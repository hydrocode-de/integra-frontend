import { AppBar, Box, Toolbar, Typography  } from "@mui/material"

import MainMap from "../components/MainMap/MainMap"
import TreeLineSource from "../components/MainMap/TreeLineSource"
import { Outlet } from "react-router-dom";
import { drawState } from "../appState/treeLineSignals";
import { DrawState } from "../appState/treeLine.model";
import MobileBottomSheet from "../layout/mobile/MobileBottomSheet";
import NewTreeLineControl from "../components/NewTreeLineControl";
import DrawControl from "../components/MainMap/DrawControl";
import ReferenceAreaSource from "../components/MainMap/ReferenceAreaSource";

const MobileMain: React.FC = () => {
    return <>
        <Box height="100vh" overflow="hidden">

            <Box width="100vw" height="calc(100vh - 60px)" m="0" mt="60px" p="0" display="flex" flexDirection="column">


                <Box flexGrow={1}>
                    <MainMap mapId="mobile">
                        <DrawControl />
                        <TreeLineSource />
                        <ReferenceAreaSource />
                    </MainMap>
                </Box>

                {/* 
                  * Navigation children at this level are only placed if the drawing mode is OFF. 
                  */}
                { drawState.value !== DrawState.OFF ? (<>
                    <AppBar position="fixed" sx={{position: 'fixed', top: 0}}>
                        <Toolbar color="default">
                            <Typography variant="h6">Neue Baumreihe</Typography>
                        </Toolbar>
                    </AppBar>
                    <MobileBottomSheet noOutlet>
                        <NewTreeLineControl />
                    </MobileBottomSheet>
                </>) : <Outlet /> }
                
                
            </Box>
        </Box>
    </>
}

export default MobileMain