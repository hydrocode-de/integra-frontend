import Plot from "react-plotly.js"
import { insectPopulation, insectsSimulation } from "../../../appState/insectsSimulationSignals"
import { treeSpecies } from "../../../appState/backendSignals"
import range from "lodash.range"
import { Data } from "plotly.js"
import { simulationStep } from "../../../appState/simulationSignals"

const InsectLarvaePlot: React.FC = () => {
    return <>
        <Plot
            style={{width: '100%', maxWidth: '400px', margin: 'auto'}}
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
    </>
}

export default InsectLarvaePlot