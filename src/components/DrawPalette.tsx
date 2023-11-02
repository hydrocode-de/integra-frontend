import { Box, ButtonGroup, Card, CardContent, Checkbox, Collapse, FormControl, FormControlLabel, IconButton, Input, InputLabel, MenuItem, Select, Slider, Typography } from "@mui/material"
import { AddBoxOutlined, DeleteOutline, CloseOutlined, CheckOutlined, Park } from "@mui/icons-material"

import { useAppDispatch, useAppSelector } from "../hooks"
import { DrawControlState, addLineAction, updateDrawState } from "./MainMap/treeLineFeatures/treeLinesSlice"
import { useZoom } from "./MainMap/mapFeatures/mapHooks"
import { useDrawBuffer } from "./MainMap/treeLineFeatures/treeLinesHooks"
import { useState } from "react"

const DrawPalette: React.FC = () => {
    // get the current state of the DrawControl
    const drawState = useAppSelector(state => state.treeLines.draw)

    // define component state for adjusting the way how the line is drawn
    const [treeSpacing, setTreeSpacing] = useState<number>(40)
    const [treeType, setTreeType] = useState<string>('birch')
    const [centerTreeLine, setCenterTreeLine] = useState<boolean>(false)
    
    // get a state dispatcher
    const dispatch = useAppDispatch()

    // subscribe to the zoom level of the map
    const zoom = useZoom()

    // subscribe to the current buffer state
    const buffer = useDrawBuffer()

    // define the functions to change the edit state
    const onEdit = () => dispatch(updateDrawState(DrawControlState.LINE))
    const onSave = () => dispatch(addLineAction({spacing: treeSpacing, type: treeType, centerOnLine: centerTreeLine}))
    const onDiscard = () => dispatch(updateDrawState(DrawControlState.TRASH))
    const onTurnOff = () => dispatch(updateDrawState(DrawControlState.OFF))
    const onAddLine = () => dispatch(updateDrawState(DrawControlState.ADD_LINE))

    return <>
        <Typography variant="h6" component="div" sx={{flexGrow: 1}} display="flex" justifyContent="space-between">
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

        {/* Add a control box to select the tree type, age and distance along the line */}
        <Collapse in={drawState !== DrawControlState.OFF} timeout="auto" unmountOnExit>
            <Card>
                <CardContent>
                    <Typography id="distance-slider" gutterBottom>Pflanzabstand</Typography>
                    <Box display="flex">
                        <Park sx={{mr: 2}} />
                        <Slider min={0} max={150} value={treeSpacing} onChange={(_, value) => setTreeSpacing(value as number)} />
                        <Input sx={{ml: 2, minWidth: '45px'}} size="small" type="number" inputProps={{min: 0, max: 150, step: 10}} value={treeSpacing} onChange={e => setTreeSpacing(Number(e.target.value))} /> 
                    </Box>

                    <FormControlLabel control={<Checkbox checked={centerTreeLine} onChange={e => setCenterTreeLine(e.target.checked)} />} label="Pflanzreihe zentrieren" />

                    <FormControl fullWidth sx={{mt: 3}}>
                        <InputLabel id="tree-type">Baumart</InputLabel>
                        <Select labelId="tree-type" value={treeType} onChange={e => setTreeType(e.target.value)}>
                            <MenuItem value="birch">Birke</MenuItem>
                            <MenuItem value="oak">Eiche</MenuItem>
                            <MenuItem value="maple">Ahorn</MenuItem>
                            <MenuItem value="beech">Buche</MenuItem>
                            <MenuItem value="pine">Kiefer</MenuItem>
                        </Select>
                    </FormControl>
                    
                    
                </CardContent>
            </Card>
        </Collapse>
    </>
}

export default DrawPalette