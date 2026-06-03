'use client'

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Activity, GitBranch, ScanSearch, BarChart2, ArrowUpRight } from 'lucide-react'
import { LetterReveal } from '@/components/ui/LetterReveal'

/* ── Данные инструментов ── */
const tools = [
  {
    id: 'trafficlens',
    icon: Activity,
    status: 'active',
    name: 'TrafficLens',
    tagline: 'Скоринг посетителей сайта',
    description:
      'JS-тег весом 4 КБ встраивается на сайт и в реальном времени оценивает качество трафика по поведенческим паттернам. Передаёт цели в Яндекс.Метрику — без ручных фильтров.',
    metrics: ['5 целей Метрики', 'Директ + ВК'],
    stack: ['JS', 'PHP 8', 'MySQL', 'Метрика API'],
    color: '#6366f1',
    lines: ['> init tracker...', '> score: 87 / bot: false', '> goal fired: hot_lead'],
  },
  {
    id: 'tracker',
    icon: GitBranch,
    status: 'active',
    name: 'Cross-domain tracker',
    tagline: 'Сквозная атрибуция без cookies',
    description:
      'Связывает первое рекламное касание с итоговой заявкой через несколько сайтов и недель. Fingerprinting (Canvas + WebGL) вместо cookies — работает после очистки и в разных браузерах.',
    metrics: ['6 сайтов', '100% заявок с uid'],
    stack: ['PHP 8', 'MySQL', 'Canvas API', 'Chart.js'],
    color: '#10b981',
    lines: ['> uid: 47291', '> path: lp_A → corp_site', '> attr: yandex / cpc'],
  },
  {
    id: 'adv-par',
    icon: ScanSearch,
    status: 'active',
    name: 'adv-par',
    tagline: 'Анализатор объявлений Яндекса',
    description:
      'Парсит рекламную выдачу Яндекса по заданным запросам, собирает объявления конкурентов с UTM-метками и формирует брендированный HTML-отчёт для клиента.',
    metrics: ['Авто-сбор выдачи', 'HTML-отчёт'],
    stack: ['Python', 'Selenium', 'PHP', 'HTML'],
    color: '#f59e0b',
    lines: ['> query: "профнастил забор"', '> found: 24 ads', '> export: report.html'],
  },
  {
    id: 'adv-stat',
    icon: BarChart2,
    status: 'active',
    name: 'adv-stat',
    tagline: 'Генератор отчётов из Директа',
    description:
      'SPA без сервера: загружаешь CSV-выгрузку из Яндекс.Директа — получаешь интерактивные графики и сводку по охватам, таргетам и площадкам. Работает прямо в браузере.',
    metrics: ['3 типа CSV', 'Без сервера'],
    stack: ['HTML', 'Vanilla JS', 'PapaParse', 'Chart.js'],
    color: '#06b6d4',
    lines: ['> load: stats_june.csv', '> rows: 1 840', '> chart: rendered ✓'],
  },
]

/* ── Анимации ── */
const fadeUp: Variants = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }
const tv = { duration: 0.55 }

/* ── Карточка ── */
function ToolCard({ tool, delay }: { tool: typeof tools[0]; delay: number }) {
  const Icon = tool.icon
  const { theme } = useTheme()
  const termBg = theme === 'light' ? '#1e1e30' : '#0d0d14'
  return (
    <motion.div
      variants={fadeUp}
      transition={{ ...tv, delay }}
      className="group flex flex-col rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300"
      style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--card-bg)' }}
    >
      {/* Псевдо-терминал */}
      <div
        className="px-4 pt-3 pb-4 font-mono text-xs leading-relaxed relative overflow-hidden"
        style={{ backgroundColor: termBg, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Dot-bar */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-2 text-white/20 text-[10px]">{tool.id}.sh</span>
        </div>
        {/* Строки вывода */}
        {tool.lines.map((line, i) => (
          <div key={i} className="flex gap-2">
            <span style={{ color: `${tool.color}99` }}>$</span>
            <span style={{ color: i < tool.lines.length - 1 ? 'rgba(255,255,255,0.45)' : tool.color }}>
              {line.replace('> ', '')}
            </span>
          </div>
        ))}
        {/* Курсор */}
        <span
          className="inline-block w-1.5 h-3.5 mt-0.5 animate-pulse"
          style={{ backgroundColor: tool.color, opacity: 0.7 }}
        />
      </div>

      {/* Контент */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Иконка + статус */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${tool.color}18`, border: `1px solid ${tool.color}30` }}>
            <Icon size={17} style={{ color: tool.color }} />
          </div>
          <span className="flex items-center gap-1.5 text-xs font-mono"
            style={{ color: 'var(--muted)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            active
          </span>
        </div>

        {/* Название */}
        <h3 className="font-mono font-black text-base mb-1" style={{ color: 'var(--page-fg)' }}>
          {tool.name}
        </h3>
        <p className="text-xs font-medium mb-3" style={{ color: tool.color }}>
          {tool.tagline}
        </p>

        {/* Описание */}
        <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--muted)' }}>
          {tool.description}
        </p>

        {/* Метрики */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.metrics.map((m) => (
            <span key={m} className="px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: `${tool.color}15`, color: tool.color, border: `1px solid ${tool.color}28` }}>
              {m}
            </span>
          ))}
        </div>

        {/* Стек */}
        <div className="flex flex-wrap gap-1.5">
          {tool.stack.map((s) => (
            <span key={s} className="px-2 py-0.5 rounded text-xs font-mono"
              style={{ backgroundColor: 'var(--subtle)', color: 'var(--muted)', border: '1px solid var(--card-border)' }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Главный компонент ── */
export function Tools() {
  const headRef  = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const ctaRef   = useRef<HTMLDivElement>(null)

  const headIn  = useInView(headRef,  { once: true, margin: '-60px 0px' })
  const cardsIn = useInView(cardsRef, { once: true, margin: '-60px 0px' })
  const ctaIn   = useInView(ctaRef,   { once: true, margin: '-40px 0px' })

  return (
    <section id="tools" className="relative py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(6,182,212,0.03) 0%, transparent 100%)' }} />

      <div className="max-w-6xl mx-auto px-6">

        {/* Заголовок */}
        <motion.div ref={headRef} variants={fadeUp} transition={tv}
          initial="hidden" animate={headIn ? 'visible' : 'hidden'}
          className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold tracking-widest uppercase mb-5">
            Инструменты
          </span>
          <LetterReveal as="h2" delay={0.05}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: 'var(--page-fg)' }}>
            Написал сам, потому что готовых решений не было
          </LetterReveal>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
            Четыре инструмента из реальной практики — каждый закрывает задачу, которую стандартные сервисы не решают.
          </p>
        </motion.div>

        {/* Сетка */}
        <motion.div ref={cardsRef} variants={stagger}
          initial="hidden" animate={cardsIn ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {tools.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} delay={i * 0.09} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div ref={ctaRef} variants={fadeUp} transition={tv}
          initial="hidden" animate={ctaIn ? 'visible' : 'hidden'}
          className="rounded-2xl px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div>
            <p className="font-bold text-base mb-1" style={{ color: 'var(--page-fg)' }}>
              Нужен похожий инструмент под ваш проект?
            </p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Разберём задачу — предложу готовое решение или сделаю под вас.
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('contact')
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            Обсудить задачу
            <ArrowUpRight size={15} />
          </button>
        </motion.div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </section>
  )
}
