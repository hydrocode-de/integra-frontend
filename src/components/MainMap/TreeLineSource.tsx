import { useCallback, useEffect, useState } from "react"
import { Source, Layer, useMap, MapLayerMouseEvent, MapMouseEvent } from "react-map-gl"

import {  CalculatedTreeLine, TreeLocation } from "../../appState/tree.model"
import { getSeason, seasonMonth } from "../../appState/simulationSignals"
import { useSignal, useSignalEffect } from "@preact/signals-react"
import { layerVisibility, zoom } from "../../appState/mapSignals"
import { updateTreePosition } from "../../appState/treeLocationSignals"
import { setDetailId } from "../../appState/sideContentSignals"
import { ageToSize } from "../../appState/backendSignals"
import { calculatedTreeLines, treeLocations } from "../../appState/geoJsonSignals"
import { canopyLayer } from "../../appState/biomassSimulationSignals"
import { calculateMouseDistance, mouseDistanceTrigger, treeLineDistanceTrigger } from "../../appState/distanceSignals"
import { treeLineArea } from "../../appState/treeLineSignals"

const TreeLineSource: React.FC = () => {
    // add a state to track if a tree location is currently dragged
    const [draggedTree, setDraggedTree] = useState<string | null>(null)

    // map the treeLocation into the new treeLocationData that maps the current season data to the treeLocations to load the corrent image
    const [treeLocationData, setTreeLocationData] = useState<TreeLocation>({type: "FeatureCollection", features: []})

    useSignalEffect(() => {
        // get the current month
        const month = seasonMonth.value
        
        const newFeatures = treeLocations.value.features.map(f => {
            // get the tree size
            const size = ageToSize(f.properties.age!)
            
            // get the current season
            const season = getSeason(month, f.properties.treeType, f.properties.age!)

            return {
                ...f,
                properties: {
                    ...f.properties,
                    image: `${size}_${season}_${f.properties.icon_abbrev}.png`
                }
            }
        })

        // Set the new Data
        setTreeLocationData({type: "FeatureCollection", features: newFeatures})
    })

    // get a reference to the map
    const map = useMap()

    // handle canopyvisibility
    const canopyIsVisible = useSignal<boolean>(false)
    useSignalEffect(() => {
        canopyIsVisible.value = layerVisibility.value.canopyLayer === "visible" || false
        
    })

    // define the layer handler functions
    const handleMouseMoveTree = (e: MapLayerMouseEvent) => {
        // map.current!.getCanvas().style.cursor = 'pointer'
        // map.current!.getCanvas().style.cursor = 'move'

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
        treeLocations.peek().features.forEach(f => map.current!.setFeatureState({source: 'tree-locations', id: f.properties.id}, {hover: false}))
    }

    const handleMouseLeaveLine = (e: MapLayerMouseEvent) => {
        map.current!.getCanvas().style.cursor = ''

        treeLocations.peek().features.forEach(f => map.current!.setFeatureState({source: 'tree-locations', id: f.properties.id}, {hover: false}))
    }

    const handleTreeClick = (e: MapLayerMouseEvent) => {
        if (e.features!.length === 0) return

        // get the feature
        const feature = e.features![0] as unknown as TreeLocation["features"][0]

        // set the detail Id of this tree to make the side content to adjust accordingly
        setDetailId({treeId: feature.properties.id })
    }

    const handleLineClick = (e: MapLayerMouseEvent) => {
        if (e.features!.length === 0) return

        // get the feature
        const line = e.features![0] as unknown as CalculatedTreeLine["features"][0]

        // set the detail Id of this tree line to make the side content to adjust accordingly
        // console.log(`click line id: ${line.properties.id}`)
        setDetailId({lineId: line.properties.id})
    }

    // handle the hovering of tree area
    const handleLineAreaEnter = (e: MapLayerMouseEvent) => {
        treeLineDistanceTrigger.value = true
    }

    const handleLineAreaLeave = (e: MapLayerMouseEvent) => {
        treeLineDistanceTrigger.value = false
    }


    // dragging functionality
    const handleDragStart = (e: MapLayerMouseEvent) => {
        // check that there is a feature being dragged
        if (e.features!.length === 0) return

        // get the feature to store its id
        const feature = e.features![0] as unknown as TreeLocation["features"][0]
        (window as any).dragged = feature.properties.id
        setDraggedTree(feature.properties.id)
        map.current!.getMap().dragPan.disable()

        // set the cursor to grabbing
        map.current!.getCanvas().style.cursor = 'grabbing'

        // enable mouse measuring
        mouseDistanceTrigger.value = true
    }

    const handleDragEnd = () => {
        (window as any).dragged = null
        setDraggedTree(null)
        map.current!.getCanvas().style.cursor = ''
        map.current!.getMap().dragPan.enable()

        // disable mouse measuring
        mouseDistanceTrigger.value = false
    }

    const handleDragMove = useCallback((e: MapMouseEvent) => {
        if (!(window as any).dragged) return
        // if (!draggedTree) return
        e.preventDefault()

        // move the tree location which is marked as active dragging
        updateTreePosition((window as any).dragged, { lon: e.lngLat.lng, lat: e.lngLat.lat })
    }, [draggedTree])

    // dev only - do not remove I need this quite often :)
    // useEffect(() => console.log(`draggedTree: ${draggedTree}`), [draggedTree])


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
            map.current.on('click', 'tree-locations', handleTreeClick)
            map.current.on('click', 'canopy-layer', handleTreeClick)
            map.current.on('mousedown', 'tree-locations', handleDragStart)
            map.current.on('mouseup', handleDragEnd)
            map.current.on('mousemove', handleDragMove)
            map.current.on('mouseenter', 'tree-lines-area', handleLineAreaEnter)
            map.current.on('mouseleave', 'tree-lines-area', handleLineAreaLeave)
            map.current.on('click', 'tree-lines-area', handleLineClick)
        }

        // unsubscribe from events
        return () => {
            map.current!.off('mousemove', 'tree-lines', handleMouseMoveLine)
            map.current!.off('mousemove', 'tree-locations', handleMouseMoveTree)
            map.current!.off('mousemove', 'canopy-layer', handleMouseMoveCanopy)
            map.current!.off('mouseleave', 'tree-lines', handleMouseLeaveLine)
            map.current!.off('mouseleave', 'tree-locations', handleMouseLeaveTree)
            map.current!.off('mouseleave', 'canopy-layer', handleMouseLeaveCanopy)
            map.current!.off('click', 'tree-locations', handleTreeClick)  // eslint-disable-line
            map.current!.off('click', 'canopy-layer', handleTreeClick)
            map.current!.off('mousedown', 'tree-locations', handleDragStart)
            map.current!.off('mouseup', handleDragEnd)
            map.current!.off('mousemove', handleDragMove)
            map.current!.off('mouseenter', 'tree-lines-area', handleLineAreaEnter)
            map.current!.off('mouseleave', 'tree-lines-area', handleLineAreaLeave)
            map.current!.off('click', 'tree-lines-area', handleLineClick)
        }
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return <>
        <Source id="tree-lines-area" type="geojson" data={treeLineArea.value} generateId>
            <Layer 
                id="tree-lines-area"
                source="tree-lines-area"
                type="fill"
                paint={{
                    'fill-color': 'darkgreen',
                    'fill-opacity': 0.4
                }}
            />
        </Source>
        <Source id="calculated-tree-line" type="geojson" data={calculatedTreeLines.value}>
            <Layer id="calculated-tree-line" source="calculated-tree-lines" type="line" 
                paint={{
                    'line-color': 'lime',
                    'line-width': 5,
                    'line-dasharray': [2, 2]
                    
                }}
            />
        </Source>
        {/* <Source id="tree-locations" type="geojson" data={treeLocations.value} generateId> */}
        <Source id="tree-locations" type="geojson" data={treeLocationData} generateId>
            <Layer id="tree-locations" source="tree-locations" type="symbol"
                layout={{
                    //'visibility': canopyIsVisible.value ? 'visible' : 'visible',
                    'visibility': zoom.value < 14.5 ? 'none' : 'visible',
                    'icon-image': ['coalesce', ['get', 'image'], 'default'],
                    'icon-anchor': 'bottom',
                    'icon-size': [
                        'step',
                        ['zoom'],
                        0.15,
                        15, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 0.17],
                        16, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 0.18],
                        17, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 0.2],
                        18, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 0.5],
                        18.5, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 1],
                        19, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 1.5],
                        19.5, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 2],
                        20, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 2.3],
                        20.3, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 2.5],
                        20.6, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 2.9],
                        21, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 3],
                        21.3, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 3.5],
                        21.6, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 4],
                        22, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 4.5],
                    ],
                    'icon-allow-overlap': true
                }}
            />
            <Layer id="canopy-center-layer" source="tree-locations" type="circle"
                beforeId="tree-locations"
                layout={{'visibility': canopyIsVisible.value ? 'visible' : 'visible'}}
                paint={{
                    "circle-color": "black",
                    //"circle-radius": ['case', ['boolean', ['feature-state', 'hover'], false], 12, 5],
                    "circle-radius": ['case', ['boolean', ['feature-state', 'hover'], false], 6, 5]
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
                beforeId="canopy-center-layer"
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