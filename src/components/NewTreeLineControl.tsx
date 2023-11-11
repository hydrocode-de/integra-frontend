import { Box, CircularProgress, Fab, IconButton, Slide, Typography } from "@mui/material"
import { ArrowBack, Close, Check } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import length from "@turf/length"

import { useDrawBuffer, useDrawState } from "./MainMap/treeLineFeatures/treeLinesHooks"
import { DrawControlState, addLineAction, updateDrawBuffer, updateDrawState } from "./MainMap/treeLineFeatures/treeLinesSlice"
import { useAppDispatch } from "../hooks"
import { useEffect, useState } from "react"

const NewTreeLineControl: React.FC = () => {
    // get a dispatcher
    const dispatch = useAppDispatch()

    // use the current state of the Draw control to return the correct component UI
    const drawState = useDrawState()

    // subscribe to the draw buffer to show the user some basic statistics about the new tree line
    const buffer = useDrawBuffer()

    // get a navigator to navigate after the edit action is finished
    const navigate = useNavigate()

    // define a state to show the statistics
    const [len, setLen] = useState<number>(0)
    const [maxLen, setMaxLen] = useState<number>(100)

    // handler to abort the editing
    const onAbort = () => {
        // empty the buffer
        dispatch(updateDrawBuffer({type: "FeatureCollection", features: []}))

        // disable the draw control
        dispatch(updateDrawState(DrawControlState.OFF))

        // navigate back to the main page
        navigate('/')
    }

    // handler to add a new tree line
    const onAdd = () => {
        dispatch(addLineAction())

        // navigate to the main page
        navigate('/')
    }

    // side-effect to update the current length and update the maximum length
    useEffect(() => {
        // get the length
        const bufferLen = length(buffer, {units: 'meters'})

        // update the maximum length of the circular progress
        if (bufferLen > 90 && bufferLen < 240) {
            setMaxLen(250)
        } else if (bufferLen > 240 && bufferLen < 490) {
            setMaxLen(500)
        } else if (bufferLen > 490 && bufferLen < 990) {
            setMaxLen(1000)
        } else if (bufferLen > 990) {
            setMaxLen(10000)
        }

        // update the length
        setLen(bufferLen)
    }, [buffer])


    // render the correct version of the control
    return <>
        {/* <Slide in={drawState === DrawControlState.LINE || drawState === DrawControlState.EDIT_LINE} direction="right" unmountOnExit> */}
            <Box>
                <Box sx={{flexGrow: 1}} display="flex" justifyContent="space-between">
                    <IconButton size="small" edge="start" color="inherit" aria-label="zurück" sx={{mr: 2}} onClick={onAbort}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        Neue Baumreihe
                    </Typography>
                    <span />
                    {/* <IconButton size="small" edge="end" color="inherit" aria-label="zurück" sx={{mr: 2}} onClick={onAbort}>
                        <Close />
                    </IconButton> */}
                </Box>
                <Box sx={{flexGrow: 1}} display="flex" justifyContent="space-around">
                    <span />
                    <Box position="relative" display="inline-flex">
                        <CircularProgress variant="determinate" value={Math.min((len / maxLen) * 100, 100)} />
                        <Box top="0" left="0" right="0" bottom="0" position="absolute" display="flex" alignItems="center" justifyContent="center">
                            <Typography variant="caption" component="div" color="text.secondary">
                                {len > 1000 ? `${(len / 1000).toFixed(1)}km` : `${len.toFixed(0)}m`}
                            </Typography>
                        </Box>
                    </Box>

                    <Fab size="small" color="success" aria-label="add" disabled={buffer.features.length === 0} onClick={onAdd}>
                        <Check />
                    </Fab>
                    <span />
                </Box>
            </Box>
        {/* </Slide> */}
    </>
}

export default NewTreeLineControl