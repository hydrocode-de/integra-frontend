/**
 * I implemented the BottomSheet from scratch as the MUI Drawer component did not handle the 
 * resize well and I could only make the backdrop invisible, not remove it. Therefore one 
 * could not interact with the map when the drawer was open.
 * For this, I basically tried to implement the Bottom Sheet of Google Maps website in the
 * mobile version.
 */

import { Box } from "@mui/material"
import { useSignal } from "@preact/signals-react"
import { PropsWithChildren } from "react"
import { Outlet } from "react-router-dom"


const MobileBottomSheet: React.FC<PropsWithChildren<{noOutlet?: boolean}>> = ({ noOutlet, children }) => {
    // use a signal to hold the sheet height
    const height = useSignal<number>(window.innerHeight / 3)

    // handle touch events
    const handleMove = (e: React.TouchEvent<HTMLDivElement>) => {
        //console.log(e.changedTouches[0])
        height.value = (window.innerHeight - e.changedTouches[0].clientY)
        
        // throw a window resize event to force the map to resize
        window.dispatchEvent(new Event('resize'));
    }

    return <>
        <Box
            component="div" 
            display="flex"
            width="100vw"
            height={height.value}
            flexDirection="column"
            onTouchMove={handleMove}
            sx={{borderRadius: '10px 10px 0 0'}}
        >
            <Box 
                component="div"
                onTouchMove={handleMove}
                width="50%"
                height="6px"
                my="8px"
                mx="auto"
                borderRadius="3px"
                sx={{backgroundColor: 'grey'}}
            >
                <Box p={1}>
                    { !!noOutlet ? children : <Outlet /> }
                </Box>
            </Box>
        </Box>
    </>
}

export default MobileBottomSheet