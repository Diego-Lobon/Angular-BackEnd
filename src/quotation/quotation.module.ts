// src/quotation/quotation.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 💡 Importar
import { QuotationController } from './quotation.controller';
import { QuotationService } from './quotation.service';
import { Cotizacion } from './entities/cotizacion.entity'; // 💡 Importar

@Module({
  imports: [
    TypeOrmModule.forFeature([Cotizacion]), // 💡 Registrar la entidad aquí
  ],
  controllers: [QuotationController],
  providers: [QuotationService],
})
export class QuotationModule {}
