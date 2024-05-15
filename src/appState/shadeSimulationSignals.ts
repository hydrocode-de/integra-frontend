import { computed } from "@preact/signals-react";
import { referenceArea } from "./referenceAreaSignals";
import { shadingPolygons } from "./shadingSignals";

import union from "@turf/union"
import difference from "@turf/difference"
import area from "@turf/area"

/**
 * The shade simulation needs to go into its own signal to 
 * avoid circular imports with shade (which depends on the tree locations) 
 * and the reference area
 */
type AgriculturalArea = GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>

export const agriculturalArea = computed<AgriculturalArea>(() => {
    // the agricultural are is the difference between the reference area and the shading area
    const reference = referenceArea.value
    const singleShades = shadingPolygons.value.features

    // return nothing if any of the above is still empty
    if (reference.features.length === 0 || singleShades.length === 0) {
        return {type: 'FeatureCollection', features: []}
    }

    // create an empty Feature
    let shade: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> = {type: 'Feature', geometry: {type: 'Polygon', 'coordinates': []}, properties: {}}
    // union all the shading polygons
    singleShades.forEach(f => shade = union(shade, f) || shade)

    // the difference is the area we are after
    const diff = difference(reference.features[0], shade) || reference.features[0]
    return {
        type: 'FeatureCollection',
        features: [diff]
    
    }
})

export interface ShadeStats {
    referenceArea: number,
    agriculturalArea: number,
    shadedArea: number,
    shadedRatio: number
}
export const shadeStats = computed<ShadeStats>(() => {
    const refArea = area(referenceArea.value)
    const agriArea = area(agriculturalArea.value)
    const shadedRatio = 100 * (1 - agriArea / refArea)

    return {
        referenceArea: refArea,
        agriculturalArea: agriArea,
        shadedArea: refArea - agriArea,
        shadedRatio: shadedRatio
    }
})