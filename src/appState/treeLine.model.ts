import { FeatureCollection, LineString, Point } from "geojson"
import { TreeDataPoint } from "./backendSignals"

// specify the settings that can be used to edit a tree line
export interface TreeEditSettings {
    spacing: number,
    treeType: string,
    width: number,
    centerOnLine: boolean
    age: number
}

// define the properties of a TreeLine
interface TreeLineProperties {
    id: string,
    name: string,
    treeCount: number,
    length?: number,
    editSettings: TreeEditSettings
}

// define the interface for user-created treeLines
export type TreeLine = FeatureCollection<LineString, TreeLineProperties>

// define the properties of a single Tree
// TODO: is there a scenario, where the Data Properties are not partial?
export interface TreeLocationProperties extends Partial<TreeDataPoint> {
    id: string,
    treeLineId?: string,
    treeType: string,
    treeShape: string
}

// define the interface for user-created tree locations
export type TreeLocation = FeatureCollection<Point, TreeLocationProperties>

// define the buffer for the draw control
export type DrawBuffer = FeatureCollection<LineString>

// export an enum for draw state
export enum DrawState {
    OFF = "off",
    LINE = "line",
    EDIT = "edit"
}
