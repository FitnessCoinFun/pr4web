'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, type Variants, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, TrendingDown, BarChart2, Zap, Globe, Cpu, Layout } from 'lucide-react'
import { openContactModal } from '@/components/ui/ContactModal'
import { LetterReveal } from '@/components/ui/LetterReveal'

/* ── Данные кейсов ── */
const cases = [
  {
    slug: 'smm-automation',
    tags: ['AI-автоматизация', 'Спортивный блог'],
    date: '2026',
    icon: Zap,
    color: 'violet',
    title: 'Автоматизация контент-продакшна для соцсетей',
    description:
      'NotebookLM извлекает структуру из видео, Claude генерирует тексты, HTML/JS-шаблон собирает карусель. Нет подписок, нет сервера — 0 ₽ за карточку.',
    metrics: [
      { label: 'Себестоимость карточки', value: '0 ₽', delta: 'копирайтер исключён', positive: true },
      { label: 'Шаблонов за сессию', value: '11', delta: 'с PNG-экспортом', positive: true },
    ],
  },
  {
    slug: 'site-audit',
    tags: ['Аудит', 'Premium e-commerce', 'AI-аналитика'],
    date: '2026',
    icon: TrendingDown,
    color: 'indigo',
    title: 'Предстартовый аудит сайта под платный трафик',
    description:
      'Аудит интернет-магазина кожаных изделий ручной работы перед первым запуском Директа: UX/конверсия, технический SEO и Deep Research рынка через NotebookLM.',
    metrics: [
      { label: 'Слоёв аудита', value: '3', delta: 'UX + SEO + рынок', positive: true },
      { label: 'Страниц проверено', value: '6+', delta: 'main + товары + служебные', positive: true },
    ],
  },
  {
    slug: 'b2b-landing',
    tags: ['Лендинг', 'B2B промышленность', 'AI-аналитика'],
    date: '2026',
    icon: BarChart2,
    color: 'cyan',
    title: 'B2B лендинг: контрактное производство ЛКМ',
    description:
      'Конкурентный анализ 17 игроков рынка толлинга, два варианта лендинга, форма сокращена с 7 полей до 3. Без внешних зависимостей.',
    metrics: [
      { label: 'Конкурентов', value: '17', delta: 'с разбивкой по УТП', positive: true },
      { label: 'Вариантов лендинга', value: '2', delta: null, positive: true },
    ],
  },
  {
    slug: 'b2b-leads',
    tags: ['Трафик', 'B2B', 'Директ'],
    date: '2024',
    icon: Globe,
    color: 'green',
    title: 'Лидогенерация B2B: подбор внештатного персонала',
    description:
      'Двусторонний спрос — квиз-квалификация + нативная замена УТП через UTM (0 ₽/мес вместо Yagla). 162 заявки за 8 месяцев, CPL 2 974 ₽.',
    metrics: [
      { label: 'CPL по форме', value: '2 974 ₽', delta: 'за 8 месяцев', positive: true },
      { label: 'Конверсий', value: '162', delta: '+ 14 квизов', positive: true },
    ],
  },
  {
    slug: 'cross-tracker',
    tags: ['Аналитика', 'Атрибуция', 'PHP'],
    date: '2026',
    icon: Cpu,
    color: 'amber',
    title: 'Кросс-доменный трекер для девелопера',
    description:
      'Собственный инструмент: связал первое рекламное касание с заявкой через 6 сайтов без cookies. Fingerprinting + PHP + MySQL.',
    metrics: [
      { label: 'Сайтов в системе', value: '6', delta: null, positive: true },
      { label: 'Заявок с атрибуцией', value: '100%', delta: 'было 0%', positive: true },
    ],
  },
  {
    slug: 'pr4web-landing',
    tags: ['Лендинг', 'Next.js', 'Личный бренд'],
    date: '2026',
    icon: Layout,
    color: 'rose',
    title: 'Лендинг личного бренда специалиста по рекламе',
    description:
      'Next.js 16 + Framer Motion с нуля: анимированный hero с 6 кадрами crossfade, ROI-калькулятор, LetterReveal, Odometer. Telegram Bot API уведомляет о каждой заявке без сторонних SaaS.',
    metrics: [
      { label: 'Платных инструментов', value: '0 ₽/мес', delta: 'нет Tilda, Webflow, Yagla', positive: true },
      { label: 'Кадров hero', value: '6', delta: '3 тёмных + 3 светлых', positive: true },
    ],
  },
]

const allTags = ['Все', 'Трафик', 'Аналитика', 'AI-автоматизация', 'Аудит', 'B2B', 'Лендинг']

