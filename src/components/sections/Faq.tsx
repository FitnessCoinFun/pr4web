'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { faqItems } from '@/lib/faq-data'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="relative py-20" style={{ backgroundColor: 'var(--page-bg)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold tracking-widest uppercase mb-5">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: 'var(--page-fg)' }}>
            Частые вопросы
          </h2>
        </div>

        <div className="space-y-2">
          {faqItems.map((item, i) => (
            <div key={i}
              className="rounded-xl overflow-hidden transition-colors"
              style={{ border: '1px solid var(--card-border)', backgroundColor: open === i ? 'var(--card-bg)' : 'transparent' }}>

              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
              >
                <span className="text-sm font-semibold leading-snug" style={{ color: 'var(--page-fg)' }}>
                  {item.question}
                </span>
                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--subtle)', color: 'var(--muted)' }}>
                  {open === i
                    ? <Minus size={11} />
                    : <Plus size={11} />
                  }
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
      </div>
    </section>
  )
}
