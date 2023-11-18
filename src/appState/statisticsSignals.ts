import { computed, signal } from "@preact/signals-react"
import { treeLocations } from "./treeLineSignals"

// some GIS functions
import area from "@turf/area"
import convex from "@turf/convex"
import buffer from "@turf/buffer"
import { layerVisibility } from "./mapSignals"

// update a convex hull for all treeLocations, whenever they change
const treeLocationHull = computed(() => convex(treeLocations.value))

// container for an external reference feature
// TODO: this needs a setter action, which fills this ie. by the union of all selected Flurstücke
const externalReferenceFeature = signal<GeoJSON.Feature<GeoJSON.Polygon> | null>(null)

// the referenceFeature is either the externalReferenceFeature or the treeLocationHull
export const referenceFeature = computed<GeoJSON.Feature<GeoJSON.Polygon> | null>(() => {
    // use the external reference feature, if available
    if (externalReferenceFeature.value) return externalReferenceFeature.value

    // if a treeLocation Hull is available, use it as reference
    if (treeLocationHull.value) {
        // buffer the treeLocationsHull by 25 meters, which we assume to be the maximal effect size
        return buffer(treeLocationHull.value, 25, {units: "meters"})
    }

    // in any other casse there is no reference area
    return null
})

export const referenceArea = computed(() => referenceFeature.value ? area(referenceFeature.value) : 0)

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
            countPerHectare: count / (referenceArea.value / 10000),
        }
    })
    
    return stats
})