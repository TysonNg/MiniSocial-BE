import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: RedisClientType;

  async onModuleInit() {
    this.redisClient = createClient({
      url: `${process.env.REDIS_URL?? "redis://redis:6379"}`,
    });

    await this.redisClient.connect();
    console.log('Redis client connected');
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
    console.log('Redis client disconnected');
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async setEx(key: string, value: string, ttl: number = 3600) {
    return await this.redisClient.setEx(key, ttl, value);
  }

  async setNx(key: string, value: string) {
    return await this.redisClient.setNX(key, value);
  }

  async set(key: string, value: string) {
    return await this.redisClient.set(key, value);
  }

  async delete(key: string) {
    return await this.redisClient.del(key);
  }

  async SADD(key: string, value: string) {
    return await this.redisClient.sAdd(key, value);
  }

  async SCARD(key: string) {
    return await this.redisClient.sCard(key);
  }

  async SMEMBERS(key: string) {
    return await this.redisClient.sMembers(key);
  }

  async SREM(key: string, member: string) {
    return await this.redisClient.sRem(key, member);
  }

  async SISMEMBER(key: string, member: string) {
    return await this.redisClient.sIsMember(key, member);
  }

  async scanKeysAndValueSorted(
    pattern: string,
    count = 100,
  ): Promise<Record<string, string>> {
    let cursor = 0;
    const tempResult: { key: string; value: string; createdAt: string }[] = [];

    do {
      const { cursor: newCursor, keys: foundKeys } =
        await this.redisClient.scan(cursor, {
          MATCH: pattern,
          COUNT: count,
        });

      for (const key of foundKeys) {
        const rawValue = await this.redisClient.get(key);
        if (key && rawValue) {
          try {
            const parsed = JSON.parse(rawValue);
            if (parsed.createdAt) {
              tempResult.push({
                key,
                value: rawValue,
                createdAt: parsed.createdAt,
              });
            }
          } catch (err) {
            console.log(err);
          }
        }
      }

      cursor = Number(newCursor);
    } while (cursor !== 0);

    tempResult.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const result: Record<string, string> = {};
    for (const item of tempResult) {
      result[item.key] = item.value;
    }

    return result;
  }
}
