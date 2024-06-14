import { Box, Button, Divider, FormControl, Grid, Input, InputAdornment, Popover, Typography } from "@mui/material";
import MainMap from "../MainMap/MainMap";
import TreeLineSource from "../MainMap/TreeLineSource";
import SummaryTable from "./SummaryTable";
import ReferenceAreaSource from "../MainMap/ReferenceAreaSource";
import { simulationStep } from "../../appState/simulationSignals";
import { changeStaticData, summaryData } from "../../appState/summarySignals";
import { useState } from "react";
import SimulationStepSlider from "../Simulation/SimulationStepSlider";

const ItemPair = ({ label, value }: { label: string; value: string }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="subtitle2">{label}</Typography>
      <Typography justifySelf={"end"}>{value}</Typography>
    </Box>
  );
};
const ItemPairVertical = ({ label, value }: { label: string; value: string }) => {
  return (
    <Box>
      <Typography variant="subtitle2">{label}</Typography>
      <Typography pb={1}>{value}</Typography>
    </Box>
  );
};

const TextEditItemPairVertical = ({ label, value, onChange, }: { label: string; value?: string, onChange: (value: string) => void }) => {
  // set component state
  const [val, setVal] = useState<string>(value || '')
  const [edit, setEdit] = useState<boolean>(false)

  const onEditFinish = () => {
    setEdit(false)
    onChange(val)
  }
  return (
    <Box >
      <Typography variant="subtitle2">{label}</Typography>
      { edit ? (
        <FormControl>
          <Input 
            value={val} 
            placeholder="nicht gewählt" 
            onChange={e => setVal(e.target.value)} 
            endAdornment={
              <InputAdornment position="end">
                <Button onClick={onEditFinish}>OK</Button>
              </InputAdornment>
            }
          />
        </FormControl>
      ) : (
        <Typography pb={1} style={{cursor: 'pointer'}} onClick={() => setEdit(true)}>{val || <i>nicht gewählt</i> }</Typography>
      ) }
      
    </Box>
  );
}

const formatWeight = (weight: number, threshold: number = 4500): string => {
  if (weight < threshold) {
    return `${weight.toFixed(1)} kg`
  } else if (weight > 100000) {
    return `${(weight / 1000).toFixed(0)} t`
  } 
  else {
    return `${(weight / 1000).toFixed(1)} t`
  
  }
}

const Summary = () => {
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(null)

  return (<>
    <Grid container sx={{maxWidth: "1200px", margin: "auto", boxSizing: 'border-box'}} spacing={3}>
      <Grid item xs={12}>
        <Typography pt={5} pb={2} variant="h4">
          Mein Agroforstsystem
        </Typography>
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
        <Typography pt={3} variant="h6">
            
        </Typography>
        <Typography color={"textSecondary"} sx={{ maxWidth: 600,pb: 1 }}>
          Hier sehen Sie eine Übersicht der geplanten Fläche.
        </Typography>
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
          <Box sx={{ bgcolor: "grey.100", borderRadius: 2, p: 1, flexGrow: 1}}>
            <Typography variant="h6" m={0} pb={1}>
              Flächenübersicht
            </Typography>
            <Box sx={{ pl: 1 }}>
              <ItemPair
                label="Flächengröße (gesamt)"
                value={`${(summaryData.value?.referenceArea)?.toFixed(0)} ha`}
              />
              <ItemPair
                label="Agroforst Nutzung"
                value={`${(summaryData.value?.agriculturalArea)?.toFixed(0)} ha`}
              />
              <ItemPair label="Schutzgebiet" value="ja" />
            </Box>
            <Typography variant="h6" m={0} pt={3} pb={1}>
              Nutzungsart
            </Typography>
            <Box sx={{ pl: 1 }}>
              <TextEditItemPairVertical 
                label="Landwirtschaft" 
                value={summaryData.value?.agriculturalUse} 
                onChange={v => changeStaticData('agriculturalUse', v)} 
              />
              <TextEditItemPairVertical 
                label="Forstwirtschaft"
                value={summaryData.value?.forestryUse}
                onChange={v => changeStaticData('forestryUse', v)}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6} p={1}>
          <Box sx={{ bgcolor: "grey.100", borderRadius: 2, p: 1, flexGrow: 1}}>
            <Typography variant="h6" m={0} pb={1}>
              Standort
            </Typography>
            <Box sx={{ pl: 1 }}>
              <TextEditItemPairVertical
                label="Jährliche Niederschlagssumme"
                value={summaryData.value?.precipitationSum}
                onChange={v => changeStaticData('precipitationSum', v)}
              />
              <TextEditItemPairVertical
                label="Jahresmitteltemperatur"
                value={summaryData.value?.averageTemperature}
                onChange={v => changeStaticData('averageTemperature', v)}
              />
              <TextEditItemPairVertical
                label="Bodenart"
                value={summaryData.value?.soilType}
                onChange={v => changeStaticData('soilType', v)}
              />
              <TextEditItemPairVertical
                label="Bodennährstoffversorgung"
                value={summaryData.value?.soilNutrient}
                onChange={v => changeStaticData('soilNutrient', v)}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} pt={1}>
          <Box sx={{ bgcolor: "grey.100", borderRadius: 2, p: 1, flexGrow: 1}} display="flex" flexDirection="row" justifyContent="space-between">
            <Box>
                <ItemPairVertical 
                  label="Oberirdische Biomasse" 
                  value={formatWeight(summaryData.value?.agb || 0)} 
                />
                <ItemPairVertical 
                  label="Kohlenstoffspeicher" 
                  value={formatWeight(summaryData.value?.carbon || 0)} 
                />
              </Box>
              <Box>
                <ItemPairVertical label="Blühabdeckung" value="10%" />
                <ItemPairVertical label="Nektarangebot" value="2335 ml" />
              </Box>
              <Box>
                <ItemPairVertical label="Pollenangebot" value="4545 μm²" />
                <ItemPairVertical label="Nistangebot" value="%" />
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
