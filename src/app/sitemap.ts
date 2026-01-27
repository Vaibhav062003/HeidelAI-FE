import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://heidelai.com',
      lastModified: new Date(),
    },
  ]
}
