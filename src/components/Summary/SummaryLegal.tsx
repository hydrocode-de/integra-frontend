import { Alert, AlertTitle, Box } from "@mui/material";
import { Bundesland, fundingConditions } from "../../appState/legalSignals";

const SummaryLegal: React.FC = () => {
    return <>
        {/* Direktzahlungen */}
        <Box mb={2}>
            { fundingConditions.value.directPayments ?(
                <Alert severity="success">
                    <AlertTitle>Sie haben evtl. Anspruch auf Direktzahlungen</AlertTitle>
                    Ihr Agroforstsystem erfüllt alle Voraussetzungen nach der GAP (§4 Abs. 2 GAPDZV) und sie haben evtl. Anspruch auf Direktzahlungen.
                </Alert>
            ) : (
                <Alert severity="warning">
                    <AlertTitle>Sie haben keinen Anspruch auf Direktzahlungen</AlertTitle>
                    Ihr Agroforstsystem erfüllt nicht alle Voraussetzungen nach der GAP (§4 Abs. 2 GAPDZV) und sie haben keinen Anspruch auf Direktzahlungen.
                </Alert>
            )}
        </Box>

        {/* Ökoregelung */}
        <Box mb={2}>
            { fundingConditions.value.ecoRegulation ?(
                <Alert severity="success">
                    <AlertTitle>Sie haben evtl. Anspruch auf Förderung nach Ökoregelung</AlertTitle>
                    Förderung nach Ökoregelung Agroforst kann beantragt werden, da alle Voraussetzungen erfüllt sind.
                </Alert>
            ) : (
                <Alert severity="warning">
                    <AlertTitle>Sie haben keinen Anspruch auf Förderung nach Ökoregelungn</AlertTitle>
                    Die Voraussetzungen für Förderung nach Ökoregelung Agroforst sind derzeit nicht erfüllt.
                </Alert>
            )}
        </Box>

        <Box mb={2}>
            <Alert severity="info">
                <AlertTitle>Zusätzliche Informationen</AlertTitle>
                Zusätzlich gelten Bestimmungen des Landes: {Bundesland.value}. <br />
                <a href={`https://google.com/search?q=Förderbedingungen Agroforst ${Bundesland.value}`}>
                    Informieren Sie sich hier.
                </a>
                <br />
                Fördervoraussetzungen können regional stark unterschiedlich sein, informieren Sie sich bei Ihrer 
                unteren Naturschutzbehörde.
            </Alert>
        </Box>
        
        <Box mb={2}>
            <Alert severity="info">
                <AlertTitle>Rechtlicher Hinweis</AlertTitle>
                Die Berechnung der Förderbedingungen erfolgt auf Basis der gesetzlichen Regelungen von Juni 2024.
                Sowohl die Seite agroforst-planungstool.de als auch die Firma hydrocode GmbH stellen diese Informationen als 
                reine Orientierungshilfe zur Verfügung.
                Die Angaben sind ohne Gewähr und ersetzen keine rechtliche Beratung. 
                Förderansprüche müssen durch die zuständigen Behörden geprüft werden, bei Nicht-Gewährung ist hydrocode GmbH nicht haftbar.
            </Alert>
        </Box>
    </>
}

export default SummaryLegal;