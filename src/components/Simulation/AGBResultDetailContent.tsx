import { Box, Grid, Typography } from "@mui/material";
import { totalStatistics } from "../../appState/statisticsSignals";
import MetricSwitchHeader from "./MetricSwitchHeader";

const AGBResultDetailContent: React.FC<{ onSwitch: (metricName: string) => void }> = ({ onSwitch }) => {
  return (
    <>
      <MetricSwitchHeader metricTitle="Oberirdische Biomasse" metric="agb" onSwitch={onSwitch} />
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <Typography variant="h4">{((totalStatistics.value.totalAgb || 0) / 1000).toFixed(0)} t</Typography>
          <Typography variant="subtitle2">Absolut</Typography>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" flexDirection="row" alignItems="baseline">
            <Typography variant="h4">{(((totalStatistics.value.totalAgb || 0) * 4) / 1000).toFixed(0)}</Typography>
            <Typography variant="subtitle2" ml={1}>
              MWh
            </Typography>
          </Box>
          <Typography variant="subtitle2">Brennwert</Typography>
          <Typography variant="caption">
            ~ {(((totalStatistics.value.totalAgb || 0) * 4) / 1000 / 2.5).toFixed(0)} m<sup>3</sup> Heizöl
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default AGBResultDetailContent;
