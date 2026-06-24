import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // 1. Importar
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redisClient: Redis;

  // 2. Inyectar ConfigService
  constructor(private configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });
  }

  // ... el resto de tus métodos (getClient, set, get, del) se mantienen igual
  getClient(): Redis {
    return this.redisClient;
  }

  async set(
    key: string,
    value: any,
    ttlSeconds: number = 604800,
  ): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

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
