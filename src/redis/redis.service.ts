import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  // Devolvemos el cliente por si necesitas comandos ultra específicos en el futuro
  getClient(): Redis {
    return this.redisClient;
  }

  // Guardar datos con un tiempo de vida (TTL) configurable de forma simple
  async set(
    key: string,
    value: any,
    ttlSeconds: number = 604800,
  ): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  // FIX DEL ERROR ROJO: Validamos explícitamente que 'data' sea un string antes de parsear
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
