export class UpdateProductDto {
  nombre?: string;
  costo_dolares?: number;
  costo_soles?: number;
  precio_venta_dolares?: number;
  precio_venta_soles?: number;
  categoriaId?: number; // <-- NUEVO
  marcaId?: number; // <-- NUEVO
}
