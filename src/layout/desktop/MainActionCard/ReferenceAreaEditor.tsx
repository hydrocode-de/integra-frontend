import { Alert, Button } from "@mui/material"
import { flyTo } from "../../../components/MainMap/MapObservableStore"

const ReferenceAreaEditor: React.FC = () => {
    return <>
        <Alert severity="info">
            Editor auf dieser Zoomstufe nicht verfügbar.<br /> 
            <Button variant="text" size="small" onClick={() => flyTo({zoom: 18.5, pitch: 45})}>Hereinzoomen.</Button>
        </Alert>
    </>
}

export default ReferenceAreaEditor