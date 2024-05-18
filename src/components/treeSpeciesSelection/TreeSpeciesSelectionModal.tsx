import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DraggableTree from "../TreeLines/DraggableTree";
import { EmojiNature, EuroRounded, ForestRounded } from "@mui/icons-material";
import StandortValueRange from "./StandortSlider";
import NutzungsChecker from "./NutzungsChecker";
import { Signal } from "@preact/signals-react";
import { SpeciesProfileI, speciesProfile } from "../../appState/speciesProfileSignals";

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
          {speciesProfile.peek()?.map((species) => {
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
              tooltipTitle="Niederschlagsbedarf"
              tooltipContent={`${selectedSpeciesProfile?.german_name} (${selectedSpeciesProfile?.latin_name}) benötigt ${selectedSpeciesProfile?.precipitation_min}-${selectedSpeciesProfile?.precipitation_max} mm Niederschlag pro Jahr.`}
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
              tooltipTitle="Bodenfeuchte"
              tooltipContent={`${selectedSpeciesProfile?.german_name} (${selectedSpeciesProfile?.latin_name}) benötigt ${selectedSpeciesProfile?.soil_moisture_min}-${selectedSpeciesProfile?.soil_moisture_max} mm Bodenfeuchte.`}
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
              tooltipTitle="pH-Wert"
              tooltipContent={`${selectedSpeciesProfile?.german_name} (${selectedSpeciesProfile?.latin_name}) benötigt ${selectedSpeciesProfile?.ph_min}-${selectedSpeciesProfile?.ph_max} pH-Wert.`}
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
              tooltipTitle="Nährstoffbedarf"
              tooltipContent={`${selectedSpeciesProfile?.german_name} (${selectedSpeciesProfile?.latin_name}) benötigt ${selectedSpeciesProfile?.nutrient_demand_min}-${selectedSpeciesProfile?.nutrient_demand_max} Nährstoffbedarf.`}
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
              tooltipTitle="Spätfrostresistenz"
              tooltipContent={`${selectedSpeciesProfile?.german_name} (${selectedSpeciesProfile?.latin_name}) hat eine Spätfrostresistenz von ${selectedSpeciesProfile?.late_frost_resistance_min} bis ${selectedSpeciesProfile?.late_frost_resistance_max}.`}
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
          <Box>
            <Box sx={{ borderRadius: 2, p: 2, bgcolor: "grey.100" }}>
              <Typography mb={2} variant="inherit">
                Nutzungsmöglichkeiten
              </Typography>
              <NutzungsChecker
                tooltipTitle="Holzproduktion"
                tooltipContent={`Mit ${selectedSpeciesProfile?.german_name} (${selectedSpeciesProfile?.latin_name}) kann Holz produziert werden.`}
                label="Stammholzproduktion"
                icon={<EuroRounded color="info" />}
                status={selectedSpeciesProfile?.wood_production || true}
              />
              <NutzungsChecker
                tooltipTitle="Biomasseproduktion"
                tooltipContent={`Mit ${selectedSpeciesProfile?.german_name} (${selectedSpeciesProfile?.latin_name}) kann Biomasse produziert werden.`}
                label="Biomasse / Kurzumtrieb"
                icon={<ForestRounded color="info" />}
                status={selectedSpeciesProfile?.short_rotation || true}
              />
              <NutzungsChecker
                tooltipTitle="Nüsse und Früchte"
                tooltipContent={`Mit ${selectedSpeciesProfile?.german_name} (${selectedSpeciesProfile?.latin_name}) können Nüsse und Früchte geerntet werden.`}
                label="Nüsse / Früchte"
                icon={<EmojiNature color="info" />}
                status={selectedSpeciesProfile?.fruits_nuts || true}
              />
            </Box>
            <Box sx={{ borderRadius: 2, p: 2, mt: 2, bgcolor: "grey.100" }}>
              <Typography mb={2} variant="inherit">
                Blüte
              </Typography>
              <StandortValueRange
                tooltipTitle="Blütezeitpunkt"
                tooltipContent={`${selectedSpeciesProfile?.german_name} (${
                  selectedSpeciesProfile?.latin_name
                }) blüht von ${selectedSpeciesProfile?.flowering_month_min! - 1} bis ${
                  selectedSpeciesProfile?.flowering_month_max
                }.`}
                min={1}
                max={12}
                minValue={selectedSpeciesProfile?.flowering_month_min! - 1} // if value is 0 it is executed as false (fix)
                maxValue={selectedSpeciesProfile?.flowering_month_max!}
                label="Blütezeitpunkt"
                marks={[
                  {
                    value: 1,
                    label: "1",
                  },
                  {
                    value: 12,
                    label: "12",
                  },
                ]}
              />
              <StandortValueRange
                tooltipTitle="Anzahl möglicher Insekten"
                tooltipContent={`${selectedSpeciesProfile?.german_name} (${
                  selectedSpeciesProfile?.latin_name
                }) versorgt bis zu ${selectedSpeciesProfile?.max_n_of_insect_species!}
                } Insekten.`}
                min={0}
                max={30}
                minValue={0} // if value is 0 it is executed as false (fix)
                maxValue={selectedSpeciesProfile?.max_n_of_insect_species!}
                label="Anzahl möglicher Insekten"
                marks={[
                  {
                    value: 0,
                    label: "0",
                  },
                  {
                    value: 30,
                    label: "30",
                  },
                ]}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TreeSpeciesSelectionModal;
