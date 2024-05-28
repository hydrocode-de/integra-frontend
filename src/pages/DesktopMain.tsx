import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import {  Summarize, Map } from "@mui/icons-material";

import MainMap from "../components/MainMap/MainMap";
import TreeLineSource from "../components/MainMap/TreeLineSource";
import TreeLineTooltip from "../components/MainMap/TreeLineTooltip";
import MapLayerSwitchButton from "../components/MainMap/MapLayerSwitchButton";
import SimulationStepSlider from "../components/Simulation/SimulationStepSlider";
import SideContent from "../layout/desktop/SideContent";
import SideTreeDetailCard from "../components/TreeLines/SideTreeDetailCard";
import Footer from "../layout/Footer";
import { useState } from "react";
import Summary from "../components/Summary/Summary";
import TreeShadeSource from "../components/MainMap/TreeShadeSource";
import { simulationIsTouched } from "../appState/simulationSignals";
import { hasData } from "../appState/geoJsonSignals";
import MainActionCard from "../components/MainActionCard/MainActionCard";
import ReferenceAreaSource from "../components/MainMap/ReferenceAreaSource";
import ResultContent from "../layout/desktop/ResultContent";
import ResultActionCard from "../components/Results/ResultActionCard";
import DistanceMeasurementsSource from "../components/MainMap/DistanceMeasurmentsSource";
import MapToolsCard from "../components/MapTools/MapToolsCard";

const DesktopMain: React.FC = () => {

  // create a signal for tabbar state
  const [activeTabbar, setActiveTabbar] = useState("map");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTabbar(newValue);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="transparent">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{  marginLeft: '0px', }} variant="h6" component="div">
                INTEGRA
              </Typography>
              <Box></Box>
            </Box>
            
            <Tabs value={activeTabbar} onChange={handleTabChange}>
              <Tab label="Karte" value="map" icon={<Map />} iconPosition="start" />
              <Tab label="Zusammenfassung" value="summary" icon={<Summarize />} iconPosition="start" disabled={!hasData.value} />
            </Tabs>
            
            <Box sx={{ marginRight: '16px' }}>
              <Box sx={{ display: "flex" }}>
                {/* remove the Project select until the Data model is final */}
                {/* <ProjectSelect /> */}
                
              </Box>
            </Box>

          </Toolbar>
        </AppBar>
      </Box>
      
      { activeTabbar === "map" ? (
      // This needs to be 100vh - 72px for header - 32px for footer
      <Box width="100vw" height="calc(100vh - 104px)" m="0" p="0" display="flex">
          {/* add the simulation slider */}
          { hasData.value || simulationIsTouched.value ? <SimulationStepSlider /> : null}

          <SideContent>
            <MapToolsCard />
            <MainActionCard />
            <SideTreeDetailCard />
          </SideContent>

          <MainMap mapId="desktop">
            <TreeLineSource />
            <TreeShadeSource /> 
            <MapLayerSwitchButton />
            <TreeLineTooltip />
            <ReferenceAreaSource />
            <DistanceMeasurementsSource />
          </MainMap>

          <ResultContent>
            <ResultActionCard />
          </ResultContent>
        </Box>
      ) : (
        <Summary />
      )}
      <Footer />
    </Box>
  );
};

export default DesktopMain;
