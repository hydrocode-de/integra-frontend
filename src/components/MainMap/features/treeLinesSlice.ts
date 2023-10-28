import { FeatureCollection, LineString, Point } from "geojson"
import { createSlice } from "@reduxjs/toolkit"

// define the properties of a TreeLine
interface TreeLineProperties {
    id: string,
    treeCount: number
}

// define the interface for user created tree lines
type TreeLine = FeatureCollection<LineString, TreeLineProperties>

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
interface TreeLinesState {
    treeLines: TreeLine,
    treeLocations: TreeLocation
}

// define the initial state
const initialState: TreeLinesState = {
    treeLines: {type: "FeatureCollection", features: []},
    treeLocations: {type: "FeatureCollection", features: []}
}

// create the slice
export const treeLinesSlice = createSlice({
    name: 'treeLines',
    initialState,
    reducers: {
        addLine: () => {},
        removeLine: () => {}
    }
})

// export the actions
export const { addLine, removeLine } = treeLinesSlice.actions

export default treeLinesSlice.reducer