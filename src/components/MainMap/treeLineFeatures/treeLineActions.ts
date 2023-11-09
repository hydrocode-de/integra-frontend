import { LineString, FeatureCollection } from "geojson"
import {v4 as uuid} from "uuid"

// import the needed turf functions
import along from "@turf/along"
import length from "@turf/length"
import bbox from "@turf/bbox"

import { PayloadAction } from "@reduxjs/toolkit";
import { DrawControlState, TreeEditSettings, TreeLinesState } from "./treeLinesSlice";



export const updateDrawBufferReducer = (state: TreeLinesState, action: PayloadAction<FeatureCollection<LineString>>) => {
    // overwrite the buffer with the new buffer
    return {...state, drawBuffer: action.payload}
}

export const updateDrawStateReducer = (state: TreeLinesState, action: PayloadAction<DrawControlState>) => {
    // overwrite the draw state
    return {...state, draw: action.payload}
}

export const addLineReducer = (state: TreeLinesState) => {
    // get the current buffer
    const buffer = state.drawBuffer

    // get the last edit settings
    const { spacing, treeType, width, centerOnLine } = state.lastEditSettings

    // add to the lines
    buffer.features.forEach(lineFeature => {
        // get the length of the line
        const len = length(lineFeature, {units: "meters"})

        // get the number of trees along the line to add
        const numTrees = Math.floor(len / spacing)

        // make sure mapbox assigned a unique id to the line
        const lineId = String(lineFeature.id) || uuid()

        // Add half of the rest of len - numTrees * distance as offset to the first tree
        // to align the trees to the center of the line if needed
        const offset = centerOnLine ? (len - numTrees * spacing) / 2 : 0

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
                    treeType: treeType
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
                width,
                length: len,
                treeType,
                editSettings: {treeType, spacing, width, centerOnLine}
            }
        })
    })

    // remove the buffer
    state.drawBuffer.features = []

    // disable edit mode
    state.draw = DrawControlState.OFF

    return state
}

export const updateTreeGeometryReducer = (state: TreeLinesState, action: PayloadAction<{treeId: string, spacing?: number, centerOnLine?: boolean}>) => {
    // get the geometry of the selected tree line
    const treeLine = state.treeLines.features.find(line => line.properties.id === action.payload.treeId)
    if (!treeLine) return state  // an error is needed here...

    // get the original settings - this is technically unnecessary,
    // but makes the code more readable, as we do not need to access the full state path all the time
    const settings = treeLine.properties.editSettings

    // update with the new spacing or centerOnLine settings
    if (action.payload.spacing && action.payload.spacing !== settings.spacing) {
        // update in the current settings
        settings.spacing = action.payload.spacing

        // and remember the settings
        state.lastEditSettings.spacing = action.payload.spacing
    }
    if (action.payload.centerOnLine !== undefined && action.payload.centerOnLine !== settings.centerOnLine) {
        // update in the current settings
        settings.centerOnLine = action.payload.centerOnLine

        // and remember the settings
        state.lastEditSettings.centerOnLine = action.payload.centerOnLine
    }
    // if both did not change, return the current state
    if (!action.payload.spacing && action.payload.centerOnLine === undefined) return state

    // remove all tree locations that belong to the tree line
    const newTreeLocations = state.treeLocations.features.filter(tree => tree.properties.treeLineId !== action.payload.treeId)

    // calculate the new tree amount
    const len = length(treeLine, {units: 'meters'})
    const numTrees = Math.floor(len / settings.spacing)
    const offset = settings.centerOnLine ? (len - numTrees * settings.spacing) / 2 : 0

    // add the new tree locations using the new spacing
    for (let i = 0; i <= numTrees; i++) {
        const newPoint = along(treeLine, (i * settings.spacing) + offset, {units: 'meters'})

        // add to new tree locations
        newTreeLocations.push({
            ...newPoint,
            properties: {
                id: String(i),
                treeLineId: action.payload.treeId,
                treeType: settings.treeType
            }
        })
    }

    // update the state for the new Locations
    state.treeLocations.features = [...newTreeLocations]

    // update the treeLine itself
    const idx = state.treeLines.features.findIndex(f => f.properties.id === action.payload.treeId)
    state.treeLines.features[idx] = {
        ...treeLine,
        properties: {
            ...treeLine.properties,
            editSettings: settings,
            treeCount: numTrees,
            length: len
        }
    }

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

export const updateLastEditSettingsReducer = (state: TreeLinesState, action: PayloadAction<Partial<TreeEditSettings>>) => {
    // update the last edit settings
    return {
        ...state,
        lastEditSettings: {
            ...state.lastEditSettings,
            ...action.payload
        }
    }
}