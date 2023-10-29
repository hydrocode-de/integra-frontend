import MapboxDraw from "@mapbox/mapbox-gl-draw"
import { ControlPosition, useControl } from "react-map-gl"

// import the css of mapbox draw
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"

// type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
//     position?: ControlPosition,
// }
interface DrawControlProps {
    position?: ControlPosition
}

const DrawControl: React.FC<DrawControlProps> = ({ position  }) => {
    // define the handlers for map draw events
    const onMapDrawCreate = (event: MapboxDraw.DrawCreateEvent) => {
        console.log("draw.create", event.features)
    }

    const onMapDrawUpdate = (event: MapboxDraw.DrawUpdateEvent) => {
        console.log(`draw.update[${event.action}]`, event.features)
    }

    const onMapDrawDelete = (event: MapboxDraw.DrawDeleteEvent) => {    
        console.log("draw.delete", event.features)
    }
    
    // useControl to add a new control to the map
    useControl<MapboxDraw>(
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

    // this component doesn't render anything
    return null
}

export default DrawControl