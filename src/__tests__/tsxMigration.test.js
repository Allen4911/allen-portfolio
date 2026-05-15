const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const glob = require('glob')

const SRC = path.join(__dirname, '../..')

describe('TypeScript migration', () => {
  test('no .jsx files remain in src/ (all migrated to .tsx)', () => {
    const jsxFiles = glob.sync('src/**/*.jsx', { cwd: SRC })
    expect(jsxFiles).toEqual([])
  })

  test('no .js files remain in src/ (excluding __tests__)', () => {
    const jsFiles = glob.sync('src/**/*.js', { cwd: SRC, ignore: ['src/__tests__/**'] })
    expect(jsFiles).toEqual([])
  })

  test('npx tsc --noEmit passes with zero errors', () => {
    let output = ''
    try {
      output = execSync('npx tsc --noEmit 2>&1', { cwd: SRC, encoding: 'utf8' })
    } catch (e) {
      output = e.stdout || e.message
    }
    const errorLines = output.split('\n').filter(l => /error TS/.test(l))
    expect(errorLines).toEqual([])
  })
})
