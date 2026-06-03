import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Политика обработки персональных данных',
  robots: { index: false },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-20 px-6" style={{ backgroundColor: 'var(--page-bg)', color: 'var(--page-fg)' }}>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors mb-8 inline-block">
          ← Вернуться на главную
        </Link>

        <h1 className="text-2xl font-bold mb-2">Политика обработки персональных данных</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>Последнее обновление: июнь 2026</p>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--page-fg)' }}>1. Оператор данных</h2>
            <p>ИП Еремин АВ, pr4web.ru. Контакт: pr4web@ya.ru</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--page-fg)' }}>2. Какие данные собираются</h2>
            <p>При заполнении формы обратной связи собираются: имя, контактный телефон или Telegram-аккаунт, информация о рекламном бюджете, описание задачи (необязательно).</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--page-fg)' }}>3. Цели обработки</h2>
            <p>Данные используются исключительно для ответа на обращение и обсуждения возможного сотрудничества. Рассылки и передача данных третьим лицам в маркетинговых целях не осуществляются.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--page-fg)' }}>4. Правовое основание</h2>
            <p>Обработка персональных данных осуществляется на основании согласия субъекта (ст. 6 Федерального закона № 152-ФЗ «О персональных данных»). Нажатие кнопки «Отправить заявку» является выражением такого согласия.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--page-fg)' }}>5. Срок хранения</h2>
            <p>Данные хранятся не более 3 лет с момента получения или до отзыва согласия.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--page-fg)' }}>6. Передача данных</h2>
            <p>Уведомления об обращениях доставляются через сервис Telegram (Telegram Messenger Inc.). Данные передаются в зашифрованном виде и не хранятся на серверах Telegram дольше необходимого для доставки сообщения.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--page-fg)' }}>7. Права субъекта</h2>
            <p>Вы вправе в любой момент отозвать согласие, запросить уточнение или удаление своих данных, направив письмо на pr4web@ya.ru. Запрос будет исполнен в течение 30 дней.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--page-fg)' }}>8. Cookies и аналитика</h2>
            <p>Сайт использует Яндекс.Метрику для анализа посещаемости. Метрика собирает обезличенные данные о поведении посетителей (страницы, клики, источники переходов). Вы можете отключить сбор данных в настройках браузера или через opt-out плагин Яндекса.</p>
          </section>

        </div>
      </div>
    </main>
  )
}
