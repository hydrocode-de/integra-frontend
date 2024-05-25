import { IconButton } from "@mui/material"
import { mouseDistanceTrigger, treeLineDistanceTrigger } from "../../appState/distanceSignals"
import { SquareFoot, StackedLineChart } from "@mui/icons-material"

const MeasureButtons: React.FC = () => {
    return <>
        <IconButton 
            color={mouseDistanceTrigger.value ? 'primary' : 'default'} 
            onClick={() => mouseDistanceTrigger.value = !mouseDistanceTrigger.peek()}
        >
            <SquareFoot  />
        </IconButton>

        <IconButton
            color={treeLineDistanceTrigger.value ? 'primary' : 'default'}
            onClick={() => treeLineDistanceTrigger.value = !treeLineDistanceTrigger.peek()}
        >
            <StackedLineChart />
        </IconButton>
    </>
}

export default MeasureButtons