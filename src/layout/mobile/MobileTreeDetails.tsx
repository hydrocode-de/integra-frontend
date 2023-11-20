import { Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import { useParams, Navigate, Link } from 'react-router-dom'
import {useSignal } from "@preact/signals-react"
import { treeLines } from '../../appState/treeLineSignals';
import TreeLineDetails from '../../components/TreeLines/TreeLineDetails';


const MobileTreeDetails: React.FC = () => {
    // use url params to get the tree id
    const { treeId } = useParams();

    // get the correct treeLine
    const treeLine = useSignal(treeLines.value.features.find(f => f.properties.id === treeId)!)
    
    if (!treeLine.value) {
        return <>
            <Navigate to="/" />
        </>
    }
    return <>
        {/* render an app bar to a fixed position */}
        <AppBar position="fixed" sx={{position: 'fixed', top: 0}}>
            <Toolbar color="default">
                <Link to="/">
                    <IconButton size="medium" edge="start">
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h6" ml={1}>{treeLine.value.properties.name}</Typography>
            </Toolbar>
        </AppBar>
        <Box>
            <TreeLineDetails treeLine={treeLine.value} />
        </Box>
    </>
}

export default MobileTreeDetails;


