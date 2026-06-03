import { NextRequest, NextResponse } from 'next/server'

const BUDGET_LABELS: Record<string, string> = {
  '100-250':  '100–250 тыс ₽/мес',
  '250-500':  '250–500 тыс ₽/мес',
  '500-1000': '500 тыс – 1 млн ₽/мес',
  'gt1000':   '1 млн ₽+ / мес',
  'unknown':  'Ещё не определился',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, contact, budget, task } = body

    if (!name || !contact || !budget) {
      return NextResponse.json({ ok: false, error: 'Заполните обязательные поля' }, { status: 400 })
    }

    const budgetLabel = BUDGET_LABELS[budget] ?? budget
    const token  = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (token && chatId) {
      const text = [
        '🔔 *Новая заявка с pr4web.ru*',
        '',
        `👤 *Имя:* ${name}`,
        `📱 *Контакт:* ${contact}`,
        `💰 *Бюджет:* ${budgetLabel}`,
        task ? `📝 *Задача:* ${task}` : '',
      ].filter(Boolean).join('\n')

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Ошибка сервера' }, { status: 500 })
  }
}
