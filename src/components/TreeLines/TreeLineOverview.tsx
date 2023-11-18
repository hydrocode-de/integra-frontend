import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material"
import { treeTypeStatistics } from "../../appState/statisticsSignals"
import { useSignal } from "@preact/signals-react"

const TreeLineOverview: React.FC = () => {
    // create a signal to switch the current stats value
    const currentState = useSignal<string>('count')
    
    return <>
        <Box display="flex" justifyContent="space-between" flexDirection="row" alignItems="center" mt={3} mb={1}>
            <Typography variant="h6">Überlick</Typography>
            <FormControl variant="standard">
            <Select size="small" value={currentState.value} onChange={e => currentState.value = e.target.value}>
                <MenuItem value="count">Anzahl</MenuItem>
                <MenuItem value="carbon">Kohlenstoff</MenuItem>
            </Select>
            </FormControl>
        </Box>
        { Object.entries(treeTypeStatistics.value).map(([treeType, stats]) => {
            return <Box key={treeType} display="flex" justifyContent="space-between">
                <Typography variant="body1">{ treeType }</Typography>
                { currentState.value === 'carbon' ? (
                    <Typography variant="body1">
                        { `${((stats.totalCarbon || 0) / 1000).toFixed(2)} t  (${(stats.countPerHectare || 0).toFixed(1)} kg / ha)` }
                    </Typography>
                ) : null }
                { currentState.value === 'count' ? (
                    <Typography variant="body1">
                        { `${stats.count} Bäume  (${Math.floor(stats.countPerHectare)} / ha)` }
                    </Typography>
                ) : null }
            </Box>
        })}
    </>
}

export default TreeLineOverview