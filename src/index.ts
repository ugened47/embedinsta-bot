import 'dotenv/config';

import TelegramBot from 'node-telegram-bot-api';

import logger from './logger';

import { Bot } from './bot';

// Get Telegram bot token from environment variables
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;

// Check if required environment variables are set
if (!telegramToken) {
  logger.error('Missing environment variables. Please check your .env file.');
  process.exit(1);
}

logger.info('Initializing bot...');

const bot = new Bot(new TelegramBot(telegramToken, { polling: true }));

logger.info('Starting bot...');
bot.start();

logger.info('Instagram Telegram Bot is running...');
