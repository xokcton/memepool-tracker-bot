import mempoolJS from '@mempool/mempool.js';
import crypto from 'crypto';
import { MempoolData } from '../types/mempool.types';
import { Logger } from '../utils/Logger';

export interface IMempoolService {
  fetchMempoolData(): Promise<MempoolData>;
  generateHash(data: MempoolData): string;
}

export class MempoolService implements IMempoolService {
  private mempoolClient: any;
  private logger: Logger;

  constructor(apiUrl: string = 'https://mempool.space/api', logger?: Logger) {
    const { bitcoin } = mempoolJS({
      hostname: apiUrl.replace('https://', '').replace('/api', ''),
    });
    this.mempoolClient = bitcoin;
    this.logger = logger || Logger.getInstance();
  }

  public async fetchMempoolData(): Promise<MempoolData> {
    try {
      this.logger.info('Fetching mempool data from API');

      const [feeEstimates, mempoolBlocks, mempoolInfo] = await Promise.all([
        this.mempoolClient.fees.getFeesRecommended(),
        this.mempoolClient.fees.getFeesMempoolBlocks(),
        this.mempoolClient.mempool.getMempool(),
      ]);

      const data = {
        feeEstimates,
        mempoolBlocks: mempoolBlocks.slice(0, 6),
        mempoolInfo,
        timestamp: Date.now(),
      };

      this.logger.info('Successfully fetched mempool data', {
        blocks: data.mempoolBlocks.length,
        fastestFee: data.feeEstimates.fastestFee,
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to fetch mempool data', error);
      throw new Error(`Failed to fetch mempool data: ${error}`);
    }
  }

  public generateHash(data: MempoolData): string {
    // Only hash the High Priority fee (halfHourFee) for comparison
    const hash = crypto
      .createHash('sha256')
      .update(data.feeEstimates.halfHourFee.toString())
      .digest('hex');
    this.logger.info('Generated hash for High Priority fee', {
      halfHourFee: data.feeEstimates.halfHourFee,
      hash: hash.substring(0, 8),
    });
    return hash;
  }
}
