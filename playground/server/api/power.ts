export default defineEventHandler(event => {
    const { month } = getQuery(event)
    return {
        month: month ? Number(month) : Math.floor(Math.random() * 12) + 1,
        value: Math.random(),
    }
})
