import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateTipoCambioDto } from './dto/create-tipo-cambio.dto';
import { UpdateTipoCambioDto } from './dto/update-tipo-cambio.dto';
import { TipoCambio } from './entities/tipo-cambio.entity';

@Injectable()
export class TipoCambioService {
  constructor(
    @InjectRepository(TipoCambio)
    private readonly tipoCambioRepository: Repository<TipoCambio>,
    private readonly httpService: HttpService,
  ) {}

  // =========================================================
  // Guardar/Actualizar siempre el ID: 1
  // =========================================================
  async guardarTipoCambio(valorDolar: number) {
    try {
      const registroExistente = await this.tipoCambioRepository.preload({
        id: 1,
        dolar: valorDolar,
      });

      if (registroExistente) {
        return await this.tipoCambioRepository.save(registroExistente);
      } else {
        const nuevoRegistro = this.tipoCambioRepository.create({
          id: 1,
          dolar: valorDolar,
        });
        return await this.tipoCambioRepository.save(nuevoRegistro);
      }
    } catch (error) {
      console.error(
        'Error al actualizar el tipo de cambio en la BD:',
        error.message,
      );
      throw new HttpException(
        'No se pudo actualizar el tipo de cambio centralizado en la base de datos.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // =========================================================
  // Consumir TXT de la SUNAT
  // =========================================================
  async obtenerDesdeSunat() {
    try {
      const url = 'https://www.sunat.gob.pe/a/txt/tipoCambio.txt';
      const respuesta$ = this.httpService.get(url, { responseType: 'text' });
      const resultado = await firstValueFrom(respuesta$);
      const dataTexto = resultado.data;

      if (!dataTexto || !dataTexto.includes('|')) {
        throw new Error(
          'El formato del archivo de la SUNAT no es válido o está vacío.',
        );
      }

      const partes = dataTexto.split('|');
      const ventaString = partes[2];
      const tipoCambioVenta = parseFloat(ventaString);

      if (isNaN(tipoCambioVenta)) {
        throw new Error(
          'No se pudo convertir el valor de venta a un número válido.',
        );
      }

      return { venta: tipoCambioVenta };
    } catch (error) {
      console.error('Error al consultar SUNAT:', error.message);
      throw new HttpException(
        'Error interno al intentar extraer el tipo de cambio desde la SUNAT.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // =========================================================
  // MÉTODOS CRUD INTERNOS
  // =========================================================
  create(createTipoCambioDto: CreateTipoCambioDto) {
    return 'This action adds a new tipoCambio';
  }

  async findAll() {
    return await this.tipoCambioRepository.find();
  }

  // Busca el ID persistido (como el ID 1 que te pide Angular)
  async findOne(id: number) {
    return await this.tipoCambioRepository.findOne({ where: { id } });
  }

  update(id: number, updateTipoCambioDto: UpdateTipoCambioDto) {
    return `This action updates a #${id} tipoCambio`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoCambio`;
  }
}
