import TelegramBot from 'node-telegram-bot-api';
import { fetchInstagramMedia } from './instagramApi';

export class Bot {
  private bot: TelegramBot;
  private rapidApiKey: string;

  constructor(token: string, rapidApiKey: string) {
    this.bot = new TelegramBot(token, { polling: true });
    this.rapidApiKey = rapidApiKey;
  }

  public start(): void {
    this.bot.on('message', this.handleMessage.bind(this));
    console.log('Bot started');
  }

  private async handleMessage(msg: TelegramBot.Message): Promise<void> {
    if (!msg.text) return;

    const instagramRegex = /https?:\/\/(www\.)?instagram\.com\/p\/([^/?#&]+)/;
    const match = msg.text.match(instagramRegex);

    if (match) {
      const shortcode = match[2];
      try {
        const media = await fetchInstagramMedia(shortcode, this.rapidApiKey);
        if (media) {
          await this.sendMedia(msg.chat.id, media);
        }
      } catch (error) {
        console.error('Error fetching Instagram media:', error);
        await this.bot.sendMessage(msg.chat.id, 'Sorry, I couldn\'t fetch the Instagram media.');
      }
    }
  }

  private async sendMedia(chatId: number, media: { type: string; url: string }): Promise<void> {
    if (media.type === 'image') {
      await this.bot.sendPhoto(chatId, media.url);
    } else if (media.type === 'video') {
      await this.bot.sendVideo(chatId, media.url);
    }
  }
}
