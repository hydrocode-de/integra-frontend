import { ButtonGroup, IconButton } from "@mui/material"
import { AddBoxOutlined, DeleteOutline, CloseOutlined, CheckOutlined } from "@mui/icons-material"

import { useAppDispatch, useAppSelector } from "../hooks"
import { DrawControlState, addLineAction, updateDrawState } from "./MainMap/treeLineFeatures/treeLinesSlice"

const DrawPalette: React.FC = () => {
    // get the current state of the DrawControl
    const drawState = useAppSelector(state => state.treeLines.draw)

    // get a state dispatcher
    const dispatch = useAppDispatch()

    // define the functions to change the edit state
    const onEdit = () => dispatch(updateDrawState(DrawControlState.LINE))
    const onSave = () => dispatch(addLineAction({distance: 40, type: 'birch'}))
    const onDiscard = () => dispatch(updateDrawState(DrawControlState.TRASH))
    const onTurnOff = () => dispatch(updateDrawState(DrawControlState.OFF))
    const onAddLine = () => dispatch(updateDrawState(DrawControlState.ADD_LINE))

    return <>
        { drawState === DrawControlState.OFF ? (
            <IconButton size="small" color="primary" aria-label="Pflanung hinzufügen" onClick={onEdit}>
                <AddBoxOutlined />
            </IconButton>
        ) : (
            <ButtonGroup>
                <IconButton size="small" color="primary" aria-label="Pflanung hinzufügen" onClick={onAddLine}>
                    <AddBoxOutlined />
                </IconButton>
                <IconButton size="small" color="success" aria-label="Pflanung speichern" onClick={onSave}>
                    <CheckOutlined />
                </IconButton>
                <IconButton size="small" color="error" aria-label="Verwerfen" onClick={onDiscard}>
                    <DeleteOutline />
                </IconButton>
                <IconButton size="small" color="error" aria-label="Verwerfen" onClick={onTurnOff}>
                    <CloseOutlined />
                </IconButton>
            </ButtonGroup>
        )}
    </>
}

export default DrawPalette