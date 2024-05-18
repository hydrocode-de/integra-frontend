import { computed } from "@preact/signals-react";
import { shadingPolygons } from "./shadingSignals";

import union from "@turf/union"
import difference from "@turf/difference"
import area from "@turf/area"
import { agriculturalArea } from "./treeLineSignals";
import intersect from "@turf/intersect";

/**
 * The shade simulation needs to go into its own signal to 
 * avoid circular imports with shade (which depends on the tree locations) 
 * and the reference area
 */
type ShadedArea = GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>

export const shadedArea = computed<ShadedArea>(() => {
    // the agricultural are is the difference between the reference area and the shading area
    // todo is this reference or agricultural area?
    const agricultural = agriculturalArea.value
    const singleShades = shadingPolygons.value.features

    // return nothing if any of the above is still empty
    if (agricultural.features.length === 0 || singleShades.length === 0) {
        return {type: 'FeatureCollection', features: []}
    }

    // create an empty Feature
    let shade: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> = {type: 'Feature', geometry: {type: 'Polygon', 'coordinates': []}, properties: {}}
    // union all the shading polygons
    singleShades.forEach(f => shade = union(shade, f) || shade)

    // the agricultural area is already clipped by the tree lines, so
    // we need the intersection here
    const intersection = intersect(shade, agricultural.features[0])
    return {
        type: 'FeatureCollection',
        features: intersection ? [intersection] : []
    
    }
})

export interface ShadeStats {
    agriculturalArea: number,
    shadedArea: number,
    shadedRatio: number
}
export const shadeStats = computed<ShadeStats>(() => {
    const agriArea = area(agriculturalArea.value)
    const shadeArea = area(shadedArea.value)
    const shadedRatio = 100 * ( shadeArea / agriArea)

    return {
        agriculturalArea: agriArea,
        shadedArea: shadeArea,
        shadedRatio: shadedRatio
    }
})