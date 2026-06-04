import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { ContactModal } from '@/components/ui/ContactModal'
import { cases } from '@/lib/cases-data'
import { ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Кейсы — PR4WEB',
  alternates: { canonical: 'https://pr4web.ru/cases' },
  description: 'Реальные проекты по контекстной рекламе, аналитике и автоматизации с измеримыми результатами.',
}

const colorMap: Record<string, { badge: string; accent: string }> = {
  violet: { badge: 'bg-violet-500/15 text-violet-400 border-violet-500/20', accent: '#8b5cf6' },
  indigo: { badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20', accent: '#6366f1' },
  cyan:   { badge: 'bg-cyan-500/15   text-cyan-400   border-cyan-500/20',   accent: '#06b6d4' },
  green:  { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', accent: '#10b981' },
  amber:  { badge: 'bg-amber-500/15  text-amber-400  border-amber-500/20',  accent: '#f59e0b' },
  rose:   { badge: 'bg-rose-500/15   text-rose-400   border-rose-500/20',   accent: '#f43f5e' },
}

const caseListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Кейсы PR4WEB — результаты рекламных кампаний',
  description: 'Задокументированные кейсы по настройке Яндекс.Директ и ВКонтакте с конкретными цифрами',
  numberOfItems: cases.length,
  itemListElement: cases.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.title,
    url: `https://pr4web.ru/cases/${c.slug}`,
    description: c.description,
  })),
}

export default function CasesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseListSchema) }}
      />
      <ContactModal />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--page-bg)', color: 'var(--page-fg)' }}>
        <Navigation />

        <main className="max-w-6xl mx-auto px-6 pt-28 pb-20">
          {/* Заголовок */}
          <div className="mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold tracking-widest uppercase mb-5">
              Кейсы и проекты
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--page-fg)' }}>
              Реальные задачи —<br className="hidden sm:block" /> измеримые результаты
            </h1>
            <p className="text-lg max-w-xl" style={{ color: 'var(--muted)' }}>
              {cases.length} кейсов из практики. Каждый — конкретная бизнес-задача с числами до и после.
            </p>
          </div>

          {/* Сетка */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cases.map((c) => {
              const col = colorMap[c.color] ?? colorMap.indigo
              return (
                <Link key={c.slug} href={`/cases/${c.slug}`}
                  className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--card-bg)' }}>

                  {/* Обложка (если есть) */}
                  {c.cover && (
                    <div className="h-48 overflow-hidden relative">
                      <Image
                        src={c.cover}
                        alt={c.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {c.tags.map(t => (
                          <span key={t} className={`px-2 py-0.5 rounded-md text-xs font-medium border ${col.badge}`}>{t}</span>
                        ))}
                      </div>
                      <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{c.date}</span>
                    </div>

                    <h2 className="font-bold text-lg leading-snug mb-2 flex-1" style={{ color: 'var(--page-fg)' }}>
                      {c.title}
                    </h2>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--muted)' }}>
                      {c.description}
                    </p>

                    {/* Метрики */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 pt-4 border-t mb-4"
                      style={{ borderColor: 'var(--card-border)' }}>
                      {c.metrics.slice(0, 3).map(m => (
                        <div key={m.label}>
                          <div className="font-mono text-sm font-black" style={{ color: 'var(--page-fg)' }}>{m.value}</div>
                          <div className="text-xs" style={{ color: 'var(--muted)' }}>{m.delta ?? m.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                      Читать кейс
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
