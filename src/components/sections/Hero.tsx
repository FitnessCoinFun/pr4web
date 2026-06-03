'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ArrowRight, ChevronDown, Zap, BarChart3, Users, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { openContactModal } from '@/components/ui/ContactModal'
import { Odometer } from '@/components/ui/Odometer'

/* ── Анимируемый счётчик ── */
function CountUp({ to, duration = 2000 }: { to: number; duration?: number }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
            setValue(Math.floor(eased * to))
            if (progress < 1) requestAnimationFrame(tick)
            else setValue(to)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration])

  return <span ref={ref}>{value}</span>
}

/* ── Данные статистики ── */
const stats = [
  {
    icon: Zap,
    value: 25,
    suffix: '+',
    label: 'лет в рекламе',
    description: 'с 2001 года',
  },
  {
    icon: BarChart3,
    value: 500,
    suffix: '+',
    label: 'проектов запущено',
    description: 'B2B и B2C',
  },
  {
    icon: Wrench,
    value: 10,
    suffix: '+',
    label: 'своих инструментов',
    description: 'трекинг, аналитика, автоматизация',
  },
  {
    icon: Users,
    value: 5,
    suffix: '+',
    label: 'агентств-партнёров',
    description: 'работаю подрядчиком',
  },
]

/* ── Теги навыков ── */
const skills = ['Яндекс.Директ', 'ВК реклама', 'Сквозная аналитика', 'Автоматизация', 'Claude AI', 'Трекинг']

/* ── Варианты анимации ── */
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

/* Тёмная тема: 3 кадра — код меняется */
const DARK_IMAGES  = ['/images/hero-1.jpg', '/images/hero-2.jpg', '/images/hero-3.jpg']
/* Светлая тема: добавьте hero-w2.jpg / hero-w3.jpg когда будут готовы */
const LIGHT_IMAGES = ['/images/hero-w1.jpg', '/images/hero-w2.jpg', '/images/hero-w3.jpg']

const SLIDE_INTERVAL = 2800  // мс между сменой кода на экране
const FADE_DURATION  = 1.4   // секунды crossfade между кадрами
const THEME_FADE     = 0.65  // секунды смены тёмная ↔ светлая

/* rgba-компоненты фона для каждой темы (используем в градиентах) */
const DARK_RGB  = '10,10,15'
const LIGHT_RGB = '248,250,252'

