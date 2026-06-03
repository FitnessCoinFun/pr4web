'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface RevealTextProps {
  children:  React.ReactNode
  className?: string
  style?:     React.CSSProperties
  delay?:     number
  duration?:  number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
}

/**
 * Анимация появления текста снизу вверх через clip-path.
 * Оборачивает дочерний элемент в невидимый контейнер с overflow:hidden,
 * внутренний motion.div скользит вверх при попадании в вьюпорт.
 */
export function RevealText({
  children,
  className = '',
  style,
  delay = 0,
  duration = 0.75,
  as: Tag = 'div',
}: RevealTextProps) {
  const ref  = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <div ref={ref} style={{ overflow: 'hidden', display: 'block' }}>
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={inView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
        transition={{ duration, delay, ease: [0.33, 1, 0.68, 1] }}
      >
        <Tag className={className} style={style}>{children}</Tag>
      </motion.div>
    </div>
  )
}

/**
 * Вариант для многострочных блоков — каждая строка анимируется отдельно.
 * Передаёт массив строк/элементов через children-массив.
 */
export function RevealLines({
  lines,
  className = '',
  stagger = 0.12,
  delay   = 0,
}: {
  lines:     React.ReactNode[]
  className?: string
  stagger?:   number
  delay?:     number
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <div ref={ref}>
      {lines.map((line, i) => (
        <div key={i} style={{ overflow: 'hidden' }}>
          <motion.div
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{ duration: 0.75, delay: delay + i * stagger, ease: [0.33, 1, 0.68, 1] }}
            className={className}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  )
}
