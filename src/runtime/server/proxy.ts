import { defineEventHandler, getQuery, getRequestURL, proxyRequest, createError } from 'h3'

export default defineEventHandler(event => {
    const { _target } = getQuery(event)

    if (!_target || typeof _target !== 'string') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing _target query parameter',
        })
    }

    const origin = getRequestURL(event).origin
    return proxyRequest(event, `${origin}${_target}`)
})
