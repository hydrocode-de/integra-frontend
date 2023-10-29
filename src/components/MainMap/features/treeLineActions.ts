import { LineString, FeatureCollection } from "geojson"

import { PayloadAction } from "@reduxjs/toolkit";
import { TreeLinesState } from "./treeLinesSlice";



export const updateDrawBufferReducer = (state: TreeLinesState, action: PayloadAction<FeatureCollection<LineString>>) => {
    // overwrite the buffer with the new buffer
    return {...state, drawBuffer: action.payload}
}



// define the Payload interface for addLineReducer
interface AddLinePayload {
    features?: any[]
}

export const addLineReducer = (state: TreeLinesState, action: PayloadAction<AddLinePayload>) => {
    // get the current buffer
    const buffer = state.drawBuffer

    // add to the lines
    buffer.features.forEach(f => {
        state.treeLines.features.push({...f, properties: {id: "foo", treeCount: 0}})
    })

    // remove the buffer
    state.drawBuffer.features = []

    return state
}

export const removeLineReducer = (state: TreeLinesState, action: PayloadAction<string>) => {
    return state
}
