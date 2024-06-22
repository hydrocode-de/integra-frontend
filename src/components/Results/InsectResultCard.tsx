import { Box, MenuItem, Select, Tooltip, Typography } from "@mui/material"
import Plot from "react-plotly.js"
import { activeBlossomsMonths, allInsects, insectPopulation, insectPopulationName, insectsSimulation, speciesToInsects } from "../../appState/insectsSimulationSignals"
import { Data } from "plotly.js"
import range from "lodash.range"
import { seasonMonth, simulationStep } from "../../appState/simulationSignals"
import { EmojiNature, Info } from "@mui/icons-material"
import { treeSpecies } from "../../appState/backendSignals"
import { useComputed } from "@preact/signals-react"
import { treeLocationFeatures } from "../../appState/geoJsonSignals"
import InsectPhanologyPlot from "./InsectResult/InsectPhanologyPlot"
import InsectLarvaePlot from "./InsectResult/InsectLarvaePlot"
import InsectActivityPlot from "./InsectResult/InsectActivityPlot"

const InsectResultCard: React.FC = () => {
    // aggregate the insects supported by the current system
    const numberOfSpecies = useComputed(() => {
        // filter the species currently planted
        const species = treeLocationFeatures.value.map(f => f.properties.treeType)
            .filter((specimen, idx, species) => species.indexOf(specimen) === idx)

        // filter the insects table and map to matrix
        const insects = Object.entries(speciesToInsects.value)
            .filter(([s, _]) => species.includes(s))
            .map(([_, insect]) => insect)
        
        // reduce the first dimension(rows) of the matrix (bitwise OR)
        const abundantSpecies = range(insects[0].length).map(index => {
            // map to the current column
            return insects.map(insect => insect[index])
                .reduce((prev, curr) => prev || curr, false)  // bitwise OR
        })

        // finally, we need the sum of that
        return abundantSpecies.reduce((prev, curr) => prev + (curr ? 1 : 0), 0)
    })

    return <>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box maxWidth="400px" width="100%" mx="auto">
                {/* Phaenology */}
                <Typography variant="h6" mt={0.5}>Anzahl unterstützter Bienenarten</Typography>
                <InsectPhanologyPlot />

                {/* Larvae */}
                <Typography variant="h6">Anzahl unterstützter Larven</Typography>
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
                
            </Box> 

        {/* <Typography variant="h6">Anzahl unterstützter Insektenarten</Typography> */}
        <Box mt={1} width="100%" display="flex" mx={1} flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box />
            <Box display="flex" flexDirection="row" alignItems="center" fontSize="1.5rem">
                <Box mr={1}>
                    <EmojiNature color="warning" />
                </Box>
                <Typography variant="h4" component="span" sx={{color: '#ed6c02'}}>{numberOfSpecies.value}</Typography>
            </Box>
            <Box mr={1}>
                <Tooltip title="Dieser Wert bezeichnet die Anzahl an potentiell unterstützten Insektenarten, welche sich aus der in Ihrem System vorhandenen Baum- und Strauchartenzusammensetzung ergibt.">
                    <Info color="info" />
                </Tooltip>
            </Box>
        </Box>

        </Box>

    </>
}

export default InsectResultCard