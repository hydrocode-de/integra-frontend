/**
 * This backend signal manages the reference areas used in the application.
 * 
 */

import { overpassJson } from "overpass-ts"
import osmtogeojson from "osmtogeojson"
import { effect, signal } from "@preact/signals-react"
import cloneDeep from "lodash.clonedeep"
import area from "@turf/area"
import center from "@turf/center"
import bbox from "@turf/bbox"
import intersect from "@turf/intersect"
import bboxPolygon from "@turf/bbox-polygon"

import { flyTo } from "../components/MainMap/MapObservableStore"
import { layerVisibility, mapBounds, zoom } from "./mapSignals"
import { polygon } from "@turf/helpers"


export type AreaSuggestions = GeoJSON.FeatureCollection<GeoJSON.Polygon>
export const areaSuggestions = signal<AreaSuggestions>({type: 'FeatureCollection', features: []})

interface ReferenceAreaProperties {
    id: string,
    origin: 'osm' | 'user',
    area: number,
    landuse?: string
}

export type ReferenceArea = GeoJSON.FeatureCollection<GeoJSON.Polygon, ReferenceAreaProperties>
export const referenceArea = signal<ReferenceArea>({type: 'FeatureCollection', features: []})

// add a effect to add the reference Area to the layer visibility
effect(() => {
    // check fot the reference area popping up
    if (referenceArea.value.features.length === 0) {
        // disable the reference area layer
        const { referenceArea, ...others } = layerVisibility.peek()
        layerVisibility.value = others
    }

    // otherwise if it did not exist before, add it
    else if (!Object.keys(layerVisibility.peek()).includes("referenceArea")) {
        layerVisibility.value = {
            ...layerVisibility.peek(),
            'referenceArea': "visible"
        }
    }
})

export const loadReferenceAreaSuggestions = (): Promise<void> => {
    const ll = mapBounds.peek()?.getSouthWest()
    const ur = mapBounds.peek()?.getNorthEast()
    const bbox = `${ll!.lat},${ll!.lng},${ur!.lat},${ur!.lng}`

    const query = `[out:json];
    (
        way[landuse=farmland](${bbox});
        way[landuse=meadow](${bbox});
        way[landuse=agricultural](${bbox});
    );
    (._;>;);
    out;`
    // console.log(query)
    
    return overpassJson(query).then((data)  => {
        // console.log(data)
        const parsedData = osmtogeojson(data)
        // console.log(parsedData)

        areaSuggestions.value = {
            type: 'FeatureCollection',
            features: [
                ...areaSuggestions.peek().features,
                ...parsedData.features as GeoJSON.Feature<GeoJSON.Polygon>[]
            ]
            .filter((f, i, self) => self.findIndex(s => s.id === f.id) === i)
        }
    })
}

// add a timeout for loading suggestions, as we only call the overpass api every second
const isRequestingSuggestions = signal(false)

// add an effect to load suggestions every time the map moves and there are no suggestions loaded for the area.
// This is only done, if the zoom level is close enough and there is not yet a reference area loaded.
effect(() => {
    // make sure that the trigger is on false
    // using value here, will trigger the effect right after a call has been made,
    // then it is checked after 1 second after each request if more requests are needed
    if (isRequestingSuggestions.value) return

    // first make sure that there is not yet a reference area
    if (referenceArea.value.features.length !== 0) return

    // then check that the zoom level is close enough
    if (zoom.value < 13) return
    
    // get the map bounds and check if they are within the bounding box of the suggestions
    const bounds = mapBounds.value
    if (!bounds) return

    console.log('Checking area suggestions coverage...')
    const mapBBox = polygon([[     
        [bounds.getSouthWest().lng, bounds.getSouthWest().lat],
        [bounds.getSouthEast().lng, bounds.getSouthEast().lat],
        [bounds.getNorthEast().lng, bounds.getNorthEast().lat],
        [bounds.getNorthWest().lng, bounds.getNorthWest().lat],
        [bounds.getSouthWest().lng, bounds.getSouthWest().lat]
    ]])

    // get the suggestions bounding box
    // if there are no features, the bbox will be [Infinity, Infinity, -Infinity, -Infinity]
    let intersectArea = 0
    if (areaSuggestions.value.features.length > 0) {
        const suggBbox =  bboxPolygon(bbox(areaSuggestions.value))

        // get the ratio of the intersection on the map bbox
        const intersection = intersect(suggBbox, mapBBox)

        // get the area of both
        intersectArea = intersection ? area(intersection) : 0
    }
    const mapArea = area(mapBBox)

    // finally figure out if we need to load new suggestions
    // if the intersection of the intersect is less than **70%** of the map area, we load new suggestions
    if (intersectArea / mapArea < 0.7) {
        console.log('loading suggestions')
        // first set the trigger to true
        isRequestingSuggestions.value = true

        // load the sugegstions from Overpass API
        loadReferenceAreaSuggestions().then(() => {
            // loading is finished, so we set the trigger back in one second
            setTimeout(() => isRequestingSuggestions.value = false, 1000)
        })
    } else {
        console.log(`no need to load suggestions, current coverage: ${(intersectArea / mapArea * 100).toFixed(1)}%`)
    }
})

// add some functions
export const createReferenceAreaFromSuggestion = (osm_id: string) => {
    // filter the current suggestions for the given osm_id
    const suggestion = areaSuggestions.peek().features.find(f => f.properties?.id === osm_id)

    // handle the creation
    if (!suggestion) {
        console.log(`createReferenceAreaFromSuggestion('${osm_id}'): could not find suggestion with id ${osm_id}`)
        return
    } else {
        const newCollection = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: cloneDeep({...suggestion.geometry}),
                    properties: {
                        id: suggestion.properties!.id,
                        origin: 'osm',
                        area: area(suggestion),
                        landuse: suggestion.properties?.landuse
                    }
                }
            ]
        } as ReferenceArea
        
        // console.log(newFeature)
        referenceArea.value = newCollection
    }

    // finally, we flyIn far enough to allow for adding trees
    const areaCenter = center(suggestion)
    flyTo({
        zoom: 16.0, 
        center: {lat: areaCenter.geometry.coordinates[1], lng: areaCenter.geometry.coordinates[0]},
        pitch: 45
    })
}
