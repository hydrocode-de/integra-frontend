import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DraggableTree from "../TreeLines/DraggableTree";
import { EmojiNature, EuroRounded, ForestRounded } from "@mui/icons-material";
import StandortValueRange from "./StandortSlider";
import NutzungsChecker from "./NutzungsChecker";
import { Signal } from "@preact/signals-react";
import { SpeciesProfileI, speciesProfile } from "../../appState/speciesProfileSignals";

import { treeSpecies } from "../../appState/backendSignals";

const treeZoneStyle = {
  display: "flex",
  flexDirection: "column",
  px: "8px",
  // bgcolor: "grey.100",
  margin: "8px",
  borderRadius: 2,
  ":hover": {
    bgcolor: "grey.200",
  },
};
const treeZoneSelectedStyle = {
  display: "flex",
  flexDirection: "column",
  px: "8px",
  bgcolor: "grey.200",
  margin: "8px",
  borderRadius: 2,
  ":hover": {
    bgcolor: "grey.200",
  },
};

const TreeSpeciesSelectionModal: React.FC<{ isOpen: Signal<boolean> }> = ({ isOpen }) => {
  const [selectedSpeciesProfile, setSelectedSpeciesProfile] = useState<SpeciesProfileI | undefined>(
    speciesProfile.peek()?.[0]
  );

  console.log(speciesProfile.value);
  return (
    <Modal onClose={() => (isOpen.value = !isOpen.peek())} open={isOpen.value}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "1200px",
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography sx={{ mb: 1 }} variant="h5">
          Deine Baumarten
        </Typography>
        <Box
          sx={{
            border: "2px dashed",
            borderColor: "grey.400",
            borderRadius: 2,
            bgcolor: "grey.100",
            height: "100px",
            display: "flex",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              margin: "auto",
            }}
            color="GrayText"
          >
            Hier kannst du deine Baumarten platzieren
          </Typography>
        </Box>
        <Typography sx={{ mb: 1, mt: 4 }} variant="h6" color="GrayText">
          Entdecke weitere Baumarten
        </Typography>
        <Box
          sx={{
            borderRadius: 2,
            height: "100px",
            display: "flex",
            alignItems: "center",
          }}
          component="div"
        >
          {speciesProfile
            .peek()
            // .filter((species) => species.latin_name === "Acer pseudoplatanus" || species.latin_name === "Prunus avium")
            ?.map((species) => {
              return (
                <Box
                  sx={selectedSpeciesProfile?.latin_name === species.latin_name ? treeZoneSelectedStyle : treeZoneStyle}
                  onClick={() => setSelectedSpeciesProfile(species)}
                >
                  <DraggableTree treeType={species.latin_name} age={50} />
                  <Typography variant="caption">{species.german_name}</Typography>
                </Box>
              );
            })}
        </Box>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ maxWidth: 500, pl: 2, pr: 4, borderRadius: 2, p: 2, bgcolor: "grey.100" }}>
            <Typography sx={{ mb: 2 }} variant="inherit">
              {selectedSpeciesProfile?.german_name} ({selectedSpeciesProfile?.latin_name})
            </Typography>
            <Typography variant="body2" textAlign="justify">
              {selectedSpeciesProfile?.profile}
            </Typography>
          </Box>
          {/* <Box sx={{ display: "flex", mt: 4 }}> */}
          <Box sx={{ width: 230, mx: 4, borderRadius: 2, p: 2, bgcolor: "grey.100" }}>
            <Typography mb={1} variant="inherit">
              Standortansprüche
            </Typography>
            <StandortValueRange
              min={100}
              max={2000}
              minValue={selectedSpeciesProfile?.precipitation_min || 300}
              maxValue={selectedSpeciesProfile?.precipitation_max || 500}
              label="Niederschlagsbedarf (mm)"
              marks={[
                {
                  value: 100,
                  label: "100",
                },
                {
                  value: 2000,
                  label: "2000",
                },
              ]}
            />
            <StandortValueRange
              min={0}
              max={10}
              minValue={selectedSpeciesProfile?.soil_moisture_min || 1}
              maxValue={selectedSpeciesProfile?.soil_moisture_max || 10}
              label="Bodenfeuchte (mm)"
              marks={[
                {
                  value: 0,
                  label: "0",
                },
                {
                  value: 10,
                  label: "10",
                },
              ]}
            />
            <StandortValueRange
              min={0}
              max={10}
              minValue={selectedSpeciesProfile?.ph_min || 4}
              maxValue={selectedSpeciesProfile?.ph_max || 8}
              label="pH-Wert"
              marks={[
                {
                  value: 0,
                  label: "0",
                },
                {
                  value: 10,
                  label: "10",
                },
              ]}
            />
            <StandortValueRange
              min={0}
              max={10}
              minValue={selectedSpeciesProfile?.nutrient_demand_min || 0} // if value is 0 it is executed as false (fix)
              maxValue={selectedSpeciesProfile?.nutrient_demand_max || 10}
              label="Nährstoffbedarf"
              marks={[
                {
                  value: 0,
                  label: "0",
                },
                {
                  value: 10,
                  label: "10",
                },
              ]}
            />
            <StandortValueRange
              min={0}
              max={10}
              minValue={selectedSpeciesProfile?.late_frost_resistance_min || 0} // if value is 0 it is executed as false (fix)
              maxValue={selectedSpeciesProfile?.late_frost_resistance_max || 10}
              label="Spätfrostresistenz"
              marks={[
                {
                  value: 0,
                  label: "0",
                },
                {
                  value: 10,
                  label: "10",
                },
              ]}
            />
          </Box>
          <Box sx={{ borderRadius: 2, p: 2, bgcolor: "grey.100" }}>
            <Typography mb={2} variant="inherit">
              Nutzungsmöglichkeiten
            </Typography>
            <NutzungsChecker label="Stammholzproduktion" icon={<EuroRounded color="info" />} status="checked" />
            <NutzungsChecker label="Biomasse / Kurzumtrieb" icon={<ForestRounded color="info" />} status="unchecked" />
            <NutzungsChecker label="Bienenweide" icon={<EmojiNature color="info" />} status="partial" />
            <NutzungsChecker
              label="Früchte / Nüsse /Streuobst"
              icon={<EmojiNature color="info" />}
              status="unchecked"
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TreeSpeciesSelectionModal;
