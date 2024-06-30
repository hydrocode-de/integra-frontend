import { Layer, Source, useMap } from "react-map-gl"
import { calculateMouseDistance, mouseDistanceLineFeatures, treeLineDistanceFeatures } from "../../appState/distanceSignals"
import { useEffect } from "react"
import { maximumDistances, minimumDistanceArea, showDistances } from "../../appState/legalSignals"

const DistanceMeasurementsSource: React.FC = () => {
    // get a reference of the map
    const map = useMap()

    // add a effect to listen to mouseMove events
    useEffect(() => {
        if (!map.current) return

        // add a listener to the map
        map.current.on('mousemove', calculateMouseDistance)

        return () => {
            map.current!.off('mousemove', calculateMouseDistance)
        }
    }, [])

    return <>
        {/* MOUSE DISTANCE */}
        <Source
            id="mouse-distances"
            type="geojson"
            data={{
                type: 'FeatureCollection',
                features: mouseDistanceLineFeatures.value
            }}
        >
            <Layer 
                id="mouse-distances"
                source="mouse-distances"
                type="line"
                paint={{
                    'line-color': 'grey',
                    'line-dasharray': [2, 2],
                    'line-width': 2
                }}
            />
            <Layer 
                id="mouse-distances-label"
                source="mouse-distances"
                type="symbol"
                layout={{
                    "text-field": ["get", "label"],
                    "text-size": 16,
                    "text-allow-overlap": true,
                    "text-anchor": "top",
                    "symbol-placement": "line-center"
                }}
            />
        </Source>

        {/* TREE LINE DISTANCE */}
        <Source
            id="tree-line-distances"
            type="geojson"
            data={{type: 'FeatureCollection', features: treeLineDistanceFeatures.value}}
        >
            <Layer 
                id="tree-line-distances"
                source="tree-line-distances"
                type="line"
                paint={{
                    'line-color': 'grey',
                    'line-dasharray': [2, 2],
                    'line-width': 2
                }}
            />
            <Layer 
                id="tree-line-distances-label"
                source="tree-line-distances"
                type="symbol"
                layout={{
                    "text-field": ["get", "label"],
                    "text-size": 16,
                    "text-allow-overlap": true,
                    "text-anchor": "top",
                    "symbol-placement": "line-center"
                }}
            />
        </Source>

        {/* Minimum distance source */}
        <Source
            id="minimum-distance"
            type="geojson"
            data={minimumDistanceArea.value}
            generateId
        >
            <Layer 
                id="minimum-distance"
                source="minimum-distance"
                beforeId="tree-locations"
                type="fill"
                layout={{
                    visibility: showDistances.value ? 'visible' : 'none'
                }}
                paint={{
                    'fill-color': 'red',
                    'fill-opacity': 0.8
                }}
            />
        </Source>

        {/* maximum distance source */}
        <Source
            id="maximum-distances"
            type="geojson"
            data={maximumDistances.value}
            generateId
        >
            <Layer 
                id="maximum-distances"
                source="maximum-distances"
                beforeId="tree-locations"
                type="line"
                layout={{
                    visibility: showDistances.value ? 'visible' : 'none'
                }}
                paint={{
                    'line-color': 'red',
                    'line-width': 3
                    }}
            />
            <Layer 
                id="maximum-distance-label"
                source="maximum-distances"
                beforeId="tree-locations"
                type="symbol"
                layout={{
                    "text-field": ["get", "label"],
                    "text-size": 16,
                    "text-allow-overlap": true,
                    "text-anchor": "top",
                    "symbol-placement": "line-center",
                    "visibility": showDistances.value ? 'visible' : 'none'
                
                }}
            />
        </Source>
    </>
}

export default DistanceMeasurementsSource