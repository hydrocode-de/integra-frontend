import { LineString, FeatureCollection } from "geojson"
import {v4 as uuid} from "uuid"

// import the needed turf functions
import along from "@turf/along"
import length from "@turf/length"
import bbox from "@turf/bbox"

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
    spacing: number,
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
        const spacing = action.payload.spacing

        // get the length of the line
        const len = length(lineFeature, {units: "meters"})

        // get the number of trees along the line to add
        const numTrees = Math.floor(len / spacing)

        // make sure mapbox assigned a unique id to the line
        const lineId = String(lineFeature.id) || uuid()

        // Add half of the rest of len - numTrees * distance as offset to the first tree
        // to align the trees to the center of the line if needed
        const offset = action.payload.centerOnLine ? (len - numTrees * spacing) / 2 : 0

        // create a TreeLocation for every tree needed along the line
        for (let i = 0; i <= numTrees; i++) {
            // get the geometry of the tree
            const point = along(lineFeature, (i * spacing)  + offset, {units: "meters"})

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
    const lineId = action.payload

    // to remove the line, the bbox of the remaining features needs to be re-calculated
    const newLines = {
        ...state.treeLines,
        features: state.treeLines.features.filter(feature => feature.id !== lineId)
    }
    if (newLines.features.length > 0) {
        newLines.bbox = bbox(newLines)
    }
    
    // filter out the tree location that belong to the line
    const newLocations = {
        ...state.treeLocations,
        features: state.treeLocations.features.filter(tree => tree.properties.treeLineId !== lineId)
    }
    if (newLocations.features.length > 0) {
        newLocations.bbox = bbox(newLocations)
    }

    return {
        ...state,
        treeLines: newLines,
        treeLocations: newLocations
    }
}

export const lineToDrawReducer = (state: TreeLinesState, action: PayloadAction<string>) => {
    // find the correct line feature
    const lineFeature = state.treeLines.features.find(feature => feature.id === action.payload)

    if (lineFeature) {
        // add the current line Feature back to the draw buffer
        state.drawBuffer.features.push(lineFeature)
    }

    return state
    // finally call the reducer to remove the line and treeLocations and re-calculate the bbox
    //return removeLineReducer(state, action)
}
