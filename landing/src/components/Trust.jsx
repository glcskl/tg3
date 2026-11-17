const POINTS = [
  {
    title: 'Шрифты с открытой лицензией',
    text: 'Unbounded, Oswald и Playfair Display распространяются по SIL Open Font License — их можно использовать в коммерческих проектах.',
    meta: 'SIL OFL 1.1',
  },
  {
    title: 'Фото не покидает браузер',
    text: 'Рендер идёт на canvas на вашем устройстве. Нет загрузки на сервер, нет хранения, нет «облачной обработки».',
    meta: 'local-first',
  },
  {
    title: 'Предсказуемый результат',
    text: 'Никакой генеративной магии: те же настройки дают ту же обложку. Поэтому пресеты работают как правила бренда.',
    meta: 'без ML',
  },
  {
    title: 'Честные ограничения',
    text: '16:9 и 9:16, файл до 2 МБ, исходник до 20 МБ. Всё, что не влезает, говорится прямо, а не прячется.',
    meta: 'без звёздочек',
  },
]

export default function Trust() {
  return (
    <section className="section trust" id="trust">
      <div className="container trust__grid">
        <div className="trust__aside">
          <p className="eyebrow">
            <span className="eyebrow__rule" aria-hidden />
            09 / доверие
          </p>
          <h2 className="display section-head__title">
            Прозрачно <em>до пикселя</em>
          </h2>
          <p className="section-head__lede">
            CoverCraft — учебный проект по управлению IT-проектами. Поэтому здесь нет ни обещаний
            «нейросетей», ни скрытых условий.
          </p>
          <a
            className="trust__link mono"
            href="https://github.com/glcskl/tg3"
            target="_blank"
            rel="noreferrer"
          >
            исходный код на GitHub ↗
          </a>
        </div>

        <div className="trust__list">
          {POINTS.map((point, index) => (
            <article key={point.title}>
              <span className="mono trust__num">0{index + 1}</span>
              <div>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </div>
              <span className="mono trust__meta">{point.meta}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
