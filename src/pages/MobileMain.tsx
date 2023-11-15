import { Box  } from "@mui/material"

import MainMap from "../components/MainMap/MainMap"
import TreeLineSource from "../components/MainMap/TreeLineSource"
import { Outlet } from "react-router-dom";

const MobileMain: React.FC = () => {
    return <>
        <Box sx={{flexGrow: 1}}>

            <Box width="100vw" height="100vh" m="0" p="0" display="flex" flexDirection="column">


                <Box flexGrow={1}>
                    <MainMap mapId="mobile">
                        <TreeLineSource />
                    </MainMap>
                </Box>

                <Outlet />
                
            </Box>
        </Box>
    </>
}

export default MobileMain