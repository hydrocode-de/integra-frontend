import { Box, Modal, Rating, Typography } from "@mui/material";
import React from "react";
import DraggableTree from "../TreeLines/DraggableTree";

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
          Bergahorn Steckbrief
        </Typography>
        <Box sx={{ display: "flex" }}>
          <div>
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
          </div>
          <Typography variant="body2">
            Der Bergahorn (Acer pseudoplatanus) ist eine Pflanzenart aus der Gattung der Ahorne (Acer) in der Familie
            der Seifenbaumgewächse (Sapindaceae). Er ist in Europa heimisch und wird auch Berg-, Wiesen- oder Waldahorn
            genannt. Der Bergahorn ist ein sommergrüner Baum, der Wuchshöhen von bis zu 30 Metern und Stammdurchmesser
            von bis zu 1,5 Metern erreichen kann. Der Bergahorn ist einhäusig getrenntgeschlechtig (monözisch), das
            heißt, männliche und weibliche Blüten sitzen auf ein und derselben Pflanze. Die Blütezeit reicht von April
            bis Mai. Die Früchte sind geflügelte Nüsschen, die in Paaren zusammenstehen und im Herbst reifen.
          </Typography>
        </Box>
        <Box sx={{ mt: 4, width: 400 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ mb: 1, mr: 1 }} variant="subtitle1">
              Standort
            </Typography>
            <Rating name="read-only" value={4} readOnly />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ mb: 1, mr: 1 }} variant="subtitle1">
              Ökologischer Nutzen
            </Typography>
            <Rating name="read-only" value={4} readOnly />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ mb: 1, mr: 1 }} variant="subtitle1">
              Wirtschaftlicher Nutzen
            </Typography>
            <Rating name="read-only" value={4} readOnly />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TreeSpeciesSelectionModal;
