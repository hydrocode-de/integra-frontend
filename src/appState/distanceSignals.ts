/**
 * This signal provides on-map distance information to the closest features on the map,
 * or between features. The signals to turn distance calculations on and off are also
 * provided here.
 */

import { computed, signal } from "@preact/signals-react";
import { MapMouseEvent } from "mapbox-gl";
import { hasData, treeLocationFeatures } from "./geoJsonSignals";
import { calculatedTreeLineFeatures } from "./treeLineSignals";

import buffer from "@turf/buffer";
import intersects from "@turf/boolean-intersects";
import nearestPointOnLine from "@turf/nearest-point-on-line"
import { lineString } from "@turf/helpers"
import distance from "@turf/distance";
import explode from "@turf/explode";


// define trigger to turn specific distance calculations on and off
export const mouseDistanceTrigger = signal<boolean>(false)
export const treeLineDistanceTrigger = signal<boolean>(false)

// helper function
const distToLabel = (dist: number) => {
    if (dist < 10) return `${dist.toFixed(2)} m`
    if (dist < 100) return `${dist.toFixed(1)} m`
    if (dist < 1000) return `${dist.toFixed(0)} m`
    return `${(dist / 1000).toFixed(1)} km`
}

// define the distance signals
interface DistanceLineProperties {
    distance: number
    label: string
    idPair?: string
}

export type DistanceLine = GeoJSON.FeatureCollection<GeoJSON.LineString, DistanceLineProperties>

/**
 * MOUSE SIGNALS
 */
const rawMouseDistanceLineFeatures = signal<DistanceLine["features"]>([])
export const mouseDistanceLineFeatures = computed<DistanceLine["features"]>(() => rawMouseDistanceLineFeatures.value)

// export a function that will re-calculate the distance lines features for mouse events
export const calculateMouseDistance = (e: MapMouseEvent, opts: {maxDist?: number, maxFeatures?: number} = {}) => {
    // directly return when the mouse distance trigger is off
    if (!mouseDistanceTrigger.value || !hasData.value) {
        // check if there are lines
        if (rawMouseDistanceLineFeatures.peek().length > 0) {
            rawMouseDistanceLineFeatures.value = []
        }
        // return, no calculations needed
        return 
    }

    // get the options and defaults
    const maxDist = opts.maxDist || 150
    const maxFeatures = opts.maxFeatures || 3

    // get the position of the mouse and a maxDist buffer around it
    const pos: GeoJSON.Feature<GeoJSON.Point> = {type: 'Feature', geometry: {type: 'Point', coordinates: [e.lngLat.lng, e.lngLat.lat]}, properties: {}}
    const searchBuffer = buffer(pos, maxDist, {units: 'meters'})

    // container for the final distance Lines
    const lines: DistanceLine["features"] = []

    // find all lines within the buffer
    const treeLines = calculatedTreeLineFeatures.peek().filter(f => intersects(f, searchBuffer))

    // get the closest point on the line to construct the distance line
    treeLines.forEach(l => {
        // get the closest point and caclualte the distance
        const closest = nearestPointOnLine(l, pos)
        const dist = distance(closest, pos, {units: 'meters'})
        lines.push(lineString(
            [pos.geometry.coordinates, closest.geometry.coordinates], 
            {
                distance: dist, 
                label: distToLabel(dist)
            }
        ))

    })

    // calculate distance to the tree locations and sort by distance, use closest N points
    const treeDistances = treeLocationFeatures.peek().map(f => distance(f, pos, {units: 'meters'}))
    const sortedTreeLocations = treeLocationFeatures.peek()
        .map((f, i) => ({feature: f, distance: treeDistances[i]}))
        .filter(({ distance }) => distance < maxDist)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, maxFeatures)

    // construct the distance lines
    sortedTreeLocations.forEach(({feature, distance }) => {
        lines.push(lineString(
            [pos.geometry.coordinates, feature.geometry.coordinates],
            {
                distance: distance,
                label: distToLabel(distance)
            }
        ))
    })

    // add the lines to signal
    rawMouseDistanceLineFeatures.value = lines
}

/**
 * TREE LINE SIGNALS
 */
export const treeLineDistanceFeatures = computed<DistanceLine["features"]>(() => {
    // if there the trigger is off, return an empty array
    if (!treeLineDistanceTrigger.value) return []

    // if there are not at least 2 tree lines, return an empty array
    if (calculatedTreeLineFeatures.value.length < 2) return []

    // in any other case we need the distance lines
    const distLines: DistanceLine["features"] = []

    // buffer each tree line by 100 meters, intersect the buffer and create a distance line to each feature
    calculatedTreeLineFeatures.value.forEach((line, index) => {
        // buffer the line by 100 meter
        const lineBuffer = buffer(line, 100, {units: 'meters'})

        // intersect the others with the buffer
        const others = calculatedTreeLineFeatures.peek().filter((other, i) => i !== index && intersects(other, lineBuffer))

        // get the closest points on the lines to each other
        others.forEach(other => {
            // if the other line did already form a pair, skip this
            if (distLines.find(l => l.properties.idPair === `${other.properties.id} - ${line.properties.id}`)) return
            
            // go for all points on the other line to find the closest one
            const feat = explode(other).features.map(p => {
                // get the closest point on the main line
                const closest = nearestPointOnLine(line, p)
                return { 
                    point1: p.geometry.coordinates, 
                    point2: closest.geometry.coordinates, 
                    distance: distance(p, closest, {units: 'meters'}) 
                }
            })
            .sort((a, b) => a.distance - b.distance)[0]

            // add the distance line
            distLines.push(lineString(
                [feat.point1, feat.point2],
                {
                    distance: feat.distance,
                    label: distToLabel(feat.distance),
                    idPair: `${line.properties.id} - ${other.properties.id}`
                }   
            ))
        })
    })

    // return the lines
    return distLines
})

