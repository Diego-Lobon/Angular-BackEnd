import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuotationModule } from './quotation/quotation.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [QuotationModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
