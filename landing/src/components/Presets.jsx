import { useEffect, useRef } from 'react'
import { BASE_STATE, PRESETS, photoById } from '../lib/presets.js'
import { loadImage, renderToCanvas, warmFonts } from '../lib/render.js'

const images = new Map()

function imageFor(id) {
  if (!images.has(id)) {
    images.set(id, loadImage(`${import.meta.env.BASE_URL}${photoById(id).src}`))
  }
  return images.get(id)
}

function PresetCard({ preset, onApply }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    let alive = true
    warmFonts().then(async () => {
      try {
        const img = await imageFor(preset.sample.photo)
        if (!alive || !canvasRef.current) return
        renderToCanvas(
          canvasRef.current,
          {
            ...BASE_STATE,
            ...preset.style,
            title: preset.sample.title,
            subtitle: preset.sample.subtitle,
          },
          img,
          { watermark: false },
        )
      } catch {
        /* превью не критично */
      }
    })
    return () => {
      alive = false
    }
  }, [preset])

  return (
    <article className="preset-card">
      <button type="button" className="preset-card__frame" onClick={() => onApply(preset.id)}>
        <canvas ref={canvasRef} width={1280} height={720} aria-label={`Пресет «${preset.name}»`} />
        <span className="preset-card__hover">Применить</span>
      </button>
      <div className="preset-card__body">
        <div className="preset-card__top">
          <h3>{preset.name}</h3>
          <span className="mono">{preset.tag}</span>
        </div>
        <p>{preset.note}</p>
      </div>
    </article>
  )
}

export default function Presets({ onApply }) {
  return (
    <section className="section presets" id="presets">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__rule" aria-hidden />
              03 / пресеты
            </p>
            <h2 className="display section-head__title">
              Шесть <em>отправных точек</em>
            </h2>
          </div>
          <p className="section-head__lede">
            Не шаблоны «под копирку»: каждый пресет — набор решений о шрифте, контрасте, кадре и
            свете. Дальше двигайте что угодно вручную. Шрифты — SIL Open Font License.
          </p>
        </div>

        <div className="preset-grid">
          {PRESETS.map((preset) => (
            <PresetCard key={preset.id} preset={preset} onApply={onApply} />
          ))}
        </div>

        <p className="presets__foot mono">
          Каждое превью выше отрисовано в браузере · 5 фильтров × 3 шрифта × 5 эффектов × 3 позиции
          × 3 рамки
        </p>
      </div>
    </section>
  )
}
