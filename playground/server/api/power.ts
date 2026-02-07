export default defineEventHandler(() => {
    return {
        month: Math.floor(Math.random() * 12) + 1,
        value: Math.random(),
    }
})
