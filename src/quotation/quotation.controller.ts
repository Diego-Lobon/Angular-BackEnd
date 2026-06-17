import { Controller, Res, Body, Post } from '@nestjs/common';
import type { Response } from 'express';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto } from './dto/create.quotation.dto';

@Controller('quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post('pdf')
  generatePdf(@Body() body: CreateQuotationDto, @Res() res: Response) {
    return this.quotationService.generatePdf(
      body.products,
      res,
      body.moneda,
      body.username,
      body.id_precio_lista,
    );
  }

  @Post('pdf-valid')
  generatePdfValid(@Body() body: CreateQuotationDto, @Res() res: Response) {
    return this.quotationService.generatePdfValid(
      body.products,
      res,
      body.moneda,
      body.username,
      body.id_precio_lista,
    );
  }
}
