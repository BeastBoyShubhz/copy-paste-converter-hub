import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools/registry';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://converterhub.dev';
  const now = new Date();

  const toolUrls = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const posts = getAllPosts();
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: posts[0] ? new Date(posts[0].date) : now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...toolUrls,
    ...blogUrls,
  ];
}
