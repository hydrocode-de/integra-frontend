import { createSlice } from "@reduxjs/toolkit"
import { updateViewportAction } from "./mapActions"

// define an interface for the map
export interface MapState {
    longitude: number,
    latitude: number,
    zoom: number,
    pitch: number,
    bearing: number
}

// define the initial state
const initialState: MapState = {
    longitude: 7.83,
    latitude: 48.0,
    zoom: 9,
    pitch: 0,
    bearing: 0
}

// create the slice
export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        updateViewport: updateViewportAction
    }
})

// export the actions
export const { updateViewport } = mapSlice.actions

// export the slice
export default mapSlice.reducer

