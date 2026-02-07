export default defineEventHandler(event => {
    const slug = getRouterParam(event, 'slug') || 'default'

    return {
        power: Math.round(Math.random() * 1000),
        period: slug,
    }
})
