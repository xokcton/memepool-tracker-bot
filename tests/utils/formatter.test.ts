import { MessageFormatter } from '../../src/utils/formatter';

describe('MessageFormatter', () => {
  let formatter: MessageFormatter;

  beforeEach(() => {
    formatter = new MessageFormatter();
  });

  describe('formatMempoolMessage', () => {
    it('should format message with all required components', () => {
      const mockData: any = {
        feeEstimates: {
          fastestFee: 10,
          halfHourFee: 8,
          hourFee: 6,
          economyFee: 4,
          minimumFee: 2,
        },
        mempoolBlocks: [{ nTx: 1000, totalFees: 300000, feeRange: [5, 10] }],
        mempoolInfo: {},
        timestamp: Date.now(),
      };

      const message = formatter.formatMempoolMessage(mockData, true);

      expect(message).toContain('Mempool has been updated!');
      expect(message).toContain('mempool.space');
      expect(message).toContain('sat/vB');
      expect(message).toContain('BTC');
      expect(message).toContain('transactions');
      expect(message).toContain('Last updated:');
    });
  });
});
