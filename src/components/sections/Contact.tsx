'use client'

import { useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Send, MessageCircle, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { LetterReveal } from '@/components/ui/LetterReveal'
import { useTheme } from 'next-themes'

/* ── Типы формы ── */
interface FormData {
  name:    string
  contact: string
  task:    string
}

const BUDGETS = [
  { value: '100-250',  label: '100–250 тыс ₽ / мес' },
  { value: '250-500',  label: '250–500 тыс ₽ / мес' },
  { value: '500-1000', label: '500 тыс – 1 млн ₽ / мес' },
  { value: 'gt1000',   label: '1 млн ₽+ / мес' },
  { value: 'unknown',  label: 'Ещё не определился' },
]

/* ── Прямые контакты ── */
const contacts = [
  {
    icon: MessageCircle,
    label: 'Telegram',
    value: '@pr4web',   // ← замените на реальный ник
    href: 'https://t.me/pr4web',
    color: '#229ED9',
  },
  {
    icon: Phone,
    label: 'Телефон',
    value: 'По запросу',
    href: '#contact',
    color: '#10b981',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@pr4web.ru',  // ← замените на реальный адрес
    href: 'mailto:hello@pr4web.ru',
    color: '#6366f1',
  },
]

/* ── Анимации ── */
const fadeUp: Variants = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const tv = { duration: 0.55 }

/* ── Поле формы ── */
function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--page-fg)' }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  )
}

const inputCls = 'form-input text-sm'

/* ── Главный компонент ── */
export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)

  const sectionIn = useInView(sectionRef, { once: true, margin: '-60px 0px' })
  const leftIn    = useInView(leftRef,    { once: true, margin: '-60px 0px' })
  const rightIn   = useInView(rightRef,   { once: true, margin: '-60px 0px' })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { theme } = useTheme()
  const selectStyle = { colorScheme: theme === 'dark' ? 'dark' : 'light' } as React.CSSProperties

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('success')
        reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="relative py-28"
      style={{ backgroundColor: 'var(--page-bg)' }}>

      {/* Верхний разделитель */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      {/* Фоновые орбы */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb-1 absolute -bottom-32 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 65%)', opacity: 0.06 }} />
        <div className="orb-2 absolute -top-24 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 65%)', opacity: 0.05 }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">

        {/* Заголовок по центру */}
        <motion.div variants={fadeUp} transition={tv}
          initial="hidden" animate={sectionIn ? 'visible' : 'hidden'}
          className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold tracking-widest uppercase mb-5">
            Контакт
          </span>
          <LetterReveal as="h2" delay={0.05}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: 'var(--page-fg)' }}>
            Опишите задачу — разберусь за час
          </LetterReveal>
          <p className="text-lg max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
            Напишите коротко — что нужно сделать и какой продукт.
          </p>
        </motion.div>

        {/* Двухколоночный блок */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Левая колонка: прямые контакты */}
          <motion.div ref={leftRef} variants={stagger}
            initial="hidden" animate={leftIn ? 'visible' : 'hidden'}
            className="lg:col-span-2 space-y-4">

            {contacts.map((c) => {
              const Icon = c.icon
              return (
                <motion.a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  variants={fadeUp} transition={tv}
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group"
                  style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--card-bg)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${c.color}20`, border: `1px solid ${c.color}35` }}>
                    <Icon size={18} style={{ color: c.color }} />
                  </div>
                  <div>
                    <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>{c.label}</div>
                    <div className="text-sm font-semibold group-hover:text-indigo-400 transition-colors" style={{ color: 'var(--page-fg)' }}>
                      {c.value}
                    </div>
                  </div>
                </motion.a>
              )
            })}

            {/* Подсказка */}
            {/* Статус доступности */}
            <motion.div variants={fadeUp} transition={tv}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
              style={{ border: '1px solid rgba(16,185,129,0.25)', backgroundColor: 'rgba(16,185,129,0.06)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span className="text-sm font-medium text-emerald-500">Доступен для новых проектов</span>
            </motion.div>

            <motion.div variants={fadeUp} transition={tv}
              className="rounded-xl p-4"
              style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--subtle)' }}>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                Предпочтительный способ связи — Telegram. Форма справа тоже работает — приходит на почту сразу после отправки.
              </p>
            </motion.div>
          </motion.div>

          {/* Правая колонка: форма */}
          <motion.div ref={rightRef} variants={fadeUp} transition={{ ...tv, delay: 0.15 }}
            initial="hidden" animate={rightIn ? 'visible' : 'hidden'}
            className="lg:col-span-3">

            <div className="rounded-2xl p-7" style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--modal-bg)' }}>

              {/* Успех */}
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle size={32} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Заявка получена</h3>
                  <p className="text-white/50 text-sm max-w-xs">
                    Отвечу в течение рабочего дня. Проверьте Telegram или почту — напишу туда.
                  </p>
                  <button onClick={() => setStatus('idle')}
                    className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-4 cursor-pointer">
                    Отправить ещё
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                  <Field label="Имя *" error={errors.name?.message}>
                    <input
                      {...register('name', { required: 'Введите имя', minLength: { value: 2, message: 'Минимум 2 символа' } })}
                      placeholder="Как к вам обращаться?"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Телефон или Telegram *" error={errors.contact?.message}>
                    <input
                      {...register('contact', { required: 'Укажите способ связи' })}
                      placeholder="+7 999 000-00-00 или @username"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Опишите задачу">
                    <textarea
                      {...register('task')}
                      placeholder="Что нужно сделать? Какой продукт, ниша, цель?"
                      rows={4}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                      <AlertCircle size={16} />
                      Ошибка отправки. Напишите напрямую в Telegram.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white
                      bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25
                      disabled:opacity-60 disabled:cursor-not-allowed
                      transition-all duration-200 cursor-pointer text-base"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Отправляю...
                      </>
                    ) : (
                      <>
                        Обсудить проект
                        <Send size={16} />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-white/25">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
