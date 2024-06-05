import { Box, Button, Card, CardActionArea, Collapse, Tab, Tabs, Typography } from "@mui/material"
import { treeLocationFeatures } from "../../appState/geoJsonSignals"
import { AppView, appView } from "../../appState/appViewSignals"
import { useSignal } from "@preact/signals-react"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import BiomassResultCard from "./BiomassResultCard"
import ShadeResultCard from "./ShadeResultCard"
import BlossomResultCard from "./BlossomResultCard"
import InsectResultCard from "./InsectResultCard"

const ResultActionCard: React.FC = () => {
    // also the Resilt Action Card can be minimized
    const open = useSignal<boolean>(true)

    // finally, if there is no result, we don't render anything
    if (treeLocationFeatures.value.length === 0 && true) {  // set the && true to && false during dev to always show the card
        return <></>
    }

    // otherwise, show stuff
    return <>
        <Card sx={{
            mt: open.value ? '11px' : 0,
            mr: open.value ? '5px' : '5px',
            p: open.value ? 1 : 1
        }}>
            {open.value ? (<>
                <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Tabs value={appView.value} onChange={(_, value) => appView.value = value as AppView}>
                        <Tab label="Biomasse" value="biomass" />
                        <Tab label="Schatten" value="shade" />
                        <Tab label="Blüten" value="blossoms" disabled />
                        <Tab label="Insekten" value="insects" disabled />
                    </Tabs>
                    <Button size="small" variant="text" onClick={() => open.value = false}>
                        <ExpandLess />
                    </Button>
                </Box>
            </>) : (<>
                <CardActionArea onClick={() => open.value = true}>
                    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" m={0}>
                        <Typography variant={open.value ? "h6" : "body1"} my="auto">
                            Übersicht
                        </Typography>
                        <ExpandMore />
                    </Box>
                </CardActionArea>
            </>)}

            <Collapse in={open.value}>
                { appView.value === "biomass" ? <BiomassResultCard /> : null }
                { appView.value === "shade" ? <ShadeResultCard /> : null }
                { appView.value === "blossoms" ? <BlossomResultCard /> : null }
                { appView.value === "insects" ? <InsectResultCard /> : null}
            </Collapse>


        </Card>
    </>
}

export default ResultActionCard