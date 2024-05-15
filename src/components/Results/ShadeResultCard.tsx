import { Box } from "@mui/material"
import Plot from "react-plotly.js"
import { shadeStats } from "../../appState/shadeSimulationSignals"

const ShadeResultCard: React.FC = () => {
    return <>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box p={1}>
                <Plot 
                    layout={{width: 350, height: 350, title: "Unbeschattete Fläche (ha)", showlegend: false, }}
                    data={[{
                        type: 'pie',
                        values: [
                            (shadeStats.value.agriculturalArea / 10000).toPrecision(3), 
                            (shadeStats.value.shadedArea / 10000).toPrecision(3)
                        ],
                        labels: ['Unbeschattet', 'Beschattet'],
                        textinfo: 'label+value+percent',
                        insidetextorientation: 'radial',
                        marker: {
                            colors: ['#FFA07A', 'grey']
                        }
                    }]}
                    config={{displayModeBar: false}}
                />
            </Box>
        </Box>
    </>
}

export default ShadeResultCard