/* ── Палитра ── */
const colorMap: Record<string, { badge: string; icon: string; border: string; glow: string }> = {
  violet: { badge: 'bg-violet-500/15 text-violet-400 border-violet-500/20', icon: 'text-violet-400', border: 'hover:border-violet-500/30', glow: 'rgba(139,92,246,0.08)' },
  indigo: { badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20', icon: 'text-indigo-400', border: 'hover:border-indigo-500/30', glow: 'rgba(99,102,241,0.08)' },
  cyan:   { badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',       icon: 'text-cyan-400',   border: 'hover:border-cyan-500/30',   glow: 'rgba(6,182,212,0.08)' },
  green:  { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: 'text-emerald-400', border: 'hover:border-emerald-500/30', glow: 'rgba(16,185,129,0.08)' },
  amber:  { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/20',    icon: 'text-amber-400',  border: 'hover:border-amber-500/30',  glow: 'rgba(245,158,11,0.08)' },
  rose:   { badge: 'bg-rose-500/15 text-rose-400 border-rose-500/20',       icon: 'text-rose-400',   border: 'hover:border-rose-500/30',   glow: 'rgba(244,63,94,0.08)' },
}

/* ── Анимации ── */
const grid: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}
const card: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const header: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

/* ── Компонент ── */
export function Cases() {
  const [activeTag, setActiveTag] = useState('Все')
  const headRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const headIn  = useInView(headRef, { once: true, margin: '-60px 0px' })
  const gridIn  = useInView(gridRef, { once: true, margin: '-60px 0px' })

  const filtered = activeTag === 'Все'
    ? cases
    : cases.filter(c => c.tags.includes(activeTag))

  return (
    <section id="cases" className="relative py-28">

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">

        {/* Заголовок */}
        <motion.div
          ref={headRef}
          variants={header}
          initial="hidden"
          animate={headIn ? 'visible' : 'hidden'}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold tracking-widest uppercase mb-5">
            Кейсы и проекты
          </span>
          <LetterReveal as="h2" delay={0.05}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: 'var(--page-fg)' }}>
            Реальные задачи — измеримые результаты
          </LetterReveal>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
            Каждый кейс — конкретная бизнес-задача с числами до и после.
          </p>
        </motion.div>

        {/* Фильтр */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={headIn ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: activeTag === tag ? '#6366f1' : 'var(--subtle)',
                borderColor:     activeTag === tag ? '#6366f1' : 'var(--card-border)',
                color:           activeTag === tag ? '#ffffff'  : 'var(--muted)',
              }}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Сетка */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTag}
            ref={gridRef}
            variants={grid}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {filtered.map((item) => {
              const c = colorMap[item.color]
              const Icon = item.icon
              return (
                <motion.article
                  key={item.slug}
                  variants={card}
                  className={`group relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden ${c.border}`}
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor:     'var(--card-border)',
                  }}
                  whileHover={{ y: -4, boxShadow: `0 20px 60px ${c.glow}` }}
                >
                <Link href={`/cases/${item.slug}`} className="absolute inset-0 z-10" aria-label={item.title} />
                  {/* Верхняя часть */}
                  <div className="p-6 flex-1">
                    {/* Иконка + дата */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.badge} border`}>
                        <Icon size={18} className={c.icon} />
                      </div>
                      <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{item.date}</span>
                    </div>

                    {/* Теги */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-0.5 rounded-md text-xs font-medium border ${c.badge}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Заголовок */}
                    <h3 className="font-bold text-base leading-snug mb-3" style={{ color: 'var(--page-fg)' }}>
                      {item.title}
                    </h3>

                    {/* Описание */}
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Метрики */}
                  <div
                    className="px-6 py-4 flex flex-wrap gap-x-4 gap-y-2 border-t"
                    style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--subtle)' }}
                  >
                    {item.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="font-mono text-sm font-black" style={{ color: 'var(--page-fg)' }}>
                          {m.value}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--muted)' }}>
                          {m.delta ?? m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Нижняя полоска — визуальный акцент без ложной ссылки */}
                  <div className="px-6 py-2.5 border-t" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--subtle)' }}>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      {item.tags.join(' · ')}
                    </span>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* CTA под кейсами */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={gridIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
            Скорее всего, я уже решал похожую задачу
          </p>
          <button
            onClick={openContactModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 cursor-pointer"
          >
            Проверить — написать
            <ArrowUpRight size={16} />
          </button>
        </motion.div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  )
}
