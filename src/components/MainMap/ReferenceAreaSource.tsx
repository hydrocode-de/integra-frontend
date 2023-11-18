import { Layer, Source } from "react-map-gl"
import { referenceFeature } from "../../appState/statisticsSignals"
import { FillPaint, LinePaint } from "mapbox-gl"
import { useIntegraTheme } from "../../context/IntegraThemeContext"
import { useSignal, useSignalEffect } from "@preact/signals-react"
import { layerVisibility } from "../../appState/mapSignals"


const ReferenceAreaSource: React.FC = () => {
    // subscribe to dark mode
    const theme = useIntegraTheme()

    // extract the visibility of the reference area from the global visibility state
    const visibility = useSignal<"none" | "visible">("none")
    useSignalEffect(() => {
        visibility.value = layerVisibility.value.referenceArea || "none"
    })

    return <>
        <Source id="reference-area" type="geojson" data={referenceFeature.value ? referenceFeature.value : {type: "FeatureCollection", features: []}} generateId>
            <Layer 
                id="reference-area-layer"
                source="reference-area"
                type="fill"
                paint={{
                    'fill-color': theme.palette.secondary.dark,
                    'fill-opacity': 0.2
                } as FillPaint}
                layout={{visibility: visibility.value}}
            />
            <Layer 
                id="reference-area-outline-layer"
                source="reference-area"
                type="line"
                paint={{
                    'line-color': theme.palette.secondary.dark,
                    'line-width': 4
                } as LinePaint}
                layout={{visibility: visibility.value}}
            />
        </Source>
    </>
}

export default ReferenceAreaSource