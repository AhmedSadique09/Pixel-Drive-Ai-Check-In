import type { FacilityRow } from './facility-data'

const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 56
const LINE_HEIGHT_RATIO = 1.4
/** Rough average glyph width of Helvetica as a fraction of the font size, used to wrap text. */
const AVG_CHAR_WIDTH_RATIO = 0.52
const MAX_LATIN1_CODE = 0xff
const BRAND_COLOR = '0.13 0.37 0.27'
const TEXT_COLOR = '0.1 0.1 0.1'
const MUTED_COLOR = '0.4 0.4 0.4'

interface PdfLine {
  text: string
  size: number
  bold: boolean
  color: string
  gapBefore: number
}

/** Helvetica only covers Latin-1 here, so anything else is shown as "?" and control characters are dropped. */
const toLatin1 = (text: string): string =>
  Array.from(text, (char) => {
    const code = char.codePointAt(0) ?? 0
    if (code < 0x20) return ' '
    return code <= MAX_LATIN1_CODE ? char : '?'
  }).join('')

const escapePdfText = (text: string): string => toLatin1(text).replace(/[\\()]/g, (char) => `\\${char}`)

function wrapText(text: string, size: number, maxWidth: number): string[] {
  const maxChars = Math.max(10, Math.floor(maxWidth / (size * AVG_CHAR_WIDTH_RATIO)))
  const lines: string[] = []
  let current = ''
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (current && current.length + 1 + word.length > maxChars) {
      lines.push(current)
      current = word
    } else {
      current = current ? `${current} ${word}` : word
    }
  }
  if (current) lines.push(current)
  return lines
}

const heading = (text: string): PdfLine => ({ text, size: 13, bold: true, color: BRAND_COLOR, gapBefore: 18 })
const body = (text: string, gapBefore = 4): PdfLine => ({ text, size: 11, bold: false, color: TEXT_COLOR, gapBefore })

/** Turns a markdown-ish rules text ("# Section" + paragraph) into styled lines. */
function rulesLines(rulesText: string): PdfLine[] {
  return rulesText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const title = line.match(/^#{1,3}\s+(.*)$/)
      return title ? { ...body(title[1], 8), bold: true } : body(line)
    })
}

function buildLines(facility: FacilityRow): PdfLine[] {
  const lines: PdfLine[] = [
    { text: facility.name, size: 22, bold: true, color: BRAND_COLOR, gapBefore: 0 },
    { text: 'Facility information', size: 11, bold: false, color: MUTED_COLOR, gapBefore: 6 },
  ]
  if (facility.location) lines.push(body(`Location: ${facility.location}`, 14))
  lines.push(body(`Fee: ¥${facility.fee}`, facility.location ? 4 : 14))
  lines.push(body(`Number of sites: ${facility.siteCount}`))
  lines.push(body(`Rules document: ${facility.docName}`))
  lines.push(body(`Status: ${facility.status === 'live' ? 'Live' : 'Draft'}`))

  if (facility.about) lines.push(heading('About this facility'), body(facility.about))
  if (facility.amenities?.length) {
    lines.push(heading('Amenities'), ...facility.amenities.map((amenity) => body(`- ${amenity}`)))
  }
  if (facility.rulesText) lines.push(heading('Site rules'), ...rulesLines(facility.rulesText))
  return lines
}

/** Splits styled lines into pages, wrapping long text to the printable width. */
function paginate(lines: PdfLine[]): string[] {
  const maxWidth = PAGE_WIDTH - MARGIN * 2
  const pages: string[][] = [[]]
  let y = PAGE_HEIGHT - MARGIN

  for (const line of lines) {
    const lineHeight = line.size * LINE_HEIGHT_RATIO
    wrapText(line.text, line.size, maxWidth).forEach((chunk, index) => {
      y -= index === 0 ? line.gapBefore + lineHeight : lineHeight
      if (y < MARGIN) {
        pages.push([])
        y = PAGE_HEIGHT - MARGIN - lineHeight
      }
      const font = line.bold ? '/F2' : '/F1'
      pages[pages.length - 1].push(
        `BT ${line.color} rg ${font} ${line.size} Tf ${MARGIN} ${y.toFixed(1)} Td (${escapePdfText(chunk)}) Tj ET`,
      )
    })
  }
  return pages.map((page) => page.join('\n'))
}

/** Builds a minimal text-only PDF (Helvetica, A4) and returns its raw bytes. */
function buildPdf(facility: FacilityRow): Uint8Array {
  const pageStreams = paginate(buildLines(facility))
  const pageObjectIds = pageStreams.map((_, index) => 5 + index * 2)

  const objects: string[] = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageStreams.length} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
  ]
  pageStreams.forEach((stream, index) => {
    const contentId = pageObjectIds[index] + 1
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`,
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    )
  })

  let pdf = '%PDF-1.4\n'
  const offsets = objects.map((object, index) => {
    const offset = pdf.length
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
    return offset
  })

  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  pdf += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  // Every character is Latin-1, so one char is one byte and the xref offsets above stay valid.
  return Uint8Array.from(pdf, (char) => char.charCodeAt(0))
}

/** Opens a generated facility information PDF in a new tab. Call from a click handler so the popup is allowed. */
export function openFacilityPdf(facility: FacilityRow): void {
  const url = URL.createObjectURL(new Blob([buildPdf(facility)], { type: 'application/pdf' }))
  window.open(url, '_blank', 'noopener')
}
