# PR4WEB — Документация для разработчика

**Домен:** pr4web.ru  
**Стек:** Next.js 16 · Tailwind v4 · Framer Motion v12 · React 19  
**Деплой:** Vercel (free tier)

---

## Быстрый старт

```bash
cd C:\000ALL\AL\CC\ea\pr4web

# Установить зависимости (если не установлены)
npm install

# Запустить dev-сервер
npm run dev
# → http://localhost:3000
```

---

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер с hot reload (Turbopack) |
| `npm run build` | Production сборка |
| `npm run start` | Запустить production сборку локально |
| `npx tsc --noEmit` | Проверить TypeScript без компиляции |

---

## Деплой на Vercel

```bash
# 1. Установить CLI (один раз)
npm i -g vercel

# 2. Первый деплой (настройка проекта)
vercel

# 3. Последующие деплои — автоматически при git push
git add .
git commit -m "описание изменений"
git push
```

### Настройка домена pr4web.ru

Vercel Dashboard → Settings → Domains → Add Domain → `pr4web.ru`  
На регистраторе: CNAME `@` → `cname.vercel-dns.com`

### Переменные окружения

Добавить в Vercel Dashboard → Settings → Environment Variables:

```
TELEGRAM_BOT_TOKEN=...    # Получить у @BotFather
TELEGRAM_CHAT_ID=...      # Написать боту /start, найти chat_id
```

---

## Добавить новый кейс (кратко)

Подробный контент-шаблон: `C:\000ALL\AL\CC\ea\CASE_TEMPLATE.md`  
Дизайн страницы кейса: `C:\000ALL\AL\CC\ea\CASES_DESIGN.md`  
Очередь кейсов: `C:\000ALL\AL\CC\ea\CONTENT_PLAN.md`

**Быстрый чеклист:**

1. Папка с изображениями: `public/cases/[slug]/`
2. Сжать фото: `node -e "require('sharp')('in.png').jpeg({quality:85}).toFile('out.jpg', console.log)"`
3. Данные кейса: добавить объект в `src/lib/cases-data.ts`
4. Карточка на главной: добавить в `src/components/sections/Cases.tsx`
5. TypeScript: `npx tsc --noEmit` — должно быть чисто
6. Git push → автодеплой

---

## Структура проекта

```
src/
├── app/
│   ├── layout.tsx          ← meta, fonts, Schema.org, skip link
│   ├── page.tsx            ← главная страница
│   ├── globals.css         ← CSS-переменные темы, анимации
│   ├── sitemap.ts          ← авто-генерация sitemap
│   ├── cases/page.tsx      ← /cases/ каталог
│   ├── cases/[slug]/       ← /cases/[slug]/ страница кейса
│   └── api/contact/        ← форма (TODO: подключить Telegram Bot)
│
├── components/
│   ├── layout/             ← Navigation, Footer
│   ├── sections/           ← Hero, Benefits, Cases, ROI, Process, AI, Tools, Contact
│   ├── cases/              ← CaseLayout, CaseCta
│   └── ui/                 ← Button, ThemeToggle, ContactModal, RevealText,
│                              LetterReveal, Odometer, Marquee, AnimatedSection
│
└── lib/
    ├── cases-data.ts       ← данные всех кейсов
    └── utils.ts            ← cn() утилита
```

---

## Подключить форму (Telegram Bot)

Файл: `src/app/api/contact/route.ts`

Заменить `console.log(...)` на:

```typescript
const text = `Заявка с pr4web.ru\n\nИмя: ${name}\nКонтакт: ${contact}\nБюджет: ${budget}\nЗадача: ${task}`
await fetch(
  `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
  {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text }),
  }
)
```

---

## Что нужно создать вручную

| Файл | Для чего | Размер |
|------|----------|--------|
| `public/og-image.jpg` | Превью при шэринге в соцсетях | 1200×630 px |
| `public/cases/cross-tracker/*.jpg` | Скриншоты дашборда трекера | любой |

---

## Известные технические особенности

- **Tailwind v4**: конфиг в CSS, нет `tailwind.config.ts`
- **Framer Motion v12**: `ease` нельзя внутри `Variants`, только в `transition={}` пропсе
- **color-scheme**: задаётся через JS (`document.documentElement.style.colorScheme`) в `ThemeToggle.tsx` — CSS-правила не пробивают OS dark mode в Chrome/Windows
- **IntersectionObserver**: один `ref` — один элемент
- **Navigation**: вынесена за `<main id="main-content">` для корректной семантики
