import { useSignalEffect } from "@preact/signals-react"
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import { ControlPosition, useControl } from "react-map-gl"

// import the css of mapbox draw
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"


// import the buffer signal
import { drawBuffer, drawState } from "../../appState/treeLineSignals"
import { DrawState } from "../../appState/treeLine.model"

interface DrawControlProps {
    position?: ControlPosition
}

const DrawControl: React.FC<DrawControlProps> = ({ position  }) => {
    // define the handlers for map draw events
    const onMapDrawCreate = (event: MapboxDraw.DrawCreateEvent) => {
        // get all features
        const features = mapboxDraw.getAll() as GeoJSON.FeatureCollection<GeoJSON.LineString>
        drawBuffer.value = features.features
    }

    const onMapDrawUpdate = (event: MapboxDraw.DrawUpdateEvent) => {
        const features = mapboxDraw.getAll() as GeoJSON.FeatureCollection<GeoJSON.LineString>
        drawBuffer.value = features.features
    }

    const onMapDrawDelete = (event: MapboxDraw.DrawDeleteEvent) => {    
        const features = mapboxDraw.getAll() as GeoJSON.FeatureCollection<GeoJSON.LineString>
        drawBuffer.value = features.features
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
    useSignalEffect(() => {
        if (!!mapboxDraw) {
            mapboxDraw.set({type: "FeatureCollection", features: drawBuffer.value})
        }
    })

    // switch the modes based on the app state
    useSignalEffect(() => {
        // switch the signal value
        if (drawState.value === DrawState.LINE) {
            mapboxDraw.changeMode("draw_line_string")
        } else if (drawState.value === DrawState.OFF) {
            // off means delete everything and go to select mode
            // thus the user interactions do not have any effect
            mapboxDraw.deleteAll()
            drawBuffer.value = []
            mapboxDraw.changeMode("simple_select")
        }
    })

    // this component doesn't render anything
    return null
}

export default DrawControl