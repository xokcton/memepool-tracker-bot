<h1 align="center">Bitcoin Mempool Monitor Bot</h1>

A Telegram bot that monitors Bitcoin network congestion using the mempool.space API and sends updates when conditions change.

## Features

- 🔄 Monitors mempool every minute
- 📊 Displays current fee estimates and mempool blocks
- 🔔 Sends new messages when mempool state changes
- ⏰ Updates timestamps when no changes detected
- 🧹 Auto-deletes incoming messages for clean chat
- ⚡ Responds to /start command for immediate check
- 📝 Comprehensive logging with configurable levels
- 💬 Works directly in private chat (no chat ID needed)

## Features

### Logger System

The bot includes a comprehensive logging system with three levels:

- `[INFO]` - General information about bot operations
- `[WARNING]` - Non-critical issues that don't stop execution
- `[ERROR]` - Critical errors that affect functionality

All logs include timestamps and structured data for easy debugging.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
CHECK_INTERVAL_MS=60000
LOG_LEVEL=INFO
```

## Usage

Development:

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

Testing:

```bash
npm test
npm run test:watch
npm run test:coverage
```

## How It Works

1. Start a chat with your bot on Telegram
2. Send `/start` command to begin monitoring
3. The bot will check mempool every minute
4. When **High Priority fee** changes, you'll receive a new formatted message
5. When the fee stays the same, the bot updates the timestamp on the existing message
6. All your messages to the bot are automatically deleted to keep the chat clean

**Note:** The bot only tracks changes in the **High Priority transaction fee** (halfHourFee). Other mempool changes won't trigger new messages, but the data displayed will always be current.
