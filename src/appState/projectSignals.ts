/**
 * Projects are a grouping element. The main job is for now to identify
 * treeLines that are managed on the same instance.
 * 
 * Right now the projects are just strings, but that will likely change in the future.
 */

import { batch, computed, effect, signal } from "@preact/signals-react";
import localforage from "localforage";
import { nanoid } from "nanoid";

import { TreeLine } from "./treeLine.model";
import { emitValidatedRawTreeLines, readOnlyRawTreeLineFeatures } from "./treeLineSignals";

// some helper
const DIRTY_TIMEOUT = 1000

// defining what a project is
export interface Project {
    id: string
    name: string
}

export enum ProjectEditState {
    SAVED = 0,
    DIRTY = 1,
    SAVING = 2
}

// project signals
export const projects = signal<Project[]>([]);
export const project = signal<Project>({ id: "anonymous", name: "anonymous" });

// edit state - internal can't be changed outside, so export only the calculated version
const internalEditState = signal<ProjectEditState>(ProjectEditState.SAVED)
export const editState = computed<ProjectEditState>(() => internalEditState.value)


// store the current project after some time
let dirtyTimeout: NodeJS.Timeout | null = null
effect(() => {
    // get the project data as it changes
    const rawData = readOnlyRawTreeLineFeatures.value

    if (rawData.length > 0) {
        internalEditState.value = ProjectEditState.DIRTY
    } else {
        internalEditState.value = ProjectEditState.SAVED
    }

    // if the current project is anonymous, we do not save anything
    if (project.value.id === "anonymous") return
    
    // whenever the rawFeatures change, we wait a second and the save to localstorage
    if (dirtyTimeout) clearTimeout(dirtyTimeout)
    dirtyTimeout = setTimeout(() => {
        localforage.setItem(project.peek().id, readOnlyRawTreeLineFeatures.peek())
        .then(() => internalEditState.value = ProjectEditState.SAVED)
        // for development you can uncomment this line to see when saving is finished
        //.then(() =>  console.log(`saved ${rawData.length} features to ${project.peek().id}`))
    }, DIRTY_TIMEOUT)
})


// effect to listen for changes in the current project
effect(() => {
    // we only load data from the storage if the project is not anonymous
    // if (project.value.id !== "anonymous") {
        localforage.getItem<TreeLine["features"]>(project.value.id).then(treeLineFeatures => {
            if (treeLineFeatures) {
                emitValidatedRawTreeLines(treeLineFeatures)
            } else {
                // empty as the current project has no data
                emitValidatedRawTreeLines([])
            }
        })
    // }
})

// listen for changes in the projects array
effect(() => {
    const newProjects = projects.value

    // save to the local storage
    localforage.setItem("projects", newProjects)
})

// define some actions to manage the projects

/**
 * Create a new Project
 * @param name - the name of the new project
 */
export const newProject = (name?: string) => {
    // create a new project
    const projectId = nanoid()
    const proj = {
        id: projectId,
        name: name || projectId
    }

    // add to the project to the list and select the new project directly list
    batch(() => {
        projects.value = [...projects.value, proj]
        project.value = proj
    })
}

/**
 * Switch Project
 * @param id - the id of the project to switch to
 */
export const switchProject = (id: string) => {
    // check if we switch to anonymous
    if (id === "anonymous") {
        project.value = { id: "anonymous", name: "anonymous" }
        return
    }
    
    // otherwise find the project
    const proj = projects.peek().find(p => p.id === id)
    if (proj) {
        project.value = proj
    }
}

// finally, on startup check if there was already something stored
localforage.getItem<Project[]>("projects").then(projectNames => {
    if (projectNames) {
        projects.value = projectNames
    }
})