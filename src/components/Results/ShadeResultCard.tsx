import { Alert, Box } from "@mui/material"

const ShadeResultCard: React.FC = () => {
    return <>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <img src="empty_state/empty-state-illustration.png" alt="empty state" />
            <Alert severity="warning">
                Diese Funktion ist noch in Entwicklung.
            </Alert>
        </Box>
    </>
}

export default ShadeResultCard