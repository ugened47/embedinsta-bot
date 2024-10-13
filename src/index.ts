import dotenv from 'dotenv';
import { Bot } from './bot';

dotenv.config();

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN as string, process.env.RAPIDAPI_KEY as string);
bot.start();
