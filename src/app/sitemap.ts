import type { MetadataRoute } from 'next'
import { cases } from '@/lib/cases-data'

/* Парсим дату формата "MM.YYYY" или "YYYY" → Date */
function parseDate(d: string): Date {
  if (d.includes('.')) {
    const [month, year] = d.split('.')
    return new Date(parseInt(year), parseInt(month) - 1, 1)
  }
  return new Date(parseInt(d), 0, 1)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://pr4web.ru'

  const caseUrls = cases.map(c => ({
    url:             `${base}/cases/${c.slug}`,
    lastModified:    parseDate(c.date),
    changeFrequency: 'monthly' as const,
    priority:        0.8,
  }))

  return [
    { url: base,            lastModified: new Date('2026-06-01'), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/cases`, lastModified: new Date('2026-06-01'), changeFrequency: 'monthly', priority: 0.9 },
    ...caseUrls,
  ]
}
