import { Box, FormControl, IconButton, InputAdornment, MenuItem, Select, TextField, Typography } from "@mui/material"
import { Add, Check, Close, Error, CheckCircle } from "@mui/icons-material"

import { ProjectEditState, editState, newProject, project, projects, switchProject } from "../appState/projectSignals"
import { useSignal } from "@preact/signals-react"

const ProjectSelect: React.FC = () => {
    // define a signal to switch the editing state of projects
    const isEditing = useSignal<boolean>(false)
    const newProjectName = useSignal<string>("")

    // we need a handler to cancel the adding of a new project
    const cancelAdd = () => {
        isEditing.value = false
        newProjectName.value = ""
    }

    // and a handler to actually add the project and select it
    const onAdd = () => {
        newProject(newProjectName.peek())
        cancelAdd()
    }
    
    // we render two different component trees depending on the editing state
    if (isEditing.value) {
        return <>
        <FormControl >
                    <TextField
                       
                        value={newProjectName.value}
                        onChange={e => newProjectName.value = e.target.value}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton size="small" edge="start" color="success" disabled={newProjectName.value === ""} onClick={onAdd}>
                                    <Check />
                                </IconButton>
                                <IconButton size="small" edge="end" color="inherit" onClick={cancelAdd}>
                                    <Close />
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                    />
                </FormControl>
        </>
    }

    // we are not editing, to we either have a project or not
    else if (projects.value! && projects.value.length === 0) {
        return <>
        <FormControl variant="standard" size="small" sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            { editState.value === ProjectEditState.DIRTY ? (
                <Box display="flex" alignItems="center" mr={2}>
                    <Error color="error" sx={{fontSize: '100%', mr: 0.5}} />
                    <Typography variant="caption" color="error">nicht gespeichert</Typography>
                </Box>
            ) : null }
            <Typography variant="caption">Kein Projekt</Typography>
            <IconButton size="small" edge="end" color="inherit" aria-label="add new Project" onClick={() => isEditing.value = true}>
                <Add />
            </IconButton>
        </FormControl>
            
        </>
    }

    else {
        return <>
            <Box display="flex" alignItems="center" mr={2}>
                { editState.value === ProjectEditState.DIRTY ? (
                    <Error color="error" sx={{fontSize: '100%', mr: 0.5}} />
                ) : (
                    <CheckCircle color="success" sx={{fontSize: '100%', mr: 0.5}} />
                )}
                <Typography variant="caption" color={editState.value === ProjectEditState.DIRTY ? "error" : "success"}>
                    {editState.value === ProjectEditState.DIRTY ? "nicht gespeichert" : "gespeichert"}
                </Typography>
            </Box>
            <FormControl variant="outlined" size="small">
                <Select size="small"  value={project.value.id} onChange={e => switchProject(e.target.value)} startAdornment={
                    <InputAdornment position="start">
                        <IconButton size="small" edge="end" color="inherit" aria-label="add new Project" onClick={() => isEditing.value = true}>
                            <Add />
                        </IconButton>
                    </InputAdornment>
                }>
                    <MenuItem value="anonymous">Kein Projekt</MenuItem>
                    { (projects.value || []).map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>) }
                </Select>
            </FormControl>
        </>
    }
}

export default ProjectSelect