import configService from './config/config';

import { TelegramBotService } from './bot/TelegramBot';
import { MempoolService } from './services/MempoolService';
import { MonitorService } from './services/MonitorService';
import { Logger } from './utils/Logger';

async function main() {
  const logger = Logger.getInstance();

  try {
    logger.info('Starting Bitcoin Mempool Monitor Bot');

    const config = configService.getConfig();
    logger.setLogLevel(config.logLevel);

    logger.info('Configuration loaded', {
      checkIntervalMs: config.checkIntervalMs,
      logLevel: config.logLevel,
    });

    // Initialize services
    const mempoolService = new MempoolService(config.mempoolApiUrl, logger);
    const telegramBot = new TelegramBotService(config, logger);
    const monitorService = new MonitorService(
      mempoolService,
      telegramBot,
      config.checkIntervalMs,
      logger,
    );

    // Setup /start command handler
    telegramBot.onStart(async (chatId) => {
      logger.info('/start command received, triggering immediate check', { chatId });
      await monitorService.checkMempool(chatId);
    });

    // Start services
    telegramBot.start();
    await monitorService.start();

    logger.info('All services started successfully');
    logger.info('Bot is ready! Send /start to begin monitoring');

    // Handle graceful shutdown
    const shutdown = () => {
      logger.info('Shutdown signal received, stopping services');
      monitorService.stop();
      telegramBot.stop();
      logger.info('All services stopped successfully');
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('Fatal error occurred', error);
    process.exit(1);
  }
}

main();
