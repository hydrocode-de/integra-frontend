import { signal, computed } from "@preact/signals-react"
import { LngLatBounds } from "mapbox-gl"

export interface ViewState {
    longitude: number,
    latitude: number,
    zoom: number,
    bearing: number,
    pitch: number
}

export const viewState = signal<ViewState>({
    longitude: 7.83,
    latitude: 47,
    zoom: 9,
    bearing: 0,
    pitch: 0
})

export const mapBounds = signal<LngLatBounds | undefined>(undefined)

export const zoom = computed(() => viewState.value.zoom)

export const center = computed(() => {
    return {
        lng: viewState.value.longitude,
        lat: viewState.value.latitude
    }
})

// layers and their visibility
export const layerVisibility = signal<{[layerId: string]: "none" | "visible"}>({})