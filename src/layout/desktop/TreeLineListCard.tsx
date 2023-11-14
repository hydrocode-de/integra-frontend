import { Box, CardContent, Typography } from "@mui/material"

import EnabledAddTreeLineButton from "../../components/TreeLines/EnableAddTreeLineButton"
import TreeLineList from "../../components/TreeLines/TreeLineList"
import TreeLineOverview from "../../components/TreeLines/TreeLineOverview"

/** 
 * We use these compontent to wrap the actual content components, 
 * to add the UI elements only needed in the Deskop version.
 */
const TreeLineListCard: React.FC = () => {
    return <>
        <CardContent>
            <Box display="flex" justifyContent="space-between" m="0">
                <span />
                <Typography variant="h5">Mein Agroforstsystem</Typography>
                <span />
            </Box>

            <Typography variant="h6" mt="2rem">Überlick</Typography>
            <TreeLineOverview />
            
            <Box display="flex" justifyContent="space-between" mt="2rem">
                <Typography variant="h6" component="div">Meine Baumreihen</Typography>
                <EnabledAddTreeLineButton />
            </Box>
            
            {/* Place the treeLine List */}
            <TreeLineList />
        </CardContent>
    </>
}

export default TreeLineListCard