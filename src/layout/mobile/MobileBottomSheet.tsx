/**
 * I implemented the BottomSheet from scratch as the MUI Drawer component did not handle the 
 * resize well and I could only make the backdrop invisible, not remove it. Therefore one 
 * could not interact with the map when the drawer was open.
 * For this, I basically tried to implement the Bottom Sheet of Google Maps website in the
 * mobile version.
 */

import { Box, Typography } from "@mui/material"
import { ExpandLess } from "@mui/icons-material"
import { useSignal } from "@preact/signals-react"
import { PropsWithChildren } from "react"
import { Outlet } from "react-router-dom"


const MobileBottomSheet: React.FC<PropsWithChildren<{noOutlet?: boolean}>> = ({ noOutlet, children }) => {
    // use a signal to hold the sheet height
    const height = useSignal<number>(window.innerHeight / 3)

    // handle touch events
    const handleMove = (e: React.TouchEvent<HTMLDivElement>) => {
        let newHeight = window.innerHeight - e.changedTouches[0].clientY
        if (newHeight < 110) {
            newHeight= 60
        }
        height.value = newHeight
        
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
            sx={{borderRadius: '25px 25px 25px 25px'}}
        >
            { height.value !== 60 ? (
            <Box 
                component="div"
                onTouchMove={handleMove}
                width="50%"
                height="6px"
                my="8px"
                mx="auto"
                borderRadius="3px"
                sx={{backgroundColor: height.value === 60 ? null : 'grey'}}
            />
            ) : null }
            
            <Box p={1}>
                { height.value === 60 ? (
                    <Box onClick={() => height.value = 250} display="flex" justifyContent="center" alignItems="center" sx={{color: 'text.secondary'}}>
                        <ExpandLess />
                        <Typography variant="body1" component="div" >
                            Tippen um Details zu zeigen
                        </Typography>
                    </Box>
                ) 
                    :  !!noOutlet ? children : <Outlet />
                }
                
            </Box>
            
        </Box>
    </>
}

export default MobileBottomSheet