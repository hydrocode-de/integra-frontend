import { Alert, Box, Button } from "@mui/material"
import { flyTo } from "../MainMap/MapObservableStore"
import { zoom } from "../../appState/mapSignals"
import { loadReferenceAreaSuggestions } from "../../appState/referenceAreaSignals"
import GeocoderSearch from "./GeocoderSearch"


const ReferenceAreaEditor: React.FC = () => {
    const onLoadOSM = () => {
        loadReferenceAreaSuggestions()
    }
    return <>
        <Box display="flex" flexDirection="column">
            { zoom.value < 14.5 ? (<>
                <Box sx={{mt: 2}}>
                    <GeocoderSearch />
                </Box>
                <Alert sx={{mt: 2}} severity="info">
                    Zoome nahe genug heran, um eine Agrarfläche zu wählen, oder suche einen Ort.
                    <Button variant="text" onClick={() => flyTo({zoom: 14.5})}>heranzoomen</Button>
                </Alert>
            </>) : (<>
                <Alert severity="info">
                    Wähle eine der Agrarflächen und bearbeite die Fläche durch Ziehen der Knotenpunkte<br /> 
                </Alert>

                <Alert severity="warning">Bearbeiten noch in Entwicklung.</Alert>

                {/* <Button variant="outlined" disabled={zoom.value < 13.0} onClick={onLoadOSM}>Load OSM</Button> */}
            </>) }
        </Box>
    </>
}

export default ReferenceAreaEditor