import { FeatureCollection, LineString, Point } from "geojson"

// specify the settings that can be used to edit a tree line
export interface TreeEditSettings {
    spacing: number,
    treeType: string,
    width: number,
    centerOnLine: boolean,
    height: number
}

// define the properties of a TreeLine
interface TreeLineProperties {
    id: string,
    treeCount: number,
    length?: number,
    editSettings: TreeEditSettings
}

// define the interface for user-created treeLines
export type TreeLine = FeatureCollection<LineString, TreeLineProperties>

// define the properties of a single Tree
export interface TreeLocationProperties {
    id: string,
    treeLineId?: string,
    treeType: string,
    height: number,
    diameter?: number,
    age?: number,
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
