import ReactMap, { ViewStateChangeEvent } from "react-map-gl"

// load the map signals to update the viewState
import { viewState } from "./mapFeatures/mapSignals"

// load the mapbox css
import 'mapbox-gl/dist/mapbox-gl.css'

import MapObserver from "./MapObserver"


const MainMap: React.FC<React.PropsWithChildren<{mapId: string}>> = ({ mapId, children }) => {
    // define the event listener for a map move
    const onMove = (event: ViewStateChangeEvent) => {
        // update the viewState signal
        viewState.value = {...viewState.value, ...event.viewState}
    }

    return <>
        <ReactMap
            id={mapId}
            reuseMaps
            initialViewState={{
                longitude: 7.83,
                latitude: 48.0,
                zoom: 12,
                pitch: 0,
            }}
            style={{width: '100%', height: '100%'}}
            //mapStyle="mapbox://styles/hydrocode-de/clnzu7dd1000b01pg2eqxcemy"
            mapStyle="mapbox://styles/mapbox/satellite-v9"
            onMove={onMove}
        >   
            {/* The Map observer is added here, as it add needed functionality. But maybe it can also be added at MainPage?! */}
            <MapObserver />
            { children }
        </ReactMap>
    </>
}

export default MainMap