import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { treeTypeStatistics } from "../../appState/statisticsSignals";
import { useSignal } from "@preact/signals-react";

const TreeLineOverview: React.FC = () => {
  const theme = useTheme();

  // create a signal to switch the current stats value
  const currentState = useSignal<string>("count");

  return (
    <>
      {Object.keys(treeTypeStatistics.value).length === 0 ? null : (
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection="row"
          alignItems="center"
          mt={3}
          mb={1}
        >
          <Typography variant="h6">Überlick</Typography>
          <FormControl variant="standard">
            <Select
              size="small"
              value={currentState.value}
              onChange={(e) => (currentState.value = e.target.value)}
            >
              <MenuItem value="count">Anzahl</MenuItem>
              <MenuItem value="carbon">Kohlenstoff</MenuItem>
              <MenuItem value="height">Baumhöhe</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      {Object.entries(treeTypeStatistics.value).map(([treeType, stats]) => {
        return (
          <Box
            key={treeType}
            display="flex"
            justifyContent="space-between"
            bgcolor={theme.palette.background.paper}
          >
            <Typography variant="body1">{treeType}</Typography>
            {currentState.value === "carbon" ? (
              <Typography variant="body1">
                {`${((stats.totalCarbon || 0) / 1000).toFixed(2)} t  (${(
                  (stats.carbonPerHectare || 0) / 1000
                ).toFixed(1)} t / ha)`}
              </Typography>
            ) : null}
            {currentState.value === "count" ? (
              <Typography variant="body1">
                {`${stats.count} Bäume  (${Math.floor(
                  stats.countPerHectare
                )} / ha)`}
              </Typography>
            ) : null}
            {currentState.value === "height" ? (
              <Typography variant="body1">
                {`${stats.meanHeight?.toFixed(
                  1
                )} m  (${stats.meanTruncHeight?.toFixed(1)} m Stamm)`}
              </Typography>
            ) : null}
          </Box>
        );
      })}
    </>
  );
};

export default TreeLineOverview;
