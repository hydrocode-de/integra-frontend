import { Alert, Box, Grid, Typography } from "@mui/material"

const Glossary: React.FC = () => {
    return <>
        <Box height="100%" p={2}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h4">
                        Glossar
                    </Typography>
                    <Alert severity="info">
                        Der Glossar ist noch in Arbeit. Hier werden bald wichtige Begriffe erklärt.
                    </Alert>
                </Grid>
            </Grid>
        </Box>
    </>
}

export default Glossary