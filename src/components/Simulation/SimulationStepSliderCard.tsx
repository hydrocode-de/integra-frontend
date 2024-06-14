import { Box, Card, CardActionArea, Collapse, Typography } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { simulationStep } from "../../appState/simulationSignals";
import { useSignal } from "@preact/signals-react";
import SimulationStepSlider from "./SimulationStepSlider";



const SimulationStepSliderCard: React.FC = () => {
  // state to handle card state
  const open = useSignal<boolean>(true);

  return (
    <>
      <Box
        minWidth="450px"
        width="40vw"
        maxWidth="600px"
        position="fixed"
        bottom={open.value ? '48px' : '32px'}
        left="0"
        right="0"
        mx="auto"
        zIndex="99"
      >
        <Card sx={{ borderRadius: 2 }}>
          
          <Box sx={{ borderRadius: 2, m: 1, ml: 2, mr: 2 }} p={open.value ? 0 : 0}>
            <CardActionArea onClick={() => (open.value = !open.peek())}>
              <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" m={0}>
                <Typography variant={open.value ? "h6" : "body1"} my="auto">
                  {simulationStep.value.current === 0
                    ? "Simulation starten"
                    : "Bäume nach " + simulationStep.value.current + " Jahren"}
                </Typography>
                {/* <IconButton size="small"> */}
                {open.value ? <ExpandMore /> : <ExpandLess />}
                {/* </IconButton> */}
              </Box>
            </CardActionArea>
            <Collapse in={open.value}>
              <SimulationStepSlider />
            </Collapse>
          </Box>

        </Card>
      </Box>
    </>
  );
};

export default SimulationStepSliderCard;
