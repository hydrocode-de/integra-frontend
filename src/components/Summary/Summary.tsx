import { Box, Divider, Typography } from "@mui/material";
import MainMap from "../MainMap/MainMap";
import DrawControl from "../MainMap/DrawControl";
import TreeLineSource from "../MainMap/TreeLineSource";
import ReferenceAreaSource from "../MainMap/ReferenceAreaSource";
import MapLayerSwitchButton from "../MainMap/MapLayerSwitchButton";
import TreeLineTooltip from "../MainMap/TreeLineTooltip";
import SummaryTable from "./SummaryTable";

const Summary = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        // height: "calc(100vh - 100px)",
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      <Typography pt={5} pb={2} variant="h4">
        Mein Agroforstsystem
      </Typography>
      <Divider />
      <Typography pt={3} pb={1} variant="h6">
        Übersicht
      </Typography>
      <Typography
        color={"textSecondary"}
        // variant="body1"
        sx={{
          maxWidth: 600,
        }}
      >
        Hier sehen Sie eine Übersicht Ihres Agroforstsystems.
      </Typography>
      <Box sx={{ display: "flex", py: 2 }}>
        <Box sx={{ width: 500, height: 500 }}>
          <MainMap mapId="summary">
            <DrawControl />
            <TreeLineSource />
            <ReferenceAreaSource />
            <TreeLineTooltip />
          </MainMap>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Box sx={{ ml: 4, mb: 4, p: 2, borderRadius: 2, bgcolor: "grey.100", flexGrow: 1 }}>test</Box>
          <Box sx={{ ml: 4, p: 2, borderRadius: 2, bgcolor: "grey.100", flexGrow: 1 }}>test</Box>
        </Box>
      </Box>
      <SummaryTable />
    </Box>
  );
};

export default Summary;
