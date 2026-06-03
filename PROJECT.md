# PR4WEB — Документация проекта

**Домен:** pr4web.ru  
**Юрлицо:** ИП Еремин АВ  
**Бренд:** PR4WEB («продвижение для веба»)  
**Стек:** Next.js 16 · Tailwind v4 · Framer Motion v12 · React 19  
**Деплой:** Vercel (free tier, домен через CNAME)  
**Репозиторий:** C:\000ALL\AL\CC\ea\pr4web\  
**Исходники кейсов:** C:\000ALL\AL\CC\ea\k1..k5\  

---

## 1. Позиционирование

**H1:** «Больше лидов с того же бюджета»  
**Подзаголовок:** «Запускаю рекламу, которая видна в цифрах — CPL, ROAS, атрибуция по всей воронке.»  
**Tone of voice:** Уверенный, конкретный, с данными. От первого лица. Без воды.

**Целевая аудитория:**

| Сегмент | Бюджет/мес | Боль |
|---------|------------|------|
| Владельцы бизнеса B2B/B2C | 100-500 тыс | Реклама сливает, нет прозрачности |
| Маркетинг-директора | 250 тыс+ | Нужен подрядчик с техническим бэкграундом |
| Агентства (субподряд) | — | Технический исполнитель на сложные задачи |

---

## 2. Дизайн-система

### CSS-переменные (переключаются через `.dark`/`.light` на `<html>`)

```
--page-bg       #fafafa / #0a0a0f
--page-fg       #0f172a / #f1f5f9
--nav-bg        rgba(250,250,250,0.92) / rgba(10,10,15,0.92)
--nav-border    rgba(0,0,0,0.07) / rgba(255,255,255,0.06)
--card-bg       rgba(0,0,0,0.03) / rgba(255,255,255,0.02)
--card-border   rgba(0,0,0,0.08) / rgba(255,255,255,0.08)
--muted         #64748b / #94a3b8
--subtle        rgba(0,0,0,0.05) / rgba(255,255,255,0.04)
--modal-bg      #ffffff / #1a1a26        ← solid фон для модалов и форм
--input-bg      #f1f5f9 / #12121a        ← solid фон для select/input
```

**ВАЖНО про `color-scheme`:** задаётся через `document.documentElement.style.colorScheme`
в ThemeToggle.tsx при маунте и переключении. CSS `color-scheme: light/dark` на `html` не
пробивает нативные OS-контролы в некоторых браузерах — нужен именно inline style.

### Акценты (фиксированные)

| Цвет | Hex | Применение |
|------|-----|------------|
| Indigo | #6366f1 | Кнопки, активные элементы, gradient text |
| Indigo light | #818cf8 | Hover, glow |
| Emerald | #10b981 | «Доступен», positive delta |
| Rose | #ef4444 | Ошибки, negative |

### Типографика

| Шрифт | CSS var | Применение |
|-------|---------|------------|
| Inter | --font-inter | Весь текст |
| JetBrains Mono | --font-jetbrains | Цифры, теги, код, логотип |

### Fluid H2 — CSS класс `.fluid-h2`

```css
font-size: clamp(1.5rem, 2.8vw + 0.6rem, 2.75rem);
```

Заменяет `text-3xl sm:text-4xl md:text-5xl` на Benefits. На других секциях — стандартные брейкпоинты.

---

## 3. Компоненты

