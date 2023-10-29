import { useEffect } from "react"

import MapboxDraw from "@mapbox/mapbox-gl-draw"
import { ControlPosition, useControl, useMap } from "react-map-gl"
import cloneDeep from "lodash.clonedeep"

// import the css of mapbox draw
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"
import { useAppDispatch } from "../../hooks"
import { updateDrawBuffer } from "./features/treeLinesSlice"
import { useDrawBuffer } from "./features/treeLinesHooks"


interface DrawControlProps {
    position?: ControlPosition
}

const DrawControl: React.FC<DrawControlProps> = ({ position  }) => {
    // get a application dispatch function
    const dispatch = useAppDispatch()

    // check the draw buffer in the state to update
    const buffer = useDrawBuffer()

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
                controls: {line_string: true, trash: true},
                displayControlsDefault: false,
                defaultMode: "draw_line_string",
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

    useEffect(() => {
        if (!mapboxDraw) return
        console.log("updated")
        mapboxDraw.set(buffer)
    }, [buffer, mapboxDraw])

    // this component doesn't render anything
    return null
}

export default DrawControl