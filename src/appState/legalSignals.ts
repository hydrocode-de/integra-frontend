import { computed } from "@preact/signals-react";
import { calculatedTreeLineFeatures, treeLineArea } from "./treeLineSignals";
import { referenceArea } from "./referenceAreaSignals";
import { area } from "@turf/turf";
import { treeLocationFeatures } from "./geoJsonSignals";

/**
 * Here, we implement the legal signal that are formulated as constraints.
 * The question of funding is further a collection of common or specific constraints.
 */
// the system needs at least 2 tree lines
export const numberOfTreeLines = computed<number>(() => calculatedTreeLineFeatures.value.length)

// the area covered by the tree lines
export const treeLineAreaShare = computed<number>(() => {
    // first we need the total area of the system
    const refArea = area(referenceArea.value)

    // get the treeLine Area
    const lines = area(treeLineArea.value)

    return (lines / refArea * 100) || 0
})

// the amount of planted trees per hectare
export const treesPerHectar = computed<number>(() => {
    // get the total number of trees
    const trees = treeLocationFeatures.value.filter(tree => tree.properties.type === 'Baum').length

    // get the total area of the system
    const refArea = area(referenceArea.value) / 10000

    return trees / refArea
})

// make sure no tree-line is smaller than 3 or larger than 25m
export const conformTreeLineWidth = computed<boolean>(() => {
    // check each tree line
    const singleChecks = calculatedTreeLineFeatures.value.map(line => line.properties.width >= 3 && line.properties.width <= 25)

    // reduce to a single boolean
    const allChecks = singleChecks.reduce((acc, cur) => acc && cur, true)

    return allChecks
})

// emit a signal of all constraints
type LegalConstraints = {
    numberOfTreeLines: boolean,
    treeLineAreaShare: boolean,
    treesPerHectar: boolean,
    conformTreeLineWidth: boolean
}
export const legalConstraints = computed<LegalConstraints>(() => {
    return {
        numberOfTreeLines: numberOfTreeLines.value >= 2,
        treeLineAreaShare: treeLineAreaShare.value <= 40,
        ecoTreeLineShare: treeLineAreaShare.value >= 2 && treeLineAreaShare.value <= 35,
        treesPerHectar: treesPerHectar.value >= 50 && treesPerHectar.value <= 200,
        conformTreeLineWidth: conformTreeLineWidth.value,
        
    }
})