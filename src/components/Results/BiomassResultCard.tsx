import { Box, MenuItem, Select, Typography } from "@mui/material"
import { biomassProperty, biomassSimulation } from "../../appState/biomassSimulationSignals"
import Plot from "react-plotly.js"
import range from "lodash.range"
import { simulationStep } from "../../appState/simulationSignals"
import { useSignal } from "@preact/signals-react"
import { referenceAreaHectar } from "../../appState/referenceAreaSignals"

const BiomassResultCard: React.FC = () => {
    // define a signal, to normalize the biomass production to the hectar
    const biomassMode = useSignal<'total' | 'perHectar'>('total')

    return <>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box display="flex" flexDirection="row" mt={1} sx={{width: '100%'}}>
                <Select 
                    sx={{width: '100%'}}
                    value={biomassProperty.value} 
                    onChange={(newProp) => biomassProperty.value = newProp.target.value as 'carbon' | 'agb'}
                >
                    <MenuItem value="agb">Oberirdische Biomasse</MenuItem>
                    <MenuItem value="carbon">Kohlenstoff</MenuItem>
                </Select>
                <Select 
                    sx={{width: '100%'}}
                    value={biomassMode.value} 
                    onChange={(newMode) => biomassMode.value = newMode.target.value as 'total' | 'perHectar'}
                >
                    <MenuItem value="total">Gesamt (t)</MenuItem>
                    <MenuItem value="perHectar">Pro Hektar (t / ha)</MenuItem>
                </Select>
            </Box>
            <Box p={3} display="flex" justifyContent="center" alignItems="baseline" width="100%">
                <Typography variant="h3" sx={{color: biomassProperty.value === 'agb' ? '#462e17' : '#241e19'}}>
                    { (biomassSimulation.value.total[simulationStep.value.current] / 1000 / (biomassMode.value === 'total' ? 1 : referenceAreaHectar.value)).toFixed(1) }
                </Typography>
                <Typography variant="h5" ml={0.3} sx={{color: biomassProperty.value === 'agb' ? '#462e17' : '#241e19'}}>
                    { biomassMode.value === 'total' ? 't' : 't / ha' }
                </Typography>
            </Box>
            <Plot
                style={{width: '100%'}}
                layout={{
                    height: 300, 
                    margin: {t: 10, r: 15},
                    autosize: true,
                    showlegend: false,
                    xaxis: {title: 'Jahre', range: [0, 100]},
                    yaxis: {title: biomassProperty.value === 'agb' ?  `Biomasse (${biomassMode.value === 'total' ? 't' : 't / ha'})` : `Kohlenstoff (${biomassMode.value === 'total' ? 't' : 't / ha'})`}
                }}
                data={[
                    {
                        type: 'scatter',
                        mode: 'lines',
                        x: range(99),
                        y: biomassSimulation.value.total.map(v => biomassMode.value === 'total' ? v / 1000 : (v / 1000) / referenceAreaHectar.value),
                        hovertemplate: `nach %{x} Jahren<br>Biomasse: %{y:.2f} ${biomassMode.value === 'total' ? 't' : 't / ha'}<extra></extra>`,
                        fill: 'tozeroy',
                        line: {
                            width: 2,
                            color: biomassProperty.value === 'agb' ? '#654321' : '#483C32'
                        }
                    },
                    {
                        type: 'scatter',
                        mode: 'markers',
                        x: [simulationStep.value.current],
                        y: [biomassSimulation.value.total[simulationStep.value.current] / 1000 / (biomassMode.value === 'total' ? 1 : referenceAreaHectar.value)],
                        marker: {
                            color: biomassProperty.value === 'agb' ? '#462e17' : '#241e19', 
                            size: 15
                        },
                        hovertemplate: `Momentan (%{x} Jahre)<br>Biomasse: %{y:.2f} ${biomassMode.value === 'total' ? 't' : 't / ha'}<extra></extra>`,
                    }
                ]}
                config={{displayModeBar: false}}
                
            />
        </Box>
    </>
}

export default BiomassResultCard