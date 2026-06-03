'use client'

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { LetterReveal } from '@/components/ui/LetterReveal'
import {
  Search, Target, Rocket, BarChart2, TrendingUp,
  MessageSquare, FileText, CheckCircle,
} from 'lucide-react'

/* ── Шаги процесса ── */
const steps = [
  {
    num: '1',
    icon: Search,
    color: 'indigo',
    accent: '#6366f1',
    title: 'Аудит',
    subtitle: 'Разбираю ситуацию по данным',
    description:
      'Смотрю что работает, что сливает бюджет. Анализирую кампании, посадочные страницы, аналитику и конкурентов — без воды, только факты.',
    output: 'Отчёт с находками',
  },
  {
    num: '2',
    icon: Target,
    color: 'violet',
    accent: '#8b5cf6',
    title: 'Стратегия',
    subtitle: 'План с прогнозом и KPI',
    description:
      'Составляю медиаплан с прогнозируемым CPL и ROI. Определяю структуру кампаний, семантику, аудитории и посадочные страницы.',
    output: 'Медиаплан + КП',
  },
  {
    num: '3',
    icon: Rocket,
    color: 'cyan',
    accent: '#06b6d4',
    title: 'Запуск',
    subtitle: 'Настройка и первые данные',
    description:
      'Настраиваю кампании, пишу тексты, проверяю аналитику. Первые две недели — режим плотного контроля и оперативных правок.',
    output: 'Работающие кампании',
  },
  {
    num: '4',
    icon: BarChart2,
    color: 'emerald',
    accent: '#10b981',
    title: 'Аналитика',
    subtitle: 'Инфраструктура трекинга',
    description:
      'Подключаю трекинг лидов, настраиваю цели. При необходимости — собственный кросс-доменный трекер для сквозной атрибуции.',
    output: 'Дашборд + сквозная аналитика',
  },
  {
    num: '5',
    icon: TrendingUp,
    color: 'amber',
    accent: '#f59e0b',
    title: 'Оптимизация',
    subtitle: 'Масштабирование результата',
    description:
      'А/Б тесты объявлений и посадок, расширение аудиторий, перераспределение бюджета в пользу работающих связок.',
    output: 'Рост при том же бюджете',
  },
]

/* ── Факты внизу ── */
const facts = [
  { icon: MessageSquare, text: 'Связь через Telegram — отвечаю в рабочее время' },
  { icon: FileText,      text: 'Еженедельные отчёты с цифрами, не «всё хорошо»' },
  { icon: CheckCircle,   text: 'Первые результаты обычно видны через 3-4 недели' },
]

