import { Source, Layer, useMap, MapLayerMouseEvent } from "react-map-gl"

import { treeLines, treeLocations } from "../../appState/treeLineSignals"
import { useEffect } from "react"
import { TreeLine, TreeLocation } from "../../appState/treeLine.model"
import center from "@turf/center"
import { flyTo } from "./MapObservableStore"
import { useNavigate } from "react-router-dom"

const TreeLineSource: React.FC = () => {
    // get a reference to the map
    const map = useMap()

    // get a navigator
    const navigate = useNavigate()

    // define the layer handler functions
    const handleMouseMoveTree = (e: MapLayerMouseEvent) => {
        map.current!.getCanvas().style.cursor = 'pointer'

        // update the feature state
        if (e.features!.length > 0) {
            map.current!.setFeatureState({ source: 'tree-locations', id: Number(e.features![0].id) }, { hover: true })
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

    const handleMouseLeaveLine = (e: MapLayerMouseEvent) => {
        map.current!.getCanvas().style.cursor = ''
    }

    // we use two different click handlers as it will get too complex otherwise
    const handleTreeClick = (e: MapLayerMouseEvent) => {
        if (e.features!.length === 0) return
        
        // get the feature
        const feature = e.features![0] as unknown as TreeLocation["features"][0]

        // we want to fly to the center of the treeLINE
        const midPoint = center(treeLines.peek().features.find(f => f.properties.id === feature.properties.treeLineId)!)
        const centerPoint = {lng: midPoint.geometry.coordinates[0], lat: midPoint.geometry.coordinates[1] }

        // now fly to the center
        flyTo({center: centerPoint, speed: 1.5})

        // navigate to the details
        navigate(`/detail/${feature.properties.treeLineId}`)
    }

    const handleLineClick = (e: MapLayerMouseEvent) => {
        if (e.features!.length === 0) return

        // get the feature
        const feature = e.features![0] as unknown as TreeLine["features"][0]

        // get the center point - mapbox slices LineStrings into multiple features so we need to find the full feature
        const midPoint = center(treeLines.peek().features.find(f => f.properties.id === feature.properties.id)!)
        const centerPoint = {lng: midPoint.geometry.coordinates[0], lat: midPoint.geometry.coordinates[1] }

        // now fly to the center
        flyTo({center: centerPoint, speed: 1.5})

        // navigate to the details
        navigate(`/detail/${feature.properties.id}`)
    }


    // effect to subscribe to the map mousemove event
    useEffect(() => {
        // subscribe to mousemove event on the layers
        if (map.current) {
            map.current.on('mousemove', 'tree-lines', handleMouseMoveLine)
            map.current.on('mousemove', 'tree-locations', handleMouseMoveTree)
            map.current.on('mouseleave', 'tree-lines', handleMouseLeaveLine)
            map.current.on('mouseleave', 'tree-locations', handleMouseLeaveTree)
            map.current.on('click', 'tree-lines', handleLineClick)
            map.current.on('click', 'tree-locations', handleTreeClick)
        }

        // unsubscribe from events
        return () => {
            map.current!.off('mousemove', 'tree-lines', handleMouseMoveLine)
            map.current!.off('mousemove', 'tree-locations', handleMouseMoveTree)
            map.current!.off('mouseleave', 'tree-lines', handleMouseLeaveLine)
            map.current!.off('mouseleave', 'tree-locations', handleMouseLeaveTree)
            map.current!.off('click', 'tree-lines', handleLineClick)
            map.current!.off('click', 'tree-locations', handleTreeClick)
        }
    }, [])

    return <>
        <Source id="tree-lines" type="geojson" data={treeLines.value} generateId>
            <Layer id="tree-lines" source="tree-lines" type="line" paint={{
                'line-color': 'lime',
                'line-width': 5,
            }} />
        </Source>
        <Source id="tree-locations" type="geojson" data={treeLocations.value} generateId>
            <Layer id="tree-locations" source="tree-locations" type="circle" paint={{
                'circle-color': 'darkgreen',
                //'circle-radius': 15,
                'circle-radius': ['case', ['boolean', ['feature-state', 'hover'], false], 15, 13]
            }} />
        </Source>
    </>
}

export default TreeLineSource