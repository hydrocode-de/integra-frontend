import Plot from "react-plotly.js"
import { activeBlossomsMonths, insectPopulation } from "../../../appState/insectsSimulationSignals"
import range from "lodash.range"
import { seasonMonth } from "../../../appState/simulationSignals"

const InsectActivityPlot: React.FC = () => {
    return <>
        <Plot 
            style={{width: '100%', maxWidth: '400px', margin: 'auto'}}
            layout={{
                height: 140,
                margin: {t: 10, r: 10, l: insectPopulation.value.german_name.length < 12 ? 105 : 185},
                xaxis: {tickvals: [3, 4, 5, 6, 7, 8, 9, 10], ticktext: ['Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt']},
                yaxis2: {overlaying: 'y', side: 'right', showgrid: false, showline: false, showticklabels: false, zeroline: false, range:[0, 1]},
                xaxis2: {overlaying: 'x', side: 'bottom', showgrid: false, showline: false, showticklabels: false, zeroline: false, range:[3, 11]},
            }}
            data={[
                {
                    type: 'heatmap',
                    x: [3, 4, 5, 6, 7, 8, 9, 10].map(v => v + 0.5),
                    y: [insectPopulation.value.german_name, 'Blühabdeckung'],
                    z: [
                        range(3, 11).map(m => insectPopulation.value.startMonth <= m && m <= insectPopulation.value.endMonth ? 0.5 : 0),
                        activeBlossomsMonths.value.slice(2, 10).map(v => v > 0 ? 1 : 0)
                    ],
                    colorscale: [[0, 'transparent'], [0.5, '#c32f69'], [1, '#9ec3e5']],
                    showscale: false,
                    hoverinfo: 'skip'
                },
                {
                    type: 'scatter',
                    mode: 'lines',
                    hoverinfo: 'skip',
                    x: [seasonMonth.value, seasonMonth.value],
                    y: [insectPopulation.value.german_name, 'Blühabdeckung'],
                    line: {dash: 'dash', width: 2, color: 'grey'},
                    yaxis: 'y2',
                    xaxis: 'x2'
                }
            ]}
            config={{displayModeBar: false}}
        />
    </>
}

export default InsectActivityPlot