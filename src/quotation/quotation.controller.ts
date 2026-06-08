import { Controller, Res, Body, Post } from '@nestjs/common';

import type { Response } from 'express';

import { QuotationService } from './quotation.service';

import { CreateQuotationDto } from './dto/create.quotation.dto';

// * Ruta base
// * /quotation
@Controller('quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  // * POST /quotation/pdf
  @Post('pdf')
  generatePdf(
    // * Datos enviados por el cliente
    @Body() body: CreateQuotationDto,
    // * Respuesta HTTP
    @Res() res: Response,
  ) {
    return this.quotationService.generatePdf(body.products, res);
  }

  @Post('pdf-valid')
  generatePdfValid(
    // * Datos enviados por el cliente
    @Body() body: CreateQuotationDto,
    // * Respuesta HTTP
    @Res() res: Response,
  ) {
    return this.quotationService.generatePdfValid(body.products, res);
  }
}
