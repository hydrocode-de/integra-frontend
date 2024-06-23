import Plot from "react-plotly.js"
import { blossomVarSimulation, blossomVariable } from "../../../appState/blossomSimulationSignals"
import { germanSpecies, simulationTimeSteps, treeSpecies } from "../../../appState/backendSignals"
import { Data } from "plotly.js"
import { simulationStep } from "../../../appState/simulationSignals"


const BlossomVarTranslation = {
    blossoms: 'Anzahl Blüten',
    nectar: 'Nektar (mm³)',
    pollen: 'Pollen (mm³)'
}
const BlossomsPerSpeciesPlot: React.FC = () => {
    return <>
        <Plot
            style={{width: '100%'}} 
            layout={{
                height: 200,
                margin: {t: 10, r: 15},
                autosize: true,
                showlegend: false,
                xaxis: {
                    //title: 'Jahre', 
                    range: [0, 100],
                    tickvals: [10, 30, 50, 80],
                    ticktext: ['10 Jahre', '30 Jahre', '50 Jahre', '80 Jahre']
                },
                yaxis: {title: BlossomVarTranslation[blossomVariable.value]},
                xaxis2: {overlaying: 'x', side: 'top', showgrid: false, showline: false, showticklabels: false, zeroline: false, range: [0, 100]},
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
                        hovertemplate: `${germanSpecies.peek()[treeType]}<br>nach %{x} Jahren<br>${BlossomVarTranslation[blossomVariable.value]}: %{y}<extra></extra>`
                    } as Data
                }),
                {
                    type: 'scatter',
                    mode: 'markers',
                    x: [simulationStep.value.current],
                    y: [blossomVarSimulation.value.total[simulationTimeSteps.value.filter(t => t <= simulationStep.value.current).length]],
                    marker: {color: 'black', size: 15},
                    hovertemplate: `Momentan (%{x} Jahre)<br>${BlossomVarTranslation[blossomVariable.value]}: %{y}<extra></extra>`,
                    xaxis: 'x2'

                }
                
            ]}
            config={{displayModeBar: false}}
        />
    </>
}

export default BlossomsPerSpeciesPlot