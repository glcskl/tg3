import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ALIGNS,
  BASE_STATE,
  EFFECTS,
  FONTS,
  FRAMES,
  PHOTOS,
  POSITIONS,
  PRESETS,
  photoById,
} from '../lib/presets.js'
import { H, W, loadImage, renderCover, renderToCanvas, warmFonts } from '../lib/render.js'
import { scoreCover } from '../lib/score.js'
import { FREE_LIMIT, registerExport, remaining } from '../lib/account.js'

const imageCache = new Map()

function getPhoto(id) {
  if (!imageCache.has(id)) {
    imageCache.set(id, loadImage(`${import.meta.env.BASE_URL}${photoById(id).src}`))
  }
  return imageCache.get(id)
}

function toBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('empty blob'))), type, quality)
  })
}

function ChipRow({ label, options, value, onChange }) {
  return (
    <div className="chips">
      <span className="chips__label">{label}</span>
      <div className="chips__row" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`chip ${value === option.id ? 'is-active' : ''}`}
            aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function Slider({ label, value, min, max, step, onChange, display }) {
  return (
    <label className="slider">
      <span className="slider__label">
        {label}
        <span className="mono">{display ?? value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

export default function Editor({ state, setState, account, setAccount, onOpenPaywall }) {
  const canvasRef = useRef(null)
  const objectUrlRef = useRef(null)
  const [img, setImg] = useState(null)
  const [meta, setMeta] = useState(null)
  const [safe, setSafe] = useState(false)
  const [uploaded, setUploaded] = useState(null)
  const [toast, setToast] = useState(null)
  const [busy, setBusy] = useState(false)

  const score = scoreCover(meta, state)
  const left = remaining(account)
  const update = useCallback((patch) => setState((current) => ({ ...current, ...patch })), [setState])

  const showToast = useCallback((text) => {
    setToast(text)
    window.clearTimeout(showToast.timer)
    showToast.timer = window.setTimeout(() => setToast(null), 3600)
  }, [])

  useEffect(() => {
    let alive = true
    warmFonts()
    getPhoto(state.photo)
      .then((image) => {
        if (alive) setImg(image)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [state.photo])

  useEffect(() => {
    if (!img) return undefined
    let alive = true
    const draw = async () => {
      await warmFonts()
      if (!alive || !canvasRef.current) return
      const result = renderToCanvas(canvasRef.current, state, img, {
        safe,
        watermark: !account.pro,
      })
      setMeta(result)
    }
    draw()
    return () => {
      alive = false
    }
  }, [state, img, safe, account.pro])

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    },
    [],
  )

  function handleFile(file) {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Подойдёт JPEG, PNG или WebP')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      showToast('Файл больше 20 МБ — сожмите его заранее')
      return
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    loadImage(url)
      .then((image) => {
        setImg(image)
        setUploaded(file.name.length > 22 ? `${file.name.slice(0, 20)}…` : file.name)
        showToast('Фото загружено — обрабатывается локально')
      })
      .catch(() => showToast('Не удалось открыть файл'))
  }

  function pickDemo(photo) {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setUploaded(null)
    update({ photo })
  }

  function applyPreset(id) {
    const preset = PRESETS.find((item) => item.id === id)
    if (!preset) return
    update({ preset: id, ...preset.style })
  }

  function randomStyle() {
    const pick = (list) => list[Math.floor(Math.random() * list.length)].id
    update({
      preset: 'custom',
      font: pick(FONTS),
      effect: pick(EFFECTS),
      position: pick(POSITIONS),
      align: pick(ALIGNS),
      frame: Math.random() > 0.78 ? 'polaroid' : Math.random() > 0.86 ? 'bars' : 'none',
      temp: Number((Math.random() * 1.1 - 0.55).toFixed(2)),
      contrast: Number((1 + Math.random() * 0.2).toFixed(2)),
      saturation: Number((0.82 + Math.random() * 0.4).toFixed(2)),
      darken: Number((0.2 + Math.random() * 0.42).toFixed(2)),
    })
  }

  async function exportCover(type) {
    if (!account.pro && left <= 0) {
      onOpenPaywall('quota')
      return
    }
    setBusy(true)
    try {
      const off = document.createElement('canvas')
      off.width = W
      off.height = H
      renderCover(off.getContext('2d'), state, img, { watermark: !account.pro })

      let blob
      if (type === 'png') {
        blob = await toBlob(off, 'image/png')
        let scale = 0.9
        while (blob.size > 2 * 1024 * 1024 && scale > 0.58) {
          const scaled = document.createElement('canvas')
          scaled.width = Math.round(W * scale)
          scaled.height = Math.round(H * scale)
          scaled.getContext('2d').drawImage(off, 0, 0, scaled.width, scaled.height)
          blob = await toBlob(scaled, 'image/png')
          scale -= 0.08
        }
      } else {
        let quality = 0.94
        blob = await toBlob(off, 'image/jpeg', quality)
        while (blob.size > 2 * 1024 * 1024 && quality > 0.6) {
          quality -= 0.06
          blob = await toBlob(off, 'image/jpeg', quality)
        }
      }

      const name = `covercraft-${new Date().toISOString().slice(0, 10)}-${Date.now()
        .toString()
        .slice(-4)}.${type}`
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(link.href), 5000)

      const next = account.pro ? account : registerExport(account)
      if (!account.pro) setAccount(next)
      const rest = remaining(next)
      showToast(
        `Скачано · ${(blob.size / 1024 / 1024).toFixed(2)} МБ${
          Number.isFinite(rest) ? ` · осталось ${rest} из ${FREE_LIMIT}` : ' · без водяного знака'
        }`,
      )
    } catch {
      showToast('Экспорт не удался — попробуйте ещё раз')
    } finally {
      setBusy(false)
    }
  }

  const reset = () => {
    setState({ ...BASE_STATE })
    setUploaded(null)
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }

  return (
    <section className="section editor" id="editor">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">
            <span className="eyebrow__rule" aria-hidden />
            02 / редактор
          </p>
          <h2 className="display section-head__title">
            Соберите обложку <em>прямо здесь</em>
          </h2>
          <p className="section-head__lede">
            Тот же движок, что и в продукте: canvas, локальные фильтры, проверка читаемости.
            Ни одна фотография не уходит на сервер.
          </p>
        </div>

        <div className="studio">
          <div className="studio__stage">
            <div className="stage__head">
              <span className="mono">Холст · 1280 × 720</span>
              <div className="stage__tools">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={safe}
                    onChange={(event) => setSafe(event.target.checked)}
                  />
                  <span className="switch__track" aria-hidden />
                  <span>Безопасные зоны</span>
                </label>
              </div>
            </div>

            <div className="stage__canvas">
              <canvas ref={canvasRef} width={W} height={H} />
              {!account.pro && <span className="stage__watermark mono">free · водяной знак</span>}
            </div>

            <div className="stage__foot">
              <div className="score">
                <div className="score__num">
                  <span>{score.score}</span>
                  <small>/100</small>
                </div>
                <div className="score__body">
                  <div className="score__top">
                    <strong>{score.label}</strong>
                    <span className="mono">оценка композиции</span>
                  </div>
                  <p>{score.verdict}</p>
                  <div className="score__bar" aria-hidden>
                    <span style={{ width: `${score.score}%` }} />
                  </div>
                </div>
              </div>

              <ul className="checks">
                {score.items.map((item) => (
                  <li key={item.id} className={item.ok ? 'is-ok' : 'is-off'} title={item.hint}>
                    <span className="checks__tick" aria-hidden>
                      {item.ok ? '✓' : '·'}
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="panel" aria-label="Настройки обложки">
            <div className="panel__head">
              <span className="mono">Панель настроек</span>
              <span className={`panel__quota ${!account.pro && left === 0 ? 'is-empty' : ''}`}>
                {account.pro ? 'PRO · без лимита' : `${left} из ${FREE_LIMIT} генераций`}
              </span>
            </div>

            <div className="group">
              <div className="group__head">
                <span>Фото</span>
                <span className="mono">{uploaded ? 'своё' : 'демо'}</span>
              </div>
              <div className="photos">
                {PHOTOS.map((photo) => (
                  <button
                    key={photo.id}
                    type="button"
                    className={`photo ${!uploaded && state.photo === photo.id ? 'is-active' : ''}`}
                    onClick={() => pickDemo(photo.id)}
                    title={photo.name}
                  >
                    <img src={`${import.meta.env.BASE_URL}${photo.src}`} alt="" loading="lazy" />
                    <span>{photo.name}</span>
                  </button>
                ))}
              </div>
              <label
                className="upload"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  handleFile(event.dataTransfer.files?.[0])
                }}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />
                <span className="upload__title">Перетащите фото или выберите файл</span>
                <span className="mono">JPEG · PNG · WebP · до 20 МБ</span>
              </label>
            </div>

            <div className="group">
              <div className="group__head">
                <span>Текст</span>
                <span className="mono">{(state.title || '').length}/64</span>
              </div>
              <label className="field">
                <span>Заголовок</span>
                <input
                  type="text"
                  value={state.title}
                  maxLength={64}
                  placeholder="О чём видео"
                  onChange={(event) => update({ title: event.target.value })}
                />
              </label>
              <label className="field">
                <span>Подзаголовок</span>
                <input
                  type="text"
                  value={state.subtitle}
                  maxLength={48}
                  placeholder="Контекст или деталь"
                  onChange={(event) => update({ subtitle: event.target.value })}
                />
              </label>
            </div>

            <div className="group">
              <div className="group__head">
                <span>Стиль</span>
                <button type="button" className="link-btn" onClick={randomStyle}>
                  Случайный стиль
                </button>
              </div>
              <ChipRow
                label="Пресет"
                options={PRESETS.map((p) => ({ id: p.id, name: p.name }))}
                value={state.preset}
                onChange={applyPreset}
              />
              <ChipRow label="Шрифт" options={FONTS} value={state.font} onChange={(v) => update({ font: v })} />
              <ChipRow
                label="Эффект текста"
                options={EFFECTS}
                value={state.effect}
                onChange={(v) => update({ effect: v })}
              />
              <ChipRow
                label="Позиция"
                options={POSITIONS}
                value={state.position}
                onChange={(v) => update({ position: v })}
              />
              <ChipRow
                label="Выравнивание"
                options={ALIGNS}
                value={state.align}
                onChange={(v) => update({ align: v })}
              />
              <ChipRow label="Рамка" options={FRAMES} value={state.frame} onChange={(v) => update({ frame: v })} />
            </div>

            <div className="group">
              <div className="group__head">
                <span>Коррекция</span>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() =>
                    update({ temp: 0, brightness: 1, contrast: 1, saturation: 1, darken: 0.3, zoom: 1 })
                  }
                >
                  Сбросить цвет
                </button>
              </div>
              <Slider
                label="Температура"
                value={state.temp}
                min={-0.6}
                max={0.6}
                step={0.02}
                onChange={(v) => update({ temp: v })}
                display={state.temp > 0 ? `+${state.temp.toFixed(2)}` : state.temp.toFixed(2)}
              />
              <Slider
                label="Яркость"
                value={state.brightness}
                min={0.7}
                max={1.3}
                step={0.01}
                onChange={(v) => update({ brightness: v })}
                display={state.brightness.toFixed(2)}
              />
              <Slider
                label="Контраст"
                value={state.contrast}
                min={0.7}
                max={1.4}
                step={0.01}
                onChange={(v) => update({ contrast: v })}
                display={state.contrast.toFixed(2)}
              />
              <Slider
                label="Насыщенность"
                value={state.saturation}
                min={0}
                max={1.6}
                step={0.01}
                onChange={(v) => update({ saturation: v })}
                display={state.saturation.toFixed(2)}
              />
              <Slider
                label="Затемнение"
                value={state.darken}
                min={0}
                max={0.8}
                step={0.01}
                onChange={(v) => update({ darken: v })}
                display={`${Math.round(state.darken * 100)}%`}
              />
              <Slider
                label="Кадрирование"
                value={state.zoom}
                min={1}
                max={1.5}
                step={0.01}
                onChange={(v) => update({ zoom: v })}
                display={`×${state.zoom.toFixed(2)}`}
              />
            </div>

            <div className="group group--actions">
              <div className="actions">
                <button
                  type="button"
                  className="btn btn--solid btn--wide"
                  onClick={() => exportCover('jpeg')}
                  disabled={busy}
                >
                  {busy ? 'Готовим файл…' : 'Скачать JPEG'}
                  <span className="mono btn__size">до 2 МБ</span>
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => exportCover('png')} disabled={busy}>
                  PNG
                </button>
              </div>
              <div className="actions__foot">
                <button type="button" className="link-btn" onClick={reset}>
                  Сбросить всё
                </button>
                <button type="button" className="link-btn" onClick={() => onOpenPaywall('features')}>
                  {account.pro ? 'PRO активен' : 'Что даёт PRO →'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </section>
  )
}
