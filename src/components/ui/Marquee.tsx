/**
 * Бесконечная бегущая строка.
 * CSS-only анимация, нет JS-нагрузки в runtime.
 * Скорость задаётся через duration (сек).
 */
interface MarqueeProps {
  text:       string
  separator?: string
  duration?:  number
  className?: string
  style?:     React.CSSProperties
}

export function Marquee({
  text,
  separator = '·',
  duration  = 32,
  className = '',
  style,
}: MarqueeProps) {
  /* Повторяем текст 8 раз — достаточно для любого экрана */
  const chunk = Array(8).fill(text).join(`  ${separator}  `)

  return (
    <div
      className={`overflow-hidden select-none ${className}`}
      style={style}
      aria-hidden="true"
    >
      <div
        className="flex whitespace-nowrap"
        style={{ animation: `marquee-scroll ${duration}s linear infinite` }}
      >
        {/* Два одинаковых блока — второй подхватывает когда первый уходит */}
        <span className="flex-shrink-0 pr-8">{chunk}</span>
        <span className="flex-shrink-0 pr-8" aria-hidden="true">{chunk}</span>
      </div>
    </div>
  )
}
