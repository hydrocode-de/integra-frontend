import { Alert, Box, Button, Card, CardActionArea, Collapse, Typography } from "@mui/material"

import DraggableTree  from "../../components/TreeLines/DraggableTree"
import { editAge, editTreeLineId } from "../../appState/treeLocationSignals"
import { useSignal } from "@preact/signals-react"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { nanoid } from "nanoid"
import TreeLinesOverview from "../../components/TreeLines/TreeLinesOverview"
import { zoom } from "../../appState/mapSignals"
import { flyTo } from "../../components/MainMap/MapObservableStore"

const DragBox: React.FC<React.PropsWithChildren> = ({children}) => (
    <Box
        marginRight="5px"
        borderRadius="4px"
        border="5px solid rgba(128,128,128,0.1)" 
        sx={{padding: '2px', backgroundColor: 'rgba(128,128,128,0.3)', maxWidth: '60px', maxHeight: '60px', minWidth: '60px', minHeight: '60px'}} 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
    >
        { children }
    </Box>
)
const DraggableElementsCard: React.FC = () => {
    // state to handle card state
    const open = useSignal<boolean>(true)

    return <>
    <Card sx={{mx: 1, p: open.value ? 2 : 1}}>
        {/* Draggable components box */}
        <CardActionArea onClick={() => (open.value = !open.peek())}>
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" m={0}>
                <Typography variant={open.value ? "h6" : "body1"} my="auto">
                    Bäume hinzufügen
                </Typography>
                { open.value ? <ExpandMore /> : <ExpandLess /> }
            </Box>
        </CardActionArea>

        <Collapse in={open.value}>
            <Box component="div" display="flex" flexDirection="row" mt="1">
                { zoom.value < 14.5 ? (
                    <Alert severity="info">
                        Editor auf dieser Zoomstufe nicht verfügbar.<br /> 
                        <Button variant="text" size="small" onClick={() => flyTo({zoom: 18.5, pitch: 45})}>Hereinzoomen.</Button>
                    </Alert>
                ) : (<>
                        <DragBox>
                            <DraggableTree treeType="Acer pseudoplatanus"  age={editAge.value} />
                        </DragBox>

                        <DragBox>
                            <DraggableTree treeType="Pyrus communis"  age={editAge.value} />
                        </DragBox>
                    </>)
                }
            </Box>

            {/* Controls */}
            {/* <Box sx={{mt: 1, p: 1}}>
                <Typography variant="body2" id="age-slider">Alter</Typography>
                <Box display="flex">
                    <Slider 
                        aria-labelledby="age-slider"
                        min={1}
                        max={100}
                        marks={true}
                        value={editAge.value}
                        onChange={(e, value) => editAge.value = value as number}
                    />
                </Box>
                <Typography sx={{ml: 1}} variant="body1">{editAge.value} years</Typography>
            </Box> */}

            <Typography sx={{mt: 2}} variant="h6">Übersicht</Typography>


            {/* { calculatedTreeLineFeatures.value.length > 0 ? (<> */}
                <Typography sx={{mt: 2}} variant="h6">Baureihen</Typography>

                <TreeLinesOverview /> 
    
                <Box sx={{mt: 1, p: 1}}>
                    <Button variant="contained" onClick={() => editTreeLineId.value = nanoid(8)}>Neue Baumline</Button>
                </Box>
                {/* </>) : null} */}

        </Collapse>
    </Card>
    </>
}

export default DraggableElementsCard