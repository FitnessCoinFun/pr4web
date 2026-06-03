import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const BASE_URL = 'https://pr4web.ru'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:  'PR4WEB — Контекстная реклама и маркетинг-инфраструктура',
    template: '%s — PR4WEB',
  },
  description:
    '25 лет в интернет-рекламе. Яндекс.Директ, аналитика, собственные инструменты. Больше лидов с того же бюджета.',

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    title:       'PR4WEB — Больше лидов с того же бюджета',
    description: '25 лет в рекламе. Пишу код. Строю аналитику. Запускаю трафик.',
    url:         BASE_URL,
    siteName:    'PR4WEB',
    locale:      'ru_RU',
    type:        'website',
    images: [
      {
        url:    '/og-image.jpg',   // создать: 1200×630, положить в /public/
        width:  1200,
        height: 630,
        alt:    'PR4WEB — Контекстная реклама и маркетинг-инфраструктура',
      },
    ],
  },

  twitter: {
    card:        'summary_large_image',
    title:       'PR4WEB — Больше лидов с того же бюджета',
    description: '25 лет в рекламе. Пишу код. Строю аналитику. Запускаю трафик.',
    images:      ['/og-image.jpg'],
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

/* Schema.org — Person + ProfessionalService для главной */
const personSchema = {
  '@context':   'https://schema.org',
  '@type':      ['Person', 'ProfessionalService'],
  name:         'ИП Еремин АВ',
  brand:        { '@type': 'Brand', name: 'PR4WEB' },
  url:          BASE_URL,
  description:  'Специалист по контекстной рекламе с 2001 года. Яндекс.Директ, ВК, аналитика, автоматизация.',
  knowsAbout:   ['Яндекс.Директ', 'Контекстная реклама', 'Веб-аналитика', 'Автоматизация маркетинга'],
  areaServed:   { '@type': 'Country', name: 'Россия' },
  priceRange:   '$$',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        {/* Skip link для клавиатурной навигации */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-indigo-600 focus:text-white focus:text-sm focus:font-semibold"
        >
          Перейти к содержимому
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/109623397" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
      </body>
      <Script id="ym-init" strategy="afterInteractive">{`
        (function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=109623397','ym');
        ym(109623397,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});
      `}</Script>
    </html>
  )
}
