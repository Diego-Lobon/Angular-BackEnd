import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart.entity';

interface CartProduct {
  productId: string;
  quantity: number;
}

@Injectable()
export class CartService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

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
    const existingItemIndex = currentCart.findIndex(
      (item) => item.productId === product.productId,
    );

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity = product.quantity;
    } else {
      currentCart.push(product);
    }

    const updatedCart = currentCart.filter((item) => item.quantity > 0);

    // Usamos nuestro método .set() limpio pasándole los segundos al final (7 días)
    await this.redisService.set(
      `anonymous_cart:${sessionId}`,
      updatedCart,
      60 * 60 * 24 * 7,
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
    // Intentamos buscar en la caché de Redis primero
    const cachedCart = await this.redisService.get<CartProduct[]>(
      `user_cart:${userId}`,
    );
    if (cachedCart) {
      return cachedCart;
    }

    // Si no está, vamos a MySQL
    const dbCartItems = await this.cartItemRepository.find({
      where: { userId },
    });

    const cart = dbCartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    // Guardamos en la caché de Redis por 1 día (86400 segundos)
    await this.redisService.set(`user_cart:${userId}`, cart, 60 * 60 * 24);
    return cart;
  }

  async saveAuthenticatedCart(
    userId: string,
    cart: CartProduct[],
  ): Promise<void> {
    // Sincronización en MySQL
    await this.cartItemRepository.delete({ userId });

    const newCartItems = cart.map((item) =>
      this.cartItemRepository.create({
        userId,
        productId: item.productId,
        quantity: item.quantity,
      }),
    );
    await this.cartItemRepository.save(newCartItems);

    // Actualizamos la caché en Redis por 1 día
    await this.redisService.set(`user_cart:${userId}`, cart, 60 * 60 * 24);
  }

  // --- Lógica de Fusión de Carritos ---
  // --- Lógica de Fusión de Carritos (Sin async) ---
  mergeCarts(
    anonymousCart: CartProduct[],
    authenticatedCart: CartProduct[],
  ): CartProduct[] {
    // <-- Cambiado de Promise<CartProduct[]> a CartProduct[]
    const mergedCartMap = new Map<string, CartProduct>();

    authenticatedCart.forEach((item) => {
      mergedCartMap.set(item.productId, { ...item });
    });

    anonymousCart.forEach((anonItem) => {
      const existingItem = mergedCartMap.get(anonItem.productId);
      if (existingItem) {
        existingItem.quantity += anonItem.quantity;
      } else {
        mergedCartMap.set(anonItem.productId, { ...anonItem });
      }
    });

    return Array.from(mergedCartMap.values());
  }
}
