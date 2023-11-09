import { FeatureCollection, LineString, Point } from "geojson"

import { createSlice } from "@reduxjs/toolkit"
import { addLineReducer, lineToDrawReducer, removeLineReducer, updateDrawBufferReducer, updateDrawStateReducer, updateLastEditSettingsReducer, updateSpacingReducer } from "./treeLineActions"

// specify the settings that can be used to edit a tree line
export interface TreeEditSettings {
    spacing: number,
    treeType: string,
    width: number,
    centerOnLine: boolean
}

// define the properties of a TreeLine
interface TreeLineProperties {
    id: string,
    treeCount: number,
    width?: number,
    length?: number,
    editSettings: TreeEditSettings
}

// define the interface for user created tree lines
export type TreeLine = FeatureCollection<LineString, TreeLineProperties>

// deine the properties of a single Tree
interface TreeLocationProperties {
    id: string,
    treeLineId?: string,
    treeType: string,
    height?: number,
    diameter?: number,
    age?: number,
}

// define the interface for user created tree locations
type TreeLocation = FeatureCollection<Point, TreeLocationProperties>

// define the state for the draw control
export enum DrawControlState {
    OFF = "off",
    LINE = "line",
    EDIT_LINE = "edit_line",

    // the following should be removed in the future
    SELECT = "select",
    ADD_LINE = "add_line",
    TRASH = "trash"
}

// define the interface for the tree lines state
export interface TreeLinesState {
    draw: DrawControlState
    drawBuffer: FeatureCollection<LineString>,
    treeLines: TreeLine,
    treeLocations: TreeLocation,
    lastEditSettings: TreeEditSettings
}



// define the initial state
const initialState: TreeLinesState = {
    draw: DrawControlState.OFF,
    drawBuffer: {type: "FeatureCollection", features: []},
    treeLines: {type: "FeatureCollection", features: []},
    treeLocations: {type: "FeatureCollection", features: []},
    lastEditSettings: {
        spacing: 40,
        treeType: "birch",
        width: 5,
        centerOnLine: true
    }
}

// create the slice
export const treeLinesSlice = createSlice({
    name: 'treeLines',
    initialState,
    reducers: {
        updateDrawState: updateDrawStateReducer,
        updateDrawBuffer: updateDrawBufferReducer,
        addLineAction: addLineReducer,
        updateSpacingAction: updateSpacingReducer,
        removeLineAction: removeLineReducer,
        lineToDrawAction: lineToDrawReducer,
        updateLastEditSettings: updateLastEditSettingsReducer
    }
})

// export the actions
export const { updateDrawState, updateDrawBuffer, addLineAction, updateSpacingAction, removeLineAction, lineToDrawAction, updateLastEditSettings } = treeLinesSlice.actions

export default treeLinesSlice.reducer