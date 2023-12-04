import { Box, Card, useTheme } from "@mui/material"
import { PropsWithChildren } from "react"
import { Outlet } from "react-router-dom"

const DesktopContentCard: React.FC<PropsWithChildren<{noOutlet?: boolean}>> = ({noOutlet, children}) => {
    const theme = useTheme()

    return <>
        <Box position="fixed" top="96px" left="24px" zIndex={99} maxWidth="384px" width="25vw" minWidth="256px">
            <Card sx={{backgroundColor: theme.palette.background.paper, p:1, borderRadius:4, border:0}}>
                { !!noOutlet ? children : <Outlet /> }
            </Card>
        </Box>
    </>
}

export default DesktopContentCard