/* ── Анимации ── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}
const tv = { duration: 0.55 }  // transition values — передаём отдельно

const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

export function Process() {
  const headRef   = useRef<HTMLDivElement>(null)
  const lineRef   = useRef<HTMLDivElement>(null)   // десктоп: линия + карточки
  const mobileRef = useRef<HTMLDivElement>(null)   // мобайл: вертикальный список
  const factRef   = useRef<HTMLDivElement>(null)

  const headIn   = useInView(headRef,   { once: true, margin: '-60px 0px' })
  const lineIn   = useInView(lineRef,   { once: true, margin: '-60px 0px' })
  const mobileIn = useInView(mobileRef, { once: true, margin: '-60px 0px' })
  const factIn   = useInView(factRef,   { once: true, margin: '-40px 0px' })

  return (
    <section id="process" className="relative py-28 overflow-hidden">

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      {/* Фоновый акцент */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.04) 0%, transparent 100%)' }} />

      <div className="max-w-6xl mx-auto px-6">

        {/* Заголовок */}
        <motion.div ref={headRef} initial="hidden" animate={headIn ? 'visible' : 'hidden'}
          variants={fadeUp} transition={tv} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold tracking-widest uppercase mb-5">
            Как работаю
          </span>
          <LetterReveal as="h2" delay={0.05}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: 'var(--page-fg)' }}>
            Процесс без сюрпризов
          </LetterReveal>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
            Каждый этап — конкретный результат. Знаете, что происходит и когда ждать цифры.
          </p>
        </motion.div>

        {/* ── Десктоп: горизонтальный таймлайн ── */}
        <div className="hidden lg:block mb-8" ref={lineRef}>

          {/* Линия с кружками */}
          <div className="relative flex items-center mb-10 px-[10%]">
            {/* Трек (серый) */}
            <div className="absolute inset-x-[10%] top-1/2 -translate-y-1/2 h-px"
              style={{ backgroundColor: 'var(--card-border)' }} />
            {/* Анимированная линия (индиго) */}
            <motion.div
              className="absolute left-[10%] top-1/2 -translate-y-1/2 h-0.5 bg-indigo-600 origin-left"
              initial={{ scaleX: 0 }}
              animate={lineIn ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
              style={{ right: '10%' }}
            />
            {/* Кружки шагов */}
            <div className="relative z-10 w-full flex justify-between">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={lineIn ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.2, ease: 'backOut' }}
                  className="w-11 h-11 rounded-full flex items-center justify-center font-mono font-black text-base text-white shadow-lg"
                  style={{ backgroundColor: step.accent, boxShadow: `0 0 0 4px var(--page-bg), 0 0 0 5px ${step.accent}40` }}
                >
                  {step.num}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Карточки — используют lineIn (тот же контейнер) */}
          <motion.div initial="hidden" animate={lineIn ? 'visible' : 'hidden'}
            variants={stagger} className="grid grid-cols-5 gap-4">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <motion.div key={step.num} variants={fadeUp} transition={tv}
                  className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  {/* Иконка */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${step.accent}18`, border: `1px solid ${step.accent}30` }}>
                    <Icon size={17} style={{ color: step.accent }} />
                  </div>
                  {/* Текст */}
                  <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--page-fg)' }}>{step.title}</h3>
                  <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--muted)' }}>{step.description}</p>
                  {/* Output */}
                  <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-medium"
                    style={{ backgroundColor: `${step.accent}12`, color: step.accent, border: `1px solid ${step.accent}25` }}>
                    → {step.output}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* ── Мобайл: вертикальный список ── */}
        <motion.div ref={mobileRef} className="lg:hidden space-y-0"
          initial="hidden" animate={mobileIn ? 'visible' : 'hidden'} variants={stagger}>
          {steps.map((step, i) => {
            const Icon = step.icon
            const isLast = i === steps.length - 1
            return (
              <motion.div key={step.num} variants={fadeUp} transition={tv} className="flex gap-4">
                {/* Левый столбец: кружок + линия */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-black text-sm text-white flex-shrink-0"
                    style={{ backgroundColor: step.accent }}>
                    {step.num}
                  </div>
                  {!isLast && (
                    <div className="w-px flex-1 my-2" style={{ backgroundColor: 'var(--card-border)', minHeight: '32px' }} />
                  )}
                </div>
                {/* Правый столбец: контент */}
                <div className={`pb-6 ${isLast ? '' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={15} style={{ color: step.accent }} />
                    <h3 className="font-bold text-base" style={{ color: 'var(--page-fg)' }}>{step.title}</h3>
                  </div>
                  <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {step.description}
                  </p>
                  <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-medium"
                    style={{ backgroundColor: `${step.accent}12`, color: step.accent, border: `1px solid ${step.accent}25` }}>
                    → {step.output}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* ── Факты внизу ── */}
        <motion.div ref={factRef} initial="hidden" animate={factIn ? 'visible' : 'hidden'}
          variants={stagger}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {facts.map((fact) => {
            const Icon = fact.icon
            return (
              <motion.div key={fact.text} variants={fadeUp} transition={tv}
                className="flex items-start gap-3 rounded-xl p-4"
                style={{ backgroundColor: 'var(--subtle)', border: '1px solid var(--card-border)' }}>
                <Icon size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{fact.text}</p>
              </motion.div>
            )
          })}
        </motion.div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </section>
  )
}
