import { AppBar, Box, Tab, Tabs, Toolbar, Typography, useMediaQuery } from "@mui/material";
import {  Summarize, Map, HelpCenter } from "@mui/icons-material";

import MainMap from "../components/MainMap/MainMap";
import TreeLineSource from "../components/MainMap/TreeLineSource";
import TreeLineTooltip from "../components/MainMap/TreeLineTooltip";
import SimulationStepSliderCard from "../components/Simulation/SimulationStepSliderCard";
import SideContent from "../layout/desktop/SideContent";
import SideTreeDetailCard from "../components/TreeLines/SideTreeDetailCard";
import Footer from "../layout/Footer";
import Summary from "../components/Summary/Summary";
import TreeShadeSource from "../components/MainMap/TreeShadeSource";
import { simulationIsTouched } from "../appState/simulationSignals";
import { hasData } from "../appState/geoJsonSignals";
import MainActionCard from "../components/MainActionCard/MainActionCard";
import ReferenceAreaSource from "../components/MainMap/ReferenceAreaSource";
import ResultContent from "../layout/desktop/ResultContent";
import ResultActionCard from "../components/Results/ResultActionCard";
import { ActivePage, activePage } from "../appState/appViewSignals";
import { referenceArea } from "../appState/referenceAreaSignals";
import DistanceMeasurementsSource from "../components/MainMap/DistanceMeasurmentsSource";
import MapToolsCard from "../components/MapTools/MapToolsCard";
import SideLineDetailCard from "../components/TreeLines/SideLineDetailCard";
import { NavigationControl } from "react-map-gl";
import Glossary from "../components/Glossary/Glossary";
import BLossomsLocationsSource from "../components/MainMap/BlossomsLocationsSource";

const DesktopMain: React.FC = () => {

  const handleTabChange = (event: React.SyntheticEvent, newValue: ActivePage) => {
    activePage.value = newValue;
  };

  const isPrinting = useMediaQuery('print')

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      { isPrinting ? null : (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="transparent" style={{height:'72px'}}>
          <Toolbar style={{minHeight: '72px'}}>
            <Box width="100%" m={0} p={0} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
  
              <Box display="flex" flexDirection="row" alignItems="center">
                <img style={{height: '56px', width: 'auto'}} src="icons/logo.png" alt="Integra Logo" />
                <Typography ml={1} variant="h6" component="div">
                  AGROFORST-PLANUNGSTOOL
                </Typography>
              </Box>

              <Box>
                {
                referenceArea.value.features.length > 0 ? (  
                  <Tabs value={activePage.value} onChange={handleTabChange}>
                    <Tab label="Karte" value="map" icon={<Map />} iconPosition="start" />
                    <Tab label="Zusammenfassung" value="summary" icon={<Summarize />} iconPosition="start" disabled={!hasData.value} />
                    <Tab label="Glossar" value="glossary" icon={<HelpCenter />} iconPosition="start" />
                  </Tabs>
                ) : null }
              </Box>

              <Box sx={{ marginRight: '16px', minWidth: '300px' }}>
                <Box sx={{ display: "flex" }}>
                  {/* remove the Project select until the Data model is final */}
                  {/* <ProjectSelect /> */}
                  
                </Box>
              </Box>
            </Box>

          </Toolbar>
        </AppBar>
      </Box>
      )}
      
      { activePage.value === "map" ? (
      // This needs to be 100vh - 72px for header - 32px for footer
      <Box width="100vw" height="calc(100vh - 104px)" m="0" p="0" display="flex">
          {/* add the simulation slider */}
          { hasData.value || simulationIsTouched.value ? <SimulationStepSliderCard /> : null}

          <SideContent>
            <MapToolsCard />
            <MainActionCard />
            <SideTreeDetailCard />
            <SideLineDetailCard />
          </SideContent>
          

          <MainMap mapId="desktop">
            <NavigationControl position="bottom-right" visualizePitch />
            <TreeLineSource />
            <TreeShadeSource /> 
            <TreeLineTooltip />
            <BLossomsLocationsSource />
            <ReferenceAreaSource />
            <DistanceMeasurementsSource />
          </MainMap>

          <ResultContent>
            <ResultActionCard />
          </ResultContent>
        </Box>
      ) : null }
      
      { activePage.value === "summary" ? (
        <Summary />
      ) : null }

      { activePage.value === "glossary" ? (
        <Glossary />
      ) : null }

      {isPrinting ? null : <Footer /> }
    </Box>
  );
};

export default DesktopMain;
