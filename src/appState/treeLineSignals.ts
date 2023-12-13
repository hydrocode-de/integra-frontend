import { signal, computed, batch } from "@preact/signals-react"
import { nanoid } from "nanoid"

// some GIS functions
import bbox from "@turf/bbox"
import length from "@turf/length"
import along from "@turf/along"

import { DrawBuffer, DrawState, TreeEditSettings, TreeLine, TreeLocation } from "./treeLine.model"
import { loadClosestDataPoint } from "./backendSignals"
import lineIntersect from "@turf/line-intersect"
import buffer from "@turf/buffer"
import pointsWithinPolygon from "@turf/points-within-polygon"

// make the last edit settings publicly available
export const lastEditSettings = signal<TreeEditSettings>({
    spacing: 12,
    treeType: "Bergahorn",
    width: 5,
    centerOnLine: true,
    age: 1
})

// main signal to hold the drawBuffer
export const drawBuffer = signal<DrawBuffer["features"]>([])

// add a signal for draw state
export const drawState = signal<DrawState>(DrawState.OFF)

// main signal to hold the treeLine data
const rawTreeLineFeatures = signal<TreeLine["features"]>([])
export const readOnlyRawTreeLineFeatures = computed(() => rawTreeLineFeatures.value)
export const hasData = computed<boolean>(() => rawTreeLineFeatures.value.length > 0)

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
const allTreeLocationFeatures = computed<TreeLocation["features"]>(() => {
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
            // calculate a new point
            const newPoint = along(treeLine, (i * settings.spacing) + offset, {units: "meters"})

            // load the closes TreeDataPoint. We need to spread this into a new object to not overwrite the
            // actual tree age by the 'age' marking the TreeDataPoint
            const {age, ...data} = loadClosestDataPoint(settings.treeType, settings.age)
            // add to the new tree locations
            trees.push({
                ...newPoint,
                properties: {
                    id: nanoid(12),
                    treeLineId: treeLine.properties.id,
                    treeType: settings.treeType,

                    // spread everything here, but use the age from the !settings!
                    ...data,
                    age: settings.age
                }
            })
        }
        return trees
    })
})

// always calculate crossing points if any
const crossingPoints = computed(() => {
    return rawTreeLineFeatures.value.flatMap((line1, i) => {
        // for each index, return the right part from the current index to combine only once
        return rawTreeLineFeatures.peek().slice(i + 1)
        // map the lineIntersect across all combinations
        .map(line2 =>  {
            // get the intersection collection
            const collection = lineIntersect(line1, line2)

            // return the features, but preseve the treeLineIds
            return collection.features.map(f => {
                return {...f, properties: {...f.properties, treeLineIds: [line1.properties.id, line2.properties.id]}}
            })
        // flatMap the FeatureCollection.features into a single array
        })
    }).flat()
})
    

// combine all calculated potiential tree locations bufferaround the current crossing points 
// for each treeline. Filter out points within that buffer and keep only the oldest tree
// to speed things up, we peek all structures, except the crossingPoints
export const nonOverlappingTreeLocations = computed(() => {
    // checkout all crossing points 
    const cross = crossingPoints.value
    // console.log(cross)
    
    // this is wild. But it is actually a pretty complex task to let the crossing points
    // only affect the trees on the respective lines, while respecting two different spacings
    const removeTrees = rawTreeLineFeatures.peek().flatMap(line => {
        // check if any crossing point exists for this line
        const myCrossings = cross.filter(c => c.properties.treeLineIds.includes(line.properties.id))

        // buffer each crossing point with my spacing and keep the oldest tree
        const buffers = myCrossings.map(point => {
            return {
                ...buffer(point, line.properties.editSettings.spacing / 2, {units: "meters"}),
                properties: {
                    treeLineIds: point.properties.treeLineIds
                }

            }
        })
        // console.log(buffers)

        // for each buffer, make sure to find all trees for this line 
        return buffers.map(buf => {
            // find all points across all lines in the buffer to determine the oldest tree
            const allPointsInBuffer = pointsWithinPolygon({type: "FeatureCollection", features: allTreeLocationFeatures.peek()}, buf).features
            // console.log(allPointsInBuffer)
            // find the oldest
            const keepTree = allPointsInBuffer.reduce((prev, curr) => curr.properties.age! > prev.properties.age! ? curr : prev)
            // console.log(keepTree)
            // reomve all trees from my line, that are in the buffer and not the oldest
            return allPointsInBuffer
                .filter(tree => tree.properties.treeLineId === line.properties.id && tree.properties.id !== keepTree.properties.id)
                .map(tree => String(tree.properties.id))
        }).flat()
    })
    // console.log(removeTrees)
    // now we know which trees to remove and can return a peeked filtered version of allTreeLocationFeatures
    return allTreeLocationFeatures.peek().filter(tree => !removeTrees.includes(String(tree.properties.id)))
})

// If we want to disable the non-overlap feature, we can build a logic here, that uses allTreeLocationFeatures
// sort the nonOverlappingTreeLocationFeatures that currently exist and the ones that will be tere in the future
export const treeLocationFeatures = computed<TreeLocation["features"]>(() => nonOverlappingTreeLocations.value.filter(tree => tree.properties.age! > 0))
const futureLocationFeatures = computed<TreeLocation["features"]>(() => nonOverlappingTreeLocations.value.filter(tree => tree.properties.age! <= 0))

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

