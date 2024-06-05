import { Box, MenuItem, Select, Tooltip, Typography } from "@mui/material"
import Plot from "react-plotly.js"
import { activeBlossomsMonths, allInsects, insectPopulation, insectPopulationName, insectsSimulation } from "../../appState/insectsSimulationSignals"
import { Data } from "plotly.js"
import range from "lodash.range"
import { simulationStep } from "../../appState/simulationSignals"
import { Info } from "@mui/icons-material"
import { treeSpecies } from "../../appState/backendSignals"

const InsectResultCard: React.FC = () => {
    return <>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography mt={1} variant="h6">Anzahl unterstützter Larven</Typography>
        <Box mt={1} px={1} width="100%" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">  
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
            
            <Plot
                style={{width: '100%'}}
                layout={{
                    height: 250, 
                    margin: {t: 10, r: 15},
                    autosize: true,
                    showlegend: false,
                    xaxis: {title: 'Jahre', range: [0, 100]},
                    yaxis: {title: 'Anzahl Larven'},
                }}
                data={[
                    ...Object.entries(insectsSimulation.value).filter(([key, _]) => key !=='total').map(([treeType, values], idx) =>{
                        return {
                            type: 'scatter',
                            mode: 'lines',
                            x: range(99),
                            y: values.map(v => Math.round(v / insectPopulation.value.pollenPerLavae)),
                            fill: 'tonexty',
                            line: { width: 2},
                            stackgroup: 'one',
                            hovertemplate: `${treeSpecies.peek().find(t => t.latin_name === treeType)!.german_name}<br>nach %{x} Jahren<br>pot. Anzahl Larven: %{y}<extra></extra>`,

                        } as Data
                    }),
                    {
                        type: 'scatter',
                        mode: 'markers',
                        x: [simulationStep.value.current],
                        y: [Math.round(insectsSimulation.value.total[simulationStep.value.current] / insectPopulation.value.pollenPerLavae)],
                        marker: {
                            size: 15,
                            color: 'black'
                        },
                        hovertemplate: `Momentan (%{x} Jahre)<br>pot. Anzahl Larven: %{y}<extra></extra>`
                    }
                ]}
                config={{displayModeBar: false}}
            />
            
            <Typography variant="h6">Blüh- bzw. Aktivitätszeitraum</Typography>
            <Plot 
                style={{width: '100%'}}
                layout={{
                    height: 200,
                    margin: { t: 10, r: 10, l: insectPopulation.value.german_name.length < 12 ? 100 : 165 },
                    autosize: true,
                    showlegend: false,
                    barmode: 'stack',
                    xaxis: {
                        title: 'Monate', 
                        range: [1, 12], tickvals: 
                        range(1, 13), 
                        ticktext: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']},
                    yaxis: {tickangle: 0},
                }}
                data={[
                    {
                        type: 'bar',
                        orientation: 'h',
                        y: [insectPopulation.value.german_name, 'Blühabdeckung'],
                        x: [
                            insectPopulation.value.startMonth, 
                            Object.values(activeBlossomsMonths.value).findIndex(v => v > 0) + 1
                        ],
                        marker: {
                            color: 'white',
                            line: {color: 'white'}
                        },
                        hoverinfo: 'skip'
                    },
                    {
                        type: 'bar',
                        orientation: 'h',
                        y: [insectPopulation.value.german_name, 'Blühabdeckung'],
                        x: [
                            insectPopulation.value.endMonth - insectPopulation.value.startMonth,
                            0
                        ],
                        marker: {
                            color: '#9ec3e5',
                            line: {color: '#9ec3e5'}
                        },
                        hoverinfo: 'skip'
                    },
                    {
                        type: 'bar',
                        orientation: 'h',
                        y: [insectPopulation.value.german_name, 'Blühabdeckung'],
                        x: [
                            0,
                            12 - (Object.values(activeBlossomsMonths.value).reverse().findIndex(v => v > 0) + 1)
                        ],
                        marker: {
                            color: '#c32f69',
                            line: {color: '#c32f69'}
                        },
                        hoverinfo: 'skip'
                    }
                ]}
                config={{displayModeBar: false}}
            />
        </Box>
    </>
}

export default InsectResultCard