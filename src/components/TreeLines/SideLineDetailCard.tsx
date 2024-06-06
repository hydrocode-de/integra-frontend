import { useSignal, useSignalEffect } from "@preact/signals-react"
import { CalculatedTreeLine } from "../../appState/tree.model";
import { activeTreeLineId, setDetailId } from "../../appState/sideContentSignals";
import { calculatedTreeLineFeatures, updateTreeLineProps } from "../../appState/treeLineSignals";
import { Box, Card, CardActionArea, Collapse, IconButton, Slider, Typography } from "@mui/material";
import { Close, ExpandLess, ExpandMore, VisibilityOutlined } from "@mui/icons-material";
import { center } from "@turf/turf";
import { flyTo } from "../MainMap/MapObservableStore";

const SideLineDetailCard: React.FC = () => {
    // state to track if the card is open
    const open = useSignal<boolean>(true);

    // get a copy of the treeline
    const treeLine = useSignal<CalculatedTreeLine["features"][0] | undefined>(undefined)

    // listen to changes in the active
    useSignalEffect(() => {
        if (activeTreeLineId.value) {
            treeLine.value = calculatedTreeLineFeatures.value.filter(line => line.properties.id === activeTreeLineId.peek())[0]
        } else {
            treeLine.value = undefined
        }
    })

    // some card handlers
    const handleClose = () => {
        setDetailId({lineId: undefined})
    }

    const handleView = () => {
        const c = center(treeLine.peek()!)
        flyTo({
            center: {lon: c.geometry.coordinates[0], lat: c.geometry.coordinates[1]},
        })
    }

    const setNewWidth = (width: number) => {
        updateTreeLineProps(treeLine.value!.properties.id, { width })
    }

    // if the treeLine is undefined, we don't render anything
    // because either another card, or nothing is shown in the side content
    if (!treeLine.value) return null

    return <>
        <Card sx={{
            mt: open.value ? '16px' : 0,
            ml: open.value ? '16px' : 0,
            p: open.value ? 2 : 1
        }}>
            <Box display="flex">
                <IconButton onClick={handleView} size="small">
                    <VisibilityOutlined />
                </IconButton>

                <CardActionArea onClick={() => open.value = !open.peek()}>
                    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" m={0}>
                        <Typography variant={open.value ? "h6" : "body1"} my="auto">
                            Baumreihe
                        </Typography>
                        { open.value ? <ExpandLess /> : <ExpandMore /> }
                    </Box>
                </CardActionArea>

                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </Box>

            <Collapse in={open.value}>
                <Box sx={{overflowY: 'scroll', p: 1}}>

                    <Box p={1}>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography variant="body2">Anzahl Bäume:</Typography>
                            <Typography variant="body1">{ treeLine.value.properties.treeCount }</Typography>
                        </Box>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography variant="body2">Länge:</Typography>
                            <Typography variant="body1">{ treeLine.value.properties.lineLength?.toFixed(1) } m</Typography>
                        </Box>
                    </Box>

                    <Box p={1} mt={1}>
                        <Typography variant="h6">Breite</Typography>
                        <Slider
                            min={1}
                            max={15}
                            value={treeLine.value.properties.width}
                            onChange={(_, v) => setNewWidth(v as number)}
                        />
                    </Box>

                </Box>
            </Collapse>
        </Card>
    </>
}

export default SideLineDetailCard