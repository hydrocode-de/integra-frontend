import { Box, Slider } from "@mui/material";
import { Mark } from "@mui/base";
import { useEffect, useState } from "react";
import { seasonMonth, setSimulationStep, simulationStep } from "../../appState/simulationSignals";
import { appView } from "../../appState/appViewSignals";
import CircularSlider from "@fseehawer/react-circular-slider";

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
    Mär: 3,
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

interface SimulationStepSliderProps {
    noMonthSlider?: boolean;
  }
  const SimulationStepSlider: React.FC<SimulationStepSliderProps> = ({ noMonthSlider }) => {
    const [dataIndex, setDataIndex] = useState<keyof typeof monthToIndex>('Jun');
  
    useEffect(() => {
      seasonMonth.value = monthToIndex[dataIndex];
    }, [dataIndex])
  
    return <>
      <Box display="flex" mt={1} p={1} alignItems="center">         
        <Slider
          marks={marks}
          valueLabelDisplay="auto"
          value={simulationStep.value.current}
          onChange={(e, value) => setSimulationStep(value as number)}
        />
  
        {/* The month slider is not needed with the biomass tab open */}
        { appView.value === 'biomass' || !!noMonthSlider ? null :(
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
        )}
        
      </Box>
    </>
  }

  export default SimulationStepSlider;