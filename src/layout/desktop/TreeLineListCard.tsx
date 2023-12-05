import { Box, CardContent, Typography } from "@mui/material";

import EnabledAddTreeLineButton from "../../components/TreeLines/EnableAddTreeLineButton";
import TreeLineList from "../../components/TreeLines/TreeLineList";
import TreeLineOverview from "../../components/TreeLines/TreeLineOverview";

/**
 * We use these compontent to wrap the actual content components,
 * to add the UI elements only needed in the Deskop version.
 */
const TreeLineListCard: React.FC = () => {
  return (
    <>
      <CardContent>
        {/* <Box display="flex" justifyContent="space-between" m="0"> */}
        {/* <span /> */}
        <Typography mt={2} align="left" variant="h5">
          Mein Agroforstsystem
        </Typography>
        {/* <span /> */}
        {/* </Box> */}

        <TreeLineOverview />

        <Box display="flex" justifyContent="space-between" mt={4} mb={1}>
          <Typography variant="h6" component="div">
            Baumreihen
          </Typography>
          <EnabledAddTreeLineButton />
        </Box>

        {/* Place the treeLine List */}
        <TreeLineList />
      </CardContent>
    </>
  );
};

export default TreeLineListCard;
