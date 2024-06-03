import { Box, Typography } from "@mui/material"
import Plot from "react-plotly.js"
import { activeBlossomsMonths, insectPopulation, insectPopulationName, insectsSimulation } from "../../appState/insectsSimulationSignals"
import { Data } from "plotly.js"
import range from "lodash.range"
import { simulationStep } from "../../appState/simulationSignals"

const InsectResultCard: React.FC = () => {
    return <>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Typography variant="h6">unterstütze Larvenpopulation</Typography>
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
                            stackgroup: 'one'
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
                        }
                    }
                ]}
                config={{displayModeBar: false}}
            />
            
            <Typography variant="h6">{insectPopulation.value.german_name} Aktität</Typography>
            <Plot 
                style={{width: '100%'}}
                layout={{
                    height: 200,
                    margin: {t: 10, r: 15},
                    autosize: true,
                    showlegend: false,
                    barmode: 'stack',
                    xaxis: {title: 'Monate', range: [0, 12]},
                    yaxis: {rotation: 45},
                }}
                data={[
                    {
                        type: 'bar',
                        orientation: 'h',
                        y: ['Larven', 'Blüten'],
                        x: [
                            insectPopulation.value.startMonth, 
                            Object.values(activeBlossomsMonths.value).findIndex(v => v > 0) + 1
                        ],
                        marker: {
                            color: 'white',
                            line: {color: 'white'}
                        }
                    },
                    {
                        type: 'bar',
                        orientation: 'h',
                        y: ['Larven', 'Blüten'],
                        x: [
                            insectPopulation.value.endMonth - insectPopulation.value.startMonth,
                            12 - (Object.values(activeBlossomsMonths.value).reverse().findIndex(v => v > 0) + 1)
                        ],
                        marker: {
                            color: 'blue',
                            line: {color: 'blue'}
                        }
                    }
                ]}
                config={{displayModeBar: false}}
            />
        </Box>
    </>
}

export default InsectResultCard