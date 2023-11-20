import { Box, CardActionArea, Collapse, IconButton, LinearProgress, Typography } from "@mui/material"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { useSignal, useSignalEffect } from "@preact/signals-react"
import { StatMetric, TreeTypeStatistics, totalStatistics } from "../../appState/statisticsSignals"
import CarbonResultDetailContent from "./CarbonResultDetailContent"
import CountResultDetailContent from "./CountResultDetailContent"
import AGBResultDetailContent from "./AGBResultDetailContent"
import HeightResultDetailContent from "./HeightResultDetailContent"

// global Names for the title
export interface Metric {
    name: string,
    title: string,
    totalIdentifier: keyof TreeTypeStatistics[0],
    reference: number,
    unit: string
}

export const NAME_LOOKUP: {[key: string]: Metric} = {
    count: {name: 'count', title: 'Baumanzahl', totalIdentifier: 'countPerHectare', reference: 100, unit: '100 Bäume / ha'},
    carbon: {name: 'carbon', title: 'Kohlenstoffgehalt', totalIdentifier: 'carbonPerHectare', reference: 10000, unit: '10 t / ha'},
    agb: {name: 'agb', title: 'Oberirdische Biomasse', totalIdentifier: 'agbPerHectare', reference: 10000, unit: '10 t / ha'},
    height: {name: 'height', title: 'Baumhöhen', totalIdentifier: 'meanHeight', reference: 20, unit: '20 m'}
}

const SimulationResultDetailCard: React.FC<{defaultMetric: StatMetric}> = ({ defaultMetric }) => {
    // state to toggle the card
    const open = useSignal<boolean>(false)

    // state to handle the metric
    const metric = useSignal<Metric>({...NAME_LOOKUP[defaultMetric]})
    const totalValue = useSignal<number>(0)

    // calcualte the total value from the current metric
    useSignalEffect(() => {
        totalValue.value = totalStatistics.value[metric.value.totalIdentifier] || 0
    })

    // pass a handler to child components, that can switch the metric
    const changeMetric = (metricName: string) => {
        if (Object.keys(NAME_LOOKUP).includes(metricName)) {
            metric.value = {...NAME_LOOKUP[metricName]}
        } else {
            console.error(`Metric ${metricName} not found`)
        }
    }


    return <>
        {/* Header to make the Card lager or smaller */}
        <CardActionArea onClick={() => open.value = !open.peek()}>
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py={0.5}>
                <Box display="flex" flexDirection="row" alignItems="center" flexGrow={1} pl={1}>
                <Typography variant="body2" mr={1}>{ open.value ? <>&nbsp;</>  : metric.value.title }</Typography>
                    <Box flexGrow={1}>
                        <LinearProgress 
                            variant="determinate"
                            value={Math.min((totalValue.value / metric.peek().reference) * 100, 100)}
                            color={(totalValue.value / metric.peek().reference) * 100 > 50 ? 'success' : 'primary'}
                        />
                    </Box>
                <Typography variant="body2" ml={1}>{metric.peek().unit}</Typography>
                </Box>
                
                {/* <IconButton size="small" edge="end" disableRipple> */}
                {open.value ? <ExpandLess /> : <ExpandMore />}
                {/* </IconButton> */}
            </Box>
        </CardActionArea>
        <Collapse in={open.value}>
            <Box p={1}>
                { metric.value.name === 'carbon' ? <CarbonResultDetailContent onSwitch={changeMetric} /> : null }
                { metric.value.name === 'count' ? <CountResultDetailContent onSwitch={changeMetric} /> : null }
                { metric.value.name === 'agb' ? <AGBResultDetailContent onSwitch={changeMetric} /> : null }
                { metric.value.name === 'height' ? <HeightResultDetailContent onSwitch={changeMetric} /> : null }
            </Box>
        </Collapse>
    </>
}

export default SimulationResultDetailCard