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
                style={{width: '100%', maxWidth: '330px', margin: 'auto'}}
                layout={{
                    height: 200, 
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
                            hovertemplate: `${treeSpecies.peek().find(t => t.latin_name === treeType)!.german_name}<br>nach %{x} Jahren<br>Anzahl Larven: %{y}<extra></extra>`,

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
                        hovertemplate: `Momentan (%{x} Jahre)<br>Anzahl Larven: %{y}<extra></extra>`
                    }
                ]}
                config={{displayModeBar: false}}
            />
            
            <Typography variant="h6">Blüh- bzw. Aktivitätszeitraum</Typography>
            <Plot 
                style={{width: '100%', maxWidth: '330px', margin: 'auto'}}
                layout={{
                    height: 140,
                    margin: { t: 10, r: 10, l: insectPopulation.value.german_name.length < 12 ? 100 : 185 },
                    autosize: true,
                    showlegend: false,
                    barmode: 'stack',
                    xaxis: {
                        title: 'Monate', 
                        range: [3, 10], tickvals: 
                        range(3, 10).map(v => v + 0.5), 
                        ticktext: ['Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt',]},
                    yaxis: {tickangle: 0},
                    yaxis2: {overlaying: 'y', side: 'right', showgrid: false, showline: false, showticklabels: false, zeroline: false, range:[0, 1]},
                    
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
                    },
                    {
                        type: 'scatter',
                        mode: 'lines',
                        x: [seasonMonth.value + 0.5, seasonMonth.value + 0.5],
                        y: [insectPopulation.value.german_name, 'Blühabdeckung'],
                        line: {dash: 'dash', width: 2, color: 'grey'},
                        yaxis: 'y2'
                    }
                ]}
                config={{displayModeBar: false}}
            />
        
        <Typography variant="h6">Anzahl unterstützter Insektenarten</Typography>
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