import { Box, Card, CardActionArea, Collapse, Slider, Typography } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Mark } from "@mui/base";
import { seasonMonth, setSimulationStep, simulationStep } from "../../appState/simulationSignals";
import { useSignal } from "@preact/signals-react";
import CircularSlider from "@fseehawer/react-circular-slider";
import { useEffect, useState } from "react";

// hard-code some marks
const marks: Mark[] = [
  // {value: 5, label: '5'},
  { value: 10, label: "10 Jahre" },
  { value: 30, label: "30 Jahre" },
  { value: 50, label: "50 Jahre" },
  { value: 80, label: "80 Jahre" },
];

// hard-code a mapping from month label to data-inde
const monthToIndex = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  Mai: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Okt: 10,
  Nov: 11,
  Dez: 12,
};


const SimulationStepSlider: React.FC = () => {
  // state to handle card state
  const open = useSignal<boolean>(true);

  const [dataIndex, setDataIndex] = useState<keyof typeof monthToIndex>('Jun');

  useEffect(() => {
    seasonMonth.value = monthToIndex[dataIndex];
  }, [dataIndex])

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
              <Box display="flex" mt={1} p={1} alignItems="center">
                <Slider
                  marks={marks}
                  valueLabelDisplay="auto"
                  value={simulationStep.value.current}
                  onChange={(e, value) => setSimulationStep(value as number)}
                />
                <Box ml={2}>
                  <CircularSlider 
                    width={90}
                    label=""
                    data={Object.keys(monthToIndex)}
                    dataIndex={6}
                    onChange={(mon: keyof typeof monthToIndex) => setDataIndex(mon)}
                    valueFontSize="0.9rem"
                    labelColor="black"
                  />
                </Box>
              </Box>
            </Collapse>
          </Box>

        </Card>
      </Box>
    </>
  );
};

export default SimulationStepSlider;
