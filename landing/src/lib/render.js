import { formatOf } from './presets.js'

const INK = '#17140F'
const PAPER = '#F7F2E7'

const STACKS = {
  unbounded: "Unbounded, 'Golos Text', system-ui, sans-serif",
  oswald: "Oswald, 'Golos Text', system-ui, sans-serif",
  playfair: "'Playfair Display', Georgia, serif",
}
const WEIGHTS = { unbounded: 600, oswald: 500, playfair: 700 }

const scratch = document.createElement('canvas')
scratch.width = 64
scratch.height = 36
const sctx = scratch.getContext('2d', { willReadFrequently: true })

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Не удалось загрузить изображение'))
    img.src = src
  })
}

export function fontStack(id) {
  return STACKS[id] || STACKS.playfair
}

export function fontString(id, size) {
  return `${WEIGHTS[id] || 600} ${size}px ${fontStack(id)}`
}

export async function warmFonts() {
  if (!document.fonts) return
  const jobs = []
  for (const id of Object.keys(STACKS)) {
    jobs.push(document.fonts.load(fontString(id, 100), 'АБВ abc 123'))
  }
  jobs.push(document.fonts.load('500 20px "JetBrains Mono"', 'COVERCRAFT 01'))
  jobs.push(document.fonts.load('400 20px "Golos Text"', 'Обложка'))
  try {
    await Promise.all(jobs)
  } catch {
    /* шрифт не загрузился — останутся системные */
  }
}

/** Толщина полосы киножурнала: доля высоты холста. */
const barHeight = (H) => Math.round(H * 0.1444)

function frameInsets(frame, W, H) {
  if (frame === 'polaroid') {
    const side = Math.round(Math.min(W, H) * 0.047)
    return { top: side, right: side, bottom: Math.round(H * 0.203), left: side }
  }
  return { top: 0, right: 0, bottom: 0, left: 0 }
}

function drawCover(ctx, img, rect, zoom = 1) {
  const scale = Math.max(rect.w / img.naturalWidth, rect.h / img.naturalHeight) * zoom
  const w = img.naturalWidth * scale
  const h = img.naturalHeight * scale
  ctx.drawImage(img, rect.x + (rect.w - w) / 2, rect.y + (rect.h - h) / 2, w, h)
}

function applyFilter(ctx, s) {
  const parts = [
    `brightness(${s.brightness.toFixed(3)})`,
    `contrast(${s.contrast.toFixed(3)})`,
    `saturate(${s.saturation.toFixed(3)})`,
  ]
  ctx.filter = parts.join(' ')
}

function overlayTemperature(ctx, rect, temp) {
  if (!temp) return
  ctx.save()
  ctx.globalCompositeOperation = 'soft-light'
  ctx.globalAlpha = Math.min(0.9, Math.abs(temp))
  ctx.fillStyle = temp > 0 ? '#FF9B4A' : '#4C7DFF'
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
  ctx.restore()
}

function overlayShade(ctx, rect, s) {
  const amount = s.darken
  if (amount <= 0.001) return
  ctx.save()
  const vertical = s.position === 'top' ? 0 : s.position === 'center' ? 0.5 : 1
  const g = ctx.createLinearGradient(0, rect.y, 0, rect.y + rect.h)
  if (vertical === 0) {
    g.addColorStop(0, `rgba(10,9,7,${amount})`)
    g.addColorStop(0.55, 'rgba(10,9,7,0)')
  } else if (vertical === 1) {
    g.addColorStop(0.42, 'rgba(10,9,7,0)')
    g.addColorStop(1, `rgba(10,9,7,${amount})`)
  } else {
    g.addColorStop(0, 'rgba(10,9,7,0)')
    g.addColorStop(0.5, `rgba(10,9,7,${amount})`)
    g.addColorStop(1, 'rgba(10,9,7,0)')
  }
  ctx.fillStyle = g
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
  ctx.restore()
}

