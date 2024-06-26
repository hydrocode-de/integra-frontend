import { Box, MenuItem, Select, Tooltip, Typography } from "@mui/material"
import { allInsects, insectPopulationName } from "../../appState/insectsSimulationSignals"
import { Info } from "@mui/icons-material"

import InsectPhanologyPlot from "./InsectResult/InsectPhanologyPlot"
import InsectLarvaePlot from "./InsectResult/InsectLarvaePlot"
import InsectActivityPlot from "./InsectResult/InsectActivityPlot"
import { useState } from "react"

const InsectResultCard: React.FC = () => {
    // create a state to handle the selected plots
    const [selectedPlot, setSelectedPlot] = useState<'phaeno' | 'larvae'>('phaeno')

    return <>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box maxWidth="400px" width="100%" mx="auto">

                {/* Select Plot */}
                <Box my={0.5}>
                    <Select sx={{width: '100%'}} size="small" value={selectedPlot} onChange={e => setSelectedPlot(e.target.value as 'phaeno' | 'larvae')}>
                        <MenuItem value="phaeno">Unterstützte Bienenarten</MenuItem>
                        <MenuItem value="larvae">Bienenartspezifische Information</MenuItem>
                    </Select>
                </Box>
                    

                {/* Phaenology */}
                { selectedPlot === 'phaeno' ? (<>
                    <Typography variant="h6" mt={0.5}>Anzahl unterstützter Bienenarten</Typography>
                    <InsectPhanologyPlot />
                </>) : null }

                {/* Larvae */}
                { selectedPlot === 'larvae' ? (<>
                    <Typography variant="h6">Anzahl unterstützter Larven pro Jahr</Typography>
                    <Box mt={0.5} px={1} width="100%" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">  
                        <Select sx={{width: '100%'}} size="small" value={insectPopulationName.value} onChange={e => insectPopulationName.value = e.target.value}>
                            { allInsects.map(insect => (
                                <MenuItem key={insect.latin_name} value={insect.latin_name}>{insect.german_name} ({insect.pollenPerLavae} mm³ / Larve)</MenuItem>
                            )) }
                        </Select>
                        <Box ml={3}>
                            <Tooltip title="Dieser Wert ist ein theoretischer Wert der Ihnen die Einschätzung bzw. Vergleichbarkeit des Nahrungsangebots für Insektenlarven ermöglichen soll. Für die Berechnung wird angenommen, dass das gesamte Pollenvolumen des geplanten Systems ausschließlich von der ausgewählten Insektenart aufgebraucht wird, unabhängig von der Übereinstimmung des Blüh- bzw. Aktivitätszeitraums.">
                                <Info color="info" />
                            </Tooltip>
                        </Box>
                    </Box>
                    <InsectLarvaePlot />
                    
                    {/* Acitivity Period */}
                    <Typography variant="h6">Blüh- bzw. Aktivitätszeitraum</Typography>
                    <InsectActivityPlot />
                </>) : null }
                
            </Box> 

        </Box>

    </>
}

export default InsectResultCard