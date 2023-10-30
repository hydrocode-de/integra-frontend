import ReactMap, { ViewStateChangeEvent } from "react-map-gl"

// load the mapbox css
import 'mapbox-gl/dist/mapbox-gl.css'
import { useAppDispatch } from "../../hooks"
import { updateViewport } from "./mapFeatures/mapSlice"


const MainMap: React.FC<React.PropsWithChildren> = ({ children }) => {
    // get a dispatch function
    const dispatch = useAppDispatch()

    // define the event listener for a map move
    const onMove = (event: ViewStateChangeEvent) => {
        // dispatch the new viewport
        dispatch(updateViewport({
            ...event.viewState
        }))
    } 
    return <>
        <ReactMap
            initialViewState={{
                longitude: 7.83,
                latitude: 48.0,
                zoom: 9,
                pitch: 0,
            }}
            style={{width: '100%', height: '100%'}}
            //mapStyle="mapbox://styles/hydrocode-de/clnzu7dd1000b01pg2eqxcemy"
            mapStyle="mapbox://styles/mapbox/satellite-v9"
            onMove={onMove}
        >
            { children }
        </ReactMap>
    </>
}

export default MainMap