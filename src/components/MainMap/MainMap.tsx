import ReactMap, { ViewStateChangeEvent, MapRef } from "react-map-gl"
import { useRef } from "react"
import { useDrop } from "react-dnd"
import mapboxgl from "mapbox-gl"

// load the map signals to update the viewState
import { mapBounds, viewState } from "../../appState/mapSignals"

// load the mapbox css
import 'mapbox-gl/dist/mapbox-gl.css'

import MapObserver from "./MapObserver"
import TreeIconLoader from "./TreeIconLoader"
import { addNewTree } from "../../appState/treeLocationSignals"
import { TreeDropProperties } from "../TreeLines/DraggableTree"


const MainMap: React.FC<React.PropsWithChildren<{mapId: string}>> = ({ mapId, children }) => {
    // use a react ref as anything else (state, hook, signal, window) is not working!!!
    const mapRef = useRef<MapRef | null>(null)

    // define the event listener for a map move
    const onMove = (event: ViewStateChangeEvent) => {
        // update the viewState signal
        viewState.value = {...viewState.value, ...event.viewState}

        // update the bounding box of the map
        mapBounds.value = mapRef.current?.getMap().getBounds()
    }

    const onLoad = (e: mapboxgl.MapboxEvent) => {
        // save a map reference to the window instance
        (window as any).map = e.target
    }

    const [, drop] = useDrop(() => ({
        accept: 'tree',
        drop: (item: TreeDropProperties, monitor) => {
            const clientOffset = monitor.getClientOffset()
            
            // get the current bounding box of the map as client pixels
            const clientRect = mapRef.current!.getMap().getContainer().getBoundingClientRect()
            const x = clientOffset!.x - clientRect.left
            const y = clientOffset!.y - clientRect.top
            const latlng = mapRef.current?.unproject([x, y])

            // build the payload of the new item
            const payload = {
                location: latlng!,
                treeType: item.treeType,
            }
            // add the tree to the map
//            console.log(item)
//            console.log(payload)
            addNewTree(payload)
        }
    }))

    return <>
        <div ref={drop} style={{width: '100%', height: '100%'}}>
        <ReactMap
            ref={mapRef}
            id={mapId}
            reuseMaps
            preserveDrawingBuffer
            initialViewState={{
                longitude: viewState.value.longitude,
                latitude: viewState.value.latitude,
                zoom: viewState.value.zoom,
                pitch: viewState.value.pitch,
                // longitude: 7.83,
                // latitude: 48.0,
                // zoom: 12,
                // pitch: 0,

            }}
            style={{width: '100%', height: '100%'}}
            //mapStyle="mapbox://styles/hydrocode-de/clnzu7dd1000b01pg2eqxcemy"
            mapStyle="mapbox://styles/mapbox/satellite-v9"
            onMove={onMove}
            onLoad={onLoad}
        >   
            {/* The Map observer is added here, as it add needed functionality. But maybe it can also be added at MainPage?! */}
            <MapObserver />

            {/* Use the Loader to add treeIcons to the map */}
            <TreeIconLoader />
            { children }
        </ReactMap>
        </div>
    </>
}

export default MainMap