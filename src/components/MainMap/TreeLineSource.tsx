import { useCallback, useEffect, useState } from "react"
import { Source, Layer, useMap, MapLayerMouseEvent, MapMouseEvent } from "react-map-gl"
import { useNavigate } from "react-router-dom"
import bbox from "@turf/bbox"

import { treeLines, treeLocations } from "../../appState/treeLineSignals"
import { TreeLine, TreeLocation } from "../../appState/treeLine.model"
import { fitBounds } from "./MapObservableStore"
import { canopyLayer, currentSeason } from "../../appState/simulationSignals"
import { useSignal, useSignalEffect } from "@preact/signals-react"
import { layerVisibility, zoom } from "../../appState/mapSignals"
import { calculatedTreeLines, updateTreePosition } from "../../appState/treeLocationSignals"
import { setDetailId } from "../../appState/sideContentSignals"
import { ageToSize } from "../../appState/backendSignals"

const TreeLineSource: React.FC = () => {
    // add a state to track if a tree location is currently dragged
    const [draggedTree, setDraggedTree] = useState<string | null>(null)

    // map the treeLocation into the new treeLocationData that maps the current season data to the treeLocations to load the corrent image
    const [treeLocationData, setTreeLocationData] = useState<TreeLocation>({type: "FeatureCollection", features: []})

    useSignalEffect(() => {
        // get the season
        const season = currentSeason.value
        
        const newFeatures = treeLocations.value.features.map(f => {
            const size = ageToSize(f.properties.age!)
            
            return {
                ...f,
                properties: {
                    ...f.properties,
                    image: `${f.properties.treeShape}_${size}_${season}.png`
                }
            }
        })

        // Set the new Data
        setTreeLocationData({type: "FeatureCollection", features: newFeatures})
    })

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

    // we use two different click handlers as it will get too complex otherwise
    // const handleTreeClick = useCallback((e: MapLayerMouseEvent) => {
    //     if (e.features!.length === 0) return
        
    //     // get the feature
    //     const feature = e.features![0] as unknown as TreeLocation["features"][0]

    //     // we want to fly to the bounding box of the treeLINE
    //     const lineBbox = bbox(treeLines.peek().features.find(f => f.properties.id === feature.properties.treeLineId)!)
        
    //     // now fitBounds to the bounding box
    //     fitBounds(lineBbox as [number, number, number, number])

    //     // navigate to the details
    //     navigate(`/detail/${feature.properties.treeLineId}`)
    // }, [navigate])
    const handleTreeClick = (e: MapLayerMouseEvent) => {
        if (e.features!.length === 0) return

        // get the feature
        const feature = e.features![0] as unknown as TreeLocation["features"][0]

        // set the detail Id of this tree to make the side content to adjust accordingly
        setDetailId({treeId: feature.properties.id })
    }

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
    }

    const handleDragEnd = () => {
        (window as any).dragged = null
        setDraggedTree(null)
        map.current!.getCanvas().style.cursor = ''
        map.current!.getMap().dragPan.enable()
    }

    const handleDragMove = useCallback((e: MapMouseEvent) => {
        if (!(window as any).dragged) return
        // if (!draggedTree) return
        e.preventDefault()
        // move the tree location which is marked as active dragging
        updateTreePosition((window as any).dragged, { lon: e.lngLat.lng, lat: e.lngLat.lat })
    }, [draggedTree])

    // dev only
    useEffect(() => console.log(`draggedTree: ${draggedTree}`), [draggedTree])


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
            // map.current.on('click', 'tree-lines', handleLineClick)
            map.current.on('click', 'tree-locations', handleTreeClick)
            map.current.on('click', 'canopy-layer', handleTreeClick)
            map.current.on('mousedown', 'tree-locations', handleDragStart)
            map.current.on('mouseup', handleDragEnd)
            map.current.on('mousemove', handleDragMove)
        }

        // unsubscribe from events
        return () => {
            map.current!.off('mousemove', 'tree-lines', handleMouseMoveLine)
            map.current!.off('mousemove', 'tree-locations', handleMouseMoveTree)
            map.current!.off('mousemove', 'canopy-layer', handleMouseMoveCanopy)
            map.current!.off('mouseleave', 'tree-lines', handleMouseLeaveLine)
            map.current!.off('mouseleave', 'tree-locations', handleMouseLeaveTree)
            map.current!.off('mouseleave', 'canopy-layer', handleMouseLeaveCanopy)
            // map.current!.off('click', 'tree-lines', handleLineClick)
            map.current!.off('click', 'tree-locations', handleTreeClick)  // eslint-disable-line
            map.current!.off('click', 'canopy-layer', handleTreeClick)
            map.current!.off('mousedown', 'tree-locations', handleDragStart)
            map.current!.off('mouseup', handleDragEnd)
            map.current!.off('mousemove', handleDragMove)
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
                    'visibility': canopyIsVisible.value ? 'visible' : 'visible',
                    'icon-image': ['coalesce', ['get', 'image'], 'default'],
                    'icon-anchor': 'bottom',
                    // 'icon-size': [
                    //     'interpolate',
                    //     ['linear'],
                    //     ['get', 'height'],
                    //     0,
                    //     0.15,
                    //     25,
                    //     1.2
                    // ],
                    'icon-size': [
                        'step',
                        ['zoom'],
                        0.15,
                        //15, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 0.6],
                        //16, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 0.7],
                        17, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 0.5],
                        18, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 0.7],
                        19, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 1.4],
                        19.5, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 1.5],
                        20, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 2],
                        21, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 3],
                        22, ['interpolate', ['linear'], ['get', 'height'], 0, 0.15, 25, 4],
                    ]
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