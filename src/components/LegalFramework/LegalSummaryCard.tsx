import { Check, Close, ExpandMore } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Chip } from "@mui/material"
import { useSignal } from "@preact/signals-react"
import { conformTreeLineWidth, fundingConditions, minimumDistanceArea, numberOfTreeLines, treeLineAreaShare, treesPerHectar } from "../../appState/legalSignals"

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
                        <Chip 
                            label="Direktzahlungen" 
                            color={fundingConditions.value.directPayments ? 'success' : 'error'}
                            icon={fundingConditions.value.directPayments ? <Check /> : <Close />} 
                            variant="outlined" 
                        />
                        <Chip 
                            label="Ökoregelung" 
                            color={fundingConditions.value.ecoRegulation ? 'success' : 'error'} 
                            icon={fundingConditions.value.ecoRegulation ? <Check /> : <Close />} 
                            variant="outlined" 
                        />
                    </Box>

                    <Alert severity="info">
                        Zusätzlich gelten Bestimmungen des Landes: Baden-Württemberg.<br />
                        <a href="">Informieren Sie sich hier.</a>
                    </Alert>
                    <hr />

                    <Alert sx={{mb: 1}} severity={numberOfTreeLines.value >= 2 ? 'success' : 'warning'}>
                        Baumreihen: {numberOfTreeLines.value} / mind. 2
                    </Alert>
                    
                    <Alert sx={{mb: 1}} severity={treeLineAreaShare.value <= 40 ? 'success' : 'warning'}>
                        Gesamtflächenanteil: {treeLineAreaShare.value.toFixed(0)}% / 40%
                    </Alert>
                    
                    <Alert sx={{mb: 1}} severity={treesPerHectar.value >= 50 && treesPerHectar.value <= 200 ? 'success' : 'warning'}>
                        Bestockungsdichte: {treesPerHectar.value.toFixed(0)} / ha  <br />(Ziel 50 - 200 / ha)
                    </Alert>
                    
                    <Alert sx={{mb: 1}} severity={conformTreeLineWidth.value ? 'success' : 'warning'}>
                        { conformTreeLineWidth.value ? 'Alle Baumstreifenbreiten konform' : 'Mind. eine Baureihenbreite nicht konform' }  
                        <br />(Ziel 3 - 25 m)
                    </Alert>

                    <Alert sx={{mb: 1}} severity={minimumDistanceArea.value.features.length > 0 ? 'warning' : 'success'}>
                        { minimumDistanceArea.value.features.length > 0 ? 'Mindestabstände von 20 m nicht eingehalten' : 'Mindestabstände eingehalten'}
                    </Alert>
                    
                        
                    
                    
                    
                </Box>
            </AccordionDetails>
        </Accordion>
    </>
}

export default LegalSummaryCard