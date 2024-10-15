# Instagram Telegram Bot

This Telegram bot allows you to share Instagram posts and reels in Telegram chats by simply sending the link. The bot will fetch the media (images and videos) from the Instagram link and send them as a media group in the chat.

## Features

- Supports sharing Instagram posts and reels
- Fetches media (images and videos) from the Instagram link
- Sends the media in a single message
- Handles multiple media items in carousel posts and reels

## Usage

1. Setup environment

   ```
   cp .env.example .env
   ```

   and fill with your own variables

1. Start the bot:

   ```
   yarn start
   ```

1. Add the bot to a Telegram group or start a private chat with it.

1. Send an Instagram post or reel link in the chat (e.g., https://www.instagram.com/p/post-id/ or https://www.instagram.com/reel/reel-id/).

1. The bot will fetch the media from the Instagram link and send them as a media group in the chat.

## Development

To run the bot in development mode with auto-restart on file changes:

```
yarn dev
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
