import { Check, Close, ExpandMore } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Chip, Typography } from "@mui/material"
import { useSignal } from "@preact/signals-react"
import { Bundesland, conformTreeLineWidth, fundingConditions, maximumDistances, minimumDistanceArea, numberOfTreeLines, treeLineAreaShare, treesPerHectar } from "../../appState/legalSignals"
import { referenceArea } from "../../appState/referenceAreaSignals"

const LegalSummaryCard: React.FC = () => {
    // create a local signal to handle open
    const open = useSignal(false)

    // add a signal to track the current funding options shown
    const activeOption = useSignal<'direct' | 'eco'>('direct')

    // only show the card if there is a field selected
    if (referenceArea.value.features.length === 0) return null

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
                            variant={activeOption.value === 'direct' ? 'filled' : 'outlined'}
                            sx={{cursor: 'pointer'}}
                            onClick={() => activeOption.value = 'direct'}
                        />
                        <Chip 
                            label="Ökoregelung" 
                            color={fundingConditions.value.ecoRegulation ? 'success' : 'error'} 
                            icon={fundingConditions.value.ecoRegulation ? <Check /> : <Close />} 
                            variant={activeOption.value === 'eco' ? 'filled' : 'outlined'}
                            sx={{cursor: 'pointer'}}
                            onClick={() => activeOption.value = 'eco'}
                        />
                    </Box>

                    {Bundesland.value !== '' ? (
                        <Alert severity="info">
                        Zusätzlich gelten Bestimmungen des Landes: {Bundesland.value}.<br />
                        <a href={`https://google.com/search?q=Förderbedingungen Agroforst ${Bundesland.value}`}>
                            Informieren Sie sich hier.
                        </a>
                    </Alert>
                    ) : (
                        <Alert severity="error">
                            Das gewählte Feld scheint nicht eindeutig einem Bundesland zugeordnet werden zu können.
                        </Alert>
                    )}
                    
                    <hr />

                    { activeOption.value === 'direct' ? <>
                        <Alert sx={{mb: 1}} severity={numberOfTreeLines.value >= 2 ? 'success' : 'warning'}>
                            Baumreihen: {numberOfTreeLines.value} / mind. 2
                        </Alert>
                        
                        <Alert sx={{mb: 1}} severity={treeLineAreaShare.value <= 40 ? 'success' : 'warning'}>
                            Gesamtflächenanteil: {treeLineAreaShare.value.toFixed(0)}% / 40%
                        </Alert>
                        <Typography variant="subtitle2">ODER</Typography>
                        
                        
                        <Alert sx={{mb: 1}} severity={treesPerHectar.value >= 50 && treesPerHectar.value <= 200 ? 'success' : 'warning'}>
                            Bestockungsdichte: {treesPerHectar.value.toFixed(0)} / ha  <br />(Ziel 50 - 200 / ha)
                        </Alert>
                    </> : null }

                    { activeOption.value === 'eco' ? <>
                        <Alert sx={{mb: 1}} severity={numberOfTreeLines.value >= 2 ? 'success' : 'warning'}>
                            Baumreihen: {numberOfTreeLines.value} / mind. 2
                        </Alert>

                        <Alert sx={{mb: 1}} severity={treeLineAreaShare.value >= 2 && treeLineAreaShare.value <= 35 ? 'success' : 'warning'}>
                            Gesamtflächenanteil: {treeLineAreaShare.value.toFixed(0)}% <br />(Ziel 2 - 35%)
                        </Alert>

                        <Alert sx={{mb: 1}} severity={conformTreeLineWidth.value ? 'success' : 'warning'}>
                            { conformTreeLineWidth.value ? 'Alle Baumstreifenbreiten konform' : 'Mind. eine Baureihenbreite nicht konform' }  
                            <br />(Ziel 3 - 25 m)
                        </Alert>

                        <Alert sx={{mb: 1}} severity={minimumDistanceArea.value.features.length > 0 ? 'warning' : 'success'}>
                            { minimumDistanceArea.value.features.length > 0 ? 'Mindestabstände von 20 m nicht eingehalten' : 'Mindestabstände eingehalten'}
                        </Alert>
                        
                        <Alert sx={{mb: 1}} severity={maximumDistances.value.features.length > 0 ? 'warning' : 'success'}>
                            { maximumDistances.value.features.length > 0 ? 'Maximalabstände von 100 m überschritten' : 'Maximalabstände eingehalten'}
                        </Alert>
                    </> : null}
                    
                </Box>
            </AccordionDetails>
        </Accordion>
    </>
}

export default LegalSummaryCard