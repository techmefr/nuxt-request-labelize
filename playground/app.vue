<template>
    <div style="max-width: 800px; margin: 40px auto; font-family: system-ui, sans-serif">
        <h1>nuxt-request-labelize</h1>
        <p>Ouvre DevTools &gt; Network pour voir les headers X-Request-Label</p>

        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px">
            <button @click="fetchSimple">
                $fetch simple → label "power-global"
            </button>
            <button @click="fetchWithUseFetch">
                useFetch → label "notes-list"
            </button>
            <button @click="fetchLoop">
                Boucle $fetch x5 → labels "power-1" a "power-5"
            </button>
            <button @click="fetchNative">
                fetch natif → label "native-test"
            </button>
        </div>

        <pre
            v-if="result"
            style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px; overflow: auto"
        >{{ result }}</pre>
    </div>
</template>

<script setup lang="ts">
const result = ref('')

async function fetchSimple(): Promise<void> {
    try {
        const data = await $fetch('/api/power/global', {
            requestLabel: 'power-global',
        })
        result.value = JSON.stringify(data, null, 2)
    } catch (error) {
        result.value = `Erreur: ${String(error)}`
    }
}

async function fetchWithUseFetch(): Promise<void> {
    try {
        const { data } = await useFetch('/api/notes', {
            requestLabel: 'notes-list',
        })
        result.value = JSON.stringify(data.value, null, 2)
    } catch (error) {
        result.value = `Erreur: ${String(error)}`
    }
}

async function fetchLoop(): Promise<void> {
    try {
        const results = []
        for (let i = 1; i <= 5; i++) {
            const data = await $fetch(`/api/power/2026-0${i}`, {
                requestLabel: 'power-{{index}}-{{path}}',
                index: i,
            })
            results.push(data)
        }
        result.value = JSON.stringify(results, null, 2)
    } catch (error) {
        result.value = `Erreur: ${String(error)}`
    }
}

async function fetchNative(): Promise<void> {
    try {
        const response = await fetch('/api/notes', {
            requestLabel: 'native-test',
        })
        const data = await response.json()
        result.value = JSON.stringify(data, null, 2)
    } catch (error) {
        result.value = `Erreur: ${String(error)}`
    }
}
</script>
