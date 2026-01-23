import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools/registry';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://converterhub.dev';

    const toolUrls = tools.map((tool) => ({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...toolUrls,
    ];
}
