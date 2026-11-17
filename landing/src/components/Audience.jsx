const AUDIENCE = [
  {
    tag: '1–100 тыс. подписчиков',
    title: 'Микроблогеры',
    quote: '«Обложку хочется за пять минут, а не за вечер».',
    text: 'Один кадр, один смысл, стабильный вид из выпуска в выпуск. Пресеты дают узнаваемость без дизайнера.',
    needs: ['свой визуальный код', 'серия обложек в одном стиле', 'без подписки на редактор'],
  },
  {
    tag: 'SMM-агентства',
    title: 'Команды и студии',
    quote: '«Нужно быстро и без правок от клиента».',
    text: 'Пресеты фиксируют правила бренда, а проверка композиции снимает половину кругов согласования.',
    needs: ['одинаковые правила для всех', 'быстрый черновик клиенту', 'экспорт под площадку'],
  },
  {
    tag: 'первый канал',
    title: 'Новички',
    quote: '«Не хочу разбираться в слоях и кривых».',
    text: 'Ни установки, ни аккаунта. Открыли страницу, собрали обложку, скачали файл — и вернулись к съёмке.',
    needs: ['ноль обучения', 'подсказки вместо панелей', 'бесплатный старт'],
  },
]

export default function Audience() {
  return (
    <section className="section audience" id="audience">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__rule" aria-hidden />
              06 / для кого
            </p>
            <h2 className="display section-head__title">
              Тем, кто делает <em>много</em> и один
            </h2>
          </div>
          <p className="section-head__lede">
            CoverCraft рассчитан на людей, у которых нет дизайнера в команде — и нет времени
            становиться им.
          </p>
        </div>

        <div className="audience__grid">
          {AUDIENCE.map((item) => (
            <article className="audience-card" key={item.title}>
              <span className="mono audience-card__tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <p className="audience-card__quote">{item.quote}</p>
              <p>{item.text}</p>
              <ul>
                {item.needs.map((need) => (
                  <li key={need}>{need}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
