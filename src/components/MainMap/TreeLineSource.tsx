import { Source, Layer } from "react-map-gl"

import { treeLines, treeLocations } from "../../appState/treeLineSignals"

const TreeLineSource: React.FC = () => {
    return <>
        <Source id="tree-lines" type="geojson" data={treeLines.value}>
            <Layer id="tree-lines" source="tree-lines" type="line" paint={{
                'line-color': 'lime',
                'line-width': 5,
            }} />
        </Source>
        <Source id="tree-locations" type="geojson" data={treeLocations.value}>
            <Layer id="tree-locations" source="tree-locations" type="circle" paint={{
                'circle-color': 'darkgreen',
                'circle-radius': 15,
            }} />
        </Source>
    </>
}

export default TreeLineSource