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
export interface TreeLineProperties {
    id: string,
    width: number,
    name?: string,
}

// define the interface for user-created treeLines
export type TreeLine = FeatureCollection<LineString, TreeLineProperties>

// define the properties of a single Tree
// TODO: is there a scenario, where the Data Properties are not partial?
export interface TreeLocationProperties extends Partial<TreeDataPoint> {
    id: string,
    treeLineId?: string,
    treeType: string,
    icon_abbrev?: string
}

// define the interface for user-created tree locations
export type TreeLocation = FeatureCollection<Point, TreeLocationProperties>


interface CalculatedTreeLineProperties extends TreeLineProperties {
    treeCount?: number,
    lineLength?: number,
}

// define the type of a calculated tree line
export type CalculatedTreeLine = GeoJSON.FeatureCollection<GeoJSON.LineString, CalculatedTreeLineProperties>

export type TreeLineArea = GeoJSON.FeatureCollection<GeoJSON.Polygon, CalculatedTreeLineProperties>

export interface RawTreeLocation {
    id: string,
    location: {lat: number, lng: number},
    treeType: string,
    icon_abbrev?: string  
    treeLineId: string,
    age: number,
    harvestAge?: number
}
