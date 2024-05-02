import { AppBar, Box, Card, Drawer, IconButton, MenuItem, MenuList, Toolbar, Typography } from "@mui/material";
import { DarkMode, LightMode, Menu, ArrowBack } from "@mui/icons-material";

import { useIntegraTheme, useModeToggler } from "../context/IntegraThemeContext";
import MainMap from "../components/MainMap/MainMap";
import DrawControl from "../components/MainMap/DrawControl";
import TreeLineSource from "../components/MainMap/TreeLineSource";
import { drawState, hasData } from "../appState/treeLineSignals";
import { DrawState } from "../appState/treeLine.model";
import TreeLineTooltip from "../components/MainMap/TreeLineTooltip";
import ReferenceAreaSource from "../components/MainMap/ReferenceAreaSource";
import ProjectSelect from "../components/ProjectSelect";
import { useSignal } from "@preact/signals-react";
import MapLayerSwitchButton from "../components/MainMap/MapLayerSwitchButton";
import SimulationStepSlider from "../components/Simulation/SimulationStepSlider";
import SimulationResultDetailCard from "../components/Simulation/SimulationResultDetailCard";
import DraggableElementsCard from "../layout/desktop/DraggableElementsCard";
import SideContent from "../layout/desktop/SideContent";
import SideTreeDetailCard from "../components/TreeLines/SideTreeDetailCard";
import TreeSpeciesSelectionModal from "../components/treeSpeciesSelection/TreeSpeciesSelectionModal";

const DesktopMain: React.FC = () => {
  // get the current theme
  const theme = useIntegraTheme();

  // get the theme toggler
  const modeToggler = useModeToggler();

  // drawer state
  const drawerOpen = useSignal<boolean>(false);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" variant="elevation" color="default">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => (drawerOpen.value = true)}
            >
              <Menu />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              INTEGRA
            </Typography>

            {/* <Typography variant="h6" component="div" sx={{flexFlow: 1, mr: 2}}>
                        Lng: {center.lng} Lat: {center.lat} Zoom: {zoom}
                    </Typography> */}

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

      <Drawer variant="temporary" open={drawerOpen.value} onClose={() => (drawerOpen.value = false)}>
        <AppBar position="static">
          <Toolbar color="default">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => (drawerOpen.value = false)}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Menü
            </Typography>
          </Toolbar>
        </AppBar>
        <MenuList
          sx={{ width: 250, height: "100%", display: "flex", justifyContent: "space-between", flexDirection: "column" }}
        >
          <span />
          <Box>
            <MenuItem>Datenschutzerklärung</MenuItem>
            <MenuItem>Impressum</MenuItem>
          </Box>
        </MenuList>
      </Drawer>

      <Box width="100vw" height="calc(100vh - 64px)" m="0" p="0" display="flex">
        {/* DEV ONLY  uncomment the old navigation logic. The components are still there, but we do not use them */}
        {/*
         * Navigation children can be placed on top of the map this way
         * Only show if the draw Mode is OFF. This feels a bit hacky...
         */}
        {/* {drawState.value !== DrawState.OFF ? (
          <DesktopContentCard noOutlet>
            <TreeLineNewCard />
          </DesktopContentCard>
        ) : (
          <Outlet />
        )} */}

        {/* Only render the simulation cards if there is data and no editing */}
        {hasData.value && drawState.value === DrawState.OFF ? (
          <>
            {/* add the simulation slider */}
            <Box
              minWidth="256px"
              width="40vw"
              maxWidth="384px"
              position="fixed"
              bottom="16px"
              left="0"
              right="0"
              mx="auto"
              zIndex="99"
            >
              <Card sx={{ borderRadius: 2 }}>
                <SimulationStepSlider />
              </Card>
            </Box>

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
          <TreeSpeciesSelectionModal />

          <DrawControl />
          <TreeLineSource />
          <ReferenceAreaSource />
          <MapLayerSwitchButton />
          <TreeLineTooltip />
        </MainMap>
      </Box>
    </>
  );
};

export default DesktopMain;
