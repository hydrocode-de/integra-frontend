import { AppBar, Box, Card, IconButton, Toolbar, Typography } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

import { useIntegraTheme, useModeToggler } from "../context/IntegraThemeContext";
import MainMap from "../components/MainMap/MainMap";
import DrawControl from "../components/MainMap/DrawControl";
import TreeLineSource from "../components/MainMap/TreeLineSource";
import { drawState, hasData } from "../appState/treeLineSignals";
import { DrawState } from "../appState/treeLine.model";
import TreeLineTooltip from "../components/MainMap/TreeLineTooltip";
import ReferenceAreaSource from "../components/MainMap/ReferenceAreaSource";
import ProjectSelect from "../components/ProjectSelect";
import MapLayerSwitchButton from "../components/MainMap/MapLayerSwitchButton";
import SimulationStepSlider from "../components/Simulation/SimulationStepSlider";
import SimulationResultDetailCard from "../components/Simulation/SimulationResultDetailCard";
import DraggableElementsCard from "../layout/desktop/DraggableElementsCard";
import SideContent from "../layout/desktop/SideContent";
import SideTreeDetailCard from "../components/TreeLines/SideTreeDetailCard";
import TreeSpeciesSelectionModal from "../components/treeSpeciesSelection/TreeSpeciesSelectionModal";
import { zoom } from "../appState/mapSignals";
import Footer from "../layout/Footer";

const DesktopMain: React.FC = () => {
  // get the current theme
  const theme = useIntegraTheme();

  // get the theme toggler
  const modeToggler = useModeToggler();

  return (
    <Box sx={{ height: "100vh" }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" variant="elevation" color="default">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              INTEGRA
            </Typography>

            <ProjectSelect />
            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="switch color mode"
              sx={{ ml: 2 }}
              onClick={modeToggler}
            >
              {theme.palette.mode === "dark" ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>

      <Box width="100vw" height="calc(100vh - 64px)" m="0" p="0" display="flex">
        {/* add the simulation slider */}
        <Box
          minWidth="256px"
          width="40vw"
          maxWidth="384px"
          position="fixed"
          bottom="24px"
          left="0"
          right="0"
          mx="auto"
          zIndex="99"
        >
          <Card sx={{ borderRadius: 2 }}>
            <SimulationStepSlider />
          </Card>
        </Box>

        {/* Only render the simulation cards if there is data and no editing */}
        {hasData.value && drawState.value === DrawState.OFF ? (
          <>
            {/* add the statistics card */}
            <Box
              // width="calc(100% - 350px - 10px - 100px)"
              position="fixed"
              top="80px"
              right="16px"
              zIndex="99"
              display="flex"
              flexDirection={"column"}
              justifyContent="flex-end"
            >
              <Box minWidth="256px" flexBasis="33%" mb={1}>
                <Card sx={{ borderRadius: 2, border: 0 }}>
                  <SimulationResultDetailCard defaultMetric="carbon" />
                </Card>
              </Box>
              <Box minWidth="256px" flexBasis="33%" mb={1}>
                <Card sx={{ borderRadius: 2, border: 0 }}>
                  <SimulationResultDetailCard defaultMetric="height" />
                </Card>
              </Box>
            </Box>
          </>
        ) : null}

        <SideContent>
          <DraggableElementsCard />
          <SideTreeDetailCard />
        </SideContent>

        <MainMap mapId="desktop">
          <DrawControl />
          <TreeLineSource />
          <ReferenceAreaSource />
          <MapLayerSwitchButton />
          <TreeLineTooltip />
        </MainMap>
      </Box>

      <Footer />
    </Box>
  );
};

export default DesktopMain;
