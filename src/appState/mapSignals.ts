import { signal, computed } from "@preact/signals-react"
import { LngLatBounds } from "mapbox-gl"

const DEV_MODE = process.env.REACT_APP_DEV_MODE === "true"

export interface ViewState {
    longitude: number,
    latitude: number,
    zoom: number,
    bearing: number,
    pitch: number
}

export const viewState = signal<ViewState>({
    longitude: 10.4515,
    latitude: 51.1657,
    zoom: 6,
    bearing: 0,
    pitch: 0,
    // add the following settings only in development mode
    ...(DEV_MODE && {
        longitude: 7.83,
        latitude: 48,
        zoom: 12,
    })
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