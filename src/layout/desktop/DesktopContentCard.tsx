import { Box, Card, useTheme } from "@mui/material"
import { PropsWithChildren } from "react"
import { Outlet } from "react-router-dom"

const DesktopContentCard: React.FC<PropsWithChildren<{noOutlet?: boolean}>> = ({noOutlet, children}) => {
    const theme = useTheme()

    return <>
        <Box component="div" position="fixed" top="70px" left="10px" zIndex={99} maxWidth="600px" width="25vw" minWidth="350px">
            <Card sx={{backgroundColor: theme.palette.background.paper}}>
                { !!noOutlet ? children : <Outlet /> }
            </Card>
        </Box>
    </>
}

export default DesktopContentCard