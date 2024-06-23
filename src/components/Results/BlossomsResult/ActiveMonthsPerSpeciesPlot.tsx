import Plot from "react-plotly.js"
import { activeBlossomsMonths } from "../../../appState/blossomSimulationSignals"
import { germanSpecies } from "../../../appState/backendSignals"
import { seasonMonth } from "../../../appState/simulationSignals"

const ActiveMonthsPerSpeciesPlot: React.FC = () => {
    return <>
        <Plot 
            style={{width: '100%'}}
            layout={{
                height: 200,
                margin: {t: 10, r: 15},
                showlegend: false,
                xaxis: {
                    title: 'Monat',
                    tickvals: [3, 4, 5, 6, 7, 8, 9, 10],
                    ticktext: ['Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt'],
                    range: [2.5, 10.5],
                },
                yaxis2: {overlaying: 'y', side: 'right', showgrid: false, showline: false, showticklabels: false, zeroline: false, range:[0, 1]},
                xaxis2: {overlaying: 'x', side: 'bottom', showgrid: false, showline: false, showticklabels: false, zeroline: false, range:[2.5, 10.5]},
            }}
            data={[
                {
                    type: 'heatmap',
                    x: [3, 4, 5, 6, 7, 8, 9, 10].map(v => v + 0.5),
                    y: [
                        'Gesamt', 
                        ...Object.keys(activeBlossomsMonths.value).filter(k => k !== 'total').map(lat => germanSpecies.value[lat])
                    ],
                    z: [
                        activeBlossomsMonths.value['total'].slice(2, 10).map(v => v > 0 ? 0.5 : 0),
                        ...Object.entries(activeBlossomsMonths.value)
                            .filter(([key, _])=> key !== 'total')
                            .map(([_, months], idx) => months.slice(2, 10).map(v => v > 0 ? idx + 1 : 0))
                    ],
                    showscale: false,
                    hoverinfo: 'skip',
                    colorscale: [
                        [0, 'transparent'],
                        [0.5, 'black'],
                        [1, 'orange'],
                        [2, 'yellow'],
                        [3, 'green'],
                        [4, 'blue'],
                        [5, 'purple'],
                        [6, 'brown'],
                        [7, 'red'],
                    ]
                },
                {
                    type: 'scatter',
                    mode: 'lines',
                    hoverinfo: 'skip',
                    x: [seasonMonth.value, seasonMonth.value],
                    y: [0, 1],
                    line: {dash: 'dash', width: 2, color: 'grey'},
                    yaxis: 'y2',
                    xaxis: 'x2'
                }
            ]}
            config={{displayModeBar: false}}
        />
    </>
}

export default ActiveMonthsPerSpeciesPlot