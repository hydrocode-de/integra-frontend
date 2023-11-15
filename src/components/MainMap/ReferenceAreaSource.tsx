import { Layer, Source } from "react-map-gl"
import { referenceFeature } from "../../appState/statisticsSignals"
import { FillPaint, LinePaint } from "mapbox-gl"
import { useIntegraTheme } from "../../context/IntegraThemeContext"


const ReferenceAreaSource: React.FC = () => {
    // subscribe to dark mode
    const theme = useIntegraTheme()

    return <>
        <Source id="reference-area" type="geojson" data={referenceFeature.value ? referenceFeature.value : undefined} generateId>
            <Layer 
                id="reference-area-layer"
                source="reference-area"
                type="fill"
                paint={{
                    'fill-color': theme.palette.secondary.dark,
                    'fill-opacity': 0.2
                } as FillPaint}
            />
            <Layer 
                id="reference-area-outline-layer"
                source="reference-area"
                type="line"
                paint={{
                    'line-color': theme.palette.secondary.dark,
                    'line-width': 4
                } as LinePaint}
            />
        </Source>
    </>
}

export default ReferenceAreaSource