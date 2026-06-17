// * @Injectable() le dice a NestJS que esta clase es un servicio.
import { Injectable } from '@nestjs/common';

// * Response representa la respuesta que enviaremos al navegador.
import type { Response } from 'express';

// * Esto ayuda a TypeScript a saber qué datos esperamos.
import { ProductDto } from './dto/create.quotation.dto';

// * PDFKit es una librería que permite crear PDFs desde código.
import PDFDocument from 'pdfkit';

// * @Injectable() convierte esta clase en un Service.
@Injectable()
// * Creamos la clase QuotationService.
// * Esta clase será utilizada por el Controller.
export class QuotationService {
  // * Método encargado de generar el PDF.
  // * product: ProducDTO[]. Con esta información se construirá la cotización.
  // * res para devolver la respuesta al navegador
  // * void significa que no devolvemos ningun valor, ya que usaremos res
  generatePdf(
    products: ProductDto[],
    res: Response,
    moneda: string,
    username?: string,
    idPrecioLista?: number,
  ): void {
    // =========================
    // TOTAL
    // =========================

    // 💡 Determinamos el símbolo de la moneda dinámicamente
    const esDolar = moneda?.toUpperCase().trim() === 'USD';
    const simbolo = esDolar ? '$' : 'S/';
    const fechaActual = new Date().toLocaleDateString('es-PE');

    const subtotal = products.reduce(
      (sum, item) => sum + item.precio_venta * item.cantidad,
      0,
    );
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    // =========================
    // PDF
    // =========================

    const doc = new PDFDocument({
      margin: 50,
      size: 'A4',
    });

    // =========================
    // HEADERS
    // =========================

    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader('Content-Disposition', 'inline; filename=cotizacion.pdf');

    doc.pipe(res);

    // =========================
    // LOGO
    // =========================

    doc.image('public/assets/logo/logo-isur.png', 50, 40, {
      width: 120,
    });

    // =========================
    // TITULO DERECHA
    // =========================

    doc.fontSize(28).fillColor('#1E3A5F').text('COTIZACIÓN', 350, 55, {
      align: 'right',
    });

    // =========================
    // INFO CLIENTE
    // =========================

    doc.moveTo(50, 140).lineTo(545, 140).strokeColor('#D1D5DB').stroke();

    doc.fontSize(11).fillColor('black');

    doc.text('Cotizar a:', 50, 160);

    doc.font('Helvetica-Bold').text(String(username), 120, 160);

    doc.font('Helvetica').text('Correo:', 50, 180);

    doc.font('Helvetica-Bold').text('ventas@isur.com', 120, 180);

    doc.font('Helvetica').text('Fecha:', 400, 160);

    doc.font('Helvetica-Bold').text(fechaActual, 450, 160);

    doc.font('Helvetica').text('ID:', 400, 180);

    doc.font('Helvetica-Bold').text(String(idPrecioLista), 450, 180);

    // =========================
    // TABLA
    // =========================

    const tableTop = 240;

    const itemX = 50;
    const descriptionX = 110;
    const priceX = 230;
    const cantX = 330;
    const impX = 400;
    const totalX = 480;

    // =========================
    // HEADER TABLA
    // =========================

    doc.rect(50, tableTop, 495, 30).fill('#1E3A5F');

    doc.fillColor('white').fontSize(11).font('Helvetica-Bold');

    doc.text('Item', itemX + 15, tableTop + 10);

    doc.text('Descripcion', descriptionX, tableTop + 10);

    doc.text('Precio Unitario', priceX, tableTop + 10);

    doc.text('cant', cantX, tableTop + 10);

    doc.text('Impuestos', impX, tableTop + 10);

    doc.text('Total', totalX, tableTop + 10);

    // =========================
    // FILAS PRODUCTOS
    // =========================

    let positionY = tableTop + 30;

    doc.font('Helvetica');
    doc.fillColor('black');

    const descriptionWidth = 100;
    const priceWidth = 70;
    const cantWidth = 50;
    const impWidth = 60;
    const totalWidth = 70;

    products.forEach((product, index) => {
      const rowTotal = product.precio_venta * product.cantidad;

      // =========================
      // CALCULAR ALTURA DESCRIPCIÓN
      // =========================

      const descriptionHeight = doc.heightOfString(product.nombre, {
        width: descriptionWidth,
      });

      // ALTURA MINIMA FILA

      const rowHeight = Math.max(40, descriptionHeight + 20);

      // =========================
      // LINEA SUPERIOR
      // =========================

      doc
        .moveTo(50, positionY)
        .lineTo(545, positionY)
        .strokeColor('#E5E7EB')
        .stroke();

      // =========================
      // ITEM
      // =========================

      doc.text(`${index + 1}`, itemX + 20, positionY + 10);

      // =========================
      // DESCRIPCION
      // =========================

      doc.text(product.nombre, descriptionX, positionY + 10, {
        width: descriptionWidth,
      });

      // =========================
      // PRECIO
      // =========================

      doc.text(
        `${simbolo} ${Number(product.precio_venta).toFixed(2)}`,
        priceX,
        positionY + 10,
        {
          width: priceWidth,
        },
      );

      // =========================
      // cant
      // =========================

      doc.text(`${product.cantidad}`, cantX, positionY + 10, {
        width: cantWidth,
      });

      // =========================
      // IMPUESTOS
      // =========================

      doc.text(`IGV-18%`, impX, positionY + 10, {
        width: impWidth,
      });

      // =========================
      // TOTAL
      // =========================

      doc.text(`${simbolo} ${rowTotal.toFixed(2)}`, totalX, positionY + 10, {
        width: totalWidth,
      });

      // =========================
      // SIGUIENTE FILA
      // =========================

      positionY += rowHeight;
    });

    // =========================
    // LINEA FINAL TABLA
    // =========================

    doc
      .moveTo(50, positionY)
      .lineTo(545, positionY)
      .strokeColor('#E5E7EB')
      .stroke();

    // =========================
    // TOTALES
    // =========================

    const totalsY = positionY + 40;

    doc.font('Helvetica').fontSize(11);

    doc.text('Sub Total:', 380, totalsY);

    doc.text(`${simbolo} ${subtotal.toFixed(2)}`, 480, totalsY);

    doc.text('IGV (18%):', 380, totalsY + 25);

    doc.text(`${simbolo} ${igv.toFixed(2)}`, 480, totalsY + 25);

    doc
      .moveTo(380, totalsY + 50)
      .lineTo(545, totalsY + 50)
      .strokeColor('#D1D5DB')
      .lineWidth(1)
      .stroke();

    doc.font('Helvetica-Bold').fontSize(14);

    doc.text('Total:', 380, totalsY + 60);

    doc.text(`${simbolo} ${total.toFixed(2)}`, 480, totalsY + 60);

    // =========================
    // FOOTER
    // =========================

    doc.fontSize(10).font('Helvetica').fillColor('#6B7280');

    doc.text('Gracias por su preferencia.', 50, 720);

    doc.text('ISUR - Sistemas de Cotización', 50, 740);

    // =========================
    // FINALIZAR
    // =========================

    doc.end();
  }

