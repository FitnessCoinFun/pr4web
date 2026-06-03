'use client'

import { useRef, useState } from 'react'
import { motion, useInView, type Variants, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ArrowUpRight, ChevronDown } from 'lucide-react'
import { LetterReveal } from '@/components/ui/LetterReveal'

/* ── Данные инструментов ── */
const tools = [
  {
    id: 'claude',
    name: 'Claude',
    company: 'Anthropic',
    letter: 'C',
    color: '#D97757',
    bg: 'rgba(217,119,87,0.10)',
    border: 'rgba(217,119,87,0.25)',
    tagline: 'Код, аудиты, автоматизация',
    description:
      'Основной инструмент — использую каждый день. Пишет код, проводит UX-аудиты, создаёт рекламные тексты и технические документы. Этот сайт разработан с Claude Code.',
    uses: [
      'Написание кода — PHP, JS, TypeScript, Next.js',
      'UX/UI-аудит сайтов перед запуском трафика',
      'Рекламные тексты и формулировки УТП',
      'Автоматизация рутинных задач и отчётов',
      'Стратегические документы и медиапланы',
    ],
    example: {
      label: 'Кейс',
      text: 'Этот сайт — Claude Code. Аудит steelcraft.ru за 2 часа вместо 2 дней.',
    },
  },
  {
    id: 'gemini',
    name: 'Gemini',
    company: 'Google',
    letter: 'G',
    color: '#4F8EF7',
    bg: 'rgba(79,142,247,0.10)',
    border: 'rgba(79,142,247,0.25)',
    tagline: 'Данные, документы, визуал',
    description:
      'Анализирую большие массивы данных из Директа и ВК, работаю с PDF-документами, провожу конкурентный анализ. Gemini Image — для создания референсов и макетов.',
    uses: [
      'Анализ выгрузок из Директа и ВК по рекламе',
      'Конкурентный ландшафт — быстрый срез рынка',
      'Работа с объёмными PDF и отчётами',
      'Генерация изображений и визуальных референсов',
      'Структурирование и парсинг данных',
    ],
    example: {
      label: 'Кейс',
      text: '17 конкурентов ТПСМ проанализированы за один сеанс с выгрузкой в таблицу.',
    },
  },
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    company: 'Google',
    letter: 'N',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.10)',
    border: 'rgba(139,92,246,0.25)',
    tagline: 'Базы знаний и исследования',
    description:
      'Создаю базы знаний по нишам клиентов, работаю с исследованиями рынка, кастдев-интервью и отраслевыми документами. Незаменим для глубокого погружения в новую нишу.',
    uses: [
      'Базы знаний по нишам перед запуском проекта',
      'Анализ кастдев-интервью и отзывов клиентов',
      'Структурирование отраслевых документов',
      'Подготовка брифов и стратегических справок',
      'Обучающие материалы и скрипты продаж',
    ],
    example: {
      label: 'Применение',
      text: 'Перед каждым новым проектом — загружаю отраслевые отчёты и получаю брифинг за 15 минут.',
    },
  },
]

/* ── Итоговые факты ── */
const stats = [
  { value: '3-5×', label: 'быстрее аудит', sub: 'против ручной работы' },
  { value: '80%',  label: 'рутины автоматизировано', sub: 'отчёты, тексты, код' },
  { value: '1 день', label: 'вместо недели', sub: 'от задачи до прототипа' },
]

/* ── Анимации ── */
const fadeUp: Variants = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const tv = { duration: 0.55 }

/* ── Карточка инструмента ── */
function ToolCard({ tool, delay }: { tool: typeof tools[0]; delay: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      variants={fadeUp}
      transition={{ ...tv, delay }}
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--card-bg)' }}
    >
      {/* Шапка */}
      <div className="px-6 pt-6 pb-5" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div className="flex items-start justify-between mb-4">
          {/* Логотип */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl"
            style={{ backgroundColor: tool.bg, border: `1px solid ${tool.border}`, color: tool.color }}
          >
            {tool.letter}
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
            {tool.company}
          </span>
        </div>
        <h3 className="text-xl font-extrabold mb-1" style={{ color: 'var(--page-fg)' }}>
          {tool.name}
        </h3>
        <p className="text-sm font-medium" style={{ color: tool.color }}>
          {tool.tagline}
        </p>
      </div>

      {/* Описание */}
      <div className="px-6 py-5 flex-1">
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--muted)' }}>
          {tool.description}
        </p>

        {/* Список применений */}
        <ul className="space-y-2.5">
          {tool.uses.slice(0, expanded ? tool.uses.length : 3).map((use) => (
            <li key={use} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--muted)' }}>
              <CheckCircle2 size={14} style={{ color: tool.color, flexShrink: 0, marginTop: 2 }} />
              {use}
            </li>
          ))}
        </ul>

        {/* Кнопка показать ещё — только если есть скрытые пункты */}
        {tool.uses.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer"
            style={{ color: 'var(--muted)' }}
          >
            {expanded ? 'Скрыть' : `+${tool.uses.length - 3} ещё`}
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={13} />
            </motion.span>
          </button>
        )}
      </div>

      {/* Пример */}
      <div className="px-6 py-4 mx-0" style={{ borderTop: '1px solid var(--card-border)', backgroundColor: 'var(--subtle)' }}>
        <span
          className="inline-block text-xs font-mono font-semibold px-2 py-0.5 rounded mb-2"
          style={{ backgroundColor: tool.bg, color: tool.color, border: `1px solid ${tool.border}` }}
        >
          {tool.example.label}
        </span>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          {tool.example.text}
        </p>
      </div>
    </motion.div>
  )
}

/* ── Главный компонент ── */
export function AiStack() {
  const headRef  = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const headIn  = useInView(headRef,  { once: true, margin: '-60px 0px' })
  const cardsIn = useInView(cardsRef, { once: true, margin: '-60px 0px' })
  const statsIn = useInView(statsRef, { once: true, margin: '-40px 0px' })

  return (
    <section id="ai" className="relative py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      {/* Фон */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(139,92,246,0.04) 0%, transparent 100%)' }} />

      <div className="max-w-6xl mx-auto px-6">

        {/* Заголовок */}
        <motion.div ref={headRef} variants={fadeUp} transition={tv}
          initial="hidden" animate={headIn ? 'visible' : 'hidden'}
          className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-mono font-semibold tracking-widest uppercase mb-5">
            AI в работе
          </span>
          <LetterReveal as="h2" delay={0.05}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: 'var(--page-fg)' }}>
            AI в каждом проекте: аудит, код, аналитика
          </LetterReveal>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
            Три инструмента закрывают 80% рутины.<br className="hidden sm:block" /> Больше времени на стратегию и результат.
          </p>
        </motion.div>

        {/* Карточки */}
        <motion.div ref={cardsRef} variants={stagger}
          initial="hidden" animate={cardsIn ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {tools.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} delay={i * 0.1} />
          ))}
        </motion.div>

        {/* Статистика */}
        <motion.div ref={statsRef} variants={stagger}
          initial="hidden" animate={statsIn ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <motion.div key={s.value} variants={fadeUp} transition={tv}
              className="rounded-xl px-6 py-5 text-center"
              style={{ backgroundColor: 'var(--subtle)', border: '1px solid var(--card-border)' }}>
              <div className="font-mono text-3xl font-black text-indigo-400 mb-1">{s.value}</div>
              <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--page-fg)' }}>{s.label}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </section>
  )
}
