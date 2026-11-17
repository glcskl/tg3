const MILESTONES = [
  { from: '20.10', to: '30.10', title: 'CustDev и уточнение боли', note: 'интервью с микроблогерами и SMM-командами' },
  { from: '31.10', to: '09.11', title: 'Дизайн-система и шрифты SIL', note: 'палитра, типографика, проверка лицензий OFL' },
  { from: '10.11', to: '25.11', title: 'UI-холст и редактор', note: 'canvas-рендер, пресеты, цветокоррекция' },
  { from: '26.11', to: '04.12', title: 'QA и проверка композиции', note: 'эвристика читаемости, тесты на устройствах' },
  { from: '05.12', to: '07.12', title: 'Хостинг и домен', note: 'сборка, деплой, метрики' },
  { from: '08.12', to: '14.12', title: 'Отзывы первых пользователей', note: 'правки по реальным обложкам' },
  { from: '15.12', to: '20.12', title: 'Доработка и релиз MVP', note: 'финальная сборка 20 декабря 2026' },
]

function parse(date, year = 2026) {
  const [day, month] = date.split('.').map(Number)
  return new Date(year, month - 1, day)
}

export default function Roadmap() {
  const today = new Date()
  const year = today.getFullYear()
  const activeIndex = MILESTONES.findIndex((item) => {
    const start = parse(item.from, year)
    const end = parse(item.to, year)
    return today >= start && today <= end
  })
  const current = activeIndex === -1 ? MILESTONES.length - 1 : activeIndex

  return (
    <section className="section roadmap" id="roadmap">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__rule" aria-hidden />
              08 / план
            </p>
            <h2 className="display section-head__title">
              Проект <em>живой</em>, а не «скоро»
            </h2>
          </div>
          <p className="section-head__lede">
            Мы открыто показываем план на 62 дня: от интервью до релиза MVP 20 декабря 2026. Всё, что
            уже готово, можно потрогать на этой странице.
          </p>
        </div>

        <ol className="timeline">
          {MILESTONES.map((item, index) => {
            const status = index < current ? 'done' : index === current ? 'now' : 'next'
            return (
              <li key={item.title} className={`timeline__item is-${status}`}>
                <div className="timeline__marker" aria-hidden>
                  <span />
                </div>
                <div className="timeline__body">
                  <div className="timeline__meta">
                    <span className="mono">
                      {item.from} — {item.to}
                    </span>
                    <span className="mono timeline__status">
                      {status === 'done' ? 'готово' : status === 'now' ? 'в работе' : 'далее'}
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.note}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
