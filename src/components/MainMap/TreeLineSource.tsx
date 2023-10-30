import { Source, Layer } from "react-map-gl"

import { useTreeLines, useTreeLocations } from "./treeLineFeatures/treeLinesHooks"
import { useEffect } from "react"

const TreeLineSource: React.FC = () => {
    // use the TreeLines and TreeLocations hook to subscribe to data
    const treeLines = useTreeLines()
    const treeLocations = useTreeLocations()

    useEffect(() => {
        console.log(treeLocations)
    }, [treeLocations])
    return <>
        <Source id="tree-lines" type="geojson" data={treeLines}>
            <Layer id="tree-lines" source="tree-lines" type="line" paint={{
                'line-color': 'lime',
                'line-width': 5,
            }} />
        </Source>
        <Source id="tree-locations" type="geojson" data={treeLocations}>
            <Layer id="tree-locations" source="tree-locations" type="circle" paint={{
                'circle-color': 'darkgreen',
                'circle-radius': 15,
            }} />
        </Source>
    </>
}

export default TreeLineSource