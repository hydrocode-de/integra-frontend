import Plot from "react-plotly.js"
import { blossomVarSimulation, blossomVariable } from "../../../appState/blossomSimulationSignals"
import { germanSpecies, simulationTimeSteps, treeSpecies } from "../../../appState/backendSignals"
import { Data } from "plotly.js"
import { simulationStep } from "../../../appState/simulationSignals"
import { useComputed, useSignalEffect } from "@preact/signals-react"


const BlossomVarTranslation = {
    blossoms: 'Anzahl Blüten',
    nectar: 'Nektar (mm³)',
    pollen: 'Pollen (mm³)'
}

const blossomVarToColor = (type: string, blossomVar: 'blossoms' | 'pollen' | 'nectar') => {
    // swith the blossomVar
    if (blossomVar === 'blossoms') {
        if (type === 'Baum') {
            return '#E797D1'
        } else {
            return '#F0BCE1'
        }
    } else if (blossomVar === 'pollen') {
        if (type === 'Baum') {
            return '#F9DC71'
        } else {
            return '#FCECB4'
        }
    } else {
        if (type === 'Baum') {
            return '#FFB370'
        } else {
            return '#FFCB9E'
        }
    }
}

const BlossomsPerSpeciesPlot: React.FC = () => {
    const treeTypeToColor = useComputed(() => {
        // get the tree species
        const species = treeSpecies.value

        // get the current blossom variable
        const blossomVar = blossomVariable.value

        // map the colors
        return Object.fromEntries(Object.values(species).map(specimen => {
            return [specimen.latin_name, blossomVarToColor(specimen.type, blossomVar)]
        }))
    })

    // dev only
    useSignalEffect(() => console.log(treeTypeToColor.value))

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
                ...Object.entries(blossomVarSimulation.value).filter(([key, _]) => key !== 'total')
                    .sort(([typeA, ], [typeB, ]) => (treeSpecies.value.find(s => s.latin_name === typeA)!.type[0]) < (treeSpecies.value.find(s => s.latin_name === typeB)!.type[0]) ? -1 : 1)
                    .map(([treeType, values], idx) => {
                    return {
                        type: 'scatter',
                        mode: 'lines',
                        x: simulationTimeSteps.value,
                        y: values,
                        fill: 'tonexty',
                        stackgroup: 'one',
                        line: { 
                            width: 2,
                            color: treeTypeToColor.value[treeType]
                        },
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