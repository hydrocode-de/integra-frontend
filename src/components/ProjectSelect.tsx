import { Box, FormControl, IconButton, Input, InputAdornment, MenuItem, Select, TextField } from "@mui/material"
import { Add, Check, Close } from "@mui/icons-material"

import { newProject, project, projects, switchProject } from "../appState/projectSignals"
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
    
    
    return <>
        <Box>
            { isEditing.value ? (
                <FormControl variant="standard">
                    <TextField
                        variant="standard"
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
            ) : (
                <FormControl variant="standard">
                    <Select label="Projekt"  value={project.value.id} onChange={e => switchProject(e.target.value)} startAdornment={
                        <InputAdornment position="start">
                            <IconButton size="small" edge="end" color="inherit" aria-label="add new Project" onClick={() => isEditing.value = true}>
                                <Add />
                            </IconButton>
                        </InputAdornment>
                    }>
                        <MenuItem value="anonymous">Kein Projekt</MenuItem>
                        { projects.value.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>) }
                    </Select>
                </FormControl>
            ) }
        </Box>
    </>
}

export default ProjectSelect