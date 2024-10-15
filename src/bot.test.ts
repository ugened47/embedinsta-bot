import { Bot } from './bot';
import TelegramBot from 'node-telegram-bot-api';
import { fetchInstagramMedia } from './instagramApi';

jest.mock('node-telegram-bot-api', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        sendMessage: jest.fn(),
        sendMediaGroup: jest.fn(),
      };
    }),
  };
});

jest.mock('./instagramApi');

describe('Bot', () => {
  let bot: Bot;
  let botMock: TelegramBot;

  beforeEach(() => {
    botMock = new TelegramBot('test-token');
    bot = new Bot(botMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleMessage', () => {
    it('should send a media group if the text contains an Instagram URL', async () => {
      (fetchInstagramMedia as jest.Mock).mockResolvedValue([
        { type: 'image', url: 'https://example.com/image.jpg' },
        { type: 'video', url: 'https://example.com/video.mp4' },
      ]);

      const chatId = 123;
      const msg = {
        chat: { id: chatId },
        text: 'Check out this post: https://www.instagram.com/p/abcdefg/',
      };

      await bot['handleMessage'](msg as TelegramBot.Message);

      expect(botMock.sendMediaGroup).toHaveBeenCalledWith(
        chatId,
        expect.any(Array),
        expect.any(Object),
      );
    });

    it('should not send a media group or message if the text does not contain an Instagram URL', async () => {
      const chatId = 123;
      const msg = {
        chat: { id: chatId },
        text: 'This message does not contain an Instagram URL',
      };

      await bot['handleMessage'](msg as TelegramBot.Message);

      expect(botMock.sendMediaGroup).not.toHaveBeenCalled();
      expect(botMock.sendMessage).not.toHaveBeenCalled();
    });

    it('should send a message if the post does not contain any media', async () => {
      (fetchInstagramMedia as jest.Mock).mockResolvedValue([]);

      const chatId = 123;
      const msg = {
        chat: { id: chatId },
        text: 'https://www.instagram.com/p/abcdefg/',
      };

      await bot['handleMessage'](msg as TelegramBot.Message);

      expect(botMock.sendMediaGroup).not.toHaveBeenCalled();
      expect(botMock.sendMessage).toHaveBeenCalledWith(
        chatId,
        'No media found for this Instagram post or reel.',
      );
    });
  });
});
