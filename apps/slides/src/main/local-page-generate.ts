/**
 * Local one-slide pptx builder used when Genspark cloud slide_generate is
 * unavailable (no gsk login / custom provider). Quality is simpler than the
 * cloud HTML designer, but generate_deck can still land pages on the canvas.
 */
import {
  addElement,
  addPicture,
  createBlankPptx,
  openPptx,
  savePptx,
  type Paragraph,
} from '@genoffice/pptx-engine'

const SLIDE_CX = 12_192_000
const SLIDE_CY = 6_858_000
const MARGIN = 457_200 // 0.5"

export interface LocalSlideGenerateInput {
  brief: string
  title?: string
  styleSkill?: string
  images?: { url: string; caption?: string }[]
  /** Optional: fetch image bytes for picture slots (main process net stack) */
  fetchImage?: (url: string) => Promise<{ bytes: Uint8Array; ext: string } | null>
}

function pickHex(styleSkill: string | undefined, keys: RegExp[]): string | undefined {
  if (!styleSkill) return undefined
  for (const key of keys) {
    const m = styleSkill.match(key)
    if (m?.[1]) return `#${m[1].replace(/^#/, '').slice(0, 6)}`
  }
  return undefined
}

function bodyParagraphs(brief: string, textColor: string): Paragraph[] {
  const lines = brief
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-*•\d.\s]+/, '').trim())
    .filter(Boolean)
  const use = (lines.length > 0 ? lines : [brief.trim() || ' ']).slice(0, 12)
  return use.map((text) => ({
    runs: [{ text, fontSize: 18, color: textColor }],
    spaceAfter: 8,
  }))
}

/**
 * Build a one-slide 16:9 pptx from title + brief (+ optional images).
 * Returns raw pptx bytes suitable for the cloudpptx: landing path.
 */
export async function buildLocalSlidePptx(input: LocalSlideGenerateInput): Promise<Uint8Array> {
  const opened = await openPptx(await createBlankPptx())
  const slide = opened.deck.slides[0]
  if (!slide) throw new Error('blank pptx has no slide')

  const bg =
    pickHex(input.styleSkill, [
      /Main background:\s*(#[0-9A-Fa-f]{6})/i,
      /main background:\s*(#[0-9A-Fa-f]{6})/i,
      /content:\s*(#[0-9A-Fa-f]{6})/i,
    ]) ?? '#FFFFFF'
  const textColor =
    pickHex(input.styleSkill, [
      /Main text color:\s*(#[0-9A-Fa-f]{6})/i,
      /main text color:\s*(#[0-9A-Fa-f]{6})/i,
    ]) ?? '#1A1A2E'
  const accent =
    pickHex(input.styleSkill, [
      /Primary accent:\s*(#[0-9A-Fa-f]{6})/i,
      /primary accent:\s*(#[0-9A-Fa-f]{6})/i,
    ]) ?? '#2563EB'

  // Full-bleed background shape
  addElement(slide, {
    kind: 'rect',
    offset: { x: 0, y: 0, cx: SLIDE_CX, cy: SLIDE_CY },
    fillColor: bg,
  })

  const title = (input.title ?? '').trim() || 'Untitled'
  const hasImages = (input.images?.length ?? 0) > 0
  const contentRight = hasImages ? Math.round(SLIDE_CX * 0.55) : SLIDE_CX - MARGIN * 2

  addElement(slide, {
    kind: 'textbox',
    offset: {
      x: MARGIN,
      y: MARGIN,
      cx: contentRight - MARGIN,
      cy: 914_400, // ~1"
    },
    paragraphs: [
      {
        runs: [{ text: title, bold: true, fontSize: 32, color: accent }],
      },
    ],
  })

  const brief = (input.brief ?? '').trim()
  if (brief) {
    addElement(slide, {
      kind: 'textbox',
      offset: {
        x: MARGIN,
        y: MARGIN + 1_066_800,
        cx: contentRight - MARGIN,
        cy: SLIDE_CY - MARGIN * 2 - 1_066_800,
      },
      paragraphs: bodyParagraphs(brief, textColor),
    })
  }

  // Up to 2 images on the right
  if (hasImages && input.fetchImage) {
    const slots = input.images!.slice(0, 2)
    const imgX = Math.round(SLIDE_CX * 0.58)
    const imgW = SLIDE_CX - imgX - MARGIN
    const imgH = Math.round((SLIDE_CY - MARGIN * 2 - (slots.length > 1 ? MARGIN / 2 : 0)) / slots.length)
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]!
      try {
        const img = await input.fetchImage(slot.url)
        if (!img) continue
        addPicture(opened, slide, {
          bytes: img.bytes,
          ext: img.ext,
          offset: {
            x: imgX,
            y: MARGIN + i * (imgH + MARGIN / 2),
            cx: imgW,
            cy: imgH,
          },
          ...(slot.caption ? { descr: slot.caption } : {}),
        })
      } catch {
        /* skip failed image */
      }
    }
  }

  return savePptx(opened)
}
