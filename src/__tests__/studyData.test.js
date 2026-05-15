import studyData from '../../public/data/study.json'

describe('study.json data quality', () => {
  test('all entries have required fields', () => {
    const required = ['slug', 'title', 'category', 'date', 'readingTime', 'excerpt', 'content', 'tags']
    studyData.forEach(entry => {
      required.forEach(field => {
        expect(entry[field]).toBeTruthy()
      })
    })
  })

  test('no entry content contains wrong openclaw GitHub URL', () => {
    const violations = studyData
      .filter(e => e.content.includes('Allen4911/openclaw-claude-bridge'))
      .map(e => e.slug)
    expect(violations).toEqual([])
  })

  test('all entries have substantive content (1500+ chars)', () => {
    const thin = studyData
      .filter(e => e.content.length < 1500)
      .map(e => `${e.slug}(${e.content.length})`)
    expect(thin).toEqual([])
  })

  test('at least 3 entries cover AI or Claude topics', () => {
    const aiEntries = studyData.filter(e =>
      e.category === 'AI' ||
      (e.tags && e.tags.some(t => ['AI', 'Claude', 'Claude Code'].includes(t)))
    )
    expect(aiEntries.length).toBeGreaterThanOrEqual(3)
  })

  test('telecom entries have technical depth (code blocks)', () => {
    const telecomEntries = studyData.filter(e =>
      ['Telecom', '5G', 'LTE', 'Satellite', 'RF'].includes(e.category) ||
      (e.tags && e.tags.some(t => ['5G', 'LTE', '6G', 'Satellite', 'RFSoC', 'O-RAN'].includes(t)))
    )
    const missing = telecomEntries.filter(e => {
      const codeBlocks = (e.content.match(/```/g) || []).length / 2
      return codeBlocks < 1
    }).map(e => e.slug)
    expect(missing).toEqual([])
  })
})
