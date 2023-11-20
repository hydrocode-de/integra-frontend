import { Box, Grid, Typography } from "@mui/material"
import MetricSwitchHeader from "./MetricSwitchHeader"
import { totalStatistics } from "../../appState/statisticsSignals"

const HeightResultDetailContent: React.FC<{onSwitch: (metricName: string) => void}> = ({ onSwitch }) => {
    return <>
        <MetricSwitchHeader metricTitle="mittlere Baumhöhen" metric="height" onSwitch={onSwitch} />
        <Grid container spacing={0}>
            <Grid item xs={6}>
                <Box display="flex" flexDirection="row" alignItems="baseline">
                    <Typography variant="h2">{ (totalStatistics.value.meanHeight || 0).toFixed(1) }</Typography>
                    <Typography variant="h6" ml={1}>m</Typography>
                </Box>
                <Typography variant="body1">Baumhöhe</Typography>
            </Grid>
            <Grid item xs={6}>
                <Box display="flex" flexDirection="row" alignItems="baseline">
                    <Typography variant="h2">{ (totalStatistics.value.meanTruncHeight || 0).toFixed(1) }</Typography>
                    <Typography variant="h6" ml={1}>m</Typography>
                </Box>
                <Typography variant="body1">Stammlänge</Typography>
            </Grid>

        </Grid>
    </>
}

export default HeightResultDetailContent