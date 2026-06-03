'use client'

import { motion, type Variants } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { RevealText } from '@/components/ui/RevealText'
import { LetterReveal } from '@/components/ui/LetterReveal'
import {
  Clock,
  Cpu,
  LineChart,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

/* ── Данные карточек ── */
const benefits = [
  {
    icon: Clock,
    color: 'indigo',
    label: 'Опыт с 2001 года',
    title: 'Видел всё — с нулевых до эпохи AI',
    description:
      'Работаю с контекстом с тех пор, когда Яндекс.Директ только появился. Видел, как менялись алгоритмы, аукционы и поведение аудитории. Эти 25 лет — не цифра в резюме, а десятки нюансов в каждом решении.',
    points: [
      'Помню рынок до автостратегий — понимаю, что за ними',
      'Опыт кризисов 2008, 2014, 2020, 2022',
      'Проекты от 100 тыс до 1 млн+ ₽ бюджета в месяц',
    ],
  },
  {
    icon: Cpu,
    color: 'violet',
    label: 'Технологический маркетолог',
    title: 'Решаю сам то, на что другие нанимают разработчика',
    description:
      'Разрабатываю инструменты трекинга, атрибуции и аналитики. Когда агентству нужен программист для внедрения пикселя — я делаю это за час. Собственные микросервисы на PHP+JS работают на реальных проектах.',
    points: [
      'Кросс-доменный трекер с fingerprinting',
      'Скоринг посетителей TrafficLens',
      'Автоматизация отчётности из Директа',
    ],
  },
  {
    icon: LineChart,
    color: 'cyan',
    label: 'Сквозная аналитика',
    title: 'Вижу то, что скрывает Яндекс.Метрика',
    description:
      'Связываю первое рекламное касание с финальной заявкой даже если между ними несколько сайтов и недель. Строю аналитику без зависимости от сторонних платформ и их ограничений.',
    points: [
      'First-touch атрибуция без cookies',
      'Сбор данных через 6+ доменов',
      'Дашборды и отчёты под задачу',
    ],
  },
  {
    icon: Sparkles,
    color: 'amber',
    label: 'AI в каждом процессе',
    title: 'Claude, Gemini и NotebookLM — рабочий стек',
    description:
      'AI — не экспериментальный инструмент, а часть ежедневного процесса. Аудит сайтов, анализ конкурентов, генерация кода, написание рекламных текстов — всё это делаю быстрее и глубже с помощью AI.',
    points: [
      'Claude для кода, аудитов, стратегии',
      'Gemini для анализа данных и документов',
      'NotebookLM для исследований и базы знаний',
    ],
  },
]

/* ── Палитра акцентов карточек ── */
const colorMap: Record<string, { bg: string; border: string; icon: string; glow: string; dot: string }> = {
  indigo: {
    bg:     'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    icon:   'text-indigo-400',
    glow:   'group-hover:shadow-indigo-500/10',
    dot:    'bg-indigo-500',
  },
  violet: {
    bg:     'bg-violet-500/10',
    border: 'border-violet-500/20',
    icon:   'text-violet-400',
    glow:   'group-hover:shadow-violet-500/10',
    dot:    'bg-violet-500',
  },
  cyan: {
    bg:     'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    icon:   'text-cyan-400',
    glow:   'group-hover:shadow-cyan-500/10',
    dot:    'bg-cyan-500',
  },
  amber: {
    bg:     'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon:   'text-amber-400',
    glow:   'group-hover:shadow-amber-500/10',
    dot:    'bg-amber-500',
  },
}

/* ── Анимации ── */
const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const headerVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

/* ── Компонент ── */
export function Benefits() {
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef   = useRef<HTMLDivElement>(null)
  const headerIn  = useInView(headerRef, { once: true, margin: '-60px 0px' })
  const gridIn    = useInView(gridRef,   { once: true, margin: '-60px 0px' })

  return (
    <section id="benefits" className="relative py-28 overflow-hidden">

      {/* Разделитель-градиент сверху */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Animated gradient mesh — тест Волны 1 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="orb-1 absolute w-[600px] h-[600px] rounded-full -top-40 -left-20 opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="orb-2 absolute w-[500px] h-[500px] rounded-full -bottom-32 -right-16 opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="orb-3 absolute w-[400px] h-[400px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 65%)', filter: 'blur(80px)' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 noise-overlay">

        {/* Заголовок секции */}
        <motion.div
          ref={headerRef}
          variants={headerVariants}
          initial="hidden"
          animate={headerIn ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold tracking-widest uppercase mb-5">
            Почему PR4WEB
          </span>
          <LetterReveal
            as="h2"
            className="fluid-h2 mb-4"
            delay={0.05}
            style={{ color: 'var(--page-fg)' }}
          >
            Реклама + аналитика + код — один человек
          </LetterReveal>
          <RevealText
            delay={0.2}
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            Совмещаю маркетинговую стратегию и технологии:<br className="hidden sm:block" /> реклама работает как система, а не набор ручных правок.
          </RevealText>
        </motion.div>

        {/* Сетка карточек */}
        <motion.div
          ref={gridRef}
          variants={staggerContainer}
          initial="hidden"
          animate={gridIn ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {benefits.map((item) => {
            const c = colorMap[item.color]
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                variants={cardVariants}
                className={`group relative rounded-2xl p-7 overflow-hidden hover:shadow-2xl ${c.glow} transition-all duration-300 cursor-default gradient-border`}
                style={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                }}
              >
                {/* Угловой glow */}
                <div
                  className={`absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  style={{ background: `radial-gradient(circle, ${item.color === 'indigo' ? '#6366f130' : item.color === 'violet' ? '#8b5cf630' : item.color === 'cyan' ? '#06b6d430' : '#f59e0b30'} 0%, transparent 70%)` }}
                />

                {/* Иконка + лейбл */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className={c.icon} />
                  </div>
                  <span className={`text-xs font-mono font-semibold tracking-widest uppercase ${c.icon} opacity-80`}>
                    {item.label}
                  </span>
                </div>

                {/* Заголовок */}
                <h3 className="text-xl font-bold mb-3 leading-snug" style={{ color: 'var(--page-fg)' }}>
                  {item.title}
                </h3>

                {/* Описание */}
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--muted)' }}>
                  {item.description}
                </p>

                {/* Буллеты */}
                <ul className="space-y-2">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--muted)' }}>
                      <CheckCircle2 size={15} className={`${c.icon} flex-shrink-0 mt-0.5 opacity-70`} />
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Нижний разделитель-акцент */}
                <div className={`absolute bottom-0 left-7 right-7 h-px ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            )
          })}
        </motion.div>

      </div>

      {/* Разделитель снизу */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
