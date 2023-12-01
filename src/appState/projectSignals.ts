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
import { resetSimulationStep, simulationStep } from "./simulationSignals";

// some helper
const DIRTY_TIMEOUT = 1000
const PROJECT_VERSION = 1

// defining what a project is
export interface Project {
    id: string
    name: string
//    simulationStep: number
    externalReference?: GeoJSON.Feature<GeoJSON.Polygon>
}

export interface ProjectData {
    treeLines: TreeLine["features"],
    simulationStep: number
}

export enum ProjectEditState {
    SAVED = 0,
    DIRTY = 1,
    SAVING = 2
}

// project signals
export const projects = signal<Project[] | null>(null);
export const project = signal<Project>({ id: "anonymous", name: "anonymous" });

// edit state - internal can't be changed outside, so export only the calculated version
const internalEditState = signal<ProjectEditState>(ProjectEditState.SAVED)
export const editState = computed<ProjectEditState>(() => internalEditState.value)


// store the current project after some time
let dirtyTimeout: NodeJS.Timeout | null = null
effect(() => {
    // get the project data as it changes
    const rawData = readOnlyRawTreeLineFeatures.value

    // get the current simulation Step
    const currentStep = simulationStep.value.current
    const previous = simulationStep.peek().previous

    if (rawData.length > 0 || currentStep !== previous) {
        internalEditState.value = ProjectEditState.DIRTY
    } else {
        internalEditState.value = ProjectEditState.SAVED
    }

    // if the current project is anonymous, we do not save anything
    if (project.value.id === "anonymous") return
    
    // whenever the rawFeatures change, we wait a second and the save to localstorage
    if (dirtyTimeout) clearTimeout(dirtyTimeout)
    dirtyTimeout = setTimeout(() => {
        localforage.setItem<ProjectData>(
            project.peek().id,
            { 
                treeLines: readOnlyRawTreeLineFeatures.peek(),
                simulationStep: simulationStep.peek().current
            }
        ).then(() => internalEditState.value = ProjectEditState.SAVED)
        // for development you can uncomment this line to see when saving is finished
        //.then(() =>  console.log(`saved ${rawData.length} features to ${project.peek().id}`))
    }, DIRTY_TIMEOUT)
})


// effect to listen for changes in the current project
effect(() => {
    // we only load data from the storage if the project is not anonymous
    // if (project.value.id !== "anonymous") {
        localforage.getItem<ProjectData>(project.value.id).then(data => {
            if (data) {
                resetSimulationStep(data.simulationStep, data.simulationStep)
                emitValidatedRawTreeLines(data.treeLines)
            } else {
                // empty as the current project has no data
                resetSimulationStep(0, 0)
                emitValidatedRawTreeLines([])
            }
        })
    // }
})

// listen for changes in the projects array - but only if project is not null
effect(() => {
    const newProjects = projects.value

    // skip saving, if the projects array has not been initialized yet
    // this is needed as the Project Version is checked with await
    if (!newProjects) return

    // in any other case it is save to store the projects
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
        name: name || projectId,
    } as Project

    // add to the project to the list and select the new project directly list
    batch(() => {
        projects.value = [...projects.value || [], proj]
        project.value = proj
    })
}

/**
 * Switch Project
 * @param id - the id of the project to switch to
 */
export const switchProject = (id: string) => {
    // check if we switch to anonymous
    if (id === "anonymous" || !projects.peek()) {
        project.value = { id: "anonymous", name: "anonymous" }
        return
    }
    
    // otherwise find the project
    const proj = projects.peek()!.find(p => p.id === id)
    if (proj) {
        project.value = proj
    }
}

// check if the PROJECT_VERSION has changed.
// That is always hard-coded in the source code, so if the number increased,
// the project model is not compatible anymore
await localforage.getItem<number>("PROJECT_VERSION").then(version => {
    if (version !== PROJECT_VERSION) {
        localforage.clear().then(() => {
            // save the current version
            localforage.setItem("PROJECT_VERSION", PROJECT_VERSION)
        })
    }
})

// finally, on startup check if there was already something stored
localforage.getItem<Project[]>("projects").then(projectNames => {
    if (projectNames) {
        projects.value = projectNames
    } else {
        projects.value = []
    }
})
