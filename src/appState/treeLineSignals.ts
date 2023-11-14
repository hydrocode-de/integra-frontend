import { signal, computed } from "@preact/signals-react"
import { v4 } from "uuid"

// some GIS functions
import bbox from "@turf/bbox"
import length from "@turf/length"
import along from "@turf/along"

import { DrawBuffer, DrawState, TreeEditSettings, TreeLine, TreeLocation } from "./treeLine.model"

// make the last edit settings publicly available
export const lastEditSettings = signal<TreeEditSettings>({
    spacing: 12,
    treeType: "birch",
    width: 5,
    centerOnLine: true,
    height: 1
})

// main signal to hold the drawBuffer
export const drawBuffer = signal<DrawBuffer["features"]>([])

// add a signal for draw state
export const drawState = signal<DrawState>(DrawState.OFF)

// main signal to hold the treeLine data
const rawTreeLineFeatures = signal<TreeLine["features"]>([])

// we need the treeLineFeatues twice, as some of the attributes depend on the treeLocation
// which is a circular dependency that cannot be resolved otherwise
const treeLineFeatures = computed<TreeLine["features"]>(() => {
    return rawTreeLineFeatures.value.map(treeLine => {
        return {
            ...treeLine,
            properties: {
                ...treeLine.properties,
                length: length(treeLine, {units: "meters"}),
                treeCount: treeLocationFeatures.value.filter(tree => tree.properties.treeLineId === treeLine.properties.id).length
            }
        }
    })
})

// export the current bbox and hull of the tree Line features
export const treeLineBbox = computed(() => bbox({type: "FeatureCollection", features: rawTreeLineFeatures.value}))

// compute the geoJSON Feature Collection from that
export const treeLines = computed<TreeLine>(() => {
    // return the feature collection
    return {
        type: "FeatureCollection",
        features: treeLineFeatures.value,
        bbox: treeLineBbox.value
    }
})


// create the treeLocations as a computed signal
const treeLocationFeatures = computed<TreeLocation["features"]>(() => {
    // map all features in treeLineFeatures to an array of treeLocations
    return rawTreeLineFeatures.value.flatMap(treeLine => {
        // get the current edit settings for this treeLine
        const settings = treeLine.properties.editSettings

        // get the length of this treeLine
        const len = length(treeLine, {units: "meters"})

        // calculate the number of trees and the offset
        const numTrees = Math.floor(len / settings.spacing)
        const offset = settings.centerOnLine ? (len - numTrees * settings.spacing) / 2 : 0

        // build the new locations
        const trees: TreeLocation["features"] = []
        for (let i = 0; i <= numTrees; i++) {
            const newPoint = along(treeLine, (i * settings.spacing) + offset, {units: "meters"})

            // add to the new tree locations
            trees.push({
                ...newPoint,
                properties: {
                    id: String(i),
                    treeLineId: treeLine.properties.id,
                    treeType: settings.treeType,
                    height: settings.height
                }
            })
        }
        return trees
    })
})

// export the treeLocations as a valid geoJSON
export const treeLocations = computed<TreeLocation>(() => {
    // calculate the bounding box of all trees
    // const treeBbox = bbox(treeLocationFeatures.value)
    
    return {
        type: "FeatureCollection",
        features: treeLocationFeatures.value,
        //bbox: treeBbox
    }
})

// add some actions

/**
 * The addTreeLine function is the only way to append to treeLineFeatures
 * - this is necessary (instead of treeLine.value.features) to make sure that
 * all needed properties are created sufficiently
 */
export const addTreeLine = () => {
    // new treeLines
    const newTreeLine: TreeLine["features"] = drawBuffer.peek().map(line => {
        // generate a id
        const lineId = String(line.id) || v4()

        return {
            ...line,
            id: lineId,
            properties: {
                id: lineId,
                treeCount: 0,
                editSettings: {...lastEditSettings.peek()}
            }
        }
    })

    // empty the drawBuffer
    drawBuffer.value = []

    // add to the rawTreeLineFeatures
    rawTreeLineFeatures.value = [...rawTreeLineFeatures.value, ...newTreeLine]
}

export const updateEditSettings = (treeId: string, settings: Partial<TreeEditSettings>) => {
    // find the correct treeLine
    
    const newRawFeatures = rawTreeLineFeatures.peek().map(line => {
        if (line.properties.id === treeId) {
            return  {
                ...line,
                properties: {
                    ...line.properties,
                    editSettings: {
                        ...line.properties.editSettings,
                        ...settings   
                    }
                }
            }
        } else {
            return {...line}
        }
    })

    // update
    rawTreeLineFeatures.value = newRawFeatures

    // update the lastEditSettings
    lastEditSettings.value = {
        ...lastEditSettings.peek(),
        ...settings
    }
}