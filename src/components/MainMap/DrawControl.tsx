import { useSignalEffect } from "@preact/signals-react"
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import { ControlPosition, useControl } from "react-map-gl"

// import the css of mapbox draw
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"


interface DrawControlProps {
    position?: ControlPosition
}

const DrawControl: React.FC<DrawControlProps> = ({ position  }) => {
    // // define the handlers for map draw events
    // const onMapDrawCreate = (event: MapboxDraw.DrawCreateEvent) => {
    //     // get all features
    //     const features = mapboxDraw.getAll() as GeoJSON.FeatureCollection<GeoJSON.LineString>
    //     drawBuffer.value = features.features
    // }

    // const onMapDrawUpdate = (event: MapboxDraw.DrawUpdateEvent) => {
    //     const features = mapboxDraw.getAll() as GeoJSON.FeatureCollection<GeoJSON.LineString>
    //     drawBuffer.value = features.features
    // }

    // const onMapDrawDelete = (event: MapboxDraw.DrawDeleteEvent) => {    
    //     const features = mapboxDraw.getAll() as GeoJSON.FeatureCollection<GeoJSON.LineString>
    //     drawBuffer.value = features.features
    // }
    
    // // useControl to add a new control to the map
    // const mapboxDraw = useControl<MapboxDraw>(
    //     // create a new instance of the DrawControl
    //     () => new MapboxDraw({
    //             // controls: {line_string: true, trash: true},
    //             displayControlsDefault: false,
    //             defaultMode: "simple_select",
    //         }),

    //     // pass the callback function called on map load
    //     ({ map }) => {
    //         map.on("draw.create", onMapDrawCreate)
    //         map.on("draw.update", onMapDrawUpdate)
    //         map.on("draw.delete", onMapDrawDelete)
    //     },

    //     // pass the callback function called on map unmount
    //     ({ map }) => {
    //         map.off("draw.create", onMapDrawCreate)
    //         map.off("draw.update", onMapDrawUpdate)
    //         map.off("draw.delete", onMapDrawDelete)
    //     },

    //     // pass the position of the control
    //     { position: position || "top-right" }
    // )
    
    // // update the draw buffer from the App state, so that the application
    // // can empty and re-fill it on user interaction
    // useSignalEffect(() => {
    //     if (!!mapboxDraw) {
    //         // get the buffer values
    //         const buffer = drawBuffer.value

    //         // set the buffer to mapbox draw programatically
    //         mapboxDraw.set({type: "FeatureCollection", features: drawBuffer.value})

    //         // if the buffer is not empty, we need to figure out the feature id of the first element present
    //         // we cannot use the other side-effect, as the draw state might change slightly before the 
    //         // buffer is updated
    //         // this is a bit hacky, but I see no other way to do this
    //         if (buffer.length > 0) {
    //             //console.log(buffer[0].id)
    //             // get the feature id
    //             const featureId = String(buffer[0].id)
    //             // and select it
    //             mapboxDraw.changeMode("simple_select", { featureIds: [featureId]})
    //         }
            
    //     }
    // })

    // // switch the modes based on the app state
    // useSignalEffect(() => {
    //     // switch the signal value
    //     if (drawState.value === DrawState.LINE) {
    //         mapboxDraw.changeMode("draw_line_string")
    //     } else if (drawState.value === DrawState.OFF) {
    //         // off means delete everything and go to select mode
    //         // thus the user interactions do not have any effect
    //         mapboxDraw.deleteAll()
    //         drawBuffer.value = []
    //         mapboxDraw.changeMode("simple_select")
    //     } else if (drawState.value === DrawState.EDIT) {
    //         // we unforturnately cannot use mapboxDraw's own buffer here as it might 
    //         // not yet be updated

    //         // important here is that we are not OFF, but use the same mapboxDraw mode
    //         mapboxDraw.changeMode("simple_select")
    //     }
    // })

    // this component doesn't render anything
    return null
}

export default DrawControl