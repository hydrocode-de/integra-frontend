import { Box, Button, Card, CardActionArea, Tab, Tabs, Typography } from "@mui/material"
import { treeLocationFeatures } from "../../appState/geoJsonSignals"
import { AppView, appView } from "../../appState/appViewSignals"
import { useSignal } from "@preact/signals-react"
import { ExpandLess, ExpandMore } from "@mui/icons-material"

const ResultActionCard: React.FC = () => {
    // also the Resilt Action Card can be minimized
    const open = useSignal<boolean>(true)

    // finally, if there is no result, we don't render anything
    if (treeLocationFeatures.value.length === 0 && false) {
        return <></>
    }

    // otherwise, show stuff
    return <>
        <Card sx={{
            mt: open.value ? '16px' : 0,
            mr: open.value ? '16px' : 0,
            p: open.value ? 1 : 1
        }}>
            {open.value ? (<>
                <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Tabs value={appView.value} onChange={(_, value) => appView.value = value as AppView}>
                        <Tab label="Biomasse" value="biomass" />
                        <Tab label="Schatten" value="shade" />
                        <Tab label="Blüten" value="blossoms" />
                        <Tab label="Insekten" value="insects" />
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


        </Card>
    </>
}

export default ResultActionCard