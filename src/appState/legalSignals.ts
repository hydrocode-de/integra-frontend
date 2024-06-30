import { computed, signal } from "@preact/signals-react";
import { calculatedTreeLineFeatures, treeLineArea, treeLineAreaFeatures } from "./treeLineSignals";
import { referenceArea } from "./referenceAreaSignals";
import { area, buffer, distance, explode, intersect, lineString, nearestPointOnLine, nearestPointToLine, polygonToLine } from "@turf/turf";
import { treeLocationFeatures } from "./geoJsonSignals";

// set some constants that might change in the future
const MIN_DISTANCE = 20
const MAX_DISTANCE = 100

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

/**
 * Here we need to do some geometry calculations to check the minimum distance to the edge
 * and between each other
 */
export const minimumDistanceArea = computed<GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>>(() => {
    // create the container
    const features: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>[] = []

    // get the reference area
    const refArea = referenceArea.value
    if (!refArea) return {type: 'FeatureCollection', features: []}

    // get the tree lines
    const lines = treeLineAreaFeatures.value
    //const lines = calculatedTreeLineFeatures.value
    if (!lines || lines.length === 0) return {type: 'FeatureCollection', features: []}

    // get the outline of the reference area and buffer by 20 meters
    const out = buffer((polygonToLine(refArea.features[0]) as GeoJSON.Feature<GeoJSON.LineString>), MIN_DISTANCE, {units: 'meters'})
    
    // use the intersection of the reference area itself to discard everything outside the reference area
    const minimumDistToEdge = intersect(out, refArea.features[0])

    // finally check each line if it is too close to another line
    lines.forEach(line => {
        // add the intersection of this line with the minimum distance
        if (minimumDistToEdge) {
            const distToEdge = intersect(line, minimumDistToEdge)
            if (distToEdge) features.push(distToEdge)
        }
        
        // now check the other lines
        // buffer the line by 20 meters
        const bufferedLine = buffer(line, 20, {units: 'meters'})

        // intersect with the other lines
        lines.filter(l => l.properties.id !== line.properties.id).forEach(other => {
            // get the intersection
            const distToLine = intersect(bufferedLine, other)
            if (distToLine) features.push(distToLine)
        })
    })
    
    // finally return the features
    return {type: 'FeatureCollection', features}
})

export const maximumDistances = computed<GeoJSON.FeatureCollection<GeoJSON.LineString>>(() => {
    // create the container
    const features: GeoJSON.Feature<GeoJSON.LineString>[] = []

    // get the reference area
    const refArea = referenceArea.value
    if (!refArea) return {type: 'FeatureCollection', features: []}

    // get the tree lines
    const lines = treeLineAreaFeatures.value
    if (!lines || lines.length === 0) return {type: 'FeatureCollection', features: []}

    // get the outline of the reference area
    const outline = (polygonToLine(refArea.features[0]) as GeoJSON.Feature<GeoJSON.LineString>)
    // turn the outline into a distance buffer
    const outlineBuffer = buffer(outline, MAX_DISTANCE, {units: 'meters'})

    // check that the minimimum distance of each tree line is not lager than MAX_DISTANCE
    lines.forEach(line => {
        // check if the line intersects with the outline
        if (!intersect(line, outlineBuffer)){
            // there is nothing within the buffer, so we need to find the closest distance
            const start = nearestPointToLine(explode(line), outline)
            
            // turn the polygon into a line and find thre closest point on the line
            //const lineAreaOutline = polygonToLine(line) as GeoJSON.Feature<GeoJSON.LineString>
            const end = nearestPointOnLine(outline, start)

            // add the line to the features
            const feature = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [start.geometry.coordinates, end.geometry.coordinates]
                },
                properties: {
                    // distance: distance(start, end, {units: 'meters'}),
                    label: `${distance(start, end, {units: 'meters'}).toFixed(0)} m`
                }
            } as GeoJSON.Feature<GeoJSON.LineString>
            features.push(feature)
        } 
    })

    // finally return the features
    return {type: 'FeatureCollection', features}
})

// set a flag if the distances should be showed in the map
export const showDistances = signal<boolean>(true)

// calculate the flag if the constraints are fulfilled
type FundingCondition = {
    directPayments: boolean
    ecoRegulation: boolean
}

export const fundingConditions = computed<FundingCondition>(() => {
    return {
        directPayments: (numberOfTreeLines.value >= 2 && treeLineAreaShare.value <= 40) || (treesPerHectar.value >= 50 && treesPerHectar.value <= 200),
        ecoRegulation: (
            numberOfTreeLines.value >= 2 &&
            conformTreeLineWidth.value &&
            minimumDistanceArea.value.features.length === 0 &&
            (treeLineAreaShare.value >= 2 && treeLineAreaShare.value <= 35)
        )
    }
})