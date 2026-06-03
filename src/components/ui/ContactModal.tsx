'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react'

/* Открыть модал из любого места: */
export const openContactModal = () =>
  window.dispatchEvent(new Event('open-contact-modal'))

const BUDGETS = [
  { value: '100-250',  label: '100–250 тыс ₽ / мес' },
  { value: '250-500',  label: '250–500 тыс ₽ / мес' },
  { value: '500-1000', label: '500 тыс – 1 млн ₽ / мес' },
  { value: 'gt1000',   label: '1 млн ₽+ / мес' },
  { value: 'unknown',  label: 'Ещё не определился' },
]

interface FormData { name: string; contact: string; budget: string; task: string }

function ErrMsg({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
      <AlertCircle size={11} />{msg}
    </p>
  )
}

export function ContactModal() {
  const [open,   setOpen]   = useState(false)
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()

  useEffect(() => {
    const show = () => { setOpen(true); setStatus('idle') }
    window.addEventListener('open-contact-modal', show)
    return () => window.removeEventListener('open-contact-modal', show)
  }, [])

  /* закрытие по Escape */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => { setOpen(false); reset(); setStatus('idle') }

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) reset()
    } catch { setStatus('error') }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div className="modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          />

          {/* Окно */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={  { opacity: 0, scale: 0.95, y: 20  }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md rounded-2xl p-7 pointer-events-auto"
              style={{ backgroundColor: 'var(--modal-bg)', border: '1px solid var(--card-border)', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Закрыть */}
              <button onClick={close}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                style={{ color: 'var(--muted)' }}>
                <X size={16} />
              </button>

              {status === 'success' ? (
                <div className="flex flex-col items-center py-8 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle size={28} className="text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--page-fg)' }}>Заявка получена</h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Отвечу в течение рабочего дня.</p>
                  <button onClick={close}
                    className="mt-2 px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all cursor-pointer">
                    Закрыть
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--page-fg)' }}>Обсудить проект</h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Отвечу в рабочее время, обычно в течение часа.</p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--page-fg)' }}>Имя *</label>
                      <input {...register('name', { required: 'Введите имя', minLength: { value: 2, message: 'Мин. 2 символа' } })}
                        placeholder="Как к вам обращаться?"
                        className="form-input text-sm" />
                      <ErrMsg msg={errors.name?.message} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--page-fg)' }}>Телефон или Telegram *</label>
                      <input {...register('contact', { required: 'Укажите способ связи' })}
                        placeholder="+7 999 000-00-00 или @username"
                        className="form-input text-sm" />
                      <ErrMsg msg={errors.contact?.message} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--page-fg)' }}>Рекламный бюджет *</label>
                      <select {...register('budget', { required: 'Выберите бюджет' })}
                        className="form-input text-sm appearance-none">
                        <option value="">Выберите диапазон</option>
                        {BUDGETS.map(b => (
                          <option key={b.value} value={b.value}>{b.label}</option>
                        ))}
                      </select>
                      <ErrMsg msg={errors.budget?.message} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--page-fg)' }}>Задача (необязательно)</label>
                      <textarea {...register('task')} rows={3}
                        placeholder="Коротко — что нужно сделать?"
                        className="form-input text-sm resize-none" />
                    </div>

                    {status === 'error' && (
                      <p className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                        Ошибка отправки. Напишите в Telegram.
                      </p>
                    )}

                    <button type="submit" disabled={status === 'loading'}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition-all cursor-pointer">
                      {status === 'loading' ? (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                      ) : <><Send size={15} />Отправить заявку</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
