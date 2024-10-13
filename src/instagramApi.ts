import fetch from 'node-fetch';

interface InstagramMediaResponse {
  data: {
    media_type: string;
    media_url: string;
  };
}

export async function fetchInstagramMedia(shortcode: string, apiKey: string): Promise<{ type: string; url: string } | null> {
  const url = `https://instagram-api-20231.p.rapidapi.com/api/media_info_from_shortcode/${shortcode}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'instagram-api-20231.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json() as InstagramMediaResponse;

    if (result.data && result.data.media_url) {
      return {
        type: result.data.media_type.toLowerCase(),
        url: result.data.media_url
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    return null;
  }
}
