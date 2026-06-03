import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getCaseBySlug, getAdjacentCase, cases } from '@/lib/cases-data'
import { CaseLayout } from '@/components/cases/CaseLayout'
import { CaseCta } from '@/components/cases/CaseCta'
import { CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react'

/* Статическая генерация всех slug */
export function generateStaticParams() {
  return cases.map(c => ({ slug: c.slug }))
}

/* Метаданные */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const c = getCaseBySlug(slug)
  if (!c) return {}
  const url = `https://pr4web.ru/cases/${c.slug}`
  return {
    title:       `${c.title} — PR4WEB`,
    description: c.description,
    alternates:  { canonical: url },
    openGraph: {
      title:       c.title,
      description: c.description,
      url,
      images: c.cover
        ? [{ url: c.cover, width: 1200, height: 630, alt: c.title }]
        : [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card:  'summary_large_image',
      title: c.title,
      description: c.description,
      images: c.cover ? [c.cover] : ['/og-image.jpg'],
    },
  }
}

/* Палитра акцентов */
const accentMap: Record<string, string> = {
  violet: '#8b5cf6', indigo: '#6366f1', cyan: '#06b6d4', green: '#10b981', amber: '#f59e0b', rose: '#f43f5e',
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c    = getCaseBySlug(slug)
  if (!c) notFound()

  const next   = getAdjacentCase(slug)
  const accent = accentMap[c.color] ?? '#6366f1'

  return (
    <CaseLayout title={c.title}>
      <article className="max-w-4xl mx-auto px-6 pb-4">

        {/* ── HERO ── */}
        <header className="pt-8 pb-14 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {c.tags.map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold border"
                style={{ backgroundColor: `${accent}18`, color: accent, borderColor: `${accent}30` }}>
                {t}
              </span>
            ))}
            <span className="text-xs font-mono ml-auto" style={{ color: 'var(--muted)' }}>{c.date}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3"
            style={{ color: 'var(--page-fg)' }}>
            {c.title}
          </h1>
          <p className="text-xl mb-8" style={{ color: 'var(--muted)' }}>{c.subtitle}</p>

          {/* Стек */}
          <div className="flex flex-wrap gap-2 mb-10">
            {c.stack.map(s => (
              <span key={s} className="px-3 py-1 rounded-lg text-xs font-mono"
                style={{ backgroundColor: 'var(--subtle)', color: 'var(--muted)', border: '1px solid var(--card-border)' }}>
                {s}
              </span>
            ))}
          </div>

          {/* Метрики */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {c.metrics.map(m => (
              <div key={m.label} className="rounded-xl px-4 py-4"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  {m.positive
                    ? <TrendingUp size={13} className="text-emerald-400" />
                    : <TrendingDown size={13} className="text-rose-400" />}
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{m.label}</span>
                </div>
                <div className="font-mono text-xl font-black" style={{ color: 'var(--page-fg)' }}>{m.value}</div>
                {m.delta && <div className="text-xs mt-0.5" style={{ color: m.positive ? '#10b981' : '#ef4444' }}>{m.delta}</div>}
              </div>
            ))}
          </div>
        </header>

        {/* ── ПРОБЛЕМА ── */}
        <section className="py-12 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase mb-4"
            style={{ color: accent }}>Контекст и проблема</h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--page-fg)' }}>{c.problem}</p>
        </section>

        {/* ── ЦЕЛЬ ── */}
        <section className="py-10 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase mb-4"
            style={{ color: accent }}>Что нужно было сделать</h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--muted)' }}>{c.goal}</p>
        </section>

        {/* ── ШАГИ ── */}
        <section className="py-12 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase mb-8"
            style={{ color: accent }}>Как решал</h2>
          <div className="space-y-12">
            {c.steps.map(step => (
              <div key={step.num} className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-5">
                {/* Номер */}
                <div className="flex md:flex-col items-center md:items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm flex-shrink-0"
                    style={{ backgroundColor: `${accent}18`, color: accent, border: `1px solid ${accent}28` }}>
                    {step.num}
                  </div>
                  <h3 className="font-bold text-base md:hidden" style={{ color: 'var(--page-fg)' }}>{step.title}</h3>
                </div>
                {/* Контент */}
                <div>
                  <h3 className="hidden md:block font-bold text-base mb-3" style={{ color: 'var(--page-fg)' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>{step.description}</p>
                  {step.prompt && (
                    <div className="rounded-xl p-4 mb-4 font-mono text-xs leading-relaxed overflow-x-auto"
                      style={{ backgroundColor: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-wrap' }}>
                      <div className="text-xs font-sans mb-2" style={{ color: accent }}>Промпт</div>
                      {step.prompt}
                    </div>
                  )}
                  {step.image && (
                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--card-border)' }}>
                      <Image src={step.image} alt={step.title} width={800} height={450}
                        className="w-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── КЛЮЧЕВЫЕ РЕШЕНИЯ (если есть) ── */}
        {c.keyPoints && c.keyPoints.length > 0 && (
          <section className="py-12 border-b" style={{ borderColor: 'var(--card-border)' }}>
            <h2 className="text-xs font-mono font-semibold tracking-widest uppercase mb-8"
              style={{ color: accent }}>Ключевые решения</h2>
            <div className="space-y-5">
              {c.keyPoints.map((kp, i) => (
                <div key={i} className="rounded-2xl p-6"
                  style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  <h3 className="font-bold text-base mb-4" style={{ color: 'var(--page-fg)' }}>{kp.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <div className="text-xs font-semibold text-rose-400 mb-1">Стандартный подход</div>
                      <span style={{ color: 'var(--muted)' }}>{kp.old}</span>
                    </div>
                    <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                      <div className="text-xs font-semibold mb-1 text-emerald-400">Наше решение</div>
                      <span style={{ color: 'var(--page-fg)' }}>{kp.new}</span>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{kp.reason}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── РЕЗУЛЬТАТ ── */}
        <section className="py-12 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <h2 className="text-xs font-mono font-semibold tracking-widest uppercase mb-6"
            style={{ color: accent }}>Результат</h2>

          {/* Метрики-резюме */}
          <div className="flex flex-wrap gap-3 mb-8">
            {c.metrics.map(m => (
              <div key={m.label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: 'var(--subtle)', border: '1px solid var(--card-border)' }}>
                <CheckCircle2 size={15} style={{ color: accent }} />
                <span className="font-mono font-black text-sm" style={{ color: 'var(--page-fg)' }}>{m.value}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{m.label}</span>
              </div>
            ))}
          </div>

          <p className="text-lg leading-relaxed" style={{ color: 'var(--page-fg)' }}>{c.result}</p>

          {c.clientQuote && (
            <blockquote className="mt-8 pl-5 border-l-4 border-indigo-500/40">
              <p className="text-base italic mb-2" style={{ color: 'var(--page-fg)' }}>«{c.clientQuote.text}»</p>
              <cite className="text-sm not-italic" style={{ color: 'var(--muted)' }}>{c.clientQuote.author}</cite>
            </blockquote>
          )}
        </section>
      </article>

      {/* ── CTA ── */}
      <CaseCta next={next} />
    </CaseLayout>
  )
}
