import { LogLevel } from '../types/mempool.types';

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor(level: LogLevel = LogLevel.INFO) {
    this.logLevel = level;
  }

  public static getInstance(level?: LogLevel): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(level);
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.INFO, LogLevel.WARNING, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `${prefix} ${message}${dataStr}`;
  }

  public info(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage(LogLevel.INFO, message, data));
    }
  }

  public warning(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARNING)) {
      console.warn(this.formatMessage(LogLevel.WARNING, message, data));
    }
  }

  public error(message: string, error?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorData =
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : error;
      console.error(this.formatMessage(LogLevel.ERROR, message, errorData));
    }
  }
}
