import { MempoolService } from '../../src/services/MempoolService';
import { LogLevel } from '../../src/types/mempool.types';
import { Logger } from '../../src/utils/Logger';

describe('MempoolService', () => {
  let service: MempoolService;
  let logger: Logger;

  beforeEach(() => {
    logger = Logger.getInstance(LogLevel.ERROR);
    service = new MempoolService('https://mempool.space/api', logger);
  });

  describe('generateHash', () => {
    it('should generate consistent hash for same High Priority fee', () => {
      const data: any = {
        feeEstimates: { halfHourFee: 10 },
        mempoolBlocks: [{ nTx: 100, feeRange: [1, 10] }],
        mempoolInfo: {},
        timestamp: 123456,
      };

      const hash1 = service.generateHash(data);
      const hash2 = service.generateHash(data);

      expect(hash1).toBe(hash2);
    });

    it('should generate different hash for different High Priority fees', () => {
      const data1: any = {
        feeEstimates: { halfHourFee: 10 },
        mempoolBlocks: [{ nTx: 100, feeRange: [1, 10] }],
        mempoolInfo: {},
        timestamp: 123456,
      };

      const data2: any = {
        feeEstimates: { halfHourFee: 20 },
        mempoolBlocks: [{ nTx: 100, feeRange: [1, 10] }],
        mempoolInfo: {},
        timestamp: 123456,
      };

      const hash1 = service.generateHash(data1);
      const hash2 = service.generateHash(data2);

      expect(hash1).not.toBe(hash2);
    });

    it('should generate same hash when only other data changes', () => {
      const data1: any = {
        feeEstimates: { halfHourFee: 10, fastestFee: 15 },
        mempoolBlocks: [{ nTx: 100, feeRange: [1, 10] }],
        mempoolInfo: {},
        timestamp: 123456,
      };

      const data2: any = {
        feeEstimates: { halfHourFee: 10, fastestFee: 25 },
        mempoolBlocks: [{ nTx: 200, feeRange: [5, 20] }],
        mempoolInfo: {},
        timestamp: 789012,
      };

      const hash1 = service.generateHash(data1);
      const hash2 = service.generateHash(data2);

      expect(hash1).toBe(hash2);
    });
  });
});
