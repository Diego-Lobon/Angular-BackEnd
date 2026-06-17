import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export interface CartProduct {
  referencia_interna?: string;

  productId: string;

  name?: string;

  price_dolares?: number;

  price_soles?: number;

  moneda?: 'USD' | 'PEN';

  cantidad: number;

  imageUrl?: string;

  marca?: {
    nombre: string;
  };

  categoria?: {
    nombre: string;
  };
}

@Injectable()
export class CartService {
  constructor(private readonly redisService: RedisService) {}

  // --- Métodos para Carritos Anónimos (Redis Simplificado) ---
  async getAnonymousCart(sessionId: string): Promise<CartProduct[]> {
    // Le pasamos el tipo <CartProduct[]> al método genérico para que no tire error
    const cart = await this.redisService.get<CartProduct[]>(
      `anonymous_cart:${sessionId}`,
    );
    return cart ? cart : [];
  }

  async updateAnonymousCart(
    sessionId: string,
    product: CartProduct,
  ): Promise<CartProduct[]> {
    const currentCart = await this.getAnonymousCart(sessionId);

    const existingItem = currentCart.find(
      (item) => item.productId === product.productId,
    );

    if (existingItem) {
      existingItem.cantidad = product.cantidad;
    } else {
      currentCart.push(product);
    }

    const updatedCart = currentCart.filter((item) => item.cantidad > 0);

    await this.redisService.set(
      `anonymous_cart:${sessionId}`,
      updatedCart,
      604800,
    );

    return updatedCart;
  }

  async removeAnonymousCartItem(
    sessionId: string,
    productId: string,
  ): Promise<CartProduct[]> {
    let currentCart = await this.getAnonymousCart(sessionId);
    currentCart = currentCart.filter((item) => item.productId !== productId);

    await this.redisService.set(
      `anonymous_cart:${sessionId}`,
      currentCart,
      60 * 60 * 24 * 7,
    );
    return currentCart;
  }

  async clearAnonymousCart(sessionId: string): Promise<void> {
    await this.redisService.del(`anonymous_cart:${sessionId}`);
  }

  // --- Métodos para Carritos Autenticados (MySQL + Caché de Redis) ---
  async getAuthenticatedCart(userId: string): Promise<CartProduct[]> {
    const cart = await this.redisService.get<CartProduct[]>(
      `user_cart:${userId}`,
    );

    return cart || [];
  }

  async saveAuthenticatedCart(
    userId: string,
    cart: CartProduct[],
  ): Promise<void> {
    await this.redisService.set(`user_cart:${userId}`, cart, 604800);
  }

  // --- Lógica de Fusión de Carritos ---
  // --- Lógica de Fusión de Carritos (Sin async) ---
  mergeCarts(
    anonymousCart: CartProduct[],
    authenticatedCart: CartProduct[],
  ): CartProduct[] {
    const merged = new Map<string, CartProduct>();

    authenticatedCart.forEach((item) => {
      merged.set(item.productId, {
        ...item,
      });
    });

    anonymousCart.forEach((anon) => {
      const existing = merged.get(anon.productId);

      if (existing) {
        existing.cantidad += anon.cantidad;
      } else {
        merged.set(anon.productId, {
          ...anon,
        });
      }
    });

    return Array.from(merged.values());
  }

  async saveAnonymousCart(
    sessionId: string,
    cart: CartProduct[],
  ): Promise<void> {
    await this.redisService.set(`anonymous_cart:${sessionId}`, cart, 604800);
  }
}