```
src/
├── app/
│   ├── layout.tsx              ThemeProvider, Inter+JetBrains, meta
│   ├── page.tsx                Сборка секций + ContactModal + Marquee
│   ├── globals.css             Все CSS-переменные, анимации, утилиты
│   ├── sitemap.ts              Авто-генерация /cases/[slug]
│   └── api/contact/route.ts   POST (TODO: подключить Telegram Bot)
│
├── app/cases/
│   ├── page.tsx                /cases/ — каталог
│   └── [slug]/page.tsx         /cases/[slug]/ — страница кейса
│
├── components/layout/
│   ├── Navigation.tsx          Sticky nav + прогресс-бар + dark/light toggle
│   └── Footer.tsx              Логотип-ссылка, nav-ссылки /#anchor
│
├── components/sections/        (в порядке на странице)
│   ├── Hero.tsx                Split-image bg (dark 3 кадра / light 3 кадра) + Odometer
│   ├── Benefits.tsx            Gradient mesh, LetterReveal H2, gradient-border на карточках, noise-overlay
│   ├── Cases.tsx               Карточки с фильтром и href → /cases/[slug]
│   ├── RoiCalculator.tsx       Recharts AreaChart + 4 ползунка
│   ├── Process.tsx             Timeline 5 шагов (desktop/mobile)
│   ├── AiStack.tsx             Claude/Gemini/NotebookLM
│   ├── Tools.tsx               4 микросервиса с псевдо-терминалом
│   └── Contact.tsx             Форма + прямые контакты
│
├── components/cases/
│   ├── CaseLayout.tsx          Обёртка с Navigation + Footer + breadcrumb
│   └── CaseCta.tsx             Призыв + переход к следующему кейсу
│
└── components/ui/
    ├── Button.tsx              primary/secondary/ghost
    ├── ThemeToggle.tsx         Moon/Sun + color-scheme через JS
    ├── ContactModal.tsx        Попап-форма, openContactModal() export
    ├── RevealText.tsx          Clip-path scroll reveal (все H2 кроме Benefits)
    ├── LetterReveal.tsx        Reveal + letter-by-letter hover (Benefits H2)
    ├── Odometer.tsx            Slot-machine цифры (Hero stats)
    ├── Marquee.tsx             Бесконечная бегущая строка
    └── AnimatedSection.tsx     Scroll-trigger обёртка
```

---

## 4. Визуальные фичи (реализованы)

| Фича | Где | Детали |
|------|-----|--------|
| Split hero background | Hero | Три dark + три light кадра, crossfade 1.4s каждые 2.8s |
| Прогресс-бар скролла | Navigation | `useScroll + scaleX`, появляется после скролла |
| Бегущая строка | Между Hero и Benefits | «Нахожу нестандартные решения», 28s loop |
| Gradient mesh (animated orbs) | Benefits | 3 орба с CSS orb-float анимацией |
| LetterReveal | Benefits H2 | Reveal снизу + hover каждой буквы |
| RevealText (clip-path) | Все H2 кроме Benefits | y: 110%→0% при попадании в viewport |
| Gradient border on hover | Benefits карточки | Conic-gradient 6s rotation, rgba 0.35-0.45 |
| Noise texture overlay | Benefits | SVG feTurbulence, opacity 0.028, mix-blend-mode overlay |
| Odometer counter | Hero stats | Digit-columns, 4.5s ease-out |
| Fluid typography | Benefits H2 | clamp() |
| Focus-visible outline | Global | 2px indigo, outline-offset 3px |
| Dark/Light theme | Global | next-themes + CSS vars + JS color-scheme |

---

## 5. Страницы кейсов

**Данные:** `src/lib/cases-data.ts` — массив `cases[]`  
**Маршруты:** `/cases/` (каталог) + `/cases/[slug]/` (страница)  
**Изображения:** `public/cases/[slug]/` — jpg, сжатые через sharp q=82-85

### Текущие 5 кейсов

| Slug | Название | Теги | Изображения |
|------|----------|------|-------------|
| smm-automation | AI-автоматизация контент-продакшна | AI-автоматизация, Спортивный блог | gen-1/2, icons, carousel |
| site-audit | Аудит под платный трафик (кожаные изделия) | Аудит, Premium e-commerce, AI-аналитика | site-1..6, audit-1..3 |
| b2b-landing | B2B лендинг (толлинг ЛКМ) | Лендинг, B2B промышленность, AI-аналитика | before-hero, v2-hero, analiz-* |
| b2b-leads | Лидогенерация подбор персонала | Трафик, B2B, Директ | landing, direct |
| cross-tracker | Кросс-доменный трекер | Аналитика, Атрибуция, Недвижимость | нет (TODO: скриншоты) |

### Как добавить новый кейс

1. Создать объект `Case` в `src/lib/cases-data.ts`
2. Положить изображения в `public/cases/[slug]/`
3. Сжать: `node -e "require('sharp')('src.png').jpeg({quality:85}).toFile('dst.jpg', console.log)"`
4. `git push` → Vercel задеплоит автоматически, sitemap обновится

Подробный шаблон — см. `C:\000ALL\AL\CC\ea\CASE_TEMPLATE.md`

---

## 6. Технические особенности

**Tailwind v4** — конфигурация через CSS (`@theme inline`), нет `tailwind.config.ts`.  
Кастомный dark: `@custom-variant dark (&:where(.dark, .dark *))`.

**Framer Motion v12** — `ease` нельзя в объекте `Variants`. Передавать через `transition={tv}` пропс.

**IntersectionObserver** — один `ref` нельзя вешать на два элемента (desktop + `lg:hidden`).

