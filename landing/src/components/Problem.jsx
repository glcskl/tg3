export default function Problem() {
  return (
    <section className="section problem" id="problem">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__rule" aria-hidden />
              01 / задача
            </p>
            <h2 className="display section-head__title">
              Два часа на одну картинку — <em>это налог</em>, а не работа
            </h2>
          </div>
          <p className="section-head__lede">
            Обложка решает, нажмут ли на видео. Но пока её соберёшь — открыть редактор, найти
            шаблон, подобрать шрифт, проверить вес файла — уходит вечер. CoverCraft оставляет только
            решения, которые действительно влияют на клик.
          </p>
        </div>

        <div className="compare">
          <div className="compare__col compare__col--old">
            <div className="compare__head">
              <span className="mono">Раньше</span>
              <span className="compare__time">
                2 ч <small>10 мин</small>
              </span>
            </div>
            <ol className="compare__list">
              <li>
                <span className="mono">01</span> Открыть Photoshop или Canva
              </li>
              <li>
                <span className="mono">02</span> Искать шаблон под формат 16:9
              </li>
              <li>
                <span className="mono">03</span> Подбирать шрифт и размер вручную
              </li>
              <li>
                <span className="mono">04</span> Следить, чтобы текст не уехал в обрез
              </li>
              <li>
                <span className="mono">05</span> Экспортировать и проверять вес файла
              </li>
            </ol>
            <p className="compare__note">
              И всё равно непонятно, читается ли заголовок в ленте на телефоне.
            </p>
          </div>

          <div className="compare__divider" aria-hidden>
            <span>→</span>
          </div>

          <div className="compare__col compare__col--new">
            <div className="compare__head">
              <span className="mono">С CoverCraft</span>
              <span className="compare__time">
                4 <small>мин</small>
              </span>
            </div>
            <ol className="compare__list">
              <li>
                <span className="mono">01</span> Загрузить кадр — или взять демо
              </li>
              <li>
                <span className="mono">02</span> Написать заголовок и подзаголовок
              </li>
              <li>
                <span className="mono">03</span> Выбрать пресет и поправить цвет
              </li>
              <li>
                <span className="mono">04</span> Посмотреть оценку композиции
              </li>
              <li>
                <span className="mono">05</span> Скачать 1280 × 720 · до 2 МБ
              </li>
            </ol>
            <p className="compare__note">
              Проверка контраста и безопасных зон встроена — превью выглядит как в ленте.
            </p>
          </div>
        </div>

        <div className="problem__strip">
          <div>
            <span className="stat__num">30×</span>
            <span className="stat__cap">быстрее, чем собирать вручную</span>
          </div>
          <div>
            <span className="stat__num">2–5%</span>
            <span className="stat__cap">целевой прирост CTR в гипотезе проекта</span>
          </div>
          <div>
            <span className="stat__num">0</span>
            <span className="stat__cap">загрузок и регистраций</span>
          </div>
        </div>
      </div>
    </section>
  )
}
