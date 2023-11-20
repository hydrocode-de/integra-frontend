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
import { PropsWithChildren, useEffect } from "react"
import { Outlet } from "react-router-dom"


const MobileBottomSheet: React.FC<PropsWithChildren<{noOutlet?: boolean}>> = ({ noOutlet, children }) => {
    // use a signal to hold the sheet height
    const height = useSignal<number>(window.innerHeight / 3)

    // make compatible with mouse
    const isDown = useSignal<boolean>(false)

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

    const onMouseDown = () => {
        if (!isDown.value) {
            isDown.value = true
        }
    }
    const onMouseUp = () => isDown.value = false
    const onMouseMove = (e: any) => {
        if (!isDown.peek()) return
        let newHeight = window.innerHeight - e.clientY
        if (newHeight < 110) {
            newHeight = 60
            isDown.value = false
        }
        height.value = newHeight

        // throw a window resize event to force the map to resize
        window.dispatchEvent(new Event('resize'));
    }

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove)
        return () => window.removeEventListener('mousemove', onMouseMove)
    }, [])

    return <>
        <Box component="div" height={height.value}>
            <Box
                component="div" 
                display="flex"
                width="100vw"
                height="20px"
                flexDirection="column"
                onTouchMove={handleMove}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                //onMouseMove={onMouseMove}
                
                sx={{touchAction: 'none', cursor: isDown.value ? 'grabbing' : 'grab'}}
            >
                { height.value !== 60 ? (
                <Box 
                    component="div"
                    onTouchMove={handleMove}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    width="50%"
                    height="6px"
                    my="8px"
                    mx="auto"
                    borderRadius="3px"
                    sx={{backgroundColor: height.value === 60 ? null : 'grey', touchAction: 'none', cursor: isDown.value ? 'grabbing' : 'grab'}}
                />
                ) : null }
            </Box>
            <Box p={1}>
                { height.value === 60 ? (
                    <Box onClick={() => height.value = 250} display="flex" justifyContent="center" alignItems="center" sx={{color: 'text.secondary'}}>
                        <ExpandLess />
                        <Typography variant="body1" component="div" sx={{cursor: 'pointer'}}>
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
