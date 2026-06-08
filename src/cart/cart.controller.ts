import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Controller('cart')
export class CartController {
  constructor(private readonly redisService: RedisService) {}

  private getRedisKey(cartId: string): string {
    return `cart:${cartId}`;
  }

  @Get(':cartId')
  async getCart(@Param('cartId') cartId: string) {
    const cart = await this.redisService.get(this.getRedisKey(cartId));
    return cart ? cart : [];
  }

  @Post(':cartId')
  async saveCart(@Param('cartId') cartId: string, @Body() cartItems: any[]) {
    await this.redisService.set(this.getRedisKey(cartId), cartItems);
    return { success: true, message: 'Carrito sincronizado en Redis' };
  }

  @Delete(':cartId')
  async clearCart(@Param('cartId') cartId: string) {
    await this.redisService.del(this.getRedisKey(cartId));
    return { success: true, message: 'Carrito eliminado de Redis' };
  }
}
