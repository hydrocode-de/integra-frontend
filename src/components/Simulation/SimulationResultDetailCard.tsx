import { Box, CardActionArea, Collapse, IconButton, LinearProgress, Typography } from "@mui/material"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { useSignal, useSignalEffect } from "@preact/signals-react"
import { StatMetric, TreeTypeStatistics, totalStatistics } from "../../appState/statisticsSignals"
import CarbonResultDetailContent from "./CarbonResultDetailContent"

// global Names for the title
export interface Metric {
    name: string,
    title: string,
    totalIdentifier: keyof TreeTypeStatistics[0],
    reference: number,
    unit: string
}

const NAME_LOOKUP: {[key: string]: Metric} = {
    count: {name: 'count', title: 'Baumanzahl', totalIdentifier: 'countPerHectare', reference: 100, unit: '100 Bäume / ha'},
    carbon: {name: 'carbon', title: 'Kohlenstoffgehalt', totalIdentifier: 'carbonPerHectare', reference: 10000, unit: '10 t / ha'},
}

const SimulationResultDetailCard: React.FC<{defaultMetric: StatMetric}> = ({ defaultMetric }) => {
    // state to toggle the card
    const open = useSignal<boolean>(false)

    // state to handle the metric
    const metric = useSignal<Metric>(NAME_LOOKUP[defaultMetric])
    const totalValue = useSignal<number>(0)

    // calcualte the total value from the current metric
    useSignalEffect(() => {
        totalValue.value = totalStatistics.value[metric.value.totalIdentifier] || 0
    })


    return <>
        {/* Header to make the Card lager or smaller */}
        <CardActionArea onClick={() => open.value = !open.peek()}>
            <Box display="flex" flexDirection="row" justifyContent="space-between">
                <Box sx={{flexGrow: 1, px: 1}}>
                    <Typography variant="body2">{ open.value ? <>&nbsp;</>  : metric.value.title }</Typography>
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <Box flexGrow={1}>
                            <LinearProgress 
                                variant="determinate"
                                value={Math.min((totalValue.value / metric.peek().reference) * 100, 100)}
                                color={(totalValue.value / metric.peek().reference) * 100 > 50 ? 'success' : 'primary'}
                            />
                        </Box>
                    <Typography variant="body2" ml={1}>{metric.peek().unit}</Typography>
                    </Box>
                </Box>
                
                <IconButton size="small" edge="end" disableRipple>
                    {open.value ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </Box>
        </CardActionArea>
        <Collapse in={open.value}>
            <Box p={1}>
                { metric.value.name === 'carbon' ? <CarbonResultDetailContent /> : null }
                
            </Box>
        </Collapse>
    </>
}

export default SimulationResultDetailCard