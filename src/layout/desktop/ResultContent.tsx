import { Box } from "@mui/material"

const ResultContent: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <>
        <Box position="fixed" top="72px" right="0px" zIndex={99} maxWidth="368px" width="25vw" minWidth="329px">
        { children }
        </Box>
    </>
}

export default ResultContent