import { ButtonGroup, IconButton, Typography } from "@mui/material"
import { AddBoxOutlined, DeleteOutline, CloseOutlined, CheckOutlined } from "@mui/icons-material"

import { useAppDispatch, useAppSelector } from "../hooks"
import { DrawControlState, addLineAction, updateDrawState } from "./MainMap/treeLineFeatures/treeLinesSlice"
import { useZoom } from "./MainMap/mapFeatures/mapHooks"
import { useDrawBuffer } from "./MainMap/treeLineFeatures/treeLinesHooks"

const DrawPalette: React.FC = () => {
    // get the current state of the DrawControl
    const drawState = useAppSelector(state => state.treeLines.draw)

    // get a state dispatcher
    const dispatch = useAppDispatch()

    // subscribe to the zoom level of the map
    const zoom = useZoom()

    // subscribe to the current buffer state
    const buffer = useDrawBuffer()

    // define the functions to change the edit state
    const onEdit = () => dispatch(updateDrawState(DrawControlState.LINE))
    const onSave = () => dispatch(addLineAction({distance: 40, type: 'birch'}))
    const onDiscard = () => dispatch(updateDrawState(DrawControlState.TRASH))
    const onTurnOff = () => dispatch(updateDrawState(DrawControlState.OFF))
    const onAddLine = () => dispatch(updateDrawState(DrawControlState.ADD_LINE))

    return <>
        <Typography variant="h6" component="div" display="flex" justifyContent="space-between">
            Pflanzungen
        
            { drawState === DrawControlState.OFF ? (
                <IconButton size="small" color="primary" aria-label="Pflanung hinzufügen" onClick={onEdit} disabled={zoom < 13.0}>
                    <AddBoxOutlined />
                </IconButton>
            ) : (
                <ButtonGroup>
                    <IconButton size="small" color="primary" aria-label="Pflanung hinzufügen" onClick={onAddLine}>
                        <AddBoxOutlined />
                    </IconButton>
                    <IconButton size="small" color="success" aria-label="Pflanung speichern" onClick={onSave} disabled={buffer.features.length === 0}>
                        <CheckOutlined />
                    </IconButton>
                    <IconButton size="small" color="error" aria-label="Verwerfen" onClick={onDiscard} disabled={buffer.features.length === 0}>
                        <DeleteOutline />
                    </IconButton>
                    <IconButton size="small" color="error" aria-label="Verwerfen" onClick={onTurnOff}>
                        <CloseOutlined />
                    </IconButton>
                </ButtonGroup>
            )}

        </Typography>
    </>
}

export default DrawPalette