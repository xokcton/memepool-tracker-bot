import { MempoolData } from '../types/mempool.types';

export class MessageFormatter {
  public formatMempoolMessage(data: MempoolData, isUpdate: boolean = false): string {
    const timestamp = this.formatTimestamp(data.timestamp);
    const emoji = isUpdate ? '🔄' : '📊';

    let message = `<b>${emoji} Mempool has been updated!</b>\n\n`;
    message += `🔗 <a href="https://mempool.space/">Visit mempool.space</a>\n\n`;

    // Format mempool blocks
    message += `<b>📦 Mempool Blocks:</b>\n`;
    data.mempoolBlocks.forEach((block, index) => {
      const feeRange = this.formatFeeRange(block.feeRange);
      const btcAmount = this.satsToBTC(block.totalFees);
      const timeEstimate = this.estimateTime(index);

      message += `\n<code>${feeRange}</code>\n`;
      message += `💰 ${btcAmount} BTC\n`;
      message += `📝 ${block.nTx.toLocaleString()} transactions\n`;
      message += `⏱ In ~${timeEstimate} minutes\n`;
    });

    // Format fee recommendations
    message += `\n<b>💸 Transaction Fees:</b>\n`;
    message += this.formatFeeEstimates(data.feeEstimates);

    message += `\n\n<i>📅 Last updated: ${timestamp}</i>`;

    return message;
  }

  public formatUpdateMessage(timestamp: number): string {
    return `<i>🕒 Last checked: ${this.formatTimestamp(timestamp)}</i>`;
  }

  private formatFeeRange(feeRange: number[]): string {
    if (feeRange.length < 2) return '~0 sat/vB';
    const min = Math.floor(feeRange[0]);
    const max = Math.ceil(feeRange[feeRange.length - 1]);
    return `~${min} sat/vB` + (min !== max ? ` - ${max} sat/vB` : '');
  }

  private satsToBTC(sats: number): string {
    return (sats / 100000000).toFixed(3);
  }

  private estimateTime(blockIndex: number): number {
    return (blockIndex + 1) * 10;
  }

  private formatFeeEstimates(fees: any): string {
    const priorities = [
      { name: 'No Priority', value: fees.minimumFee, emoji: '🐌' },
      { name: 'Low Priority', value: fees.economyFee, emoji: '🚶' },
      { name: 'Medium Priority', value: fees.hourFee, emoji: '🚴' },
      { name: 'High Priority', value: fees.halfHourFee, emoji: '🚗' },
      { name: 'Fastest', value: fees.fastestFee, emoji: '🚀' },
    ];

    return priorities.map((p) => `${p.emoji} <b>${p.name}:</b> ${p.value} sat/vB`).join('\n');
  }

  private formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    const hoursStr = String(hours).padStart(2, '0');

    return `${year}-${month}-${day} ${hoursStr}:${minutes}:${seconds} ${ampm}`;
  }
}
