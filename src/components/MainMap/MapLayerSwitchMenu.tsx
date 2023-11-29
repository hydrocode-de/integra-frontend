import { MenuItem, MenuList, Switch, SxProps, Typography } from "@mui/material"
import { layerVisibility } from "../../appState/mapSignals"

const MapLayerSwitchMenu: React.FC = () => {
    // function to toggle a layer in the global visibility state
    const toggleLayer = (layerName: string) => {
        // check the current state of the layer
        const visible = layerVisibility.peek()[layerName] === "visible" || false
        layerVisibility.value = {...layerVisibility.value, [layerName]: visible ? "none" : "visible"}
    }

    // create a SX object
    const sx: SxProps = {
        display: 'flex',
        justifyContent: 'space-between',
    }

    return <>
        <MenuList sx={{width: '100%'}}>
            <MenuItem sx={sx} disabled={!layerVisibility.value.referenceArea} onClick={() => toggleLayer('referenceArea')}>
                <Typography>Referenzfläche einblenden</Typography>
                <Switch checked={layerVisibility.value.referenceArea === "visible"} />
            </MenuItem>
            <MenuItem sx={sx} disabled={!layerVisibility.value.canopyLayer} onClick={() => toggleLayer('canopyLayer')}>
                <Typography>Kronenfläche berechnen</Typography>
                <Switch checked={layerVisibility.value.canopyLayer === "visible"} />
            </MenuItem>
        </MenuList>
    </>
}

export default MapLayerSwitchMenu