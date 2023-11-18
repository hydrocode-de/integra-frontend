import { signal, computed, effect } from "@preact/signals-react"
import { referenceFeature } from "./statisticsSignals"

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

export const zoom = computed(() => viewState.value.zoom)

export const center = computed(() => {
    return {
        lng: viewState.value.longitude,
        lat: viewState.value.latitude
    }
})

// layers and their visibility
export const layerVisibility = signal<{[layerId: string]: "none" | "visible"}>({})

// add effects for aout-disabling layers
effect(() => {
    if (!referenceFeature.value) {
        const { referenceArea, ...others } = layerVisibility.peek()
        layerVisibility.value = others 
    }
    // otherwise if it did not exist before, add it
    else if (!Object.keys(layerVisibility.peek()).includes("referenceArea")) {
        layerVisibility.value = {
            ...layerVisibility.peek(),
            referenceArea: "visible"
        }
    }
})