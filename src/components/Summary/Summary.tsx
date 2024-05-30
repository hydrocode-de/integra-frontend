import { Box, Divider, Grid, Typography } from "@mui/material";
import MainMap from "../MainMap/MainMap";
import TreeLineSource from "../MainMap/TreeLineSource";
import SummaryTable from "./SummaryTable";
import { referenceArea } from "../../appState/referenceAreaSignals";
import { agriculturalArea } from "../../appState/treeLineSignals";
import ReferenceAreaSource from "../MainMap/ReferenceAreaSource";

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

const Summary = () => {
  // console.log(agriculturalArea.value.features[0].properties.area / 10000)
  return (<>
    <Grid container sx={{maxWidth: "1200px", margin: "auto", boxSizing: 'border-box'}} spacing={3}>
      <Grid item xs={12}>
        <Typography pt={5} pb={2} variant="h4">
          Mein Agroforstsystem
        </Typography>
        <Divider />
        <Typography pt={3} variant="h6">
          Übersicht
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
                value={`${(referenceArea.value.features[0]?.properties?.area / 10000).toFixed(0)} ha`}
              />
              <ItemPair
                label="Agroforst Nutzung"
                value={`${(agriculturalArea.value.features[0]?.properties?.area / 10000).toFixed(0)} ha`}
              />
              <ItemPair label="Schutzgebiet" value="ja" />
            </Box>
            <Typography variant="h6" m={0} pt={3} pb={1}>
              Nutzungsart
            </Typography>
            <Box sx={{ pl: 1 }}>
              <ItemPairVertical label="Landwirtschaft" value="Feldfrucht mit Raps und Winterweizen" />
              <ItemPairVertical label="Forstwirtschaft" value="Kurzumtrieb" />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6} p={1}>
          <Box sx={{ bgcolor: "grey.100", borderRadius: 2, p: 1, flexGrow: 1}}>
            <Typography variant="h6" m={0} pb={1}>
              Standort
            </Typography>
            <Box sx={{ pl: 1 }}>
              <ItemPairVertical label="Jährliche Niederschlagssumme" value="600 mm" />
              <ItemPairVertical label="Jahresmitteltemperatur" value="10,2 °C" />
              <ItemPairVertical label="Bodenart" value="Schluffton" />
              <ItemPairVertical label="Bodennährstoffversorgung" value="nährstoffreich, basisch" />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} pt={1}>
          <Box sx={{ bgcolor: "grey.100", borderRadius: 2, p: 1, flexGrow: 1}} display="flex" flexDirection="row" justifyContent="space-between">
            <Box>
                <ItemPairVertical label="Oberirdische Biomasse" value="3256 kg" />
                <ItemPairVertical label="Kohlenstoffspeicher" value="1567 kg" />
              </Box>
              <Box>
                <ItemPairVertical label="Blühabdeckung" value="10%" />
                <ItemPairVertical label="Nektarangebot" value="2335 ml" />
              </Box>
              <Box>
                <ItemPairVertical label="Pollenangebot" value="4545 µm2" />
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
