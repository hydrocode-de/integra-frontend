import ReactMap from "react-map-gl"

// load the mapbox css
import 'mapbox-gl/dist/mapbox-gl.css'


const MainMap: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <>
        <ReactMap
            initialViewState={{
                longitude: 7.83,
                latitude: 48.0,
                zoom: 9,
                pitch: 60,
            }}
            style={{width: '100%', height: '100%'}}
            mapStyle="mapbox://styles/hydrocode-de/clnzu7dd1000b01pg2eqxcemy"
        >
            { children }
        </ReactMap>
    </>
}

export default MainMap