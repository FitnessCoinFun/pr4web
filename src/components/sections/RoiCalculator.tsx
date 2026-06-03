'use client'

import { useState, useMemo, useId } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Users, Wallet, Info } from 'lucide-react'
import { LetterReveal } from '@/components/ui/LetterReveal'

/* ─── Константы оптимизации (из реальной практики) ─── */
const CPC_COEFF  = 0.65   // -35% цена клика после чистки трафика
const CONV_COEFF = 1.40   // +40% конверсия после аудита лендинга

/* Разгон: оптимизация набирает силу постепенно */
const RAMP = [0.45, 0.65, 0.80, 0.92, 1.0, 1.0]
const MONTHS = ['Мес 1', 'Мес 2', 'Мес 3', 'Мес 4', 'Мес 5', 'Мес 6']

/* ─── Форматтеры ─── */
function fmtNum(n: number) {
  return new Intl.NumberFormat('ru-RU').format(Math.round(n))
}
function fmtMoney(n: number) {
  if (n >= 10_000_000) return `${Math.round(n / 1_000_000)} млн₽`
  if (n >= 1_000_000)  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')} млн₽`
  if (n >= 1_000)      return `${Math.round(n / 1_000)} тыс₽`
  return `${Math.round(n)} ₽`
}
function fmtMoneyFull(n: number) {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' ₽'
}

/* ─── Расчёт ─── */
function calc(budget: number, cpc: number, conv: number, check: number) {
  const clicks   = budget / cpc
  const leads    = clicks * (conv / 100)
  const revenue  = leads * check

  const nCpc     = cpc  * CPC_COEFF
  const nConv    = conv * CONV_COEFF
  const nClicks  = budget / nCpc
  const nLeads   = nClicks * (nConv / 100)
  const nRevenue = nLeads * check

  const chart = MONTHS.map((month, i) => ({
    month,
    До:    Math.round(revenue),
    После: Math.round(revenue + (nRevenue - revenue) * RAMP[i]),
  }))

  return {
    before:       { clicks: Math.round(clicks), leads: Math.round(leads), revenue },
    after:        { clicks: Math.round(nClicks), leads: Math.round(nLeads), revenue: nRevenue },
    chart,
    deltaLeads:   Math.round(nLeads - leads),
    deltaRevenue: Math.round(nRevenue - revenue),
    roi:          Math.round(((nRevenue - revenue) / budget) * 100),
  }
}

/* ─── Кастомный тултип ─── */
type TooltipEntry = { name?: string; value?: number }
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-4 py-3 text-sm shadow-xl"
      style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--page-fg)' }}>
      <p className="font-mono font-bold mb-1" style={{ color: 'var(--muted)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} className="font-mono">
          <span style={{ color: p.name === 'После' ? '#818cf8' : '#64748b' }}>{p.name}: </span>
          <span className="font-black">{fmtMoneyFull(p.value ?? 0)}</span>
        </p>
      ))}
    </div>
  )
}

