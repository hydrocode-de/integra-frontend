import { useEffect } from "react"

import MapboxDraw from "@mapbox/mapbox-gl-draw"
import { ControlPosition, useControl } from "react-map-gl"

// import the css of mapbox draw
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"
import { useAppDispatch, useAppSelector } from "../../hooks"
import { DrawControlState, updateDrawBuffer, updateDrawState } from "./treeLineFeatures/treeLinesSlice"
import { useDrawBuffer } from "./treeLineFeatures/treeLinesHooks"


interface DrawControlProps {
    position?: ControlPosition
}

const DrawControl: React.FC<DrawControlProps> = ({ position  }) => {
    // get a application dispatch function
    const dispatch = useAppDispatch()

    // check the draw buffer in the state to update
    const buffer = useDrawBuffer()

    // development only
    const drawState = useAppSelector(state => state.treeLines.draw)

    // define the handlers for map draw events
    const onMapDrawCreate = (event: MapboxDraw.DrawCreateEvent) => {
        // get all features
        const features = mapboxDraw.getAll() as GeoJSON.FeatureCollection<GeoJSON.LineString>
        dispatch(updateDrawBuffer(features))
    }

    const onMapDrawUpdate = (event: MapboxDraw.DrawUpdateEvent) => {
        const features = mapboxDraw.getAll() as GeoJSON.FeatureCollection<GeoJSON.LineString>
        dispatch(updateDrawBuffer(features))
    }

    const onMapDrawDelete = (event: MapboxDraw.DrawDeleteEvent) => {    
        const features = mapboxDraw.getAll() as GeoJSON.FeatureCollection<GeoJSON.LineString>
        dispatch(updateDrawBuffer(features))
    }
    
    // useControl to add a new control to the map
    const mapboxDraw = useControl<MapboxDraw>(
        // create a new instance of the DrawControl
        () => new MapboxDraw({
                // controls: {line_string: true, trash: true},
                displayControlsDefault: false,
                defaultMode: "simple_select",
            }),

        // pass the callback function called on map load
        ({ map }) => {
            map.on("draw.create", onMapDrawCreate)
            map.on("draw.update", onMapDrawUpdate)
            map.on("draw.delete", onMapDrawDelete)
        },

        // pass the callback function called on map unmount
        ({ map }) => {
            map.off("draw.create", onMapDrawCreate)
            map.off("draw.update", onMapDrawUpdate)
            map.off("draw.delete", onMapDrawDelete)
        },

        // pass the position of the control
        { position: position || "top-right" }
    )
    
    // update the draw buffer from the App state, so that the application
    // can empty and re-fill it on user interaction
    useEffect(() => {
        if (!mapboxDraw) return
        // console.log("updated")
        mapboxDraw.set(buffer)
    }, [buffer, mapboxDraw])

    // switch the modes based on the app state
    useEffect(() => {
        if (!mapboxDraw) return
        if (drawState === DrawControlState.SELECT) {
            mapboxDraw.changeMode("simple_select")
        } 
        else if (drawState === DrawControlState.LINE) {
            mapboxDraw.changeMode("draw_line_string")
        } 
        
        else if (drawState === "off") {
            // off means delete everything and go to select mode
            // thus the user interactions do not have any effect
            mapboxDraw.deleteAll()
            dispatch(updateDrawBuffer({type: "FeatureCollection", features: []}))
            mapboxDraw.changeMode("simple_select")
        } 
        
        else if (drawState === "trash") {
            // check if something is selected
            const selected = mapboxDraw.getSelected()
            // check if there are selected features
            if (selected.features.length > 0) {
                // delete the selected features
                mapboxDraw.delete(selected.features.map(f => String(f.id)))

                // now update the buffer
                const features = mapboxDraw.getAll() as GeoJSON.FeatureCollection<GeoJSON.LineString>
                dispatch(updateDrawBuffer(features))
            }
            
            // jump into select mode
            dispatch(updateDrawState(DrawControlState.SELECT))
        } 
        
        else if (drawState === DrawControlState.ADD_LINE) {
            // this one is an ugly workaround - we need to go to line add and reset the state
            // otherwise the user can't keep on hitting the button to add lines
            mapboxDraw.changeMode("simple_select")
            dispatch(updateDrawState(DrawControlState.LINE))
        }
    }, [drawState, mapboxDraw, dispatch])

    // this component doesn't render anything
    return null
}

export default DrawControl