import { Alert, Box, IconButton, Modal, Typography } from "@mui/material";
import React, {useState } from "react";
import DraggableTree from "../TreeLines/DraggableTree";
import { Close, EmojiNature, EuroRounded, ForestRounded } from "@mui/icons-material";
import { Signal } from "@preact/signals-react";
import { SpeciesProfileI, speciesProfile } from "../../appState/speciesProfileSignals";
import StandortValueRange from "./StandortSlider";
import NutzungsChecker from "./NutzungsChecker";
import { treePalette } from "../../appState/appViewSignals";
import DragBox from "../MainActionCard/DragBox";
import { editAge } from "../../appState/treeLocationSignals";
import { useDrop } from "react-dnd";


const TreeSpeciesSelectionModal: React.FC<{ isOpen: Signal<boolean> }> = ({ isOpen }) => {
  const [selectedSpeciesProfile, setSelectedSpeciesProfile] = useState<SpeciesProfileI | undefined>(
    speciesProfile.peek()?.[0]
  );

  // drop zone for the tree species
  const [, dropPlatte] = useDrop(() => ({
    accept: 'tree',
    drop: (item: any) => {
      // filter out the current tree type, if it is already in the palette
      const others = treePalette.peek().filter(t => t !== item.treeType)

      // add the item to the end of the palette
      treePalette.value = [...others, item.treeType]
    }
  }))

  const handleRemoveTree = (tree: string) => {
    treePalette.value = treePalette.peek().filter(t => t !== tree)
  }

  // console.log(speciesProfile.value);
  return (
    <Modal onClose={() => (isOpen.value = !isOpen.peek())} open={isOpen.value}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "85%",
          maxWidth: "1200px",
          maxHeight: 'calc(100vh - 30px)',
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 4,
          overflowY: 'auto'
        }}
      >
        {/* Palette */}
        <Box>
          <Typography sx={{ mb: 1 }} variant="h5">
            Deine Baumarten
          </Typography>
          <Alert severity="info">
            Hier kannst du Baum- und Straucharten von unten nach Standorteigenschaften auswählen und in die Palette ziehen.
            Danach kannst du Sie auf der Karte zum Planen nutzen.
          </Alert>
          <Box
            ref={dropPlatte}
            sx={{
              border: "2px dashed",
              borderColor: "grey.400",
              borderRadius: 2,
              bgcolor: "grey.100",
              height: "80px",
              display: "flex",
              alignItems: "center",
              padding: "1rem"
            }}
          >
            { treePalette.value.map((tree, idx) => (
              <Box sx={{position: 'relative'}} key={idx}>
                <DragBox key={idx}>
                  <DraggableTree treeType={tree} age={editAge.value} />
                </DragBox>
                <IconButton 
                  size="small" 
                  sx={{ position: "absolute", top:  '-16px', right: '-12px'}}
                  onClick={() => handleRemoveTree(tree)}
                >
                    <Close />
                  </IconButton>
              </Box>
            )) }
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
        </Box>

        {/* insert a warning */}
        { treePalette.value.length >= 4 ? (
          <Alert severity="warning">
            Mehr als 4 Baum- und Straucharten können in der Palette nicht gut dargestellt werden. 
            Nutze jetzt 4 Arten und füge wenn du fertig bist weitere Arten hinzu.
          </Alert>
        ) : null }
        
        {/* Other Species */}
        <Box>
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
            {speciesProfile.peek()?.filter(t => t.type === 'Baum').map((species, idx) => {
              return (
                <Box mr={2} sx={{maxWidth: '75px', lineHeight: 0.5}} key={idx}>
                  <DragBox 
                    selected={species.latin_name === selectedSpeciesProfile?.latin_name}
                    onClick={() => setSelectedSpeciesProfile(species)}
                  >
                    <DraggableTree treeType={species.latin_name} age={50} />
                  </DragBox>
                  <Typography variant="caption">{species.german_name}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box>
          <Typography sx={{ mb: 1, mt: 4 }} variant="h6" color="GrayText">
            Entdecke weitere Straucharten
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
            {speciesProfile.peek()?.filter(t => t.type === 'Strauch').map((species, idx) => {
              return (
                <Box mr={2} sx={{maxWidth: '75px', lineHeight: 0.5}} key={idx}>
                  <DragBox 
                    selected={species.latin_name === selectedSpeciesProfile?.latin_name}
                    onClick={() => setSelectedSpeciesProfile(species)}
                  >
                    <DraggableTree treeType={species.latin_name} age={50} />
                  </DragBox>
                  <Typography variant="caption">{species.german_name}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Details */}
        <Box mt={1} sx={{ display: "flex" }}>
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
            {/* <StandortValueRange
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
            /> */}
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
                tooltipTitle="Anzahl möglicher Insektenarte "
                tooltipContent={`${selectedSpeciesProfile?.german_name} (${
                  selectedSpeciesProfile?.latin_name
                }) versorgt bis zu ${selectedSpeciesProfile?.max_n_of_insect_species!}
                } Insekten.`}
                min={0}
                max={30}
                minValue={0} // if value is 0 it is executed as false (fix)
                maxValue={selectedSpeciesProfile?.max_n_of_insect_species!}
                label="Anzahl möglicher Insektenarten"
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
