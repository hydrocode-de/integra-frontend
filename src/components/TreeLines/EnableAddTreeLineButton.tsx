import { useNavigate } from "react-router-dom"
import { Add } from "@mui/icons-material"

import { zoom } from "../MainMap/mapFeatures/mapSignals"
import { useAppDispatch } from "../../hooks"
import { DrawControlState, updateDrawState } from "../MainMap/treeLineFeatures/treeLinesSlice"
import { Button } from "@mui/material"

const EnabledAddTreeLineButton: React.FC = () => {
    // get a state dispatcher to enable the draw tool
    const dispatch = useAppDispatch()

    // get a navigator
    const navigate = useNavigate()

    // add handler
    const onAdd = () => {
        // change the state of the draw tool
        dispatch(updateDrawState(DrawControlState.LINE))

        // navigate to the draw page
        navigate('/new')
    }
    
    return <>
        <Button size="small" variant="contained" onClick={onAdd} startIcon={<Add />} disabled={zoom.value < 13}>Neu</Button>
    </>
}

export default EnabledAddTreeLineButton