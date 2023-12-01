import { Box, Card, CardHeader, Typography } from "@mui/material"
import { useSignal, useSignalEffect } from "@preact/signals-react"
import { MapLayerMouseEvent, useMap } from "react-map-gl"
import { TreeLocation } from "../../appState/treeLine.model"

const TreeLineTooltip: React.FC = () => {
    // create a signal for the tooltip location
    const location = useSignal<[number, number] | null>(null)
    const content = useSignal<any>(<Typography p={1} variant="caption">no content</Typography>)

    // use the map
    const map = useMap()

    // subscribe to the map 
    useSignalEffect(() => {
        const onMouseMove = (e: MapLayerMouseEvent) => {
            if (e.features!.length > 0) {
                // set the tooltip location in screen coordinates relative to the map element ;)
                location.value = [e.point.x, e.point.y]

                // get the feature info - use the treeType for now
                const f = e.features![0] as unknown as TreeLocation["features"][0]
                if (f) {
                    content.value = (<>
                        <CardHeader p={0} title={f.properties.treeType} subheader={`Age: ${f.properties.age} - Height: ${f.properties.height}`}  />
                    </>)
                }
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
    })

    return <>
        {location.value ? (
            <Box component="div" position="fixed" top={location.value[1] + 70 + 10} left={location.value[0]} m={0} p={0} zIndex={999}>
            <Card>            
                { content.value }
            </Card>
        </Box>
        ) : null}
        
    </>
}

export default TreeLineTooltip