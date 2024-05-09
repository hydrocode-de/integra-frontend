import { Box } from "@mui/material"

const SideContent: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <>
        <Box position="fixed" top="72px" left="0px" zIndex={99} maxWidth="368px" width="25vw" minWidth="329px">
        { children }
        </Box>
    </>
}

export default SideContent