import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material"
import { useEffect, useState } from "react"
import { changeStaticData, summaryData } from "../../appState/summarySignals"

const USAGES = ['Kurzumtrieb', 'Wertholz', 'Streuobst', 'Futterlaub', 'Bienenweide']

const ForestrySelect: React.FC = () => {
    const [selectedUse, setSelectedUse] = useState<string[]>(summaryData.value?.forestryUse || [])
    
    // handle the change when a checkbox was clicked
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.checked) {
            setSelectedUse([...selectedUse, USAGES[index]])
        } else {
            setSelectedUse(selectedUse.filter(u => u !== USAGES[index]))
        }
    }

    // update the summaryData when the selectedUse changes
    useEffect(() => {
        changeStaticData('forestryUse', selectedUse)
    }, [selectedUse])

    return <>
        <FormGroup>
            {USAGES.map((usage, index) => (
                <FormControlLabel 
                    key={index}
                    control={<Checkbox 
                            checked={selectedUse.includes(USAGES[index])} 
                            onChange={e => handleChange(e, index)}
                        />
                    }
                    label={usage}
                />
            ))}
            
        </FormGroup>
    </>
}

export default ForestrySelect