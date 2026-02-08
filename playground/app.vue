<template>
    <div style="max-width: 900px; margin: 40px auto; font-family: system-ui, sans-serif">
        <h1>nuxt-request-labelize</h1>
        <p>Open DevTools &gt; Network &gt; filter Fetch/XHR and look at the Name column</p>

        <section style="margin-top: 32px">
            <h2>Without label</h2>
            <p>10 identical calls. In Network: "power" x10, impossible to tell apart.</p>
            <button style="padding: 10px 20px; font-size: 16px" @click="fetchWithoutLabels">
                10 calls WITHOUT label
            </button>
        </section>

        <section style="margin-top: 32px">
            <h2>With label</h2>
            <p>10 calls with requestLabel. In Network: "power-1", "power-2"... "power-10"</p>
            <button style="padding: 10px 20px; font-size: 16px" @click="fetchWithLabels">
                10 calls WITH label
            </button>
        </section>

        <pre
            v-if="result"
            style="
                margin-top: 24px;
                padding: 16px;
                background: #f5f5f5;
                border-radius: 8px;
                overflow: auto;
                max-height: 400px;
            "
        >{{ result }}</pre>
    </div>
</template>

<script setup lang="ts">
const CALL_COUNT = 10

const result = ref('')

async function fetchWithoutLabels(): Promise<void> {
    try {
        result.value = 'Firing 10 calls without labels...'
        const promises = Array.from({ length: CALL_COUNT }, (_, i) =>
            $fetch(`/api/power?month=${i + 1}`),
        )
        const data = await Promise.all(promises)
        result.value = `Network: 10x "power" identical\n\n${JSON.stringify(data, null, 2)}`
    } catch (error) {
        result.value = `Error: ${String(error)}`
    }
}

async function fetchWithLabels(): Promise<void> {
    try {
        result.value = 'Firing 10 calls with labels...'
        const promises = Array.from({ length: CALL_COUNT }, (_, i) =>
            $fetch(`/api/power?month=${i + 1}`, {
                requestLabel: 'power-{{index}}',
                index: i + 1,
            }),
        )
        const data = await Promise.all(promises)
        result.value = `Network: "power-1", "power-2"... "power-10"\n\n${JSON.stringify(data, null, 2)}`
    } catch (error) {
        result.value = `Error: ${String(error)}`
    }
}
</script>
