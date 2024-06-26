import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material"
import { useSignal, useSignalEffect } from "@preact/signals-react"
import { MapLayerMouseEvent, useMap } from "react-map-gl"
import { TreeLocation } from "../../appState/tree.model"
import { germanSpecies } from "../../appState/backendSignals"
import { AppView, appView } from "../../appState/appViewSignals"

const abbreviateNumber = (value: number) => {
    if (value < 1e3) return value.toString()
    if (value < 1e6) return (value / 1e3).toFixed(1) + 'k'
    if (value < 1e9) return (value / 1e6).toFixed(1) + 'M'
}
const renderContent = (tree: TreeLocation["features"][0], viewState: AppView) => {
    if (viewState === "biomass" || viewState === "shade") return <>
        <Box display="flex" width="100%" flexDirection="row" justifyContent="space-between">
            <strong>Alter</strong>
            <Typography variant="body2">{tree.properties.age}</Typography>
        </Box>
        <Box display="flex" width="100%" flexDirection="row" justifyContent="space-between">
            <strong>Höhe</strong>
            <Typography variant="body2">{tree.properties.height?.toFixed(1)}m</Typography>
        </Box>
    </>
    else if (viewState === "blossoms" || viewState === "insects") return <>
        <Box display="flex" width="100%" flexDirection="row" justifyContent="space-between">
            <strong>Alter</strong>
            <Typography variant="body2">{tree.properties.age}</Typography>
        </Box>
        <Box display="flex" width="100%" flexDirection="row" justifyContent="space-between">
            <strong>Blütenanzahl</strong>
            <Typography variant="body2">{abbreviateNumber(tree.properties.blossoms!)}</Typography>
        </Box>
    </>
}

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
                        <CardHeader p={0} 
                            title={germanSpecies.peek()[f.properties.treeType]} 
                            subheader={f.properties.treeType}  
                        />
                        <CardContent>
                            { renderContent(f, appView.value) }
                        </CardContent>
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
            map.current.on('mousemove', 'canopy-layer', onMouseMove)
            map.current.on('mouseleave', 'canopy-layer', onMouseLeave)

            return () => {
                map.current!.off('mousemove', 'tree-locations', onMouseMove)
                map.current!.off('mouseleave', 'tree-locations', onMouseLeave)
                map.current!.off('mousemove', 'canopy-layer', onMouseMove)
                map.current!.off('mouseleave', 'canopy-layer', onMouseLeave)
            }
        }
    })

    return <>
        {location.value ? (
            <Box position="fixed" top={location.value[1] + 70 + 10} left={location.value[0]} m={0} p={0} zIndex={999}>
            <Card>            
                { content.value }
            </Card>
        </Box>
        ) : null}
        
    </>
}

export default TreeLineTooltip