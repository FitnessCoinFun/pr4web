'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import type { FaqItem } from '@/lib/faq-data'

interface Props {
  items:  FaqItem[]
  accent: string
}

export function CaseFaq({ items, accent }: Props) {
  const [open, setOpen] = useState<number | null>(0)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <section className="py-12 border-b" style={{ borderColor: 'var(--card-border)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <h2 className="text-xs font-mono font-semibold tracking-widest uppercase mb-8"
        style={{ color: accent }}>
        Вопросы по теме
      </h2>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i}
            className="rounded-xl overflow-hidden transition-colors"
            style={{
              border: '1px solid var(--card-border)',
              backgroundColor: open === i ? 'var(--card-bg)' : 'transparent',
            }}>

            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
            >
              <span className="text-sm font-semibold leading-snug" style={{ color: 'var(--page-fg)' }}>
                {item.question}
              </span>
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${accent}18`, color: accent }}>
                {open === i ? <Minus size={11} /> : <Plus size={11} />}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}
