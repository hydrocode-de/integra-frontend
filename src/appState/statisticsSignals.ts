import { computed, signal } from "@preact/signals-react"
import { treeLocations } from "./treeLineSignals"

// some GIS functions
import area from "@turf/area"
import convex from "@turf/convex"

export const treeLocationHull = computed(() => convex(treeLocations.value))
export const treeLineArea = computed(() => treeLocationHull.value ? area(treeLocationHull.value) : 0)


// container for an external reference feature
// TODO: this needs a setter action, which fills this ie. by the union of all selected Flurstücke
const externalReferenceFeature = signal<GeoJSON.Feature<GeoJSON.Polygon> | null>(null)

// the referenceFeature is either the externalReferenceFeature or the treeLocationHull
export const referenceFeature = computed<GeoJSON.Feature<GeoJSON.Polygon> | null>(() => externalReferenceFeature.value || treeLocationHull.value)

interface TreeTypeStatistics {
    [treeType: string]: {
        count: number,
        countPerHectare: number,
    }
}

export const treeTypeStatistics = computed<TreeTypeStatistics>(() => {
    // calculate the current area
    if (!treeLocations.value) return {}

    // get all available tree types
    const treeTypes = [...new Set(treeLocations.value.features.map(tree => tree.properties.treeType))]

    // calculate all the statistics by tree type
    const stats = {} as TreeTypeStatistics
    treeTypes.forEach(treeType => {
        // count statistics
        const count = treeLocations.value.features.filter(tree => tree.properties.treeType === treeType).length
        stats[treeType] = {
            count: count,
            countPerHectare: count / (treeLineArea.value / 10000),
        }
    })
    
    return stats
})