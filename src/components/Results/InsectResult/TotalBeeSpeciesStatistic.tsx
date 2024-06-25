import { EmojiNature, Info } from "@mui/icons-material"
import { Box, Tooltip, Typography } from "@mui/material"
import { totalBeeSpecies } from "../../../appState/insectsSimulationSignals"


const TotalBeeSpeciesStatistic: React.FC = () => {
    return <>
    <Box mt={1} width="100%" display="flex" mx={1} flexDirection="row" justifyContent="space-between" alignItems="center">
        <Box />
        <Box display="flex" flexDirection="row" alignItems="center" fontSize="1.5rem">
            <Box mr={1}>
                <EmojiNature color="warning" />
            </Box>
            <Typography variant="h4" component="span" sx={{color: '#ed6c02'}}>{totalBeeSpecies.value}</Typography>
        </Box>
        <Box mr={1}>
            <Tooltip title="Dieser Wert bezeichnet die Anzahl an potentiell unterstützten Insektenarten, welche sich aus der in Ihrem System vorhandenen Baum- und Strauchartenzusammensetzung ergibt.">
                <Info color="info" />
            </Tooltip>
        </Box>
    </Box>
    </>
}

export default TotalBeeSpeciesStatistic