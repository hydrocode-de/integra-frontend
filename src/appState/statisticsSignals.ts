import { computed } from "@preact/signals-react"
import { treeLocations } from "./treeLineSignals"
import area from "@turf/area"
import convex from "@turf/convex"

interface TreeTypeStatistics {
    [treeType: string]: {
        count: number,
        countPerHectare: number,
    }
}

export const treeTypeStatistics = computed<TreeTypeStatistics>(() => {
    // calculate the current area
    if (!treeLocations.value) return {}
    
    // calculate the area
    const hull = convex(treeLocations.value)
    const currentArea = hull ? area(hull) : 0

    // get all available tree types
    const treeTypes = [...new Set(treeLocations.value.features.map(tree => tree.properties.treeType))]

    // calculate all the statistics by tree type
    const stats = {} as TreeTypeStatistics
    treeTypes.forEach(treeType => {
        // count statistics
        const count = treeLocations.value.features.filter(tree => tree.properties.treeType === treeType).length
        stats[treeType] = {
            count: count,
            countPerHectare: count / (currentArea / 10000),
        }
    })
    
    return stats
})