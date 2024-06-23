import { Box, Typography } from "@mui/material"
import BlossomsPerSpeciesPlot from "./BlossomsResult/BlossomsPerSpeciesPlot"

const BlossomResultCard: React.FC = () => {
    return <>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box maxWidth="400px" width="100%" mx="auto">
                {/* Phaenology */}
                <Typography variant="h6" mt={0.5}>Blühangebot nach Art</Typography>
                <BlossomsPerSpeciesPlot />
                
            </Box>
        </Box>
    </>
}

export default BlossomResultCard