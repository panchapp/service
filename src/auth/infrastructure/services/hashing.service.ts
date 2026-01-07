import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  private readonly saltRounds = 10;

  async hash(token: string): Promise<string> {
    return bcrypt.hash(token, this.saltRounds);
  }

  async compare(token: string, hash: string): Promise<boolean> {
    return bcrypt.compare(token, hash);
  }
}
