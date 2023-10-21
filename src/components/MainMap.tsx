import { createContext, useContext, useEffect, useRef, useState } from "react"
import mapboxgl, { Map } from "mapbox-gl"  // eslint-disable-line import/no-webpack-loader-syntax

// load the mapbox css
import 'mapbox-gl/dist/mapbox-gl.css'

// load the mapbox token from the environment
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN!


// provide a context for the map
const MapContext = createContext<Map | null>(null);
export const useMap = () => useContext(MapContext);

// main Component
const MainMap: React.FC = () => {
    // set up some refs to hold the map and container
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<Map | null>(null)

    // set up the initial map state
    const [lng, setLng] = useState(7.83)
    const [lat, setLat] = useState(48.0)
    const [zoom, setZoom] = useState(9)
    const [pitch, setPitch] = useState(60)
    const [bearing, setBearing] = useState(0)


    // on mount, initialize the map
    useEffect(() => {
        if (map.current || !mapContainer.current) return // already initialized

        // initialize the map
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            //style: 'mapbox://styles/mapbox/satellite-v9',
            style: 'mapbox://styles/hydrocode-de/clnzu7dd1000b01pg2eqxcemy',
            center: [lng, lat],
            zoom: zoom,
            pitch: pitch,
            bearing: bearing
        })

        // add an event listener when the map moves
        map.current.on('move', () => {
            // get the center
            setLat(map.current!.getCenter().lat)
            setLng(map.current!.getCenter().lng)

            // get the orientation
            setZoom(map.current!.getZoom())
            setBearing(map.current!.getBearing())
            setPitch(map.current!.getPitch())
        })
    })

    // return the map container
    return <>
        <MapContext.Provider value={map.current}>
            <div ref={mapContainer} className="map-container" style={{height: '100%', width: '100%'}} />
        </MapContext.Provider>
    </>
}

export default MainMap