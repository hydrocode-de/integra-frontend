import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText, Skeleton } from "@mui/material"
import { calculatedTreeLineFeatures } from "../../appState/treeLineSignals"
import { EditLocation, Forest } from "@mui/icons-material"
import { editTreeLineId } from "../../appState/treeLocationSignals"
import {  flyTo } from "../MainMap/MapObservableStore"
import { center } from "@turf/turf"


const TreeLinesOverview: React.FC = () => {
    // use a handler to select a new line, to add a flyTo map event
    const handleSelect = (id: string) => {
        // set the id of the tree line to edit
        editTreeLineId.value = id

        // get the bounding box of the line
        // const lineBox = bbox(calculatedTreeLineFeatures.peek().find(l => l.properties.id === id))
        const lineCenter = center(calculatedTreeLineFeatures.value.find(l => l.properties.id === id)!)
        
        // fly to the line
        // fitBounds([lineBox[0], lineBox[1], lineBox[2], lineBox[3]])
        flyTo({center: {lon: lineCenter.geometry.coordinates[0], lat: lineCenter.geometry.coordinates[1]}})
    }

    return <>
        <List sx={{width: '100%', bgcolor: 'background.paper'}}>
            { calculatedTreeLineFeatures.value.map((line, idx) => (
                <ListItemButton 
                    key={idx} 
                    sx={{width: '100%'}} 
                    onClick={() => handleSelect(line.properties.id)}
                    selected={editTreeLineId.value === line.properties.id}
                >
                    <ListItemAvatar>
                        <Avatar>
                            {editTreeLineId.value === line.properties.id ? <EditLocation /> : <Forest /> }
                        </Avatar>
                    </ListItemAvatar>

                    <ListItemText 
                        primary={`Baumreihe ${idx + 1}`} 
                        secondary={`${line.properties.treeCount} Bäume (${line.properties.lineLength?.toFixed(1)}m)`}
                    />
                </ListItemButton>
            )) }
            { !calculatedTreeLineFeatures.value.map(l => l.properties.id).includes(editTreeLineId.value) ? (
                <ListItemButton selected>
                    <ListItemAvatar>
                        <Skeleton variant="circular" width={40} height={40} />
                    </ListItemAvatar>
                    <ListItemText primary="Neue Baumlinie" secondary="füge weitere Bäume hinzu, damit hier eine Reihe entsteht" />
                </ListItemButton>
            ) : null }
        </List>
    </>
}

export default TreeLinesOverview