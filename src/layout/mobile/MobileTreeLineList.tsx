import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import EnabledAddTreeLineButton from "../../components/TreeLines/EnableAddTreeLineButton"
import TreeLineList from "../../components/TreeLines/TreeLineList"

const MobileTreeLineList: React.FC = () => {
    return <>
        {/* Add a app bar to a fixed location */}
        <AppBar position="fixed" sx={{position: 'fixed', top: 0}}>
            <Toolbar color="default">
                <Typography variant="h6">Mein Agroforstsystem</Typography>
            </Toolbar>
        </AppBar>
        <Box>
            <EnabledAddTreeLineButton />
            <TreeLineList />
        </Box>
    </>
}

export default MobileTreeLineList