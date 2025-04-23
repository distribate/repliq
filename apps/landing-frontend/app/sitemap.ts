import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://fasberry.su',
			lastModified: new Date(),
			changeFrequency: 'always',
			priority: 1,
		},
		{
			url: 'https://fasberry.su/start',
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: 'https://fasberry.su/shop',
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.5,
		},
		{
			url: 'https://fasberry.su/rules',
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.3,
		},
	]
}