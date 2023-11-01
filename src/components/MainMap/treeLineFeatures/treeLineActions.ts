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
    age?: number,
    width?: number,
    centerOnLine?: boolean
}

export const addLineReducer = (state: TreeLinesState, action: PayloadAction<AddLinePayload>) => {
    // get the current buffer
    const buffer = state.drawBuffer

    // add to the lines
    buffer.features.forEach(lineFeature => {
        // get the defined distance between trees
        const distance = action.payload.distance

        // get the length of the line
        const len = length(lineFeature, {units: "meters"})

        // get the number of trees along the line to add
        const numTrees = Math.floor(len / distance)

        // make sure mapbox assigned a unique id to the line
        const lineId = String(lineFeature.id) || uuid()

        // Add half of the rest of len - numTrees * distance as offset to the first tree
        // to align the trees to the center of the line if needed
        const offset = action.payload.centerOnLine ? (len - numTrees * distance) / 2 : 0

        // create a TreeLocation for every tree needed along the line
        for (let i = 0; i <= numTrees; i++) {
            // get the geometry of the tree
            const point = along(lineFeature, (i * distance)  + offset, {units: "meters"})

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
                width: action.payload.width,
                length: len
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
