import { Box, Button, Divider,  Grid, Popover, Typography } from "@mui/material";
import MainMap from "../MainMap/MainMap";
import TreeLineSource from "../MainMap/TreeLineSource";
import SummaryTable from "./SummaryTable";
import ReferenceAreaSource from "../MainMap/ReferenceAreaSource";
import { simulationStep } from "../../appState/simulationSignals";
import { changeStaticData, summaryData } from "../../appState/summarySignals";
import { useState } from "react";
import SimulationStepSlider from "../Simulation/SimulationStepSlider";
import TextEditField from "./TextEditField";
import ForestrySelect from "./ForestrySelect";


const Summary = () => {
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(null)

  return (<>  
    <Grid container sx={{maxWidth: "1200px", margin: "auto", boxSizing: 'border-box'}} spacing={3}>
      <Grid item xs={12}>
        <TextEditField 
          value={summaryData.value?.systemTitle || 'Mein Agroforstsystem'}
          onChange={v => changeStaticData('systemTitle', v)}
          pt={5}
          pb={2}
          variant="h4"
        />
        <Divider />
        <Box pt={3} display="flex" flexDirection="row" justifyContent="start" alignItems="center">
          <Typography variant="h6" component="span">
            Diese Zusammenfassung bezieht sich auf ihre Planung nach
          </Typography>
          <Button variant="outlined" color="success" style={{marginLeft: '1rem', marginRight: '1rem'}} onClick={e => setPopoverAnchor(e.currentTarget)}>
            {simulationStep.value.current}
          </Button>
          <Popover
            open={Boolean(popoverAnchor)} 
            onClose={() => setPopoverAnchor(null)} 
            anchorEl={popoverAnchor}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Box width="450px" px={2} pb={1} pt={2} >
              <SimulationStepSlider noMonthSlider />
            </Box>
          </Popover>
          <Typography variant="h6" component="span">
            Jahren ({new Date().getFullYear() + simulationStep.value.current }).
          </Typography>
        </Box>

      </Grid>
      
      
      <Grid item xs={12} lg={6} p={2}>
        <Box sx={{ width: '100%', height: '100%', minHeight: '500px', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(128,128,128,0.5)' }}>
          <MainMap mapId="summary">
            <TreeLineSource />
            <ReferenceAreaSource />
          </MainMap>
        </Box>
      </Grid>

      <Grid container xs={12} lg={6} p={1} mt={1} alignItems="stretch">
        
        <Grid item xs={6} p={1}>
          <Box sx={{ bgcolor: "grey.100", borderRadius: 2, p: 1, flexGrow: 1, boxSizing: 'border-box'}}>
            <Typography variant="h6" m={0} pb={1}>
              Flächenübersicht
            </Typography>
            <Box sx={{ pl: 1 }}>
              <Box>
                <Typography variant="subtitle2">Gesamtfläche:</Typography>
                <Typography pb={1}>{`${(summaryData.value?.referenceArea)?.toFixed(0)} ha`}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Acker-/Weidefläche:</Typography>
                <Typography pb={1}>{`${(summaryData.value?.agriculturalArea)?.toFixed(0)} ha`}</Typography>
              </Box>
            </Box>

            <Typography variant="h6" m={0} pt={3} pb={1}>
              Nutzungsart
            </Typography>
            <Box sx={{ pl: 1 }}>
              <Typography variant="subtitle2">Feldnutzung:</Typography>
              <TextEditField
                value={summaryData.value?.agriculturalUse!} 
                onChange={v => changeStaticData('agriculturalUse', v)}
                placehoder="Weide, Raps, ..."
              />
              </Box>
              <Box sx={{ pl: 1 }}>
                <Typography variant="subtitle2">Gehölznutzung:</Typography>
                <ForestrySelect />
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={6} p={1} justifyContent="space-between">
          <Box sx={{ bgcolor: "grey.100", borderRadius: 2, p: 1, flexGrow: 1}}>
            <Typography variant="h6" m={0} pb={1}>
              Klima
            </Typography>
            <Box pl={1}>
              <Box>
                <Typography variant="subtitle2">Jährl. Niederschlagssumme:</Typography>
                <Typography pb={1}>{summaryData.value?.precipitationSum}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Jahresmitteltemperatur:</Typography>
                <Typography pb={1}>{summaryData.value?.averageTemperature}</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ bgcolor: "grey.100", borderRadius: 2, p: 1, flexGrow: 1, mt: 2}}>
            <Typography variant="h6" m={0} pb={1}>
              Boden
            </Typography>
            <Box pl={1}>
              <Box>
                <Typography variant="subtitle2">Vorherrschende Bodenart:</Typography>
                <Typography pb={1}>{summaryData.value?.soilType}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Bodenfeuchte:</Typography>
                <Typography pb={1}>{' NOT IMPLEMENTED'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Boden-pH</Typography>
                <Typography pb={1}>{'NOT IMPLEMENTED'}</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ bgcolor: "grey.100", borderRadius: 2, p: 1, flexGrow: 1, mt: 2}}>
            <Typography variant="h6" m={0} pb={1}>
              Schutzgebiet
            </Typography>
            <Box pl={1}>
              <Box>
                {/* <Typography variant="subtitle2">Vorherrschende Bodenart:</Typography> */}
                <Typography pb={1}>{'NOT IMPLEMENTED'}</Typography>
              </Box>
            </Box>
          </Box>

        </Grid>

      </Grid>

      <Grid item xs={12} mt={3}>
        <Typography variant="h6">
          Planung
        </Typography>
        <Typography color={"textSecondary"} sx={{maxWidth: 600, pb: 1,}}>
          Hier sehen Sie eine Übersicht Ihres geplanten Agroforstsystems.
        </Typography>
        <SummaryTable />
      </Grid>

      <Grid item xs={12} mt={3}>
        <Typography pt={6} pb={2} variant="h4">
          Informationen
        </Typography>
        <Divider />
        <Typography pt={3} variant="h6">
          Übersicht
        </Typography>
        <Typography color={"textSecondary"} sx={{maxWidth: 600,pb: 1,}}>
          Wichtige Rechtliche Rahmenbedingen zu Anlage ihres Agroforstsystemes
        </Typography>
      </Grid>

    </Grid>
  </>);
};

export default Summary;
