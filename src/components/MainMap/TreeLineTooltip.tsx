import { Box, Card, CardContent } from "@mui/material"
import { useSignal } from "@preact/signals-react"
import { useEffect } from "react"
import { MapLayerMouseEvent, useMap } from "react-map-gl"

const TreeLineTooltip: React.FC = () => {
    // create a signal for the tooltip location
    const location = useSignal<[number, number] | null>(null)
    // use the map
    const map = useMap()

    // subscribe to the map 
    useEffect(() => {
        const onMouseMove = (e: MapLayerMouseEvent) => {
            if (e.features!.length > 0) {
                // const f = e.features![0]
                location.value = [e.point.x, e.point.y]
                
            }
        }
        const onMouseLeave = (e: MapLayerMouseEvent) => {
            location.value = null
        }

        if (map.current) {
            map.current.on('mousemove', 'tree-locations', onMouseMove)
            map.current.on('mouseleave', 'tree-locations', onMouseLeave)

            return () => {
                map.current!.off('mousemove', 'tree-locations', onMouseMove)
                map.current!.off('mouseleave', 'tree-locations', onMouseLeave)
            }
        }
    }, [map.current])

    return <>
        {location.value ? (
            <Box position="fixed" top={location.value[1] + 70 + 10} left={location.value[0]} m={0} p={0}>
            <Card>
                <Box sx={{p: 1}}>                
                    <i>no content</i>
                </Box>
            </Card>
        </Box>
        ) : null}
        
    </>
}

export default TreeLineTooltip