/* ─── Слайдер ─── */
interface SliderProps {
  id: string
  label: string
  hint: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
}
function Slider({ id, label, hint, value, min, max, step, format, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <label htmlFor={id} className="text-sm font-medium" style={{ color: 'var(--page-fg)' }}>
            {label}
          </label>
          <span title={hint} className="cursor-help" style={{ color: 'var(--muted)' }}>
            <Info size={13} />
          </span>
        </div>
        <span className="font-mono text-sm font-bold text-indigo-400">{format(value)}</span>
      </div>
      <div className="relative h-5 flex items-center">
        {/* track */}
        <div className="absolute inset-x-0 h-1.5 rounded-full" style={{ backgroundColor: 'var(--card-border)' }} />
        {/* fill */}
        <div className="absolute h-1.5 rounded-full bg-indigo-600"
          style={{ width: `${pct}%` }} />
        {/* native input поверх */}
        <input
          id={id}
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-5"
          style={{ zIndex: 1 }}
        />
        {/* thumb */}
        <div
          className="absolute w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow-md pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

/* ─── Карточка результата ─── */
function ResultCard({
  icon: Icon, label, before, after, delta, positive, delay,
}: {
  icon: React.ElementType
  label: string
  before: string
  after: string
  delta: string
  positive: boolean
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl p-4"
      style={{ backgroundColor: 'var(--subtle)', border: '1px solid var(--card-border)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} className="text-indigo-400" />
        <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Сейчас</div>
          <div className="font-mono text-sm font-bold" style={{ color: 'var(--page-fg)' }}>{before}</div>
        </div>
        <div className="text-right">
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>После</div>
          <div className="font-mono text-sm font-black text-indigo-400 whitespace-nowrap leading-tight">{after}</div>
        </div>
      </div>
      <div className={`mt-2 text-xs font-semibold font-mono ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {delta}
      </div>
    </motion.div>
  )
}

/* ─── Главный компонент ─── */
export function RoiCalculator() {
  const uid = useId()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  const [budget, setBudget]   = useState(250_000)
  const [cpc,    setCpc]      = useState(120)
  const [conv,   setConv]     = useState(2.5)
  const [check,  setCheck]    = useState(25_000)

  const r = useMemo(() => calc(budget, cpc, conv, check), [budget, cpc, conv, check])

  return (
    <section id="roi" className="relative py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">

        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          ref={ref}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold tracking-widest uppercase mb-5">
            ROI-калькулятор
          </span>
          <LetterReveal as="h2" delay={0.05}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: 'var(--page-fg)' }}>
            Сколько лидов вы теряете сейчас?
          </LetterReveal>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
            Введите текущие показатели — калькулятор покажет, что изменится в рублях после оптимизации.
          </p>
        </motion.div>

        {/* Основной блок */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >

          {/* ── Левая колонка: ползунки ── */}
          <div className="rounded-2xl p-7 space-y-7"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div>
              <h3 className="font-bold text-base mb-1" style={{ color: 'var(--page-fg)' }}>
                Ваши текущие показатели
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Подвигайте ползунки под свою ситуацию
              </p>
            </div>

            <Slider id={`${uid}-budget`}
              label="Месячный бюджет"
              hint="Сколько тратите на рекламу в месяц"
              value={budget} min={100_000} max={1_000_000} step={10_000}
              format={v => fmtMoney(v)}
              onChange={setBudget} />

            <Slider id={`${uid}-cpc`}
              label="Средняя цена клика (CPC)"
              hint="Средняя стоимость одного клика по объявлению"
              value={cpc} min={20} max={500} step={5}
              format={v => `${v} ₽`}
              onChange={setCpc} />

            <Slider id={`${uid}-conv`}
              label="Конверсия сайта"
              hint="Доля посетителей, оставивших заявку"
              value={conv} min={0.5} max={10} step={0.1}
              format={v => `${v.toFixed(1)}%`}
              onChange={setConv} />

            <Slider id={`${uid}-check`}
              label="Средний чек / стоимость лида"
              hint="Средняя выручка с одной заявки или сделки"
              value={check} min={3_000} max={300_000} step={1_000}
              format={v => fmtMoney(v)}
              onChange={setCheck} />

          </div>

          {/* ── Правая колонка: результаты ── */}
          <div className="flex flex-col gap-5">

            {/* Карточки дельт */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ResultCard
                icon={Users}
                label="Лидов в месяц"
                before={fmtNum(r.before.leads)}
                after={fmtNum(r.after.leads)}
                delta={`+${fmtNum(r.deltaLeads)} лидов`}
                positive delay={0.25} />
              <ResultCard
                icon={Wallet}
                label="Выручка"
                before={fmtMoney(r.before.revenue)}
                after={fmtMoney(r.after.revenue)}
                delta={`+${fmtMoney(r.deltaRevenue)}`}
                positive delay={0.32} />
              <ResultCard
                icon={TrendingUp}
                label="ROI оптимизации"
                before="0%"
                after={`${r.roi}%`}
                delta={r.roi > 0 ? 'доп. прибыль' : 'без изменений'}
                positive={r.roi > 0} delay={0.39} />
            </div>

            {/* График */}
            <div className="rounded-2xl p-5"
              style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold" style={{ color: 'var(--page-fg)' }}>
                  Динамика выручки по месяцам
                </p>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--muted)' }}>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />До
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />После
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={175}>
                <AreaChart data={r.chart} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradBefore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#64748b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="gradAfter" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => fmtMoney(v as number)} tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} width={88} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="До"    stroke="#64748b" strokeWidth={2} fill="url(#gradBefore)" dot={false} />
                  <Area type="monotone" dataKey="После" stroke="#6366f1" strokeWidth={2} fill="url(#gradAfter)"  dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                const el = document.getElementById('contact')
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
              }}
              className="w-full py-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 cursor-pointer"
            >
              Хочу такие результаты — обсудить проект
            </button>

            {/* Методология */}
            <div className="rounded-xl p-4 text-xs leading-relaxed space-y-1"
              style={{ backgroundColor: 'var(--subtle)', color: 'var(--muted)' }}>
              <p className="font-semibold" style={{ color: 'var(--page-fg)' }}>На чём основан расчёт</p>
              <p>— Снижение CPC на 35% — медианный результат чистки площадок и минус-слов</p>
              <p>— Рост конверсии на 40% — медианный результат аудита лендинга и A/B тестов</p>
              <p>— Разгон 6 месяцев отражает реальную скорость накопления статистики</p>
              <p className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--card-border)' }}>
                Медианные значения по проектам 2022-2025. Результат зависит от ниши и стартовых показателей.
              </p>
            </div>
          </div>

        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  )
}
