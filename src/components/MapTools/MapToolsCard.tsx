import { useSignal } from "@preact/signals-react"
import { hasData } from "../../appState/geoJsonSignals"
import { Box, Card, CardActionArea, Collapse, IconButton, Typography } from "@mui/material"
import { ExpandLess, ExpandMore, FitScreenOutlined } from "@mui/icons-material"
import MeasureButtons from "./MeasureButtons"
import { fitReferenceArea, referenceArea } from "../../appState/referenceAreaSignals"

const MapToolsCard: React.FC = () => {
    // track if the card is open
    const open = useSignal<boolean>(true)

    // only show the card at all if there is data
    //if (!hasData.value) return null

    // render the card
    return <>
        <Card sx={{
            mt: open.value ? '16px' : '0px',
            ml: open.value ? '16px' : '0px',
            mb: open.value ? '16px' : '0px', 
            p: open.value ? 2 : 1
        }}>
            <CardActionArea onClick={() => open.value = !open.peek()}>
                <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" m={0}>
                    <Typography variant={open.value ? "h6" : "body1"} my="auto">
                        Kartenwerkzeuge
                    </Typography>
                    { open.value ? <ExpandLess /> : <ExpandMore /> }
                </Box>
            </CardActionArea>

            <Collapse in={open.value}>
                <Box sx={{overflowY: 'scroll', p: 1}}>
                    
                    <Box display="flex" flexDirection="row">
                        <MeasureButtons />
                        <IconButton 
                            color="primary" 
                            onClick={() => fitReferenceArea()} 
                            disabled={referenceArea.value.features.length === 0}
                        >
                            <FitScreenOutlined />
                        </IconButton>
                    </Box>
                    
                </Box>
            </Collapse>

        </Card>
    </>
}

export default MapToolsCard