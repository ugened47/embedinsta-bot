import { fetchInstagramMedia } from './instagramApi';

const mockResponse = jest.fn().mockResolvedValue({
  items: [
    {
      media_type: 1,
      image_versions2: {
        candidates: [
          {
            url: 'https://example.com/image1.jpg',
          },
          {
            url: 'https://example.com/image2.jpg',
          },
          {
            url: 'https://example.com/image3.jpg',
          },
        ],
      },
    },
  ],
});

jest.spyOn(global, 'fetch').mockImplementation(() => {
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    json: mockResponse,
    body: null,
    bodyUsed: false,
    redirected: false,
    type: 'basic',
    url: 'https://www.instagram.com/p/abcdefg/',
    clone: jest.fn(),
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    text: jest.fn(),
  });
});

describe('fetchInstagramMedia', () => {
  it('should return media items', async () => {
    const url = 'https://www.instagram.com/p/abcdefg/';
    const mediaItems = await fetchInstagramMedia(url);
    console.log(mediaItems);
    expect(mediaItems).toEqual([
      {
        type: 'image',
        url: 'https://example.com/image2.jpg',
      },
    ]);
  });

  it('should return empty array if there is an error', async () => {
    const url = 'https://www.instagram.com/p/abcdefg/';
    mockResponse.mockRejectedValue(new Error('Error'));
    const mediaItems = await fetchInstagramMedia(url);
    expect(mediaItems).toEqual([]);
  });
});
