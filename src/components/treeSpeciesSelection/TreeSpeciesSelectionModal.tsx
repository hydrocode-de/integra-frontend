import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import DraggableTree from "../TreeLines/DraggableTree";
import { EmojiNature, EuroRounded, ForestRounded } from "@mui/icons-material";
import StandortValueRange from "./StandortSlider";
import NutzungsChecker from "./NutzungsChecker";
import { Signal } from "@preact/signals-react";

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

const TreeSpeciesSelectionModal: React.FC<{isOpen:Signal<boolean>}> = ({isOpen}) => {
  return (
    <Modal onClose={() => (isOpen.value = !isOpen.peek())}  open={isOpen.value}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "1200px",
          width: "80%",
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
          <Box sx={treeZoneStyle}>
            <DraggableTree treeType="Bergahorn" age={50} />
            <Typography variant="caption">Bergahorn</Typography>
          </Box>
          <Box sx={treeZoneStyle}>
            <DraggableTree treeType="Bergahorn" age={50} />
            <Typography variant="caption">Bergahorn</Typography>
          </Box>
          <Box sx={treeZoneSelectedStyle}>
            <DraggableTree treeType="Bergahorn" age={50} />
            <Typography variant="caption">Feldahorn</Typography>
          </Box>
          <Box sx={treeZoneStyle}>
            <DraggableTree treeType="Bergahorn" age={50} />
            <Typography variant="caption">Bergahorn</Typography>
          </Box>
          <Box sx={treeZoneStyle}>
            <DraggableTree treeType="Bergahorn" age={50} />
            <Typography variant="caption">Bergahorn</Typography>
          </Box>
          <Box sx={treeZoneStyle}>
            <DraggableTree treeType="Bergahorn" age={50} />
            <Typography variant="caption">Bergahorn</Typography>
          </Box>
          <Box sx={treeZoneStyle}>
            <DraggableTree treeType="Bergahorn" age={50} />
            <Typography variant="caption">Bergahorn</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ maxWidth: 500, pl: 2, pr: 4, borderRadius: 2, p: 2, bgcolor: "grey.100" }}>
            <Typography sx={{ mb: 2 }} variant="inherit">
              Feldahorn (Acer campestre)
            </Typography>
            <Typography variant="body2" textAlign="justify">
              Der Feldahorn (Acer campestre) eignet sich sehr gut für die Stammholzproduktion oder den Einsatz als
              Heckenpflanze in Agroforstsystemen. Der Feldahorn hat einen langsamen Wuchs und erreicht eine maximale
              Höhe von 28 m. Er stellt geringe Ansprüche an den Standort. Der Feldahorn hat eine vielseitige ökologische
              Bedeutung. Sein leicht abbaubares Laub fördert die Humusbildung und dient als hochwertiges Futter für
              Insekten und Vögel. Es kann ebenfalls als Futter für Nutztiere verwendet werden.
            </Typography>
          </Box>
          {/* <Box sx={{ display: "flex", mt: 4 }}> */}
          <Box sx={{ width: 230, mx: 4, borderRadius: 2, p: 2, bgcolor: "grey.100" }}>
            <Typography mb={1} variant="inherit">
              Standortansprüche
            </Typography>
            <StandortValueRange
              min={100}
              max={1000}
              minValue={300}
              maxValue={500}
              label="Niederschlagsbedarf (mm)"
              marks={[
                {
                  value: 100,
                  label: "100",
                },
                {
                  value: 300,
                  label: "300",
                },
                {
                  value: 600,
                  label: "600",
                },
                {
                  value: 900,
                  label: "900",
                },
              ]}
            />
            <StandortValueRange
              min={100}
              max={1000}
              minValue={300}
              maxValue={500}
              label="Bodenfeuchte (mm)"
              marks={[
                {
                  value: 100,
                  label: "100",
                },
                {
                  value: 300,
                  label: "300",
                },
                {
                  value: 600,
                  label: "600",
                },
                {
                  value: 900,
                  label: "900",
                },
              ]}
            />
            <StandortValueRange
              min={100}
              max={1000}
              minValue={300}
              maxValue={500}
              label="pH-Wert"
              marks={[
                {
                  value: 100,
                  label: "100",
                },
                {
                  value: 300,
                  label: "300",
                },
                {
                  value: 600,
                  label: "600",
                },
                {
                  value: 900,
                  label: "900",
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
