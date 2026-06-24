// src/quotation/quotation.controller.ts
import {
  Controller,
  Get,
  Res,
  Body,
  Post,
  Param,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import type { Response } from 'express';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto } from './dto/create.quotation.dto';
import { SaveQuotationDto } from './dto/save-quotation.dto';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cotizacion } from './entities/cotizacion.entity';
import * as fs from 'fs';

@Controller('quotation')
export class QuotationController {
  constructor(
    private readonly quotationService: QuotationService,
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
  ) {}

  @Post('pdf')
  generatePdf(@Body() body: CreateQuotationDto, @Res() res: Response) {
    return this.quotationService.generatePdf(
      body.products,
      res,
      body.moneda,
      body.username,
      body.id_precio_lista,
      body.tipo_documento,
      body.numero_documento,
      body.direccion,
      body.email,
      body.solicitante,
    );
  }

  @Post('pdf-valid')
  generatePdfValid(@Body() body: any, @Res() res: Response) {
    let nroCotizacionOficial: string | undefined = undefined;

    // 💡 1. Si el frontend envió el ID único de la base de datos, armamos el COT oficial
    if (body.quotationId) {
      const correlativoFormateado = String(body.quotationId).padStart(5, '0'); // '00006'
      const sufijoPrecioLista = String(body.id_precio_lista || '00').padStart(
        2,
        '0',
      ); // '02'

      nroCotizacionOficial = `COT-${correlativoFormateado}-${sufijoPrecioLista}`; // COT-00006-02
    }

    // 💡 2. Pasamos el 'nroCotizacionOficial' como 11vo parámetro a tu estructura del Service
    return this.quotationService.generatePdf(
      body.products,
      res,
      body.moneda,
      body.username,
      body.id_precio_lista,
      body.tipo_documento,
      body.numero_documento,
      body.direccion,
      body.email,
      body.solicitante,
      nroCotizacionOficial, // 👈 ¡Inyección clave del ID real!
    );
  }

  @Post('save')
  async saveQuotation(@Body() body: SaveQuotationDto, @Res() res: Response) {
    try {
      // 🚀 El controlador solo llama al servicio y le pasa el body
      const result = await this.quotationService.saveQuotation(body);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al guardar la cotización',
        error: error.message,
      });
    }
  }

  @Get('list')
  async getAllQuotations(@Res() res: Response) {
    try {
      const result = await this.quotationService.findAll();
      return res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al obtener el listado de cotizaciones',
        error: error.message,
      });
    }
  }

  // quotation.controller.ts

  @Get('download/:id')
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const cotizacion = await this.cotizacionRepository.findOne({
        where: { id: parseInt(id) },
      });

      if (!cotizacion || !cotizacion.pdf_url) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'PDF no encontrado' });
      }

      const filePath = path.join(process.cwd(), 'public', cotizacion.pdf_url);

      if (!fs.existsSync(filePath)) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Archivo físico no existe' });
      }

      // 💡 ESTA ES LA CLAVE:
      // Extraemos el nombre real del archivo (ej: cotizacion_uuid.pdf)
      const fileName = path.basename(filePath);

      // Configuramos ambos headers
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );
      res.setHeader('X-File-Name', fileName); // 👈 Enviamos el nombre expuesto
      res.setHeader('Content-Type', 'application/pdf');

      return res.sendFile(filePath);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error al servir el PDF' });
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.quotationService.deleteQuotation(parseInt(id));
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Cotización eliminada correctamente' });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al eliminar la cotización',
        error: error.message,
      });
    }
  }
}
