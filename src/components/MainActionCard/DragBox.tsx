import { Box } from "@mui/material"

interface DragBoxProps {
    selected?: boolean,
    onClick?: () => void
}

const DragBox: React.FC<React.PropsWithChildren<DragBoxProps>> = ({ selected, onClick, children}) => (
    <Box
        onClick={onClick}
        marginRight="5px"
        borderRadius="4px"
        border={`5px solid ${selected ? 'white' : 'rgba(128,128,128,0.1)'}`}
        sx={{
            padding: '2px', 
            backgroundColor: selected ? 'white' : 'rgba(128,128,128,0.3)', 
            maxWidth: '60px',
            maxHeight: '60px', 
            minWidth: '60px', 
            minHeight: '60px',
            boxShadow: selected ? '0 2px 4px rgba(128,128,128,0.5)' : '0 2px 4px rgba(128,128,128,0.4)'
        }}
        display="flex" 
        alignItems="center" 
        justifyContent="center"
    >
        { children }
    </Box>
)

export default DragBox