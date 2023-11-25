import { useCallback, useEffect } from "react"
import { Source, Layer, useMap, MapLayerMouseEvent } from "react-map-gl"
import { useNavigate } from "react-router-dom"
import bbox from "@turf/bbox"

import { treeLines, treeLocations } from "../../appState/treeLineSignals"
import { TreeLine, TreeLocation } from "../../appState/treeLine.model"
import { fitBounds } from "./MapObservableStore"
import { canopyLayer } from "../../appState/simulationSignals"
import { useSignal, useSignalEffect } from "@preact/signals-react"
import { layerVisibility } from "../../appState/mapSignals"

const TreeLineSource: React.FC = () => {
    // get a reference to the map
    const map = useMap()

    // get a navigator
    const navigate = useNavigate()

    // handle canopyvisibility
    const canopyIsVisible = useSignal<boolean>(false)
    useSignalEffect(() => {
        canopyIsVisible.value = layerVisibility.value.canopyLayer === "visible" || false
        
    })

    // define the layer handler functions
    const handleMouseMoveTree = (e: MapLayerMouseEvent) => {
        map.current!.getCanvas().style.cursor = 'pointer'

        // update the feature state
        if (e.features!.length > 0) {
            map.current!.setFeatureState({ source: 'tree-locations', id: Number(e.features![0].id) }, { hover: true })
        }
    }

    const handleMouseMoveCanopy = (e: MapLayerMouseEvent) => {
        map.current!.getCanvas().style.cursor = 'pointer'

        // update the feature state
        if (e.features!.length > 0) {
            map.current!.setFeatureState({ source: 'canopy', id: Number(e.features![0].id) }, { hover: true })
        }
    }

    const handleMouseMoveLine = (e: MapLayerMouseEvent) => {
        map.current!.getCanvas().style.cursor = 'pointer'
    }

    // reset the cursor and feature state after leaving the layer
    const handleMouseLeaveTree = (e: MapLayerMouseEvent) => {
        map.current!.getCanvas().style.cursor = ''

        treeLocations.peek().features.forEach(f => map.current!.setFeatureState({source: 'tree-locations', id: f.properties.id}, {hover: false}))
    }

    const handleMouseLeaveCanopy = (e: MapLayerMouseEvent) => {
        map.current!.getCanvas().style.cursor = ''

        canopyLayer.peek().features.forEach(f => map.current!.setFeatureState({source: 'canopy', id: f.properties.id}, {hover: false}))
    }

    const handleMouseLeaveLine = (e: MapLayerMouseEvent) => {
        map.current!.getCanvas().style.cursor = ''
    }

    // we use two different click handlers as it will get too complex otherwise
    const handleTreeClick = useCallback((e: MapLayerMouseEvent) => {
        if (e.features!.length === 0) return
        
        // get the feature
        const feature = e.features![0] as unknown as TreeLocation["features"][0]

        // we want to fly to the bounding box of the treeLINE
        const lineBbox = bbox(treeLines.peek().features.find(f => f.properties.id === feature.properties.treeLineId)!)
        
        // now fitBounds to the bounding box
        fitBounds(lineBbox as [number, number, number, number])

        // navigate to the details
        navigate(`/detail/${feature.properties.treeLineId}`)
    }, [navigate])

    const handleLineClick = useCallback((e: MapLayerMouseEvent) => {
        if (e.features!.length === 0) return

        // get the feature
        const feature = e.features![0] as unknown as TreeLine["features"][0]

        // get the bounding box - mapbox slices LineStrings into multiple features so we need to find the full feature
        const lineBbox = bbox(treeLines.peek().features.find(f => f.properties.id === feature.properties.id)!)

        // now fitBounds to the bounding box
        fitBounds(lineBbox as [number, number, number, number])

        // navigate to the details
        navigate(`/detail/${feature.properties.id}`)
    }, [navigate])


    // effect to subscribe to the map mousemove event
    useEffect(() => {
        // subscribe to mousemove event on the layers
        if (map.current) {
            map.current.on('mousemove', 'tree-lines', handleMouseMoveLine)
            map.current.on('mousemove', 'tree-locations', handleMouseMoveTree)
            map.current.on('mousemove', 'canopy-layer', handleMouseMoveCanopy)
            map.current.on('mouseleave', 'tree-lines', handleMouseLeaveLine)
            map.current.on('mouseleave', 'tree-locations', handleMouseLeaveTree)
            map.current.on('mouseleave', 'canopy-layer', handleMouseLeaveCanopy)
            map.current.on('click', 'tree-lines', handleLineClick)
            map.current.on('click', 'tree-locations', handleTreeClick)
            map.current.on('click', 'canopy-layer', handleTreeClick)
        }

        // unsubscribe from events
        return () => {
            map.current!.off('mousemove', 'tree-lines', handleMouseMoveLine)
            map.current!.off('mousemove', 'tree-locations', handleMouseMoveTree)
            map.current!.off('mousemove', 'canopy-layer', handleMouseMoveCanopy)
            map.current!.off('mouseleave', 'tree-lines', handleMouseLeaveLine)
            map.current!.off('mouseleave', 'tree-locations', handleMouseLeaveTree)
            map.current!.off('mouseleave', 'canopy-layer', handleMouseLeaveCanopy)
            map.current!.off('click', 'tree-lines', handleLineClick)
            map.current!.off('click', 'tree-locations', handleTreeClick)  // eslint-disable-line
            map.current!.off('click', 'canopy-layer', handleTreeClick)
        }
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return <>
        <Source id="tree-lines" type="geojson" data={treeLines.value} generateId>
            <Layer id="tree-lines" source="tree-lines" type="line" 
                //layout={{'visibility': canopyIsVisible.value ? 'none' : 'visible'}}
                paint={{
                    'line-color': 'lime',
                    'line-width': 5,
                }}
            />
        </Source>
        <Source id="tree-locations" type="geojson" data={treeLocations.value} generateId>
            <Layer id="tree-locations" source="tree-locations" type="symbol" 
                layout={{
                    'visibility': canopyIsVisible.value ? 'none' : 'visible',
                    'icon-image': ['get', 'image'],
                    'icon-anchor': 'bottom',
                    //'icon-size': ['case', ['boolean', ['feature-state', 'hover'], false], 1.1, 1],
                }}
            />
            <Layer id="canopy-center-layer" source="tree-locations" type="circle"
                layout={{'visibility': canopyIsVisible.value ? 'visible' : 'visible'}}
                paint={{
                    "circle-color": "black",
                    "circle-radius": 5
                }}
            />
        </Source>
        <Source id="canopy" type="geojson" data={canopyLayer.value} generateId>
            <Layer id="canopy-layer" source="canopy" type="fill" 
                layout={{'visibility': canopyIsVisible.value ? 'visible' : 'none'}}
                beforeId="canopy-center-layer"
                paint={{
                    "fill-color": "darkgreen",
                    "fill-opacity": 0.7
                }}
            />
            <Layer id="canopy-outline-layer" source="canopy" type="line" 
                layout={{'visibility': canopyIsVisible.value ? 'visible' : 'none'}}
                paint={{
                    "line-color": "darkgreen",
                    "line-width": 2
                }}
            />
        </Source>
    </>
}

export default TreeLineSource