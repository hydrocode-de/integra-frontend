/**
 * This backend signal manages the reference areas used in the application.
 * 
 */

import { overpassJson } from "overpass-ts"
import osmtogeojson from "osmtogeojson"
import { signal } from "@preact/signals-react"
import cloneDeep from "lodash.clonedeep"
import area from "@turf/area"
import center from "@turf/center"

import { flyTo } from "../components/MainMap/MapObservableStore"
import { mapBounds } from "./mapSignals"


export type AreaSuggestions = GeoJSON.FeatureCollection<GeoJSON.Polygon>
export const areaSuggestions = signal<AreaSuggestions>({type: 'FeatureCollection', features: []})

interface ReferenceAreaProperties {
    id: string,
    origin: 'osm' | 'user',
    area: number,
    landuse?: string
}

export type ReferenceArea = GeoJSON.FeatureCollection<GeoJSON.Polygon, ReferenceAreaProperties>
export const referenceArea = signal<ReferenceArea | undefined>({type: 'FeatureCollection', features: []})


export const loadReferenceAreaSuggestions = () => {
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
    
    overpassJson(query).then((data)  => {
        console.log(data)
        const parsedData = osmtogeojson(data)
        console.log(parsedData)

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
        center: {lat: areaCenter.geometry.coordinates[1], lng: areaCenter.geometry.coordinates[0]}
    })
}
