import Plot from "react-plotly.js"
import { blossomVarSimulation } from "../../../appState/blossomSimulationSignals"
import { germanSpecies, simulationTimeSteps, treeSpecies } from "../../../appState/backendSignals"
import { Data } from "plotly.js"
import { simulationStep } from "../../../appState/simulationSignals"

const BlossomsPerSpeciesPlot: React.FC = () => {
    return <>
        <Plot
            style={{width: '100%'}} 
            layout={{
                height: 300,
                margin: {t: 10, r: 15},
                autosize: true,
                showlegend: false,
                xaxis: {title: 'Jahre', range: [0, 100]},
                yaxis: {title: 'Anzahl Blüten'}
            }}
            data={[
                ...Object.entries(blossomVarSimulation.value).filter(([key, _]) => key !== 'total').map(([treeType, values], idx) => {
                    return {
                        type: 'scatter',
                        mode: 'lines',
                        x: simulationTimeSteps.value,
                        y: values,
                        fill: 'tonexty',
                        stackgroup: 'one',
                        line: { width: 2 },
                        hovertemplate: `${germanSpecies.peek()[treeType]}<br>nach %{x} Jahren<br>Anzahl Blüten: %{y}<extra></extra>`
                    } as Data
                }),
                {
                    type: 'scatter',
                    mode: 'markers',
                    x: [simulationStep.value.current],
                    y: [blossomVarSimulation.value.total[simulationTimeSteps.value.filter(t => t <= simulationStep.value.current).length]],
                    marker: {color: 'black', size: 15},
                    hovertemplate: `Momentan (%{x} Jahre)<br>Anzahl Blüten: %{y}<extra></extra>`
                }
                
            ]}
            config={{displayModeBar: false}}
        />
    </>
}

export default BlossomsPerSpeciesPlot