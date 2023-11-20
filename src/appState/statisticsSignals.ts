import { computed, signal } from "@preact/signals-react"
import { treeLocations } from "./treeLineSignals"

// some GIS functions
import area from "@turf/area"
import convex from "@turf/convex"
import buffer from "@turf/buffer"

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

interface StatisticsDatapoint {
    count: number,
    countPerHectare: number,
    totalCarbon?: number,
    carbonPerHectare?: number,
    totalAgb?: number,
    agbPerHectare?: number,
    meanHeight?: number,
    meanTruncHeight?: number,
    meanBhd?: number,
}

export interface TreeTypeStatistics {
    [treeType: string]: StatisticsDatapoint
}

export type StatMetric = "count" | "carbon" | "agb" | "height"

export const treeTypeStatistics = computed<TreeTypeStatistics>(() => {
    // calculate the current area
    if (!treeLocations.value) return {}

    // get all available tree types
    const treeTypes = [...new Set(treeLocations.value.features.map(tree => tree.properties.treeType))]

    // calculate all the statistics by tree type
    const stats = {} as TreeTypeStatistics
    treeTypes.forEach(treeType => {
        // filter the tree locations by tree type
        const individuals = treeLocations.value.features.filter(tree => tree.properties.treeType === treeType)

        // carbon statistics
        const totalCarbon = individuals.map(tree => tree.properties.carbon || 0).reduce((t1, t2) => t1 + t2, 0)
        const totalAgb = individuals.map(tree => tree.properties.agb || 0).reduce((t1, t2) => t1 + t2, 0)

        // height statistics
        const meanHeight = individuals.map(tree => tree.properties.height || 0).reduce((t1, t2) => t1 + t2, 0) / individuals.length
        const meanTruncHeight = individuals.map(tree => (tree.properties.height || 0) - (tree.properties.canopyHeight || 0)).reduce((t1, t2) => t1 + t2, 0) / individuals.length
        
        // BHD statistics
        const meanBhd = individuals.map(tree => tree.properties.bhd || 0).reduce((t1, t2) => t1 + t2, 0) / individuals.length

        stats[treeType] = {
            count: individuals.length,
            countPerHectare: individuals.length / (referenceArea.value / 10000),
            totalCarbon: totalCarbon,
            carbonPerHectare: totalCarbon / (referenceArea.value / 10000),
            totalAgb: totalAgb,
            agbPerHectare: totalAgb / (referenceArea.value / 10000),
            meanHeight: meanHeight,
            meanTruncHeight: meanTruncHeight,
            meanBhd: meanBhd,
        }
    })
    
    return stats
})

export const totalStatistics = computed<StatisticsDatapoint>(() => {
    // sum up all treeType statistics
    // TODO: this can be done in a loop so far
    return {
        count: Object.values(treeTypeStatistics.value).map(t => t.count).reduce((t1, t2) => t1 + t2, 0),
        countPerHectare: Object.values(treeTypeStatistics.value).map(t => t.countPerHectare).reduce((t1, t2) => t1 + t2, 0),
        totalCarbon: Object.values(treeTypeStatistics.value).map(t => t.totalCarbon || 0).reduce((t1, t2) => t1 + t2, 0),
        carbonPerHectare: Object.values(treeTypeStatistics.value).map(t => t.carbonPerHectare || 0).reduce((t1, t2) => t1 + t2, 0),
        totalAgb: Object.values(treeTypeStatistics.value).map(t => t.totalAgb || 0).reduce((t1, t2) => t1 + t2, 0),
        agbPerHectare: Object.values(treeTypeStatistics.value).map(t => t.agbPerHectare || 0).reduce((t1, t2) => t1 + t2, 0),
        meanHeight: Object.values(treeTypeStatistics.value).map(t => t.meanHeight || 0).reduce((t1, t2) => t1 + t2, 0) / Object.keys(treeTypeStatistics.value).length,
        meanTruncHeight: Object.values(treeTypeStatistics.value).map(t => t.meanTruncHeight || 0).reduce((t1, t2) => t1 + t2, 0) / Object.keys(treeTypeStatistics.value).length,
        meanBhd: Object.values(treeTypeStatistics.value).map(t => t.meanBhd || 0).reduce((t1, t2) => t1 + t2, 0) / Object.keys(treeTypeStatistics.value).length,
    }
})