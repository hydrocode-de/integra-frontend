import { Box } from "@mui/material"

const SideContent: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <>
        <Box position="fixed" top="80px" left="16px" zIndex={99} maxWidth="368px" width="25vw" minWidth="329px">
        { children }
        </Box>
    </>
}

export default SideContent