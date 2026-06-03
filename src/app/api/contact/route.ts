import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, contact, budget, task } = body

    if (!name || !contact || !budget) {
      return NextResponse.json({ ok: false, error: 'Заполните обязательные поля' }, { status: 400 })
    }

    // TODO: подключить email-сервис. Варианты:
    // 1. Resend (resend.com) — npm i resend, добавить RESEND_API_KEY в .env
    // 2. Nodemailer — npm i nodemailer, добавить SMTP_* в .env
    // 3. Telegram Bot API — отправлять уведомление в личку
    //
    // Пример Resend:
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'site@pr4web.ru',
    //   to: 'your@email.ru',
    //   subject: `Заявка от ${name}`,
    //   text: `Имя: ${name}\nКонтакт: ${contact}\nБюджет: ${budget}\nЗадача: ${task}`,
    // })

    console.log('[contact form]', { name, contact, budget, task })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Ошибка сервера' }, { status: 500 })
  }
}
