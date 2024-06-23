import { Box, MenuItem, Select, Typography } from "@mui/material"
import BlossomsPerSpeciesPlot from "./BlossomsResult/BlossomsPerSpeciesPlot"
import { BlossomVariable, blossomVariable, setBlossomVariable } from "../../appState/blossomSimulationSignals"

const BlossomOptions: {value: BlossomVariable, label: String}[] = [
    {value: 'blossoms', label: 'Blütenanzahl'},
    {value: 'pollen', label: 'Pollenvolumen'},
    {value: 'nectar', label: 'Nektarvolumen'}
]
const BlossomResultCard: React.FC = () => {
    return <>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box maxWidth="400px" width="100%" mx="auto">
                {/* Phaenology */}
                <Typography variant="h6" mt={0.5}>Blühangebot nach Art</Typography>
                <Box mt={0.5} px={1} width="100%" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Select sx={{width: '100%'}} size="small" value={blossomVariable.value} onChange={e => setBlossomVariable(e.target.value as BlossomVariable)}>
                        { Object.values(BlossomOptions).map(opt => (
                            <MenuItem key={opt.value} value={opt.value}>{ opt.label }</MenuItem>
                        )) }

                    </Select>
                </Box>
                <BlossomsPerSpeciesPlot />
                
            </Box>
        </Box>
    </>
}

export default BlossomResultCard