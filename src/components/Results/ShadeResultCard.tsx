import { Box, Tooltip, Typography } from "@mui/material"
import Plot from "react-plotly.js"
import { shadeStats } from "../../appState/shadeSimulationSignals"
import { useComputed } from "@preact/signals-react"
import { referenceAreaHectar } from "../../appState/referenceAreaSignals"
import { agriculturalArea } from "../../appState/treeLineSignals"
import { area } from "@turf/turf"
import { Info } from "@mui/icons-material"

const ShadeResultCard: React.FC = () => {
    // calculate the two sizes every time they change
    const shadedArea = useComputed<number>(() => Math.round(shadeStats.value.shadedArea / 1000) / 10)
    const unshadedArea = useComputed<number>(() => Math.round((shadeStats.value.agriculturalArea - shadeStats.value.shadedArea) / 1000) / 10)
    
    return <>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Box width="100%" p={1} display="block">
                <Typography variant="h6">Beschattung der landwirtschaftlichen Fläche</Typography>
            </Box>
            <Box width="100%" p={1} mt={2} display="block">
                <Typography variant="body1">{`Gesamtfläche:     ${referenceAreaHectar.value.toFixed(1)} ha`}</Typography>
                <Box display="flex" flexDirection="row" alignItems="center">
                <Typography variant="body1" mr={1}>
                    {`Landw. Fläche:    ${(area(agriculturalArea.value) / 10000).toFixed(1)} ha`}
                </Typography>
                <Tooltip title="Die landwirtschaftliche Fläche umfasst die für landwirtschaftliche Zwecke nutzbare Fläche, abzüglich der von Baumstreifen beanspruchten Fläche.">
                        <Info fontSize="small" color="info" />
                    </Tooltip>
                </Box>

            </Box>
            <Box p={1} mt={1} mx="auto" display="block">
                <Plot 
                    layout={{
                        width: 400,
                        height: 350, 
                        showlegend: true,
                        margin: {t: 0, b: 15},
                        legend: {orientation: 'h'},
                    }}
                    data={[{
                        type: 'pie',
                        hole: 0.4,
                        values: [unshadedArea.value, shadedArea.value],
                        labels: ['Unbeschattet', 'Beschattet'],
                        //textinfo: 'label+value+percent',
                        textinfo: 'none',
                        // texttemplate: '%{label}: %{value} ha',
                        insidetextorientation: 'radial',
                        hovertemplate: '%{customdata[0]}<extra></extra>',
                        customdata: [
                            `<b>Unbeschattet</b><br>${unshadedArea.value} ha<br>${(unshadedArea.value / (shadedArea.value + unshadedArea.value) * 100).toFixed(0)}%`, 
                            `<b>Beschattet</b><br>${shadedArea.value} ha<br>${(shadedArea.value / (shadedArea.value + unshadedArea.value) * 100).toFixed(0)}%`, 
                        ],
                        marker: {
                            colors: ['#B4C6E7', '#628ACC'],
                            line: {
                                color: 'white',
                                width: 1
                            }
                        }
                    }]}
                    config={{displayModeBar: false}}
                />
            </Box>
        </Box>
    </>
}

export default ShadeResultCard