**Hero split background** — мобайл: правая панель скрыта. Мобильные кадры — отдельные портретные кропы (824×1527) из `public/images/hero-mob-1..3.png` (тёмные) и `hero-mob-w1..3.png` (светлые). Кропы лежат в `C:\000ALL\AL\CC\ea\img-arh\`, исходники `1sl-mod.png` + остальные. Crossfade идентичен десктопу через `DARK_MOB_IMAGES` / `LIGHT_MOB_IMAGES`.

**next-themes color-scheme** — CSS-правило не пробивает нативные OS-контролы в Chrome/Windows.
Надёжный способ: `document.documentElement.style.colorScheme = ...` в ThemeToggle.tsx.

**Select dropdown** — `color-scheme` через JS. Дополнительно: `select.form-input { color-scheme: inherit }`.

---

## 7. Деплой — Netlify (текущий)

**Хостинг:** Netlify (free tier), автодеплой из GitHub `FitnessCoinFun/pr4web` ветка `main`.  
**Домен:** pr4web.ru — A-запись `75.2.60.5` в Бегете, www → CNAME `fascinating-heliotrope-c8607b.netlify.app`.  
**SSL:** Let's Encrypt, автоматически через Netlify.

### Рабочий процесс деплоя

```bash
cd C:\000ALL\AL\CC\ea\pr4web
# Внести правки в файлы
git add .
git commit -m "описание"
git push
# Netlify пересобирает автоматически (~1 мин)
```

### Переменные окружения (Netlify → Site configuration → Environment variables)

| Переменная | Значение |
|------------|---------|
| `TELEGRAM_BOT_TOKEN` | токен бота от @BotFather |
| `TELEGRAM_CHAT_ID` | числовой ID чата (@pr_mast) |

### Форма — Telegram уведомления

Реализовано в `src/app/api/contact/route.ts`. Уведомление приходит в @pr_mast.  
После изменения env-переменных нужно сделать **Trigger deploy** в Netlify.

---

## 8. TODO — оставшиеся задачи

### Сделано (июнь 2026)

- [x] **Деплой** — Netlify, домен pr4web.ru, SSL
- [x] **Telegram Bot** — уведомления на @pr_mast (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID)
- [x] **Контакты** — @pr_mast, pr4web@ya.ru
- [x] **Яндекс.Метрика** — счётчик 109623397 в layout.tsx, событие `form_submit`
- [x] **Политика конфиденциальности** — `/privacy` (152-ФЗ)
- [x] **Мобильная версия** — портретные кропы Hero, кастомный выбор бюджета, скролл сертификатов пальцем

### Осталось до запуска рекламы

- [ ] **OG-image** — создать `public/og-image.jpg` (1200×630), добавить в layout.tsx
- [ ] **Скриншоты cross-tracker** — сделать и положить в `public/cases/cross-tracker/`
- [ ] **Яндекс.Вебмастер** — подтвердить сайт, добавить sitemap.xml

### Следующие волны

### Следующие волны визуальных улучшений

**Волна 2 (интерактив — тестить на мобиле):**
- [ ] Magnetic кнопки (Framer Motion useMotionValue на mousemove)
- [ ] 3D card tilt на карточках кейсов
- [ ] Spotlight / darkening cursor
- [ ] Parallax в Hero (scrollY * 0.3)

**Волна 3 (навигация):**
- [ ] View Transitions API при переходе главная → /cases/[slug]
- [ ] SVG draw-анимация линии в Process
- [ ] Sticky TOC на страницах кейсов

**Технические:**
- [ ] Shiki — подсветка синтаксиса для промптов на страницах кейсов
- [ ] Pixel noise hover на кнопках (::before pseudo с SVG noise)
- [ ] Skeleton loaders (актуально когда появятся API-запросы)

---

## 9. Навигация и якоря

| Якорь | Секция | Поведение на внутренних страницах |
|-------|--------|-----------------------------------|
| `#benefits` | Преимущества | `window.location.href = '/#benefits'` |
| `#cases` | Кейсы | аналогично |
| `#roi` | ROI-калькулятор | аналогично |
| `#process` | Как работаю | аналогично |
| `#ai` | AI-стек | аналогично |
| `#tools` | Инструменты | аналогично |
| `#contact` | Контакты | аналогично |

Footer: все ссылки в формате `/#anchor`.  
Кнопки «Обсудить проект/задачу» → `openContactModal()` из `ContactModal.tsx`.

---

*Обновлён: июнь 2026 — деплой Netlify, Telegram, Метрика, мобильная анимация Hero*
