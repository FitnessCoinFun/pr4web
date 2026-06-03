'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/* Одна цифровая колонка — прокручивается сверху вниз */
function OdometerDigit({ digit, delay }: { digit: number; delay: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div
      ref={ref}
      style={{ display: 'inline-block', overflow: 'hidden', height: '1em', verticalAlign: 'text-bottom' }}
    >
      <motion.div
        initial={{ y: 0 }}
        animate={inView ? { y: `${-digit * 10}%` } : { y: 0 }}
        transition={{
          duration: 4.5,      // медленно — чтобы «залипнуть»
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <div key={n} style={{ height: '1em', display: 'flex', alignItems: 'center' }}>
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

interface OdometerProps {
  /** Число или строка вида "25", "500", "10" */
  value: number | string
  /** Суффикс после числа, например "+" */
  suffix?: string
  className?: string
}

/**
 * Цифры появляются как колонки слот-машины.
 * Нецифровые символы ("+", "%", пробелы) вставляются как есть.
 */
export function Odometer({ value, suffix, className }: OdometerProps) {
  const str = String(value)

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'baseline' }}>
      {str.split('').map((char, i) => {
        const digit = parseInt(char, 10)
        if (!isNaN(digit)) {
          return <OdometerDigit key={i} digit={digit} delay={0.1 + i * 0.08} />
        }
        return <span key={i}>{char}</span>
      })}
      {suffix && <span>{suffix}</span>}
    </span>
  )
}
