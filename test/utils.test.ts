import { describe, it, expect } from 'vitest'
import { resolveLabel, rewriteUrl } from '../src/runtime/utils'

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

    it('handles multiple occurrences', () => {
        expect(resolveLabel('{{path}}-{{path}}', '/api')).toBe('/api-/api')
    })

    it('handles index zero', () => {
        expect(resolveLabel('item-{{index}}', '/api', 0)).toBe('item-0')
    })
})

describe('rewriteUrl', () => {
    it('rewrites to __label path with encoded _target', () => {
        expect(rewriteUrl('/api/power', 'power-1')).toBe(
            '/api/__label/power-1?_target=%2Fapi%2Fpower',
        )
    })

    it('encodes query params in _target', () => {
        expect(rewriteUrl('/api/power?month=1', 'power-jan')).toBe(
            '/api/__label/power-jan?_target=%2Fapi%2Fpower%3Fmonth%3D1',
        )
    })

    it('preserves label in the path for Network tab display', () => {
        const result = rewriteUrl('/api/users', 'users-page-2')
        expect(result).toContain('/api/__label/users-page-2')
        expect(result).toContain('_target=%2Fapi%2Fusers')
    })

    it('does not modify the label string', () => {
        const result = rewriteUrl('/api/data', 'my-custom-label')
        expect(result.startsWith('/api/__label/my-custom-label?')).toBe(true)
    })

    it('handles url with multiple query params', () => {
        const result = rewriteUrl('/api/search?q=hello&page=2', 'search')
        expect(result).toBe('/api/__label/search?_target=%2Fapi%2Fsearch%3Fq%3Dhello%26page%3D2')
    })
})
