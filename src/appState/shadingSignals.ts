import { computed, effect } from "@preact/signals-react";
import { loadShadeData, shadeDatapoints } from "./backendSignals";
import { appView } from "./appViewSignals";

import {toMercator, toWgs84} from "@turf/projection"
import { seasonMonth } from "./simulationSignals";
import { activeTreeTypes } from "./treeLocationSignals";
import { treeLocationFeatures } from "./geoJsonSignals";


// add an effect to load new shade-datapoints whenever a new tree type is added to the map
effect(() => {
    // get the keys of the current shadeDatapoints
    const loadedTypes = Object.keys(shadeDatapoints.value);

    activeTreeTypes.value.forEach(type => {
        // check if the type is already loaded
        if (!loadedTypes.includes(type)) {
            loadShadeData(type)
            console.log(`Loading shading for ${type}`)
        }
    })
})

type Shading = GeoJSON.FeatureCollection<GeoJSON.Polygon>

// calculate the current shade polygons
export const shadingPolygons = computed<Shading>(() => {
    // if the view is not set to 'shade', return an empty geojson
    if (appView.value !== 'shade') {
        return {
            type: 'FeatureCollection',
            features: []
        }
    }

    // we need to calculate the shade for the current tree locations and month
    const shadeData = shadeDatapoints.value
    const month = seasonMonth.value

    // build the features
    const features = treeLocationFeatures.value.map(tree => {
        // get the correct shade data for the tree type and age
        // const treeTypeShade = (shadeData[tree.properties.treeType] || [])
        //     .reduce((prev, curr,) =>  curr.age > prev.age && tree.properties.age! >= curr.age ? curr : prev, {age: -1, shade_data: [], id: 0, latin_name: ''} as ShadeDatapoint)
        const validShades = (shadeData[tree.properties.treeType] || []).filter(dataPoint => dataPoint.age <= tree.properties.age!)
        if (validShades.length === 0) return null
        // get the largest shade we can find
        const treeTypeShade = validShades.reduce((a, b) => a.age > b.age ? a : b)

        // filter to the current month
        //const shadeData = treeTypeShade.shade_data.filter(dataPoint => dataPoint.month === month)
        const shadeForMonth = treeTypeShade.shade_data.find(point => point.month === month)
        if (!shadeForMonth) return null

        // next we transform the tree location to mercator projection
        const treeMercator = toMercator(tree)

        // now the shading polygon can be shifted to the tree location
        const shadingPolygon: GeoJSON.Polygon = {
            'type': 'Polygon',
            coordinates: [shadeForMonth.coordinates.map(coords => {
                return [
                    coords[0] + treeMercator.geometry.coordinates[0],
                    coords[1] + treeMercator.geometry.coordinates[1]
                ]
            })]
        }

        // transform back and return
        return {
            type: 'Feature',
            geometry: toWgs84(shadingPolygon),
            properties: {
                treeId: tree.properties.id
            }
        }
    })

    // build the GeoJSON
    return {
        type: 'FeatureCollection',
        features: features.filter(f => f !== null) as Shading['features']
    }
})

// calculate the 