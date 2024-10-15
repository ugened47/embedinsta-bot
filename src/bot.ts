import TelegramBot from 'node-telegram-bot-api';
import { fetchInstagramMedia } from './instagramApi';
import logger from './logger';

export class Bot {
  private bot: TelegramBot;

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true });
  }

  public start(): void {
    this.bot.on('message', this.handleMessage.bind(this));
    logger.info('Bot started and listening for messages');
  }

  /**
   * Handles an incoming message.
   *
   * @param msg - The incoming message from Telegram
   *
   * @remarks
   * The function checks if the message contains an Instagram post or reel URL.
   * If it does, it fetches the media items from the Instagram API and sends them
   * as a media group to the chat.
   *
   * @returns A promise that resolves when the function is done handling the message
   */
  private async handleMessage(msg: TelegramBot.Message): Promise<void> {
    if (!msg.text) return;

    logger.info(`Received message: ${msg.text}`);

    // Regular expression to match Instagram post and reel URLs
    const instagramRegex = /https?:\/\/(www\.)?instagram\.com\/(p|reel|reels)\/([^/?#&]+)/;
    const match = msg.text.match(instagramRegex);

    if (match) {
      let url = match[0];
      logger.info(`Detected Instagram ${match[2]} with URL: ${url}`);

      if (match[2] === 'reels') {
        const newUrl = url.replace('/reels/', '/reel/');
        logger.info(`Replacing /reels/ with /reel/ in URL: ${newUrl}`);
        url = newUrl;
      }

      logger.info(`Final URL: ${url}`);

      try {
        logger.info('Fetching Instagram media...');
        const mediaItems = await fetchInstagramMedia(url);

        if (mediaItems.length > 0) {
          logger.info(`Found ${mediaItems.length} media item(s)`);
          logger.info(JSON.stringify(mediaItems, null, 2));
          await this.sendMediaGroup(msg, mediaItems);
        } else {
          logger.info('No media found');
          await this.bot.sendMessage(
            msg.chat.id,
            'No media found for this Instagram post or reel.',
          );
        }
      } catch (error) {
        logger.error('Error fetching Instagram media:', error);
        await this.bot.sendMessage(msg.chat.id, "Sorry, I couldn't fetch the Instagram media.");
      }
    }
  }

  private async sendMediaGroup(
    msg: TelegramBot.Message,
    mediaItems: { type: string; url: string }[],
  ): Promise<void> {
    const media = mediaItems.map((item) => {
      const mediaItem = {
        type: item.type === 'image' ? 'photo' : 'video',
        media: item.url,
      };

      return mediaItem;
    });

    try {
      await this.bot.sendMediaGroup(msg.chat.id, media as TelegramBot.InputMediaPhoto[], {
        reply_to_message_id: msg.message_id,
      });
    } catch (error) {
      logger.error('Error sending media group:', error);
      await this.bot.sendMessage(msg.chat.id, "Sorry, I couldn't send the media group.");
    }
  }
}
