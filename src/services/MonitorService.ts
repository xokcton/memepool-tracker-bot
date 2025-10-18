import { ITelegramBot } from '../bot/TelegramBot';
import { MempoolState } from '../types/mempool.types';
import { MessageFormatter } from '../utils/formatter';
import { Logger } from '../utils/Logger';
import { IMempoolService } from './MempoolService';

export class MonitorService {
  private mempoolService: IMempoolService;
  private telegramBot: ITelegramBot;
  private formatter: MessageFormatter;
  private logger: Logger;
  private states: Map<number, MempoolState> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private checkIntervalMs: number;

  constructor(
    mempoolService: IMempoolService,
    telegramBot: ITelegramBot,
    checkIntervalMs: number,
    logger?: Logger,
  ) {
    this.mempoolService = mempoolService;
    this.telegramBot = telegramBot;
    this.formatter = new MessageFormatter();
    this.checkIntervalMs = checkIntervalMs;
    this.logger = logger || Logger.getInstance();
  }

  public async start(): Promise<void> {
    this.logger.info('Starting mempool monitor service');

    // Setup periodic checks
    this.intervalId = setInterval(() => {
      this.checkAllChats();
    }, this.checkIntervalMs);

    this.logger.info('Monitor started successfully', {
      intervalSeconds: this.checkIntervalMs / 1000,
    });
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.logger.info('Monitor stopped');
    }
  }

  private async checkAllChats(): Promise<void> {
    const chatIds = Array.from(this.states.keys());

    if (chatIds.length === 0) {
      this.logger.info('No active chats to check');
      return;
    }

    this.logger.info('Checking mempool for all active chats', {
      chatCount: chatIds.length,
    });

    for (const chatId of chatIds) {
      await this.checkMempool(chatId);
    }
  }

  public async checkMempool(chatId: number): Promise<void> {
    try {
      this.logger.info('Checking mempool', { chatId });

      const data = await this.mempoolService.fetchMempoolData();
      const hash = this.mempoolService.generateHash(data);
      const currentState = this.states.get(chatId);

      if (!currentState) {
        // First run for this chat - send new message
        this.logger.info('First check for chat, sending initial message', { chatId });
        const messageId = await this.sendNewMessage(chatId, data);
        this.states.set(chatId, { data, lastMessageId: messageId, chatId, hash });
        this.logger.info('Initial message sent successfully', { chatId, messageId });
      } else if (hash !== currentState.hash) {
        // Data changed - send new message
        this.logger.info('Mempool state changed, sending new message', {
          chatId,
          oldHash: currentState.hash.substring(0, 8),
          newHash: hash.substring(0, 8),
        });
        const messageId = await this.sendNewMessage(chatId, data);
        this.states.set(chatId, { data, lastMessageId: messageId, chatId, hash });
        this.logger.info('Update message sent successfully', { chatId, messageId });
      } else {
        // No change - update timestamp in existing message
        this.logger.info('No changes detected, updating timestamp', { chatId });
        await this.updateExistingMessage(chatId, data);
      }
    } catch (error) {
      this.logger.error('Error checking mempool', error);
    }
  }

  private async sendNewMessage(chatId: number, data: any): Promise<number> {
    const message = this.formatter.formatMempoolMessage(data, true);
    return await this.telegramBot.sendMessage(chatId, message);
  }

  private async updateExistingMessage(chatId: number, data: any): Promise<void> {
    const state = this.states.get(chatId);
    if (!state?.lastMessageId) {
      this.logger.warning('No message ID found for chat, cannot update', { chatId });
      return;
    }

    const message = this.formatter.formatMempoolMessage(data, false);
    await this.telegramBot.editMessage(chatId, state.lastMessageId, message);
  }
}
