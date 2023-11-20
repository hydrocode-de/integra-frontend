import { Grid, Typography } from "@mui/material"
import { totalStatistics } from "../../appState/statisticsSignals"
import MetricSwitchHeader from "./MetricSwitchHeader"

const CarbonResultDetailContent: React.FC<{onSwitch: (metricName: string) => void}> = ({ onSwitch }) => {
    return <>
        <MetricSwitchHeader metricTitle="Kohlenstoffgehalt" metric="carbon" onSwitch={onSwitch} />
        <Grid container spacing={0}>
            <Grid item xs={6}>
                <Typography variant="h2">{ ((totalStatistics.value.totalCarbon || 0)  / 1000).toFixed(0) } t</Typography>
                <Typography variant="body1">Absolut</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h2">{ ((totalStatistics.value.totalCarbon || 0)  / 1000 * 3.667).toFixed(0) } t</Typography>
                <Typography variant="body1">CO<sub>2</sub> Einsparung</Typography>
            </Grid>
        </Grid>
    </>
}

export default CarbonResultDetailContent