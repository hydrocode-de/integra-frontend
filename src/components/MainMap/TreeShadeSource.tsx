import { Source } from "react-map-gl"
import { shadingPolygons } from "../../appState/shadingSignals"
import Layer from "react-map-gl/dist/esm/components/layer"

const TreeShadeSource: React.FC = () => {
    return <>
        <Source id="tree-shades" type="geojson" data={shadingPolygons.value} generateId>
            <Layer
                id="tree-shades"
                source="tree-shades"
                type="fill"
                paint={{
                    'fill-color': '#000',
                    'fill-opacity': 0.2,
                }}
            />
        </Source>
    </>
}

export default TreeShadeSource