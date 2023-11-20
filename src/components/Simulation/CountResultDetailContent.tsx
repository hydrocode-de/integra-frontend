import { Grid, Typography } from "@mui/material"
import { totalStatistics } from "../../appState/statisticsSignals"
import MetricSwitchHeader from "./MetricSwitchHeader"

const CountResultDetailContent: React.FC<{onSwitch: (metricName: string) => void}> = ({ onSwitch }) => {
    return <>
        <MetricSwitchHeader metricTitle="Baumanzahl" metric="count" onSwitch={onSwitch} />
        <Grid container spacing={0}>
            <Grid item xs={6}>
                <Typography variant="h2">{ (totalStatistics.value.count || 0).toFixed(0) }</Typography>
                <Typography variant="body1">Bäume gesamt</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h2">{ (totalStatistics.value.countPerHectare || 0).toFixed(0) }</Typography>
                <Typography variant="body1">Bäume pro Hektar</Typography>
            </Grid>
        </Grid>
    </>
}

export default CountResultDetailContent