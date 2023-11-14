import { computed, signal } from "@preact/signals-react"

export const tooltipCenter = signal<[number, number] | null>(null)
export const tooltipContent = signal<any>(<i>no info</i>)

export const tooltip = computed(() => {
    return {
        center: tooltipCenter.value,
        content: tooltipContent.value
    }
})