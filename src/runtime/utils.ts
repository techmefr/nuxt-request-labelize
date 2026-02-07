export function resolveLabel(template: string, url: string, index?: number): string {
    let result = template

    if (index !== undefined) {
        result = result.replace(/\{\{index\}\}/g, String(index))
    }

    return result.replace(/\{\{path\}\}/g, url)
}
