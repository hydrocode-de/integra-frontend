import Plot from "react-plotly.js"
import { insectPhanologicalMonths } from "../../../appState/insectsSimulationSignals"
import { seasonMonth } from "../../../appState/simulationSignals"


const InsectPhanologyPlot: React.FC = () => {

    return <>
        <Plot 
            style={{width: '100%'}}
            layout={{
                height: 230,
                margin: {t: 10, r: 15},
                autosize: true,
                showlegend: false,
                xaxis: {
                    title: 'Monat',
                    tickvals: [3, 4, 5, 6, 7, 8, 9, 10],
                    ticktext: ['Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt'],
                },
                yaxis: {
                    title: 'Anzahl Bienenarten',
                    tickvals: [0, 10, 20, 30, 40, 50],
                    range: [0, 50]
                },
                yaxis2: {overlaying: 'y', side: 'right', showgrid: false, showline: false, showticklabels: false, zeroline: false, range:[0, 1]}

            }}
            data={[
                {
                    type: 'scatter',
                    mode: 'lines',
                    //x: ['Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt'],
                    x: [3, 4, 5, 6, 7, 8, 9, 10],
                    y: insectPhanologicalMonths.value.slice(2, 10),
                    line: {
                        width: 2,
                        color: 'orange'
                    },
                    fill: 'tozeroy',
                    hovertemplate: 'Anzahl Bienenarten: %{y}<extra></extra>'
                },
                {
                    type: 'scatter',
                    mode: 'lines',
                    x: [seasonMonth.value, seasonMonth.value],
                    y: [0, 1],
                    line: {
                        dash: 'dash',
                        width: 2,
                        color: 'grey'
                    },
                    yaxis: 'y2'
                }
            ]}
            config={{displayModeBar: false}}
        />
    </>
}

export default InsectPhanologyPlot