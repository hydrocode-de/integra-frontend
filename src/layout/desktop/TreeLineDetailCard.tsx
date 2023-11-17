import { useParams, Link, Navigate } from "react-router-dom"
import { ArrowBack } from "@mui/icons-material"


import TreeLineDetails from "../../components/TreeLines/TreeLineDetails"
import { Box, IconButton } from "@mui/material"
import { treeLines } from "../../appState/treeLineSignals"
import { useSignalEffect } from "@preact/signals-react"


const TreeLineDetailCard: React.FC = () => {
    // use url params to get the tree id
    const { treeId } = useParams()


    return <>
        { treeLines.value.features.find(f => f.properties.id === treeId)! ? (<>
            <Box display="flex" justifyContent="space-between" p="0.5rem">
                <Link to="/">
                <IconButton size="small" edge="start" >
                    <ArrowBack />
                </IconButton>
                </Link>
            </Box>
            <TreeLineDetails treeLine={treeLines.value.features.find(f => f.properties.id === treeId)!} />
        </>) : (<>
            <Navigate to="/" replace />
        </>) }
    </>
}

export default TreeLineDetailCard