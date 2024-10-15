// Interface for the Instagram API response
interface InstagramMediaResponse {
  items: Array<{
    media_type: number;
    image_versions2: {
      candidates: Array<{
        url: string;
      }>;
    };
    video_versions?: Array<{
      url: string;
    }>;
    carousel_media?: Array<{
      media_type: number;
      image_versions2: {
        candidates: Array<{
          url: string;
        }>;
      };
      video_versions?: Array<{
        url: string;
      }>;
    }>;
  }>;
}

import logger from './logger';

/**
 * Fetches media items from Instagram API for a given URL.
 *
 * @param url - URL of the Instagram post or reel
 * @returns An array of media items with their type and URL
 *
 * @remarks
 * The function fetches the JSON response from Instagram API and extracts the media items from it.
 * If the media is a carousel, it processes all the items in the carousel.
 * The function logs information about the media items it processes.
 * If there is an error fetching the media, it logs the error and returns an empty array.
 */
export async function fetchInstagramMedia(url: string): Promise<{ type: string; url: string }[]> {
  const originalUrl = new URL(url);
  const newUrl = `${originalUrl.origin}${originalUrl.pathname}?__a=1&__d=dis`;

  try {
    logger.info(`Fetching Instagram media for URL: ${url}`);

    // prettier-ignore
    const response = await fetch(newUrl, {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7,ru-UA;q=0.6,ru;q=0.5,nl;q=0.4",
        "cache-control": "max-age=0",
        "dpr": "2",
        "priority": "u=0, i",
        "sec-ch-prefers-color-scheme": "dark",
        "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
        "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"129.0.6668.91\", \"Not=A?Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"129.0.6668.91\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": "\"\"",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-ch-ua-platform-version": "\"15.0.0\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "viewport-width": "1728",
        "cookie": process.env.IG_CORS_COOKIE || '',
      },
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET"
    });

    const result = (await response.json()) as InstagramMediaResponse;

    if (result && result.items && result.items.length > 0) {
      const item = result.items[0];

      if (item.carousel_media) {
        logger.info('Processing carousel media');
        return item.carousel_media.map((media) => ({
          type: media.media_type === 2 ? 'video' : 'image',
          url:
            media.media_type === 2
              ? media.video_versions![1].url
              : media.image_versions2.candidates[1].url,
        }));
      } else {
        logger.info('Processing single media item');
        return [
          {
            type: item.media_type === 2 ? 'video' : 'image',
            url:
              item.media_type === 2
                ? item.video_versions![1].url
                : item.image_versions2.candidates[1].url,
          },
        ];
      }
    }
    logger.info('No media found in the API response');
    logger.info(JSON.stringify(result, null, 2));
    return [];
  } catch (error) {
    logger.error('Error fetching Instagram media:', error);
    return [];
  }
}