export function Hero() {
  const { theme } = useTheme()
  const [mounted,  setMounted]  = useState(false)
  const [leftIdx,  setLeftIdx]  = useState(0)

  useEffect(() => { setMounted(true) }, [])

  /* До гидратации показываем тёмную тему (совпадает с defaultTheme) */
  const isDark = !mounted || theme !== 'light'

  /* Безопасный индекс: если в светлой теме 1 картинка — всегда 0 */
  const lightSafe = leftIdx % LIGHT_IMAGES.length

  /* Цикл: всегда по максимальному набору (3 кадра), modulo сам обработает */
  useEffect(() => {
    const len   = Math.max(DARK_IMAGES.length, LIGHT_IMAGES.length)
    const timer = setInterval(
      () => setLeftIdx(prev => (prev + 1) % len),
      SLIDE_INTERVAL,
    )
    return () => clearInterval(timer)
  }, [])

  const handleScroll = (href: string) => {
    const el = document.querySelector(href)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  /* Вспомогательная функция градиентов для каждой панели */
  const leftGrad  = (rgb: string) =>
    `linear-gradient(to right,  rgba(${rgb},0.55) 0%, rgba(${rgb},0) 28%, rgba(${rgb},0.75) 78%, rgba(${rgb},1) 100%)`
  const rightGrad = (rgb: string) =>
    `linear-gradient(to left,   rgba(${rgb},0.55) 0%, rgba(${rgb},0) 28%, rgba(${rgb},0.75) 78%, rgba(${rgb},1) 100%)`
  const centerGrad = (rgb: string) =>
    `radial-gradient(ellipse 55% 90% at 50% 50%, rgba(${rgb},0.45) 0%, transparent 100%)`

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: isDark ? '#0a0a0f' : '#f8fafb', transition: 'background-color 0.5s ease' }}
    >

      {/* ── Split background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* ── ЛЕВАЯ ПАНЕЛЬ (на мобиле — полная ширина) ── */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-1/2">

          {/* Тёмные кадры (1-3): код меняется в цикле */}
          {DARK_IMAGES.map((src, i) => (
            <motion.div
              key={`d-${src}`}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: isDark && i === leftIdx ? 1 : 0 }}
              transition={{ duration: FADE_DURATION, ease: 'easeInOut' }}
              style={{ backgroundImage: `url(${src})`, backgroundSize: '200% 100%', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat' }}
            />
          ))}

          {/* Светлые кадры (добавляйте hero-w2.jpg, hero-w3.jpg) */}
          {LIGHT_IMAGES.map((src, i) => (
            <motion.div
              key={`l-${src}`}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: !isDark && i === lightSafe ? 1 : 0 }}
              transition={{ duration: FADE_DURATION, ease: 'easeInOut' }}
              style={{ backgroundImage: `url(${src})`, backgroundSize: '200% 100%', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat' }}
            />
          ))}

          {/* Градиент desktop: тёмная версия (fade к центру экрана) */}
          <motion.div className="absolute inset-0 pointer-events-none hidden sm:block" initial={false}
            animate={{ opacity: isDark ? 1 : 0 }} transition={{ duration: THEME_FADE }}
            style={{ background: leftGrad(DARK_RGB) }} />
          <motion.div className="absolute inset-0 pointer-events-none hidden sm:block" initial={false}
            animate={{ opacity: isDark ? 0 : 1 }} transition={{ duration: THEME_FADE }}
            style={{ background: leftGrad(LIGHT_RGB) }} />
          {/* Градиент mobile: затемнение со всех краёв + низ для текста */}
          <motion.div className="absolute inset-0 pointer-events-none sm:hidden" initial={false}
            animate={{ opacity: isDark ? 1 : 0 }} transition={{ duration: THEME_FADE }}
            style={{ background: `linear-gradient(to bottom, rgba(${DARK_RGB},0.45) 0%, rgba(${DARK_RGB},0) 30%, rgba(${DARK_RGB},0.7) 75%, rgba(${DARK_RGB},1) 100%)` }} />
          <motion.div className="absolute inset-0 pointer-events-none sm:hidden" initial={false}
            animate={{ opacity: isDark ? 0 : 1 }} transition={{ duration: THEME_FADE }}
            style={{ background: `linear-gradient(to bottom, rgba(${LIGHT_RGB},0.45) 0%, rgba(${LIGHT_RGB},0) 30%, rgba(${LIGHT_RGB},0.7) 75%, rgba(${LIGHT_RGB},1) 100%)` }} />
        </div>

        {/* ── ПРАВАЯ ПАНЕЛЬ (человек — скрыта на мобиле) ── */}
        <div className="hidden sm:block absolute inset-y-0 right-0 w-1/2">
          {/* Тёмная версия */}
          <motion.div className="absolute inset-0" initial={false}
            animate={{ opacity: isDark ? 1 : 0 }} transition={{ duration: THEME_FADE }}
            style={{ backgroundImage: 'url(/images/hero-1.jpg)', backgroundSize: '200% 100%', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }} />
          {/* Светлая версия */}
          <motion.div className="absolute inset-0" initial={false}
            animate={{ opacity: isDark ? 0 : 1 }} transition={{ duration: THEME_FADE }}
            style={{ backgroundImage: 'url(/images/hero-w1.jpg)', backgroundSize: '200% 100%', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }} />

          {/* Градиент: тёмная версия */}
          <motion.div className="absolute inset-0 pointer-events-none" initial={false}
            animate={{ opacity: isDark ? 1 : 0 }} transition={{ duration: THEME_FADE }}
            style={{ background: rightGrad(DARK_RGB) }} />
          {/* Градиент: светлая версия */}
          <motion.div className="absolute inset-0 pointer-events-none" initial={false}
            animate={{ opacity: isDark ? 0 : 1 }} transition={{ duration: THEME_FADE }}
            style={{ background: rightGrad(LIGHT_RGB) }} />
        </div>

        {/* ── Центральное затемнение под текст ── */}
        <motion.div className="absolute inset-0 pointer-events-none" initial={false}
          animate={{ opacity: isDark ? 1 : 0 }} transition={{ duration: THEME_FADE }}
          style={{ background: centerGrad(DARK_RGB) }} />
        <motion.div className="absolute inset-0 pointer-events-none" initial={false}
          animate={{ opacity: isDark ? 0 : 1 }} transition={{ duration: THEME_FADE }}
          style={{ background: centerGrad(LIGHT_RGB) }} />

        {/* ── Индиго-акцент ── */}
        <div
          className="orb-1 absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 65%)', opacity: isDark ? 0.06 : 0.04 }}
        />
      </div>

      {/* ── Контент ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl mx-auto px-6 pt-32 pb-20 w-full">

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Статус-бейдж */}
          <motion.div variants={fadeUp} className="mb-8">
            <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium">
              <span className="pulse-dot w-2 h-2 rounded-full bg-green-400 inline-block" />
              Доступен для новых проектов
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
            style={{ color: 'var(--page-fg)' }}
          >
            <span className="block">Больше лидов</span>
            <span className="block">
              <span className="text-gradient">с того же бюджета</span>
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl max-w-2xl leading-relaxed mb-4"
            style={{ color: 'var(--muted)' }}
          >
            Запускаю рекламу, которая видна в цифрах — CPL, ROAS, атрибуция
            по всей воронке. Отдельный разработчик не нужен: код, трекинг
            и аналитику делаю сам.
          </motion.p>

          {/* Теги */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-10">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-lg text-sm font-mono border"
                style={{
                  backgroundColor: 'var(--subtle)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--muted)',
                }}
              >
                {skill}
              </span>
            ))}
          </motion.div>

          {/* CTA кнопки */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => handleScroll('#cases')}
              className="glow-accent group"
            >
              Смотреть кейсы
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={openContactModal}
            >
              Обсудить задачу
            </Button>
          </motion.div>

          {/* Статистика */}
          <motion.div
            variants={fadeIn}
            className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--card-border)', border: '1px solid var(--card-border)' }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 px-6 py-5 transition-colors"
                style={{ backgroundColor: 'var(--page-bg)' }}
              >
                <div className="mt-0.5 w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <stat.icon size={18} className="text-indigo-400" />
                </div>
                <div>
                  <div className="font-mono text-2xl font-black leading-none mb-1" style={{ color: 'var(--page-fg)' }}>
                    <Odometer value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--page-fg)' }}>{stat.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{stat.description}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="relative z-10 flex justify-center pb-8"
      >
        <button
          onClick={() => handleScroll('#benefits')}
          className="bounce-scroll flex flex-col items-center gap-2 transition-colors cursor-pointer"
          style={{ color: 'var(--muted)', opacity: 0.5 }}
        >
          <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
          <ChevronDown size={20} />
        </button>
      </motion.div>
    </section>
  )
}
