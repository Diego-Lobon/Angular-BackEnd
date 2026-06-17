import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CartService, CartProduct } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // ========================
  // CARRITO ANÓNIMO
  // ========================

  @Get('anonymous/:sessionId')
  getAnonymousCart(
    @Param('sessionId') sessionId: string,
  ): Promise<CartProduct[]> {
    return this.cartService.getAnonymousCart(sessionId);
  }

  @Post('anonymous/:sessionId')
  async saveAnonymousCart(
    @Param('sessionId') sessionId: string,
    @Body() cart: CartProduct[],
  ): Promise<CartProduct[]> {
    await this.cartService.saveAnonymousCart(sessionId, cart);

    return cart;
  }

  @Delete('anonymous/:sessionId')
  clearAnonymous(@Param('sessionId') sessionId: string): Promise<void> {
    return this.cartService.clearAnonymousCart(sessionId);
  }

  // ========================
  // CARRITO LOGUEADO
  // ========================

  @Get('user/:userId')
  getUserCart(@Param('userId') userId: string): Promise<CartProduct[]> {
    return this.cartService.getAuthenticatedCart(userId);
  }

  @Post('user/:userId')
  saveUserCart(
    @Param('userId') userId: string,
    @Body() cart: CartProduct[],
  ): Promise<void> {
    return this.cartService.saveAuthenticatedCart(userId, cart);
  }

  @Delete('user/:userId')
  clearUser(@Param('userId') userId: string): Promise<void> {
    return this.cartService.saveAuthenticatedCart(userId, []);
  }
}
