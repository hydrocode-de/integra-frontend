/**
 * This module collects all signals that are published as valid GeoJSON objects,
 * or arrays of GeoJSON.Feature objects
 * 
 * Putting these into an extra module should make it easier to understand how the
 * signals update each other, and which end up on the map.
 */

import { computed } from "@preact/signals-react"
import { CalculatedTreeLine, TreeLocation } from "./tree.model"
import {  rawTreeFeatures, treeFeatures } from "./treeLocationSignals"
import { calculatedTreeLineFeatures } from "./treeLineSignals"

// merge together with the single trees
export const treeLocationFeatures = computed<TreeLocation["features"]>(() => {
    // if there are more sources for tree locations, they can be added here
    return [
        ...treeFeatures.value
    ]
})

// only trees that are not yet planted
export const futureTreeFeatures = computed<TreeLocation["features"]>(() => {
    // filter rawTreeFeatures for trees which are not yet planted
    return rawTreeFeatures.value.filter(tree => tree.properties.age! <= 0)
})

// only trees that are already harvested
export const harvestedTreeFeatures = computed<TreeLocation["features"]>(() => {
    // filter rawTreeFeatures for trees which are already harvested
    return rawTreeFeatures.value.filter(
        tree => tree.properties.harvestAge && tree.properties.age! >= tree.properties.harvestAge
    )
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

// export the futureLocations as a valid geoJSON
export const futureTreeLocations = computed<TreeLocation>(() => {
    return {
        type: "FeatureCollection",
        features: [
            ...futureTreeFeatures.value
        ]
    }
})

// export the harvestedLocations as a valid geoJSON
export const harvestedTreeLocations = computed<TreeLocation>(() => {
    return {
        type: "FeatureCollection",
        features: [
            ...harvestedTreeFeatures.value
        ]
    }
})

export const calculatedTreeLines = computed<CalculatedTreeLine>(() => {
    return {
        type: 'FeatureCollection',
        features: calculatedTreeLineFeatures.value
    }
})

// Compile information about existing tree locations. They can result from a tree line or be single trees
export const hasData = computed<boolean>(() => {
    return treeLocationFeatures.value.length > 0
})