// export the futureLocations as a valid geoJSON
export const futureTreeLocations = computed<TreeLocation>(() => {
    return {
        type: "FeatureCollection",
        features: futureLocationFeatures.value
    }
})

// add some actions

/**
 * The addTreeLine function is the only way to append to treeLineFeatures
 * - this is necessary (instead of treeLine.value.features) to make sure that
 * all needed properties are created sufficiently
 */
export const addTreeLine = (options?: Partial<TreeEditSettings>): String[] => {
    // get the number of current treeLines
    const numTreeLines = rawTreeLineFeatures.peek().length

    // new treeLines
    const newTreeLine: TreeLine["features"] = drawBuffer.peek().map((line, index) => {
        // generate a id
        const lineId = String(line.id) || nanoid(12)

        // the next name:
        const name = `Pflanzreihe ${numTreeLines + index + 1}`

        return {
            ...line,
            id: lineId,
            properties: {
                id: lineId,
                name,
                treeCount: 0,
                editSettings: {
                    ...lastEditSettings.peek(),
                    ...options
                }
            }
        }
    })

    // empty the drawBuffer
    drawBuffer.value = []

    // add to the rawTreeLineFeatures
    rawTreeLineFeatures.value = [...rawTreeLineFeatures.value, ...newTreeLine]

    // return a list of added treeLines
        return newTreeLine.map(line => String(line.id))
}

/**
 * Although the rawTreeLineFeatures could be sliced directly in the Component, we made the
 * rawTreeLineFeatures private to make sure that the treeLineFeatures are updated correctly.
 * This is important as all other treeLine signals depend on the rawTreeLineFeatures.
 * @param treeId - The ID of the tree line to be removed.
 */
export const removeTreeLine = (treeId: string) => {
    // filter the treeLineFeatures
    const newTreeLineFeatures = rawTreeLineFeatures.peek().filter(line => line.properties.id !== treeId)

    // update the rawTreeLineFeatures
    rawTreeLineFeatures.value = newTreeLineFeatures
}

/**
 * Moves a tree line from the rawTreeLineFeatures to the drawBuffer.
 *
 * @param treeId - The ID of the tree line to be moved.
 *
 * This function performs the following steps:
 * 1. Finds the tree line in the rawTreeLineFeatures that matches the provided treeId.
 * 2. If the tree line is not found, the function returns immediately.
 * 3. Filters the rawTreeLineFeatures to remove the tree line that matches the provided treeId.
 * 4. In a batch operation, it updates the rawTreeLineFeatures with the new list that doesn't include the tree line with the provided treeId, and adds the tree line to the drawBuffer.
 */
export const moveTreeLineToDrawBuffer = (treeId: string) => {
    // find the correct treeLine
    const treeLine = rawTreeLineFeatures.peek().find(line => line.properties.id === treeId)
    if (!treeLine) return

    // filter the rawTreeLineFeatures
    const newRawFeatures = rawTreeLineFeatures.peek().filter(line => line.properties.id !== treeId)

    // in a batch, remove the treeLine and add it to the drawBuffer
    batch(() => {
        rawTreeLineFeatures.value = newRawFeatures
        drawBuffer.value = [...drawBuffer.peek(), treeLine]
        drawState.value = DrawState.EDIT
    })
}

/**
 * Update the edit settings of an individual tree line.
 * This does also update the last edit settings as this was an edit incident.
 * Alternatively, the updateAllLinesAges can be used, which is applied to all tree lines
 * and bypasses the lastEditSettings, as this is an simulation incident.
 * @param treeId - The ID of the tree line to be updated.
 * @param settings - The settings to be updated.
 */
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

/**
 * Updates the age of all tree lines by a specified amount.
 *
 * @param ageChange - The change in age to be applied to all tree lines.
 *
 * This function performs the following steps:
 * 1. Retrieves the current state of the rawTreeLineFeatures.
 * 2. Maps over each tree line in the rawTreeLineFeatures.
 * 3. For each tree line, it creates a new object that is a copy of the original tree line, but with the `age` property of the `editSettings` updated by the specified `ageChange`.
 * 4. The result is a new array of tree lines with updated ages, which is then used to update the state of the rawTreeLineFeatures.
 */
export const updateAllLineAges = (ageChange: number) => {
    // new rawTreeLineFeatures
    const newRawFeatures = rawTreeLineFeatures.peek().map(line => {
        return {
            ...line,
            properties: {
                ...line.properties,
                editSettings: {
                    ...line.properties.editSettings,
                    age: line.properties.editSettings.age + ageChange
                }
            }
        }
    })

    // update
    rawTreeLineFeatures.value = newRawFeatures
}

/**
 * This function is used to directly manipulate the rawTreeLineFeatures.
 * USE THIS WITH CAUTION - this does not invoke addTreeLine and the caller
 * needs to make sure, that the rawTreeLineFeatures are valid.
 */
export const emitValidatedRawTreeLines = (lines: TreeLine["features"]) => rawTreeLineFeatures.value = lines