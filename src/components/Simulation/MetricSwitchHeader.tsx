import { FormControl, MenuItem, Select, Typography } from "@mui/material"
import { useSignal } from "@preact/signals-react"
import { NAME_LOOKUP } from "./SimulationResultDetailCard"


const MetricSwitchHeader: React.FC<{metric: string, metricTitle: string, onSwitch: (metricName: string) => void}> = ({ metric, metricTitle, onSwitch }) => {
    // state to check that we need to switch to a select
    const isSelect = useSignal<boolean>(false)
    //const [isSelect, setIsSelect] = useState<boolean>(false)

    const onSelectionChanged = (metricName: string) => {
        // call the callback
        onSwitch(metricName)
    }

    const enableSelect = () => {
        isSelect.value = true
    }

    return <>
        {/* {isSelect.value ? ( */}
            <FormControl variant="standard" sx={{display: isSelect.value ? 'block' : 'none'}}>
            <Select value="current" onChange={e => onSelectionChanged(e.target.value)}>
                {/* add the other options */}
                { Object.entries(NAME_LOOKUP).map(([name, m]) => {
                    if (name === metric) {
                        return <MenuItem key="current" value="current" disabled>{metricTitle}</MenuItem>
                    } else {
                        return <MenuItem key={name} value={name}>{m.title}</MenuItem>
                    }
                    
                }) }

                {/* also add the current one, but disabled */}
                
            </Select>
            </FormControl>
        {/* ) : ( */}
            <Typography variant="h6" sx={{cursor: 'pointer', display: isSelect.value ? 'none' : 'block'}} onClick={enableSelect}>{metricTitle}</Typography>
        {/* ) } */}
    </>
}

export default MetricSwitchHeader