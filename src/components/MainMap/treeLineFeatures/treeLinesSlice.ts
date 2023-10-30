import { FeatureCollection, LineString, Point, Feature } from "geojson"

import { createSlice } from "@reduxjs/toolkit"
import { addLineReducer, removeLineReducer, updateDrawBufferReducer } from "./treeLineActions"

// define the properties of a TreeLine
interface TreeLineProperties {
    id: string,
    treeCount: number
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


// define the interface for the tree lines state
export interface TreeLinesState {
    drawBuffer: FeatureCollection<LineString>,
    treeLines: TreeLine,
    treeLocations: TreeLocation
}

// define the initial state
const initialState: TreeLinesState = {
    drawBuffer: {type: "FeatureCollection", features: []},
    treeLines: {type: "FeatureCollection", features: []},
    treeLocations: {type: "FeatureCollection", features: []}
}

// create the slice
export const treeLinesSlice = createSlice({
    name: 'treeLines',
    initialState,
    reducers: {
        updateDrawBuffer: updateDrawBufferReducer,
        addLineAction: addLineReducer,
        removeLineAction: removeLineReducer
    }
})

// export the actions
export const { updateDrawBuffer, addLineAction, removeLineAction } = treeLinesSlice.actions

export default treeLinesSlice.reducer