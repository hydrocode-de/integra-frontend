import { Box, Card, useTheme } from "@mui/material"
import { Outlet } from "react-router-dom"

const DesktopContentCard: React.FC = () => {
    const theme = useTheme()

    return <>
        <Box position="fixed" top="70px" left="10px" zIndex={99} maxWidth="600px" width="25vw" minWidth="350px">
            <Card sx={{backgroundColor: theme.palette.background.paper}}>
                <Outlet />
            </Card>
        </Box>
    </>
}

export default DesktopContentCard