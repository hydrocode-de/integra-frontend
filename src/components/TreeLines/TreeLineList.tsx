import React from "react";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import { ArrowRight, ArrowUpward } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { zoom } from "../../appState/mapSignals";

import { treeLines } from "../../appState/treeLineSignals";

const TreeLineList: React.FC = () => {
  return (
    <>
      {/* Generate one Accordion for each treeLine feature */}
      {
        // render emtpy state image if there are no tree lines
        treeLines.value.features.length === 0 && (
          <Box display="flex" justifyContent="center" flexDirection={"column"} alignItems="center" sx={{ mt: 4 }}>
            <img height={96} src="/empty_state/empty-state-illustration.png" alt="Keine Baumreihen" />
            {/* <Box display={'flex'}> */}
            <Typography sx={{ mt: 2 }} variant="body1" align="center">
              {/* if  */}
              Noch keine Baumreihe vorhanden
            </Typography>
            {zoom.value > 13 ? (
              <Box display={"flex"} ml={3} mr={3} mt={1} justifyContent={"center"} alignItems={"center"}>
                <Typography sx={{ mr: 1 }} variant="body2" align="center">
                  Klicken sie auf den Plus Button
                </Typography>
                {/* add and up icon */}
                <ArrowUpward />
              </Box>
            ) : (
              <Typography ml={3} mr={3} mt={1} variant="body2" align="center">
                Suchen sie ein passendes Gebiet auf der Karte
              </Typography>
            )}
            {/* </Box> */}
          </Box>
        )
      }

      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {treeLines.value.features.map((treeLine, index) => (
          <React.Fragment key={treeLine.properties.id}>
            <ListItem
              key={treeLine.properties.id}
              sx={{
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)", // Change this to your preferred hover color
                },
              }}
              component={Link}
              to={`/detail/${treeLine.properties.id}`}
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <ArrowRight />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ height: 48 }} src="/icons/bergahorn-10.png" title="green iguana"></Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={treeLine.properties.name}
                secondary={`${treeLine.properties.treeCount} Bäume (${treeLine.properties.length?.toFixed(0)}m)`}
              ></ListItemText>

              {/* <ListItemIcon> */}
              {/* <ArrowRight /> */}
              {/* </ListItemIcon> */}
              {/* action={<ArrowRight />} */}
            </ListItem>
            {index !== treeLines.value.features.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </>
  );
};

export default TreeLineList;
