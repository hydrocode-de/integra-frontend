import { Box, Slider } from "@mui/material";
import { Mark } from "@mui/base";
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
    Jan: 0,
    Feb: 1,
    Mär: 2,
    Apr: 3,
    Mai: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Okt: 9,
    Nov: 10,
    Dez: 11,
  };

interface SimulationStepSliderProps {
    noMonthSlider?: boolean;
  }
  const SimulationStepSlider: React.FC<SimulationStepSliderProps> = ({ noMonthSlider }) => {
    const handleMonthChange = (month: keyof typeof monthToIndex) => {
      if (monthToIndex[month] !== seasonMonth.peek() - 1) {
        seasonMonth.value = monthToIndex[month] + 1;
      }
    }
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
            dataIndex={seasonMonth.peek() - 1}
            onChange={handleMonthChange}
            valueFontSize="0.9rem"
            labelColor="black"
          />
        </Box>
        )}
        
      </Box>
    </>
  }

  export default SimulationStepSlider;