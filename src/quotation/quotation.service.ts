import { Injectable } from '@nestjs/common';

import type { Response } from 'express';
import { ProductDto } from './dto/create.quotation.dto';
import PDFDocument from 'pdfkit';

@Injectable()
export class QuotationService {
  generatePdf(products: ProductDto[], res: Response): void {
    // =========================
    // TOTAL
    // =========================

    const subtotal = products.reduce(
      (sum, item) => sum + item.price * item.cant,
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

    doc.font('Helvetica-Bold').text('Empresa ISUR SAC', 120, 160);

    doc.font('Helvetica').text('Correo:', 50, 180);

    doc.font('Helvetica-Bold').text('ventas@isur.com', 120, 180);

    doc.font('Helvetica').text('Fecha:', 400, 160);

    doc.font('Helvetica-Bold').text('22/05/2026', 450, 160);

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
      const rowTotal = product.price * product.cant;

      // =========================
      // CALCULAR ALTURA DESCRIPCIÓN
      // =========================

      const descriptionHeight = doc.heightOfString(product.name, {
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

      doc.text(product.name, descriptionX, positionY + 10, {
        width: descriptionWidth,
      });

      // =========================
      // PRECIO
      // =========================

      doc.text(`S/ ${product.price.toFixed(2)}`, priceX, positionY + 10, {
        width: priceWidth,
      });

      // =========================
      // cant
      // =========================

      doc.text(`${product.cant}`, cantX, positionY + 10, {
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

      doc.text(`S/ ${rowTotal.toFixed(2)}`, totalX, positionY + 10, {
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

    doc.text(`S/ ${subtotal.toFixed(2)}`, 480, totalsY);

    doc.text('IGV (18%):', 380, totalsY + 25);

    doc.text(`S/ ${igv.toFixed(2)}`, 480, totalsY + 25);

    doc
      .moveTo(380, totalsY + 50)
      .lineTo(545, totalsY + 50)
      .strokeColor('#D1D5DB')
      .lineWidth(1)
      .stroke();

    doc.font('Helvetica-Bold').fontSize(14);

    doc.text('Total:', 380, totalsY + 60);

    doc.text(`S/ ${total.toFixed(2)}`, 480, totalsY + 60);

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
