import { Box, Icon, Modal, Rating, Slider, Typography } from "@mui/material";
import React from "react";
import DraggableTree from "../TreeLines/DraggableTree";
import { Check, Circle, CircleOutlined, MonetizationOn } from "@mui/icons-material";

const treeZoneStyle = {
  display: "flex",
  flexDirection: "column",
  px: "8px",
  bgcolor: "grey.100",
  margin: "8px",
  borderRadius: 2,
  ":hover": {
    bgcolor: "grey.200",
  },
};

const TreeSpeciesSelectionModal: React.FC = () => {
  return (
    <Modal open={true}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "1000px",
          width: "80%",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography sx={{ mb: 4 }} variant="h4">
          Auswahl der Baumarten
        </Typography>
        <Typography sx={{ mb: 1 }} variant="h6">
          Ausgewählte Baumarten
        </Typography>
        <Box
          sx={{
            border: "3px dashed",
            borderColor: "grey.200",
            borderRadius: 2,
            bgcolor: "grey.100",
            width: "100%",
            height: "100px",
            display: "flex",
          }}
        ></Box>
        <Typography sx={{ mb: 1, mt: 4 }} variant="h6">
          Baumarten
        </Typography>
        <Box
          sx={{
            borderRadius: 2,
            width: "100%",
            height: "100px",
            display: "flex",
            alignItems: "center",
            bgcolor: "grey.100",
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
          <Box sx={treeZoneStyle}>
            <DraggableTree treeType="Bergahorn" age={50} />
            <Typography variant="caption">Bergahorn</Typography>
          </Box>
        </Box>
        <Typography sx={{ mb: 1, mt: 4 }} variant="h6">
          Feldahorn (Acer campestre)
        </Typography>
        <Box sx={{ display: "flex", maxWidth: 700 }}>
          {/* <div>
            <Box
              sx={{
                p: 2,
                mr: 4,
                bgcolor: "grey.100",
                borderRadius: 2,
              }}
            >
              <DraggableTree treeType="Bergahorn" age={50} />
            </Box>
          </div> */}
          <Typography variant="body2">
            Der Feldahorn (Acer campestre) eignet sich sehr gut für die Stammholzproduktion oder den Einsatz als
            Heckenpflanze in Agroforstsystemen. Der Feldahorn hat einen langsamen Wuchs und erreicht eine maximale Höhe
            von 28 m. Er stellt geringe Ansprüche an den Standort. Der Feldahorn hat eine vielseitige ökologische
            Bedeutung. Sein leicht abbaubares Laub fördert die Humusbildung und dient als hochwertiges Futter für
            Insekten und Vögel. Es kann ebenfalls als Futter für Nutztiere verwendet werden.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", mt: 4 }}>
          <Box sx={{ borderRadius: 2, px: 4, py: 3, bgcolor: "grey.100", width: "40%" }}>
            <Typography variant="h6">Standortansprüche</Typography>
            <Box mt={1}>
              <Typography sx={{}} variant="subtitle1">
                Niederschlag (mm)
              </Typography>
              <Slider
                min={100}
                max={1000}
                // valueLabelDisplay="on"
                value={[500, 1000]}
                disabled
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
            <Box mt={1}>
              <Typography variant="subtitle1">Bodenfeuchte (m³/m³)</Typography>
              <Slider
                min={100}
                max={1000}
                // valueLabelDisplay="on"
                value={[300, 500]}
                disabled
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
            <Box mt={1}>
              <Typography sx={{}} variant="subtitle1">
                pH-Wert
              </Typography>
              <Slider
                min={100}
                max={1000}
                // valueLabelDisplay="on"
                value={[500, 800]}
                disabled
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
          </Box>
          <Box sx={{ borderRadius: 2, ml: 4, px: 4, py: 3, bgcolor: "grey.100", width: "40%" }}>
            <Typography mb={2} variant="h6">
              Nutzungsmöglichkeiten
            </Typography>
            <Box sx={{ display: "flex", pb: 2 }}>
              <MonetizationOn />
              <Typography pl={1} flex={1} variant="subtitle1">
                Wertholz
              </Typography>
              <Check />
            </Box>
            <Box sx={{ display: "flex", pb: 2 }}>
              <MonetizationOn />
              <Typography pl={1} flex={1} variant="subtitle1">
                Biomasse / Kurzumtrieb
              </Typography>
              <CircleOutlined sx={{ m: "auto" }} />
            </Box>
            <Box sx={{ display: "flex", pb: 2 }}>
              <MonetizationOn />
              <Typography pl={1} flex={1} variant="subtitle1">
                Bienenweide
              </Typography>
              <CircleOutlined sx={{ m: "auto" }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TreeSpeciesSelectionModal;
