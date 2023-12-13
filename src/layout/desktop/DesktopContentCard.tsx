import { Box, Card, useTheme } from "@mui/material"
import { PropsWithChildren } from "react"
import { Outlet } from "react-router-dom"

const DesktopContentCard: React.FC<PropsWithChildren<{noOutlet?: boolean}>> = ({noOutlet, children}) => {
    const theme = useTheme()

    return <>
        <Box position="fixed" top="80px" left="16px" zIndex={99} maxWidth="368px" width="25vw" minWidth="329px">
            <Card sx={{backgroundColor: theme.palette.background.paper, p:1, pt:2, borderRadius:2, border:0}}>
                { !!noOutlet ? children : <Outlet /> }
            </Card>
        </Box>
    </>
}

// top = 64px (AppBar) + 16px (margin) = 80px

export default DesktopContentCard