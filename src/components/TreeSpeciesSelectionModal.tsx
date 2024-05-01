import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import DraggableTree from "./TreeLines/DraggableTree";
import { editAge } from "../appState/treeLocationSignals";
import { BorderColor } from "@mui/icons-material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const dropZoneStyle = {
  border: "2px dashed",
  // borderStyle: "dashed solid", ",
  borderColor: "grey.500",
  borderRadius: "5px",
  // borderColor: "grey.100",
  width: "100%",
  height: "100px",
  display: "flex",
  justifyContent: "center",
  flexGrow: 1,
  alignItems: "center",
  backgroundColor: "#f9f9f9",
  // color: "#000",
  fontSize: "16px",
  fontWeight: "bold",
};

const selectZoneStyle = {
  borderRadius: "5px",
  width: "100%",
  height: "100px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f9f9f9",
  color: "#000",
  fontSize: "16px",
  fontWeight: "bold",
};

const TreeSpeciesSelectionModal: React.FC = () => {
  return (
    <Modal open={true}>
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h4">
          Welche Baumart wollen sie nutzen?
        </Typography>
        <Typography id="modal-modal-title" variant="h6">
          Ausgewählte Baumarten
        </Typography>
        <Box sx={dropZoneStyle} component="div" display="flex" justifyContent="space-between"></Box>
        <Typography id="modal-modal-title" variant="h6">
          Baumarten
        </Typography>
        <Box sx={selectZoneStyle} component="div" display="flex" justifyContent="space-between">
          {/* <DragBox> */}
          <DraggableTree treeType="Bergahorn" age={editAge.value} />
          {/* </DragBox> */}

          {/* <DragBox> */}
          <DraggableTree treeType="Vogelbeere" age={editAge.value} />
          {/* </DragBox> */}
        </Box>
      </Box>
    </Modal>
  );
};

export default TreeSpeciesSelectionModal;
