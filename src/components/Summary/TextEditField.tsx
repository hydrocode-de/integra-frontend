import { Button, FormControl, Input, InputAdornment, Typography, TypographyProps } from "@mui/material"
import { useState } from "react"

// use the Typography props
interface TextEditFieldProps extends Omit<TypographyProps, 'onChange'> {
    value: string,
    onChange?: (value: string) => void,
    placehoder?: string,
}

const TextEditField: React.FC<TextEditFieldProps> = ({onChange, value, placehoder, pb, style, ...props}) => {
    // track the changed value
    const [val, setVal] = useState<string>(value)
    const [edit, setEdit] = useState<boolean>(false)
    
    const onEditFinish = () => {
        setEdit(false)
        if (onChange) onChange(val)
    }

    return <>
    { edit ? (
        <FormControl>
            <Input 
                value={val}
                placeholder={placehoder || 'nicht gewählt'}
                onChange={e => setVal(e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <Button onClick={onEditFinish}>OK</Button>
                    </InputAdornment>
                }
            />
        </FormControl>
    ) : (
        <Typography 
            pb={pb || 1} 
            style={(style || {}) && {cursor: 'pointer'}} 
            onClick={() => setEdit(true)}
            {...props}
        >
            {value || placehoder || 'nicht gewählt'}
        </Typography>
    )}
    </>
}

export default TextEditField