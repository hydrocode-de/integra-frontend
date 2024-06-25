import { Layer, Source } from "react-map-gl"
import { blossomIndicatorArea } from "../../appState/blossomSimulationSignals"

const BLossomsLocationsSource: React.FC = () => {
    return <>
        <Source id="blossom-indicator-area" type="geojson" data={blossomIndicatorArea.value} generateId>
            <Layer 
                id="blossom-indicator-area"
                source="blossom-indicator-area"
                beforeId="tree-locations"
                type="fill"
                paint={{
                    'fill-color': '#DF77C1',
                    'fill-outline-color': '#DF77C1',
                    'fill-opacity': 0.5,
                
                }}
            />
        </Source>
    </>
}

export default BLossomsLocationsSource