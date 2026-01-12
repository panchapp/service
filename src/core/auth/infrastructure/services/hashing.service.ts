import { Injectable } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'node:crypto';

@Injectable()
export class HashingService {
  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  compare(token: string, storedHash: string): boolean {
    const currentHash = Buffer.from(this.hash(token));
    const targetHash = Buffer.from(storedHash);
    if (currentHash.length !== targetHash.length) return false;
    return timingSafeEqual(currentHash, targetHash);
  }
}
