import { Box, Typography } from "@mui/material"
import { treeTypeStatistics } from "../../appState/statisticsSignals"

const TreeLineOverview: React.FC = () => {
    return <>
        { Object.entries(treeTypeStatistics.value).map(([treeType, stats]) => {
            return <Box key={treeType} display="flex" justifyContent="space-between">
                <Typography variant="body1">{ treeType }</Typography>
                <Typography variant="body1">{ `${stats.count} Bäume (${Math.floor(stats.countPerHectare)} / ha)` }</Typography>
            </Box>
        })}
    </>
}

export default TreeLineOverview