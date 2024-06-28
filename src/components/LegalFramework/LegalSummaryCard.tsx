import { Check, Close, ExpandMore } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Card, CardContent, Chip, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { useSignal } from "@preact/signals-react"

const LegalSummaryCard: React.FC = () => {
    // create a local signal to handle open
    const open = useSignal(true)
    return <>
        <Accordion
            expanded={open.value}
            onChange={() => open.value = !open.peek()}
            disableGutters
        >
            <AccordionSummary expandIcon={<ExpandMore />}>
                Förderungsbedingungen
            </AccordionSummary>

            <AccordionDetails>
                <Box>
                    <Box mb={2} display="flex" justifyContent="space-between">
                        <Chip label="Direktzahlungen" color="success" icon={<Check />} variant="outlined" />
                        <Chip label="Ökoregelung" color="error" icon={<Close />} variant="outlined" />
                    </Box>

                    <Alert severity="info">
                        Zusätzlich gelten Bestimmungen des Landes: Baden-Württemberg.<br />
                        <a href="">Informieren Sie sich hier.</a>
                    </Alert>
                    <hr />

                    {/* <List>
                        <ListItem>
                            <ListItemIcon color="success"><Check color="success" /></ListItemIcon>
                            <ListItemText color="success">
                                Anzahl an Baumreihen
                            </ListItemText>
                        </ListItem>
                    </List>    
                    <Box mb={0.6} display="flex" justifyContent="space-between">
                        <Close color="error" />
                        <Typography color="error" variant="body1">Gesamtflächenanteil &lt; 40%</Typography>
                    </Box> */}
                    <Alert sx={{mb: 1}} severity="warning">
                        Baumreihen: 0 / 2
                    </Alert>
                    
                    <Alert sx={{mb: 1}} severity="success">
                        Gesamtflächenanteil: 21% / 40%
                    </Alert>
                    
                    <Alert sx={{mb: 1}} severity="warning">
                        Bestockungsdichte: 0.8 / ha  <br />(Ziel 50 - 200 / ha)
                    </Alert>
                    
                    <Alert sx={{mb: 1}} severity="success">
                        Baumstreifenbreite: 3.27 m  <br />(Ziel 3 - 25 m)
                    </Alert>

                    <Alert sx={{mb: 1}} severity="warning">
                        Abstand zum Rand: 130 m <br />(Ziel 20 - 100 m)
                    </Alert>
                    
                        
                    
                    
                    
                </Box>
            </AccordionDetails>
        </Accordion>
    </>
}

export default LegalSummaryCard