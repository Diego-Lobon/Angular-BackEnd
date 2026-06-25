// src/quotation/quotation.service.ts
import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { ProductDto } from './dto/create.quotation.dto';
import PDFDocument from 'pdfkit';
import { SaveQuotationDto } from './dto/save-quotation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cotizacion } from './entities/cotizacion.entity';
import * as fs from 'fs';
import * as path from 'path';

import { v4 as uuidv4 } from 'uuid'; // Importa esto al inicio

@Injectable()
export class QuotationService {
  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
  ) {}

  async deleteQuotation(id: number): Promise<boolean> {
    const cotizacion = await this.cotizacionRepository.findOne({
      where: { id },
    });

    if (!cotizacion) throw new Error('Cotización no encontrada');

    // 1. Eliminar archivo físico si existe
    if (cotizacion.pdf_url) {
      // Asumiendo que pdf_url empieza con /uploads/...
      // process.cwd() obtiene la raíz del proyecto
      const filePath = path.join(process.cwd(), cotizacion.pdf_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 2. Eliminar registro en base de datos
    await this.cotizacionRepository.delete(id);
    return true;
  }

  async findByPdfName(filename: string) {
    // Buscamos en la base de datos donde la columna pdf_url contenga este archivo
    const fullPath = `/public/uploads/pdf/${filename}`;
    const cotizacion = await this.cotizacionRepository.findOne({
      where: { pdf_url: fullPath },
      relations: { cliente: true },
    });

    if (!cotizacion) throw new Error('Cotización no encontrada');
    return cotizacion;
  }

  async findAll() {
    try {
      const cotizaciones = await this.cotizacionRepository.find({
        relations: { cliente: true },
        order: { fecha_creacion: 'DESC' },
      });

      return {
        success: true,
        data: cotizaciones.map((cot) => ({
          id: cot.id,
          numero_cotizacion: cot.numero_cotizacion,
          // 💡 AQUÍ ESTABAN FALTANDO:
          tipo_documento: cot.tipo_documento,
          numero_documento: cot.numero_documento,
          razon_social: cot.razon_social,
          // Mantenemos la relación como la tenías
          cliente: cot.cliente
            ? { nombre: cot.cliente.nombre }
            : { nombre: 'Publico General' },
          fecha_creacion: cot.fecha_creacion,
          estado: cot.estado,
          pdf_url: cot.pdf_url,
        })),
      };
    } catch (error: any) {
      throw new Error(`Error al listar: ${error.message}`);
    }
  }

  // src/quotation/quotation.service.ts
  // src/quotation/quotation.service.ts

  async saveQuotation(
    data: SaveQuotationDto,
  ): Promise<Cotizacion & { full_pdf_url: string }> {
    // 1. Instanciamos la clase explícitamente para que TS sepa que es 1 objeto
    const nuevaCotizacion = new Cotizacion();

    // 2. Asignación directa con casteo de seguridad para la relación
    nuevaCotizacion.cliente = data.id_cliente
      ? ({ id: data.id_cliente } as any)
      : null;
    nuevaCotizacion.tipo_documento = data.tipo_documento;
    nuevaCotizacion.numero_documento = data.numero_documento;
    nuevaCotizacion.razon_social = data.razon_social;
    nuevaCotizacion.solicitante = data.solicitante || null;
    nuevaCotizacion.estado = 'PROCESO';
    nuevaCotizacion.pdf_url = null;
    nuevaCotizacion.numero_cotizacion = null;

    // 3. Guardamos y obligamos a TS a tratar la respuesta como objeto Cotizacion
    const cotizacionGuardada: Cotizacion =
      await this.cotizacionRepository.save(nuevaCotizacion);

    // 4. Preparar ruta del archivo
    const randomHash = uuidv4();
    const fileName = `cotizacion_${randomHash}.pdf`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'pdf');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);

    // 5. Cálculo del número oficial usando el ID obtenido del save
    const numeroOficial = `COT-${String(cotizacionGuardada.id).padStart(5, '0')}-${String(data.id_precio_lista || '00').padStart(2, '0')}`;

    // 6. Generación del PDF
    try {
      await new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        this.generatePdf(
          data.products,
          writeStream,
          'PEN',
          data.razon_social,
          data.id_precio_lista,
          data.tipo_documento,
          data.numero_documento,
          data.direccion,
          data.email,
          data.solicitante,
          numeroOficial,
        );
        writeStream.on('finish', () => resolve());
        writeStream.on('error', (err) => reject(err));
      });
    } catch (err) {
      throw new Error('No se pudo generar el archivo físico del PDF');
    }

    // 7. Actualización final
    cotizacionGuardada.pdf_url = `/uploads/pdf/${fileName}`;
    cotizacionGuardada.numero_cotizacion = numeroOficial;

    const cotizacionFinal =
      await this.cotizacionRepository.save(cotizacionGuardada);
    return {
      ...cotizacionFinal,
      // Agregamos la URL completa para que el frontend no tenga que adivinar
      full_pdf_url: `${process.env.APP_URL}${cotizacionFinal.pdf_url}`,
    };
  }

  generatePdf(
    products: ProductDto[],
    res: any,
    moneda: string,
    username?: string,
    idPrecioLista?: number,
    tipoDocumento?: string,
    numeroDocumento?: string,
    direccion?: string,
    email?: string,
    solicitante?: string,
    nroCotizacionPersonalizado?: string, // 💡 Nuevo parámetro opcional
  ): void {
    const esDolar = moneda?.toUpperCase().trim() === 'USD';
    const simbolo = esDolar ? '$' : 'S/';
    const fechaActual = new Date().toLocaleDateString('es-PE');

    // 💡 DETERMINAR NÚMERO DE COTIZACIÓN
    let nroCotizacion = '';
    if (nroCotizacionPersonalizado) {
      nroCotizacion = nroCotizacionPersonalizado;
    } else {
      // Si no viene uno oficial, significa que es una PREVISUALIZACIÓN temporal
      const sufijoLista =
        idPrecioLista !== null && idPrecioLista !== undefined
          ? String(idPrecioLista).padStart(2, '0')
          : 'XX';
      nroCotizacion = `COT-XXXXX-${sufijoLista}`;
    }

    const subtotal = products.reduce(
      (sum, item) => sum + item.precio_venta * item.cantidad,
      0,
    );

    // 2. Calculamos el IGV sobre esa base
    const igv = subtotal * 0.18;

    // 3. El Total General es la suma de ambos
    const totalGeneral = subtotal + igv;

    const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });

    if (res && typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename=${nroCotizacion}.pdf`,
      );
    }

    doc.pipe(res);

    // --- PALETA DE COLORES ---
    const COLOR_PRIMARY = '#0F172A';
    const COLOR_SECONDARY = '#475569';
    const COLOR_LIGHT_BG = '#F8FAFC';
    const COLOR_BORDER = '#E2E8F0';
    const COLOR_TEXT = '#1E293B';
    const COLOR_ACCENT = '#4F46E5';

    // 1. ENCABEZADO
    try {
      doc.image('public/assets/logo/logo-isur.png', 36, 28, { width: 140 });
    } catch (e) {
      doc
        .fillColor(COLOR_PRIMARY)
        .font('Helvetica-Bold')
        .fontSize(18)
        .text('CORPORACIÓN ISUR', 40, 40);
    }

    doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(8.5);
    doc.text('CORPORACIÓN ISUR S.R.L.', 40, 95);
    doc.text('Jr. Zepita Nro. 533 Int. 401a, Moquegua - Ilo', 40, 107, {
      width: 250,
    });
    doc.text('Contacto: ventas@isur.com  |  WhatsApp: 987 654 321', 40, 119);

    const boxWidth = 200;
    const boxHeight = 72;
    const boxX = 355;
    const boxY = 40;

    doc.rect(boxX, boxY, boxWidth, boxHeight).fill(COLOR_LIGHT_BG);
    doc
      .rect(boxX, boxY, boxWidth, boxHeight)
      .strokeColor(COLOR_PRIMARY)
      .lineWidth(1.5)
      .stroke();

    doc
      .fillColor(COLOR_PRIMARY)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('R.U.C. 20532435847', boxX, boxY + 14, {
        align: 'center',
        width: boxWidth,
      })
      .text('COTIZACIÓN DE VENTA', boxX, boxY + 33, {
        align: 'center',
        width: boxWidth,
      })
      .fillColor(COLOR_ACCENT)
      .text(nroCotizacion, boxX, boxY + 52, {
        align: 'center',
        width: boxWidth,
      });

    // 2. BLOQUE DE DATOS DEL CLIENTE
    const clientY = 145;
    doc
      .moveTo(40, clientY)
      .lineTo(555, clientY)
      .strokeColor(COLOR_BORDER)
      .lineWidth(1)
      .stroke();

    doc
      .fillColor(COLOR_PRIMARY)
      .font('Helvetica-Bold')
      .fontSize(9)
      .text('DATOS DEL DESTINATARIO', 40, clientY + 12);
    doc
      .fillColor(COLOR_TEXT)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(
        String(username || 'CLIENTE GENÉRICO').toUpperCase(),
        40,
        clientY + 26,
        {
          width: 350,
          height: 14,
          ellipsis: true,
        },
      );

    doc.font('Helvetica').fontSize(8.5).fillColor(COLOR_SECONDARY);
    let currentInfoY = clientY + 41;

    if (numeroDocumento) {
      doc.text(
        `${tipoDocumento || 'DOCUMENTO'}: ${numeroDocumento}`,
        40,
        currentInfoY,
      );
      currentInfoY += 13;
    }
    if (direccion) {
      doc.text(`Dirección: ${direccion}`, 40, currentInfoY, {
        width: 260,
        height: 10,
        ellipsis: true,
      });
      currentInfoY += 13;
    }
    if (email) {
      doc.text(`Email: ${email}`, 40, currentInfoY);
    }

    const infoX = 400;
    doc.font('Helvetica').fontSize(8.5).fillColor(COLOR_TEXT);
    doc.text('Fecha Emisión:', infoX, clientY + 26);
    doc
      .font('Helvetica-Bold')
      .text(fechaActual, 455, clientY + 26, { align: 'right', width: 100 });

    if (solicitante) {
      doc.font('Helvetica').text('Solicitante:', infoX, clientY + 39);
      doc
        .font('Helvetica-Bold')
        .fillColor(COLOR_ACCENT)
        .text(String(solicitante), 435, clientY + 39, {
          align: 'right',
          width: 120,
        });
    }

    // 3. TABLA DE ITEMS
    const tableTop = 235;
    const colX = {
      item: 40,
      codigo: 80,
      desc: 165,
      cant: 360,
      unit: 405,
      total: 465,
    };
    const colWidth = {
      item: 30,
      codigo: 85,
      desc: 195,
      cant: 55,
      unit: 70,
      total: 80,
    };

    doc.rect(40, tableTop, 515, 22).fill(COLOR_PRIMARY);
    doc.fillColor('white').fontSize(8).font('Helvetica-Bold');
    doc.text('ITEM', colX.item, tableTop + 7, {
      align: 'center',
      width: colWidth.item,
    });
    doc.text('CÓDIGO', colX.codigo, tableTop + 7);
    doc.text('DESCRIPCIÓN DEL PRODUCTO', colX.desc, tableTop + 7);
    doc.text('CANT.', colX.cant, tableTop + 7, {
      align: 'center',
      width: colWidth.cant,
    });
    doc.text('P. UNIT', colX.unit, tableTop + 7, {
      align: 'right',
      width: colWidth.unit,
    });
    doc.text('TOTAL', colX.total, tableTop + 7, {
      align: 'right',
      width: colWidth.total,
    });

    let positionY = tableTop + 22;

    products.forEach((product, index) => {
      const rowTotal = product.precio_venta * product.cantidad;
      const descriptionHeight = doc.heightOfString(product.nombre, {
        width: colWidth.desc,
      });
      const rowHeight = Math.max(25, descriptionHeight + 10);

      if (positionY + rowHeight > 710) {
        doc.addPage();
        positionY = 40;
        doc.rect(40, positionY, 515, 22).fill(COLOR_PRIMARY);
        doc.fillColor('white').font('Helvetica-Bold').fontSize(8);
        doc.text('ITEM', colX.item, positionY + 7, {
          align: 'center',
          width: colWidth.item,
        });
        doc.text('CÓDIGO', colX.codigo, positionY + 7);
        doc.text('DESCRIPCIÓN DEL PRODUCTO', colX.desc, positionY + 7);
        doc.text('CANT.', colX.cant, positionY + 7, {
          align: 'center',
          width: colWidth.cant,
        });
        doc.text('P. UNIT', colX.unit, positionY + 7, {
          align: 'right',
          width: colWidth.unit,
        });
        doc.text('TOTAL', colX.total, positionY + 7, {
          align: 'right',
          width: colWidth.total,
        });
        positionY += 22;
      }

      if (index % 2 === 0) {
        doc.rect(40, positionY, 515, rowHeight).fill(COLOR_LIGHT_BG);
      }

      doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8.5);
      doc.text(
        `${String(index + 1).padStart(2, '0')}`,
        colX.item,
        positionY + 7,
        { align: 'center', width: colWidth.item },
      );
      doc
        .font('Helvetica-Bold')
        .text(product.referencia_interna || 'S/C', colX.codigo, positionY + 7, {
          width: colWidth.codigo,
          height: 10,
          ellipsis: true,
        });
      doc.font('Helvetica').text(product.nombre, colX.desc, positionY + 7, {
        width: colWidth.desc,
      });
      doc.text(`${product.cantidad}`, colX.cant, positionY + 7, {
        align: 'center',
        width: colWidth.cant,
      });
      doc.text(
        `${simbolo} ${Number(product.precio_venta).toFixed(2)}`,
        colX.unit,
        positionY + 7,
        { align: 'right', width: colWidth.unit },
      );
      doc
        .font('Helvetica-Bold')
        .text(`${simbolo} ${rowTotal.toFixed(2)}`, colX.total, positionY + 7, {
          align: 'right',
          width: colWidth.total,
        });

      doc
        .moveTo(40, positionY + rowHeight)
        .lineTo(555, positionY + rowHeight)
        .strokeColor(COLOR_BORDER)
        .lineWidth(0.5)
        .stroke();
      positionY += rowHeight;
    });

    // 4. PIE DE COMPROBANTE
    let bottomY = positionY + 25;
    if (bottomY > 630) {
      doc.addPage();
      bottomY = 40;
    }

    doc.rect(40, bottomY, 280, 75).fill(COLOR_LIGHT_BG);
    doc
      .rect(40, bottomY, 280, 75)
      .strokeColor(COLOR_BORDER)
      .lineWidth(0.5)
      .stroke();

    doc
      .fillColor(COLOR_PRIMARY)
      .font('Helvetica-Bold')
      .fontSize(8)
      .text('CONDICIONES COMERCIALES', 48, bottomY + 8);
    const terminos = [
      '• Los precios incluyen el Impuesto General a las Ventas (IGV 18%).',
      '• Vigencia de la proforma: 7 días calendario.',
      '• El stock está sujeto a variación hasta confirmar la orden.',
      '• Pagos mediante transferencias bancarias o aplicativos digitales.',
    ];
    let termY = bottomY + 21;
    doc.fillColor(COLOR_SECONDARY).font('Helvetica').fontSize(7.2);
    terminos.forEach((line) => {
      doc.text(line, 48, termY, { width: 265 });
      termY += 11;
    });

    const totalsX_Label = 350;
    const totalsX_Value = 455;
    const totalsWidth_Value = 100;

    doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8.5);
    doc.text('Op. Gravada (Sub Total):', totalsX_Label, bottomY + 5);
    doc.text(`${simbolo} ${subtotal.toFixed(2)}`, totalsX_Value, bottomY + 5, {
      align: 'right',
      width: totalsWidth_Value,
    });

    doc.text('I.G.V. (18%):', totalsX_Label, bottomY + 20);
    doc.text(`${simbolo} ${igv.toFixed(2)}`, totalsX_Value, bottomY + 20, {
      align: 'right',
      width: totalsWidth_Value,
    });

    doc
      .moveTo(totalsX_Label, bottomY + 36)
      .lineTo(555, bottomY + 36)
      .strokeColor(COLOR_BORDER)
      .lineWidth(0.5)
      .stroke();

    doc
      .fillColor(COLOR_PRIMARY)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('TOTAL GENERAL:', totalsX_Label, bottomY + 45);
    doc.text(
      `${simbolo} ${totalGeneral.toFixed(2)}`,
      totalsX_Value,
      bottomY + 45,
      { align: 'right', width: totalsWidth_Value },
    );

    // 5. MARGEN Y PIE DE PÁGINA DINÁMICO
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc
        .moveTo(40, 755)
        .lineTo(555, 755)
        .strokeColor(COLOR_BORDER)
        .lineWidth(0.5)
        .stroke();

      doc.fontSize(7.5).font('Helvetica').fillColor(COLOR_SECONDARY);
      doc.text(
        'Si está de acuerdo con los suministros descritos, responda a este documento adjuntando su comprobante.',
        40,
        764,
      );
      doc.text(
        'ISUR - Sistema Automatizado de Cotizaciones Corporativas',
        40,
        775,
      );
      doc.text(`Página ${i + 1} de ${pages.count}`, 495, 764, {
        align: 'right',
        width: 60,
      });
    }

    doc.end();
  }
}
