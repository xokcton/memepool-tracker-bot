import { LogLevel } from '../../src/types/mempool.types';
import { Logger } from '../../src/utils/Logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = Logger.getInstance(LogLevel.INFO);
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('info', () => {
    it('should log info messages', () => {
      logger.info('Test info message');
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy.mock.calls[0][0]).toContain('[INFO]');
      expect(consoleLogSpy.mock.calls[0][0]).toContain('Test info message');
    });

    it('should include data when provided', () => {
      logger.info('Test with data', { key: 'value' });
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy.mock.calls[0][0]).toContain('{"key":"value"}');
    });
  });

  describe('warning', () => {
    it('should log warning messages', () => {
      logger.warning('Test warning');
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('[WARNING]');
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('Test warning');
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      logger.error('Test error');
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('[ERROR]');
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('Test error');
    });

    it('should format Error objects', () => {
      const error = new Error('Test error object');
      logger.error('An error occurred', error);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('Test error object');
    });
  });

  describe('log level filtering', () => {
    it('should not log info when level is WARNING', () => {
      logger.setLogLevel(LogLevel.WARNING);
      logger.info('Should not appear');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should log warning when level is WARNING', () => {
      logger.setLogLevel(LogLevel.WARNING);
      logger.warning('Should appear');
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should only log errors when level is ERROR', () => {
      logger.setLogLevel(LogLevel.ERROR);
      logger.info('Should not appear');
      logger.warning('Should not appear');
      logger.error('Should appear');

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
