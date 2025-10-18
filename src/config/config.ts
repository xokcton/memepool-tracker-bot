import dotenv from 'dotenv';
dotenv.config();

import { LogLevel } from '../types/mempool.types';

export interface Config {
  telegramBotToken: string;
  checkIntervalMs: number;
  mempoolApiUrl: string;
  logLevel: LogLevel;
}

class ConfigService {
  private config: Config;

  constructor() {
    this.validateEnv();
    this.config = {
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN!,
      checkIntervalMs: parseInt(process.env.CHECK_INTERVAL_MS || '60000', 10),
      mempoolApiUrl: 'https://mempool.space/api',
      logLevel: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
    };
  }

  private validateEnv(): void {
    const required = ['TELEGRAM_BOT_TOKEN'];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  public getConfig(): Config {
    return this.config;
  }
}

export default new ConfigService();
