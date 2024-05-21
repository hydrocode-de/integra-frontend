import { Layer, Source, useMap } from "react-map-gl"
import { calculateMouseDistance, mouseDistanceLineFeatures, treeLineDistanceFeatures } from "../../appState/distanceSignals"
import { useEffect } from "react"

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
                    'line-width': 1.5
                }}
            />
            <Layer 
                id="mouse-distances-label"
                source="mouse-distances"
                type="symbol"
                layout={{
                    "text-field": ["get", "label"],
                    "text-size": 15,
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
                    'line-width': 1.5
                }}
            />
            <Layer 
                id="tree-line-distances-label"
                source="tree-line-distances"
                type="symbol"
                layout={{
                    "text-field": ["get", "label"],
                    "text-size": 15,
                    "text-allow-overlap": true,
                    "text-anchor": "top",
                    "symbol-placement": "line-center"
                }}
            />
        </Source>
    </>
}

export default DistanceMeasurementsSource