import { FormControl, MenuItem, Select } from "@mui/material"
import { project, projects, switchProject } from "../appState/projectSignals"

const ProjectSelect: React.FC = () => {
    
    return <>
        <FormControl variant="standard">
            <Select label="Projekt" value={project.value.id} onChange={e => switchProject(e.target.value)}>
                <MenuItem value="anonymous">Kein Projekt</MenuItem>
                { projects.value.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>) }
            </Select>
        </FormControl>
    </>
}

export default ProjectSelect