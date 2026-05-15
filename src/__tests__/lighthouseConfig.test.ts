import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const root = path.resolve(__dirname, '../../')

describe('Lighthouse CI 설정 파일', () => {
  describe('.lighthouserc.js', () => {
    const rcPath = path.join(root, '.lighthouserc.js')

    it('파일이 존재한다', () => {
      expect(fs.existsSync(rcPath)).toBe(true)
    })

    it('유효한 JS 모듈이다', () => {
      const config = require(rcPath)
      expect(config).toBeDefined()
      expect(typeof config).toBe('object')
    })

    it('ci.collect.url이 설정되어 있다', () => {
      const config = require(rcPath)
      expect(config.ci?.collect?.url).toBeDefined()
      expect(Array.isArray(config.ci.collect.url)).toBe(true)
    })

    it('ci.assert.assertions에 4개 카테고리 threshold가 있다', () => {
      const config = require(rcPath)
      const assertions = config.ci?.assert?.assertions
      expect(assertions).toBeDefined()
      expect(assertions['categories:performance']).toBeDefined()
      expect(assertions['categories:accessibility']).toBeDefined()
      expect(assertions['categories:best-practices']).toBeDefined()
      expect(assertions['categories:seo']).toBeDefined()
    })

    it('각 카테고리 threshold가 0.8 이상이다', () => {
      const config = require(rcPath)
      const assertions = config.ci.assert.assertions
      const categories = [
        'categories:performance',
        'categories:accessibility',
        'categories:best-practices',
        'categories:seo',
      ]
      categories.forEach((cat) => {
        const [, minScore] = assertions[cat]
        expect(minScore.minScore).toBeGreaterThanOrEqual(0.8)
      })
    })
  })

  describe('.github/workflows/lighthouse-ci.yml', () => {
    const wfPath = path.join(root, '.github/workflows/lighthouse-ci.yml')

    it('파일이 존재한다', () => {
      expect(fs.existsSync(wfPath)).toBe(true)
    })

    it('유효한 YAML이다', () => {
      const content = fs.readFileSync(wfPath, 'utf8')
      expect(() => yaml.load(content)).not.toThrow()
    })

    it('push와 pull_request 트리거가 있다', () => {
      const content = fs.readFileSync(wfPath, 'utf8')
      const wf = yaml.load(content) as any
      expect(wf.on.push).toBeDefined()
      expect(wf.on.pull_request).toBeDefined()
    })

    it('lhci autorun 스텝이 있다', () => {
      const content = fs.readFileSync(wfPath, 'utf8')
      expect(content).toContain('lhci autorun')
    })

    it('next build 스텝이 있다', () => {
      const content = fs.readFileSync(wfPath, 'utf8')
      expect(content).toContain('next build')
    })
  })
})
