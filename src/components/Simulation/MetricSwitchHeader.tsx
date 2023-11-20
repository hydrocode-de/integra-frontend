import { FormControl, MenuItem, Select, Typography } from "@mui/material"
import { useSignal } from "@preact/signals-react"
import { NAME_LOOKUP } from "./SimulationResultDetailCard"


const MetricSwitchHeader: React.FC<{metric: string, metricTitle: string, onSwitch: (metricName: string) => void}> = ({ metric, metricTitle, onSwitch }) => {
    // state to check that we need to switch to a select
    const isSelect = useSignal<boolean>(false)

    const onSelectionChanged = (metricName: string) => {
        // set back to typography
        isSelect.value = false

        // call the callback
        onSwitch(metricName)
    }

    return <>
        {isSelect.value ? (
            <FormControl variant="standard">
            <Select value="current" onChange={e => onSelectionChanged(e.target.value)}>
                {/* add the other options */}
                { Object.entries(NAME_LOOKUP).map(([name, m]) => {
                    if (name === metric) {
                        return <MenuItem value="current" disabled>{metricTitle}</MenuItem>
                    } else {
                        return <MenuItem value={name}>{m.title}</MenuItem>
                    }
                    
                }) }

                {/* also add the current one, but disabled */}
                
            </Select>
            </FormControl>
        ) : (
            <Typography variant="h6" sx={{cursor: 'pointer'}} onClick={() => isSelect.value = true}>{metricTitle}</Typography>
        ) }
    </>
}

export default MetricSwitchHeader