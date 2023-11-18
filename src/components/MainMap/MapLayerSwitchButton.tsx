import { Box, Fab, Popover } from "@mui/material"
import { Layers, Close } from "@mui/icons-material"
import { useSignal } from "@preact/signals-react"
import { useRef } from "react"
import MapLayerSwitchMenu from "./MapLayerSwitchMenu"

const MapLayerSwitchButton: React.FC = () => {
    // anchor ref for the popover
    const anchorRef = useRef<HTMLButtonElement>(null)

    // component signal to control the popover state
    const open = useSignal<boolean>(false)

    // control for the popover state
    const toggleLayerMenu = () => {
        open.value = !open.peek()
    }
    return <>
        <Fab ref={anchorRef} size="medium" color="default" aria-label="Show map layers" sx={{ position: 'fixed', bottom: 25, right: 10}} onClick={toggleLayerMenu}>
            { open.value ? <Close /> : <Layers /> }
        </Fab>
        <Popover 
            open={open.value}
            anchorEl={anchorRef.current}
            anchorOrigin={{vertical: 'top', horizontal: 'left'}}
            transformOrigin={{vertical: 'bottom', horizontal: 'left'}}
            onClose={() => open.value = false}
        >
            <Box minWidth={150}>
                <MapLayerSwitchMenu />  
            </Box>
        </Popover>
    </>
}

export default MapLayerSwitchButton