import { LineString, FeatureCollection } from "geojson"
import {v4 as uuid} from "uuid"

// import the needed turf functions
import along from "@turf/along"
import length from "@turf/length"

import { PayloadAction } from "@reduxjs/toolkit";
import { DrawControlState, TreeLinesState } from "./treeLinesSlice";



export const updateDrawBufferReducer = (state: TreeLinesState, action: PayloadAction<FeatureCollection<LineString>>) => {
    // overwrite the buffer with the new buffer
    return {...state, drawBuffer: action.payload}
}

export const updateDrawStateReducer = (state: TreeLinesState, action: PayloadAction<DrawControlState>) => {
    // overwrite the draw state
    return {...state, draw: action.payload}
}


// define the Payload interface for addLineReducer
interface AddLinePayload {
    distance: number,
    type: string,
    age?: number
}

export const addLineReducer = (state: TreeLinesState, action: PayloadAction<AddLinePayload>) => {
    // get the current buffer
    const buffer = state.drawBuffer

    // add to the lines
    buffer.features.forEach(lineFeature => {
        // get the length of the line
        const len = length(lineFeature, {units: "meters"})

        // get the number of trees along the line to add
        const numTrees = Math.floor(len / action.payload.distance)

        // make sure mapbox assigned a unique id to the line
        const lineId = String(lineFeature.id) || uuid()

        // TODO: here we could add half of the rest of len - numTrees * distance as offset to the first tree
        // that would align the trees to the center of the line

        // create a TreeLocation for every tree needed along the line
        for (let i = 0; i < numTrees; i++) {
            // get the geometry of the tree
            const point = along(lineFeature, i * action.payload.distance, {units: "meters"})

            // set the properties of the point and push to the treeLocations
            state.treeLocations.features.push({
                ...point,
                properties: {
                    id: String(i),
                    treeLineId: lineId,
                    treeType: action.payload.type,
                    age: action.payload.age,
                }
            })
        }

        // push the line to the treeLines with some metadata
        state.treeLines.features.push({
            ...lineFeature,
            id: lineId,
            properties: {
                id: lineId,
                treeCount: numTrees,
            }
        })
    })

    // remove the buffer
    state.drawBuffer.features = []

    // disable edit mode
    state.draw = DrawControlState.OFF

    return state
}

export const removeLineReducer = (state: TreeLinesState, action: PayloadAction<string>) => {
    return state
}
