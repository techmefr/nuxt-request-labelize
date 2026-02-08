export default defineEventHandler(async event => {
    const body = await readBody(event)
    return {
        month: body?.month ?? Math.floor(Math.random() * 12) + 1,
        value: Math.random(),
    }
})
