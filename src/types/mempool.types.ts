export interface FeeEstimate {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

export interface MempoolBlock {
  blockSize: number;
  blockVSize: number;
  nTx: number;
  totalFees: number;
  medianFee: number;
  feeRange: number[];
}

export interface MempoolInfo {
  count: number;
  vsize: number;
  total_fee: number;
  fee_histogram: number[][];
}

export interface MempoolData {
  feeEstimates: FeeEstimate;
  mempoolBlocks: MempoolBlock[];
  mempoolInfo: MempoolInfo;
  timestamp: number;
}

export interface MempoolState {
  data: MempoolData;
  lastMessageId?: number;
  chatId?: number;
  hash: string;
}

export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}
