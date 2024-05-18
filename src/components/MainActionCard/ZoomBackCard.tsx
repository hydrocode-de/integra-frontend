import { Alert, Box, Button } from "@mui/material"
import { flyTo } from "../MainMap/MapObservableStore"

const ZoomBackCard: React.FC = () => {
    return <>
        <Box display="flex" flexDirection="column">
            <Alert severity="info">
                Baum Editor auf dieser Zoomstufe nicht verfügbar.<br /> 
                <Button variant="text" size="small" onClick={() => flyTo({zoom: 18.5, pitch: 45})}>Hereinzoomen.</Button>
            </Alert>
        </Box>    
    </>
}

export default ZoomBackCard