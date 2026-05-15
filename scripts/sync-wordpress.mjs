#!/usr/bin/env node
/**
 * Syncs posts from wordpress-blog repo into content/wordpress/
 *
 * Usage: node scripts/sync-wordpress.mjs <source-dir>
 *   source-dir: path to checked-out wordpress-blog repo (default: ./wordpress-source)
 */

import fs from 'fs'
import path from 'path'

const SOURCE_DIR = process.argv[2] ?? path.join(process.cwd(), 'wordpress-source')
const OUT_DIR = path.join(process.cwd(), 'content', 'wordpress')

const SKIP_DIRS = new Set(['scripts', '.github', '.obsidian', 'assets'])

const FOLDER_TO_TAG = {
  'Automation':       'automation',
  'Books':            'books',
  'Build & Projects': 'build',
  'Make Money':       'make-money',
  'Problem Solving':  'problem-solving',
  'Prompts':          'prompts',
  'Study':            'study',
  'Tools & Reviews':  'tools',
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { data: {}, content: raw }
  const block = match[1]
  const content = raw.slice(match[0].length)
  const data = {}
  for (const line of block.split('\n')) {
    const m = line.match(/^(\w[\w_]*):\s*(.*)$/)
    if (m) {
      const val = m[2].trim()
      data[m[1]] = val === 'true' ? true : val === 'false' ? false : isNaN(Number(val)) ? val : Number(val)
    }
  }
  return { data, content }
}

function extractTitle(content) {
  const m = content.match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : null
}

function extractDescription(content) {
  // first non-empty, non-heading, non-image paragraph
  const lines = content.split('\n')
  const chunks = []
  let cur = []
  for (const line of lines) {
    if (line.trim() === '') {
      if (cur.length) { chunks.push(cur.join(' ')); cur = [] }
    } else {
      cur.push(line.trim())
    }
  }
  if (cur.length) chunks.push(cur.join(' '))

  for (const chunk of chunks) {
    if (/^#+\s/.test(chunk)) continue
    if (/^!\[/.test(chunk)) continue
    if (/^>/.test(chunk)) continue
    if (chunk.length < 20) continue
    // strip markdown syntax for plain text desc
    return chunk.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').slice(0, 200)
  }
  return ''
}

function sanitizeForMdx(content) {
  return content
    // Remove Windows local image paths
    .replace(/!\[([^\]]*)\]\(C:\\[^)]+\)/g, '')
    .replace(/!\[([^\]]*)\]\([A-Z]:\\[^)]+\)/g, '')
    // Escape < that is NOT a valid HTML/JSX tag opener (e.g. <10ms, <±, <=)
    // Valid openers: <letter, </, <!
    .replace(/<(?![a-zA-Z/!])/g, '&lt;')
    // Escape { } outside of code blocks to prevent MDX JSX interpolation errors
    // We do a simple heuristic: replace { } that appear in table cells / plain text
    // by leaving them alone inside ``` blocks
    .replace(/(?<!`)(\{)(?!`)/g, (m, _, offset, str) => {
      // Check if we're inside a code fence — simple line-level check
      const before = str.slice(0, offset)
      const fencesBefore = (before.match(/^```/gm) || []).length
      return fencesBefore % 2 === 0 ? '&#123;' : m
    })
    .replace(/(?<!`)(\})(?!`)/g, (m, _, offset, str) => {
      const before = str.slice(0, offset)
      const fencesBefore = (before.match(/^```/gm) || []).length
      return fencesBefore % 2 === 0 ? '&#125;' : m
    })
}

function slugify(filename) {
  return filename.replace(/\.mdx?$/, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '')
}

function buildFrontmatter(fields) {
  const lines = ['---']
  for (const [k, v] of Object.entries(fields)) {
    if (Array.isArray(v)) {
      lines.push(`${k}:`)
      v.forEach((i) => lines.push(`  - "${i}"`))
    } else if (typeof v === 'string') {
      lines.push(`${k}: "${v.replace(/"/g, "'")}"`)
    } else {
      lines.push(`${k}: ${v}`)
    }
  }
  lines.push('---')
  return lines.join('\n')
}

function processFile(filePath, category, dateStr) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = parseFrontmatter(raw)

  if (!data.is_public) return null

  const filename = path.basename(filePath)
  const slug = slugify(filename)
  const title = extractTitle(content) ?? slug.replace(/-/g, ' ')
  const description = extractDescription(content)
  const tag = FOLDER_TO_TAG[category] ?? category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const cleanContent = sanitizeForMdx(content)
    // remove the H1 (already used as title)
    .replace(/^#\s+.+\n?/m, '')
    .trimStart()

  const fm = buildFrontmatter({
    title,
    description,
    date: dateStr,
    tags: [tag],
    published: true,
    draft: false,
    ...(data.wp_id ? { wp_id: data.wp_id } : {}),
  })

  return { slug, content: `${fm}\n\n${cleanContent}` }
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source dir not found: ${SOURCE_DIR}`)
    process.exit(1)
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })

  // Clean existing synced files
  if (fs.existsSync(OUT_DIR)) {
    for (const f of fs.readdirSync(OUT_DIR)) {
      if (f.endsWith('.mdx') || f.endsWith('.md')) {
        fs.unlinkSync(path.join(OUT_DIR, f))
      }
    }
  }

  const today = new Date().toISOString().split('T')[0]
  let synced = 0
  let skipped = 0

  const categories = fs.readdirSync(SOURCE_DIR).filter((name) => {
    const full = path.join(SOURCE_DIR, name)
    return fs.statSync(full).isDirectory() && !SKIP_DIRS.has(name) && !name.startsWith('.')
  })

  for (const category of categories) {
    const catDir = path.join(SOURCE_DIR, category)
    const files = fs.readdirSync(catDir).filter((f) => /\.mdx?$/.test(f))

    for (const file of files) {
      const filePath = path.join(catDir, file)
      const result = processFile(filePath, category, today)
      if (!result) { skipped++; continue }

      const outPath = path.join(OUT_DIR, `${result.slug}.mdx`)
      fs.writeFileSync(outPath, result.content, 'utf-8')
      console.log(`✓ ${category}/${file} → ${result.slug}.mdx`)
      synced++
    }
  }

  console.log(`\nDone: ${synced} synced, ${skipped} skipped (not public)`)
}

main()
