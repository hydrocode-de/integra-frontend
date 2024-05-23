import { Box } from "@mui/material"
import { biomassSimulation } from "../../appState/biomassSimulationSignals"
import Plot from "react-plotly.js"
import range from "lodash.range"

const BiomassResultCard: React.FC = () => {
    return <>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Plot
                layout={{width: 350, height: 250, title: "Biomasse"}}
                data={[
                    {
                        type: 'scatter',
                        mode: 'lines+markers',
                        x: range(99),
                        y: biomassSimulation.value.total
                    }
                ]}
                config={{displayModeBar: false}}
            />
        </Box>
    </>
}

export default BiomassResultCard