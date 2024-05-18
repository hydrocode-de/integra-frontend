/**
 * This module collects all calculation needed for the biomass result tab
 * 
 * Currently this is:
 *  - the canopy layer
 */

import { computed } from "@preact/signals-react"
import { TreeLocationProperties } from "./tree.model"
import { appView } from "./appViewSignals"
import { treeLocationFeatures } from "./geoJsonSignals"

import buffer from "@turf/buffer"
import area from "@turf/area"

// define a model type for canopy
interface CanopyProperties extends TreeLocationProperties {
    canopyArea: number,
    canopyWidth?: number,
    error?: string

}
export type Canopy = GeoJSON.FeatureCollection<GeoJSON.Polygon, CanopyProperties>

// now the existence of the 'canopyLayer' can be used to calculate the canopy only conditionally
export const canopyLayerFeatures = computed<Canopy["features"]>(() => {
    // if the app view is not on biomass, we don't need a canopy
    if (appView.value !== 'biomass') {
        return []
    } else {
        // otherwise buffer the treeLocations
        return treeLocationFeatures.value.map(tree => {
            // tree buffer defaults to 1m 
            const buffered = buffer(tree, (tree.properties.canopyWidth || 1) / 2, {units: 'meters'})
            
            return {
                ...buffered,
                properties: {
                    ...tree.properties,
                    canopyArea: area(buffered),
                    canopyWidth: tree.properties.canopyWidth,
                    error: !tree.properties.canopyWidth ? `Tree ${tree.properties.id} has no canopy width set` : undefined
                }
            }
        })
    }
})

export const canopyLayer = computed<Canopy>(() => {
    return {
        type: 'FeatureCollection',
        features: canopyLayerFeatures.value
    }
})