function sampleLuma(ctx, rect) {
  sctx.clearRect(0, 0, 64, 36)
  sctx.drawImage(ctx.canvas, rect.x, rect.y, rect.w, rect.h, 0, 0, 64, 36)
  let data
  try {
    data = sctx.getImageData(0, 0, 64, 36).data
  } catch {
    return 128
  }
  let sum = 0
  let n = 0
  for (let i = 0; i < data.length; i += 4) {
    sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
    n += 1
  }
  return n ? sum / n : 128
}

function wrapLines(ctx, text, maxWidth) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const lines = []
  let current = words[0]
  for (let i = 1; i < words.length; i += 1) {
    const next = `${current} ${words[i]}`
    if (ctx.measureText(next).width <= maxWidth) current = next
    else {
      lines.push(current)
      current = words[i]
    }
  }
  lines.push(current)
  return lines
}

function baseSize(title, frame, W, H) {
  const len = (title || '').trim().length
  let size = 108
  if (len > 14) size = 96
  if (len > 22) size = 84
  if (len > 32) size = 72
  if (len > 44) size = 62
  if (len > 58) size = 54
  size *= W / 1280
  if (H > W) size *= 1.15
  if (frame === 'polaroid') size *= 0.66
  if (frame === 'bars') size *= 0.58
  return Math.round(size)
}

function textArea(s, insets, W, H) {
  if (s.frame === 'polaroid') {
    const padX = Math.round(W * 0.0531)
    return {
      x: padX,
      y: H - insets.bottom + Math.round(H * 0.025),
      w: W - padX * 2,
      h: insets.bottom - Math.round(H * 0.0611),
    }
  }
  if (s.frame === 'bars') {
    const barH = barHeight(H)
    return {
      x: Math.round(W * 0.0563),
      y: s.position === 'top' ? Math.round(H * 0.0306) : H - barH + Math.round(H * 0.0194),
      w: W - Math.round(W * 0.1126),
      h: barH - Math.round(H * 0.0278),
    }
  }
  const mx = Math.round(W * 0.0656)
  const my = Math.round(H * 0.1167)
  return { x: mx, y: my, w: W - mx * 2, h: H - my * 2 }
}

function textZone(s, area, l, imageRect) {
  const h = Math.min(area.h, l.blockH + l.subSize)
  let y = area.y
  if (s.position === 'center') y = area.y + (area.h - l.blockH) / 2
  else if (s.position === 'bottom') y = area.y + area.h - l.blockH
  y = Math.max(imageRect.y, Math.min(y - 8, imageRect.y + imageRect.h - h))
  return {
    x: Math.max(imageRect.x, area.x),
    y,
    w: Math.min(area.w, imageRect.w),
    h: Math.min(h + 16, imageRect.h),
  }
}

function layout(ctx, s, area, W, H) {
  const scale = W / 1280
  const step = Math.max(4, Math.round(6 * scale))
  let size = baseSize(s.title, s.frame, W, H)
  let lines = []
  let subSize = 0
  const maxLines = s.frame === 'none' ? (H > W ? 4 : 3) : H > W ? 3 : 2

  for (let guard = 0; guard < 14; guard += 1) {
    ctx.font = fontString(s.font, size)
    lines = wrapLines(ctx, s.title, area.w)
    if (lines.length <= maxLines || size <= Math.round(34 * scale)) break
    size -= step
  }
  if (!lines.length) lines = ['']

  const lineHeight = size * 1.08
  subSize = Math.max(18, Math.round(size * 0.32))
  const gap = s.subtitle ? Math.round(subSize * 0.9) : 0
  const blockH = lines.length * lineHeight + (s.subtitle ? gap + subSize : 0)
  return { size, lines, lineHeight, subSize, gap, blockH }
}

