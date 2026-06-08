import { Module } from '@nestjs/common';
import { QuotationController } from './quotation.controller';
import { QuotationService } from './quotation.service';

@Module({
  // * Controladores
  controllers: [QuotationController],
  // * Servicios
  providers: [QuotationService],
})
export class QuotationModule {}
