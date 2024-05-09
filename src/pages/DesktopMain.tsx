import { AppBar, Box, Card, IconButton, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { DarkMode, LightMode, Summarize, Map } from "@mui/icons-material";

import { useIntegraTheme, useModeToggler } from "../context/IntegraThemeContext";
import MainMap from "../components/MainMap/MainMap";
import DrawControl from "../components/MainMap/DrawControl";
import TreeLineSource from "../components/MainMap/TreeLineSource";
import { hasData } from "../appState/treeLineSignals";
import TreeLineTooltip from "../components/MainMap/TreeLineTooltip";
import ReferenceAreaSource from "../components/MainMap/ReferenceAreaSource";
import ProjectSelect from "../components/ProjectSelect";
import MapLayerSwitchButton from "../components/MainMap/MapLayerSwitchButton";
import SimulationStepSlider from "../components/Simulation/SimulationStepSlider";
import SimulationResultDetailCard from "../components/Simulation/SimulationResultDetailCard";
import DraggableElementsCard from "../layout/desktop/DraggableElementsCard";
import SideContent from "../layout/desktop/SideContent";
import SideTreeDetailCard from "../components/TreeLines/SideTreeDetailCard";
import Footer from "../layout/Footer";
import { useState } from "react";
import Summary from "../components/Summary/Summary";
import TreeShadeSource from "../components/MainMap/TreeShadeSource";

const DesktopMain: React.FC = () => {
  // get the current theme
  const theme = useIntegraTheme();
  // create a signal for tabbar state
  const [activeTabbar, setActiveTabbar] = useState("map");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTabbar(newValue);
  };

  // get the theme toggler
  const modeToggler = useModeToggler();

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="transparent">
          <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{ position: "absolute", left: 16 }} variant="h6" component="div">
              INTEGRA
            </Typography>
            <Tabs value={activeTabbar} onChange={handleTabChange}>
              <Tab label="Karte" value="map" icon={<Map />} iconPosition="start" />
              <Tab label="Zusammenfassung" value="summary" icon={<Summarize />} iconPosition="start" />
            </Tabs>
            <Box sx={{ position: "absolute", right: 16 }}>
              <Box sx={{ display: "flex" }}>
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
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      
      { activeTabbar === "map" ? (
      <Box width="100vw" height="calc(100vh - 64px)" m="0" p="0" display="flex">
            {/* add the simulation slider */}
            <Box
              minWidth="450px"
              width="40vw"
              maxWidth="600px"
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
          {hasData.value ? (
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
            <TreeShadeSource /> 
            <ReferenceAreaSource />
            <MapLayerSwitchButton />
            <TreeLineTooltip />
          </MainMap>
        </Box>
      ) : (
        <Summary />
      )}
      <Footer />
    </Box>
  );
};

export default DesktopMain;
