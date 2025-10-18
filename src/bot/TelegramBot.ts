import TelegramBot from 'node-telegram-bot-api';
import { Config } from '../config/config';
import { Logger } from '../utils/Logger';

export interface ITelegramBot {
  sendMessage(chatId: number, text: string): Promise<number>;
  editMessage(chatId: number, messageId: number, text: string): Promise<void>;
  deleteMessage(chatId: number, messageId: number): Promise<void>;
  start(): void;
  stop(): void;
}

export class TelegramBotService implements ITelegramBot {
  private bot: TelegramBot;
  private onStartCallback?: (chatId: number) => Promise<void>;
  private logger: Logger;

  constructor(config: Config, logger?: Logger) {
    this.bot = new TelegramBot(config.telegramBotToken, { polling: true });
    this.logger = logger || Logger.getInstance();
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;

      this.logger.info('Received message', {
        chatId,
        text: msg.text,
        messageId: msg.message_id,
      });

      // Delete all incoming messages for cleanliness
      try {
        await this.bot.deleteMessage(chatId, msg.message_id);
        this.logger.info('Deleted incoming message', { messageId: msg.message_id });
      } catch (error) {
        this.logger.warning('Failed to delete message', error);
      }

      // Handle /start command
      if (msg.text === '/start' && this.onStartCallback) {
        this.logger.info('Processing /start command', { chatId });
        await this.onStartCallback(chatId);
      }
    });

    this.bot.on('polling_error', (error) => {
      this.logger.error('Polling error occurred', error);
    });
  }

  public onStart(callback: (chatId: number) => Promise<void>): void {
    this.onStartCallback = callback;
    this.logger.info('Registered /start command callback');
  }

  public async sendMessage(chatId: number, text: string): Promise<number> {
    try {
      const message = await this.bot.sendMessage(chatId, text, {
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      });
      this.logger.info('Sent message', { chatId, messageId: message.message_id });
      return message.message_id;
    } catch (error) {
      this.logger.error('Failed to send message', error);
      throw error;
    }
  }

  public async editMessage(chatId: number, messageId: number, text: string): Promise<void> {
    try {
      await this.bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      });
      this.logger.info('Edited message', { chatId, messageId });
    } catch (error) {
      this.logger.error('Failed to edit message', error);
      throw error;
    }
  }

  public async deleteMessage(chatId: number, messageId: number): Promise<void> {
    try {
      await this.bot.deleteMessage(chatId, messageId);
      this.logger.info('Deleted message', { chatId, messageId });
    } catch (error) {
      this.logger.warning('Failed to delete message', error);
    }
  }

  public start(): void {
    this.logger.info('Telegram bot started successfully');
  }

  public stop(): void {
    this.bot.stopPolling();
    this.logger.info('Telegram bot stopped');
  }
}
