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

    return lines / refArea * 100
})

// the amount of planted trees per hectare
export const treesPerHectar = computed<number>(() => {
    // get the total number of trees
    const trees = treeLocationFeatures.value.filter(tree => tree.properties.type === 'Baum').length

    // get the total area of the system
    const refArea = area(referenceArea.value) / 10000

    return trees / refArea
})