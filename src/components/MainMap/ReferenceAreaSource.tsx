import { Layer, MapLayerMouseEvent, Source, useMap } from "react-map-gl"
import { AreaSuggestions, ReferenceArea, areaSuggestions, createReferenceAreaFromSuggestion, referenceArea } from "../../appState/referenceAreaSignals"
import { useEffect, useState } from "react"
import { useSignalEffect } from "@preact/signals-react"

export const ReferenceAreaSource: React.FC = () => {
    // get a reference to the map
    const map = useMap()

    // put the reference are suggestions into a local signal, to add the hover indicator to the properties
    const [suggestions, setSuggestions] = useState<AreaSuggestions>({type: 'FeatureCollection', features: []})
    

    useSignalEffect(() => {
        if (areaSuggestions.value.features.length > 0 && referenceArea.value?.features.length === 0) {
            setSuggestions({
                type: 'FeatureCollection',
                features: areaSuggestions.peek().features.map((f, idx) => ({...f, id: idx}))
            })
        } else {
            setSuggestions({type: 'FeatureCollection', features: []})
        }
    })

    // define some handler
    const handleMouseEnter = (e: MapLayerMouseEvent) => {
        // update the pointer
        if (map.current) {
            map.current.getCanvas().style.cursor = 'pointer'
        }

        // update the features
        if (e.features!.length > 0) {
            map.current!.setFeatureState({source: 'reference-suggestions', id: e.features![0].id}, {hover: true})
        }
    }

    const handleMouseLeave = (e: MapLayerMouseEvent) => {
        // update the pointer
        if (map.current) {
            map.current.getCanvas().style.cursor = ''
        }

        // get the source data and reset the hover state
        suggestions.features.forEach(f => {
            map.current!.setFeatureState({source: 'reference-suggestions', id: f.id}, {hover: false})
        })
    }

    const handleClick = (e: MapLayerMouseEvent) => {
        // get the clicked feature
        const clickedFeature = e.features![0]
        if (!clickedFeature) return

        // create a referenceArea from the clicked feature
        createReferenceAreaFromSuggestion(clickedFeature.properties!.id)
    }

    // register the handlers to the map
    useEffect(() => {
        if (map.current) {
            map.current.on('mouseenter', 'reference-suggestions', handleMouseEnter)
            map.current.on('mouseleave', 'reference-suggestions', handleMouseLeave)
            map.current.on('click', 'reference-suggestions', handleClick)
        }

        return () => {
            map.current!.off('mouseenter', 'reference-suggestions', handleMouseEnter)
            map.current!.off('mouseleave', 'reference-suggestions', handleMouseLeave)
            map.current!.off('click', 'reference-suggestions', handleClick)
        }
    }, [suggestions])

    return <>
        <Source 
            id="reference-suggestions" 
            type="geojson" 
            data={suggestions} 
            // generateId
        >
            <Layer 
                id="reference-suggestions" 
                source="reference-suggestions" 
                type="fill"
                paint={{
                    // use the feature state to style the hover effect
                    'fill-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#FF0000', '#FFA07A'],
                    'fill-opacity': 0.5,
                }} 
            />
        </Source>
        <Source
            id="reference-area"
            type="geojson"
            data={referenceArea.value}
            generateId
        >
            <Layer 
                id="reference-area"
                source="reference-area"
                type="fill"
                paint={{
                    'fill-color': 'purple',
                    'fill-opacity': 0.08,
                }}
            />
            <Layer 
                id="refernce-area-line"
                source="reference-area"
                type="line"
                paint={{
                    'line-color': 'purple',
                    'line-width': 5,
                }}
            />
        </Source>
    </>
}

export default ReferenceAreaSource