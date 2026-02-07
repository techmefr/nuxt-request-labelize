import { describe, it, expect } from 'vitest'
import { resolveLabel } from '../src/runtime/utils'

describe('resolveLabel', () => {
    it('replaces {{path}} with url', () => {
        expect(resolveLabel('req-{{path}}', '/api/power')).toBe('req-/api/power')
    })

    it('replaces {{index}} with provided index', () => {
        expect(resolveLabel('req-{{index}}', '/api/test', 5)).toBe('req-5')
    })

    it('replaces both templates at once', () => {
        expect(resolveLabel('{{index}}-{{path}}', '/api/power', 3)).toBe('3-/api/power')
    })

    it('returns label as-is without templates', () => {
        expect(resolveLabel('my-label', '/api/test')).toBe('my-label')
    })

    it('leaves {{index}} untouched when no index provided', () => {
        expect(resolveLabel('req-{{index}}', '/api/test')).toBe('req-{{index}}')
    })

    it('handles multiple {{path}} occurrences', () => {
        expect(resolveLabel('{{path}}-{{path}}', '/api')).toBe('/api-/api')
    })

    it('handles multiple {{index}} occurrences', () => {
        expect(resolveLabel('{{index}}-{{index}}', '/api', 7)).toBe('7-7')
    })

    it('handles index zero', () => {
        expect(resolveLabel('item-{{index}}', '/api', 0)).toBe('item-0')
    })
})
