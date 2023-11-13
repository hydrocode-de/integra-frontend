import { signal, computed } from "@preact/signals-react"

export interface viewState {
    longitude: number,
    latitude: number,
    zoom: number,
    bearing: number,
    pitch: number
}

export const viewState = signal<viewState>({
    longitude: 7.83,
    latitude: 47,
    zoom: 9,
    bearing: 0,
    pitch: 0
})

export const zoom = computed(() => viewState.value.zoom)

export const center = computed(() => {
    return {
        lng: viewState.value.longitude,
        lat: viewState.value.latitude
    }
})