  generatePdfValid(
    products: ProductDto[],
    res: Response,
    moneda: string,
    username?: string,
    idPrecioLista?: number,
  ): void {
    // =========================
    // TOTAL
    // =========================

    // 💡 Determinamos el símbolo de la moneda dinámicamente
    const esDolar = moneda?.toUpperCase().trim() === 'USD';
    const simbolo = esDolar ? '$' : 'S/';
    const fechaActual = new Date().toLocaleDateString('es-PE');

    const subtotal = products.reduce(
      (sum, item) => sum + item.precio_venta * item.cantidad,
      0,
    );
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    // =========================
    // PDF
    // =========================

    const doc = new PDFDocument({
      margin: 50,
      size: 'A4',
    });

    // =========================
    // HEADERS
    // =========================

    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader('Content-Disposition', 'inline; filename=cotizacion.pdf');

    doc.pipe(res);

    // =========================
    // LOGO
    // =========================

    doc.image('public/assets/logo/logo-isur.png', 50, 40, {
      width: 120,
    });

    // =========================
    // TITULO DERECHA
    // =========================

    doc.fontSize(28).fillColor('#1E3A5F').text('COTIZACIÓN', 350, 55, {
      align: 'right',
    });

    // =========================
    // INFO CLIENTE
    // =========================

    doc.moveTo(50, 140).lineTo(545, 140).strokeColor('#D1D5DB').stroke();

    doc.fontSize(11).fillColor('black');

    doc.text('Cotizar a: ', 50, 160);

    doc.font('Helvetica-Bold').text(String(username), 120, 160);

    doc.font('Helvetica').text('Correo:', 50, 180);

    doc.font('Helvetica-Bold').text('ventas@isur.com', 120, 180);

    doc.font('Helvetica').text('Fecha:', 400, 160);

    doc.font('Helvetica-Bold').text(fechaActual, 450, 160);

    doc.font('Helvetica').text('ID:', 400, 180);

    doc.font('Helvetica-Bold').text(String(idPrecioLista), 450, 180);

    // =========================
    // TABLA
    // =========================

    const tableTop = 240;

    const itemX = 50;
    const codigoX = 100;
    const descriptionX = 160;
    const priceX = 290;
    const cantX = 370;
    const impX = 410;
    const totalX = 480;

    // =========================
    // HEADER TABLA
    // =========================

    doc.rect(50, tableTop, 495, 30).fill('#1E3A5F');

    doc.fillColor('white').fontSize(11).font('Helvetica-Bold');

    doc.text('Item', itemX + 15, tableTop + 10);

    doc.text('Codigo', codigoX, tableTop + 10);

    doc.text('Descripcion', descriptionX, tableTop + 10);

    doc.text('Precio Unit.', priceX, tableTop + 10);

    doc.text('cant', cantX, tableTop + 10);

    doc.text('Impuestos', impX, tableTop + 10);

    doc.text('Total', totalX, tableTop + 10);

    // =========================
    // FILAS PRODUCTOS
    // =========================

    let positionY = tableTop + 30;

    doc.font('Helvetica');
    doc.fillColor('black');

    const codigoWidth = 50;
    const descriptionWidth = 120;
    const priceWidth = 60;
    const cantWidth = 40;
    const impWidth = 50;
    const totalWidth = 60;

    products.forEach((product, index) => {
      const rowTotal = product.precio_venta * product.cantidad;

      // =========================
      // CALCULAR ALTURA DESCRIPCIÓN
      // =========================

      const descriptionHeight = doc.heightOfString(product.nombre, {
        width: descriptionWidth,
      });

      // ALTURA MINIMA FILA

      const rowHeight = Math.max(40, descriptionHeight + 20);

      // =========================
      // LINEA SUPERIOR
      // =========================

      doc
        .moveTo(50, positionY)
        .lineTo(545, positionY)
        .strokeColor('#E5E7EB')
        .stroke();

      // =========================
      // ITEM
      // =========================

      doc.text(`${index + 1}`, itemX + 20, positionY + 10);

      // =========================
      // CODIGO
      // =========================

      doc.text(product.referencia_interna, codigoX, positionY + 10, {
        width: codigoWidth,
      });

      // =========================
      // DESCRIPCION
      // =========================

      doc.text(product.nombre, descriptionX, positionY + 10, {
        width: descriptionWidth,
      });

      // =========================
      // PRECIO
      // =========================

      doc.text(
        `${simbolo} ${Number(product.precio_venta).toFixed(2)}`,
        priceX,
        positionY + 10,
        {
          width: priceWidth,
        },
      );

      // =========================
      // cant
      // =========================

      doc.text(`${product.cantidad}`, cantX, positionY + 10, {
        width: cantWidth,
      });

      // =========================
      // IMPUESTOS
      // =========================

      doc.text(`IGV-18%`, impX, positionY + 10, {
        width: impWidth,
      });

      // =========================
      // TOTAL
      // =========================

      doc.text(`${simbolo} ${rowTotal.toFixed(2)}`, totalX, positionY + 10, {
        width: totalWidth,
      });

      // =========================
      // SIGUIENTE FILA
      // =========================

      positionY += rowHeight;
    });

    // =========================
    // LINEA FINAL TABLA
    // =========================

    doc
      .moveTo(50, positionY)
      .lineTo(545, positionY)
      .strokeColor('#E5E7EB')
      .stroke();

    // =========================
    // TOTALES
    // =========================

    const totalsY = positionY + 40;

    doc.font('Helvetica').fontSize(11);

    doc.text('Sub Total:', 380, totalsY);

    doc.text(`${simbolo} ${subtotal.toFixed(2)}`, 480, totalsY);

    doc.text('IGV (18%):', 380, totalsY + 25);

    doc.text(`${simbolo} ${igv.toFixed(2)}`, 480, totalsY + 25);

    doc
      .moveTo(380, totalsY + 50)
      .lineTo(545, totalsY + 50)
      .strokeColor('#D1D5DB')
      .lineWidth(1)
      .stroke();

    doc.font('Helvetica-Bold').fontSize(14);

    doc.text('Total:', 380, totalsY + 60);

    doc.text(`${simbolo} ${total.toFixed(2)}`, 480, totalsY + 60);

    // =========================
    // FOOTER
    // =========================

    doc.fontSize(10).font('Helvetica').fillColor('#6B7280');

    doc.text('Gracias por su preferencia.', 50, 720);

    doc.text('ISUR - Sistemas de Cotización', 50, 740);

    // =========================
    // FINALIZAR
    // =========================

    doc.end();
  }
}