function anchorY(s, area, blockH, size) {
  if (s.frame === 'polaroid') return area.y + size * 0.86
  if (s.frame === 'bars') return area.y + (area.h - blockH) / 2 + size * 0.86
  if (s.position === 'top') return area.y + size * 0.86
  if (s.position === 'center') return area.y + (area.h - blockH) / 2 + size * 0.86
  return area.y + area.h - blockH + size * 0.86
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, h / 2, w / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function drawWatermark(ctx, frame, W, H) {
  const pad = Math.round(Math.min(W, H) * 0.04)
  const size = Math.max(16, Math.round(W * 0.0133))
  ctx.save()
  ctx.font = `500 ${size}px "JetBrains Mono", monospace`
  ctx.fillStyle = 'rgba(23,20,15,0.42)'
  if (frame === 'none') ctx.fillStyle = 'rgba(247,242,231,0.5)'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('COVERCRAFT', W - pad, H - pad)
  ctx.restore()
}

/**
 * Рисует обложку в выбранном формате (16:9 или 9:16)
 * и возвращает метрики для оценки композиции.
 */
export function renderCover(ctx, state, img, options = {}) {
  const s = state
  const fmt = formatOf(s)
  const W = fmt.w
  const H = fmt.h
  const insets = frameInsets(s.frame, W, H)
  const imageRect = {
    x: insets.left,
    y: insets.top,
    w: W - insets.left - insets.right,
    h: H - insets.top - insets.bottom,
  }

  ctx.save()
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = s.frame === 'polaroid' ? '#FBF7EF' : '#0E0D0B'
  ctx.fillRect(0, 0, W, H)

  if (img) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(imageRect.x, imageRect.y, imageRect.w, imageRect.h)
    ctx.clip()
    applyFilter(ctx, s)
    drawCover(ctx, img, imageRect, s.zoom)
    ctx.filter = 'none'
    overlayTemperature(ctx, imageRect, s.temp)
    overlayShade(ctx, imageRect, s)
    ctx.restore()
  } else {
    ctx.fillStyle = '#DED6C6'
    ctx.fillRect(imageRect.x, imageRect.y, imageRect.w, imageRect.h)
  }

  if (s.frame === 'bars') {
    const barH = barHeight(H)
    ctx.fillStyle = '#F7F2E7'
    if (s.position === 'top') ctx.fillRect(0, 0, W, barH)
    else ctx.fillRect(0, H - barH, W, barH)
  }

  const area = textArea(s, insets, W, H)
  const l = layout(ctx, s, area, W, H)
  const zone = textZone(s, area, l, imageRect)
  const luma = s.frame === 'none' ? sampleLuma(ctx, zone) : 242

  const dark = luma < 138
  let fill = PAPER
  let sub = 'rgba(247,242,231,0.78)'
  if (s.frame !== 'none') {
    fill = INK
    sub = 'rgba(23,20,15,0.6)'
  } else if (s.effect === 'plate') {
    fill = '#FBF7EF'
    sub = 'rgba(251,247,239,0.72)'
  } else if (s.effect === 'neon') {
    fill = '#FFF4E8'
    sub = 'rgba(255,236,222,0.8)'
  } else if (s.effect === 'auto') {
    fill = dark ? PAPER : INK
    sub = dark ? 'rgba(247,242,231,0.78)' : 'rgba(23,20,15,0.62)'
  }

  const y0 = anchorY(s, area, l.blockH, l.size)
  const align = s.align
  const anchorX = align === 'left' ? area.x : align === 'right' ? area.x + area.w : area.x + area.w / 2

  ctx.textAlign = align
  ctx.textBaseline = 'alphabetic'

  if (s.effect === 'plate') {
    const widest = l.lines.reduce((max, line) => {
      ctx.font = fontString(s.font, l.size)
      return Math.max(max, ctx.measureText(line).width)
    }, 0)
    const padX = l.size * 0.34
    const padY = l.size * 0.3
    const boxW = Math.min(area.w + padX, widest + padX * 2)
    const boxH = l.blockH + padY * 2
    let boxX = area.x - padX
    if (align === 'center') boxX = area.x + area.w / 2 - boxW / 2
    if (align === 'right') boxX = area.x + area.w - boxW + padX
    const boxY = y0 - l.size * 0.86 - padY
    ctx.save()
    ctx.fillStyle = 'rgba(14,12,10,0.66)'
    roundedRect(ctx, boxX, boxY, boxW, boxH, 10)
    ctx.fill()
    ctx.restore()
  }

  l.lines.forEach((line, i) => {
    const y = y0 + i * l.lineHeight
    ctx.font = fontString(s.font, l.size)
    if (s.effect === 'shadow') {
      ctx.save()
      ctx.shadowColor = 'rgba(8,7,5,0.6)'
      ctx.shadowBlur = l.size * 0.26
      ctx.shadowOffsetY = l.size * 0.06
      ctx.fillStyle = fill
      ctx.fillText(line, anchorX, y)
      ctx.restore()
    } else if (s.effect === 'outline') {
      ctx.save()
      ctx.lineJoin = 'round'
      ctx.lineWidth = Math.max(4, l.size * 0.07)
      ctx.strokeStyle = dark || s.frame !== 'none' ? 'rgba(12,10,8,0.72)' : 'rgba(12,10,8,0.7)'
      if (s.frame !== 'none') ctx.strokeStyle = 'rgba(247,242,231,0.9)'
      ctx.strokeText(line, anchorX, y)
      ctx.fillStyle = s.frame !== 'none' ? INK : fill
      ctx.fillText(line, anchorX, y)
      ctx.restore()
    } else if (s.effect === 'neon') {
      ctx.save()
      ctx.shadowColor = 'rgba(255,116,64,0.9)'
      ctx.shadowBlur = l.size * 0.42
      ctx.fillStyle = fill
      ctx.fillText(line, anchorX, y)
      ctx.fillText(line, anchorX, y)
      ctx.shadowBlur = l.size * 0.14
      ctx.fillText(line, anchorX, y)
      ctx.restore()
    } else {
      ctx.fillStyle = fill
      ctx.fillText(line, anchorX, y)
    }
  })

  if (s.subtitle) {
    const y = y0 + (l.lines.length - 1) * l.lineHeight + l.gap + l.subSize
    ctx.font = `500 ${l.subSize}px "Golos Text", system-ui, sans-serif`
    ctx.fillStyle = sub
    ctx.fillText(s.subtitle, anchorX, y)
  }

  if (options.safe) {
    ctx.save()
    const m = Math.round(Math.min(W, H) * 0.0889)
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.setLineDash([9, 9])
    ctx.lineWidth = 2
    ctx.strokeRect(m, m, W - m * 2, H - m * 2)
    ctx.beginPath()
    ctx.moveTo(W / 3, m)
    ctx.lineTo(W / 3, H - m)
    ctx.moveTo((W / 3) * 2, m)
    ctx.lineTo((W / 3) * 2, H - m)
    ctx.moveTo(m, H / 3)
    ctx.lineTo(W - m, H / 3)
    ctx.moveTo(m, (H / 3) * 2)
    ctx.lineTo(W - m, (H / 3) * 2)
    ctx.stroke()
    ctx.restore()
  }

  if (options.watermark) drawWatermark(ctx, s.frame, W, H)

  ctx.restore()

  const colorLuma = fill === INK ? 24 : 240
  let contrast = Math.abs(colorLuma - luma)
  if (s.frame !== 'none') contrast = Math.max(contrast, 210)
  if (s.effect === 'plate') contrast = Math.max(contrast, 190)
  if (s.effect === 'outline') contrast = Math.max(contrast, 150)
  if (s.effect === 'neon') contrast = Math.max(contrast, 165)

  return {
    luma,
    lines: l.lines.length,
    size: l.size,
    sizeRatio: l.size / W,
    width: W,
    height: H,
    color: fill,
    contrast,
    covered: l.blockH / H,
  }
}

export function renderToCanvas(canvas, state, img, options = {}) {
  const fmt = formatOf(state)
  const ctx = canvas.getContext('2d')
  canvas.width = fmt.w
  canvas.height = fmt.h
  return renderCover(ctx, state, img, options)
}
