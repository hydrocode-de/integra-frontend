/**
 * Simulations are used to change the state of the treeLine in place.
 * 
 * A simulation is controlled by a step since the start of the simulation
 * and is measured in years.
 */

import { batch, computed, effect, signal } from "@preact/signals-react";
import { updateAllLineAges, readOnlyRawTreeLineFeatures, treeLocationFeatures } from "./treeLineSignals";
import { layerVisibility } from "./mapSignals";
import buffer from "@turf/buffer";
import area from "@turf/area";
import { TreeLocationProperties } from "./treeLine.model";

// the iteration is too important, so we make it private to this module
const step = signal<number>(0)
const previousStep = signal<number>(-1)


// public read-only access to the duration - we could use a better name here
interface SimulationStep {
    current: number,
    previous: number
}
// the simulation step updates only if step changes, as it is updated in a batch with previousStep
export const simulationStep = computed<SimulationStep>(() => {
    return {
        current: step.value,
        previous: previousStep.peek()
    }
})

// public handler to set the simulation duration directly
/**
 * Sets the current step of the simulation.
 *
 * @param newStep - The new step of the simulation.
 *
 * This function performs the following steps:
 * 1. Validates the new step to ensure it is an integer between 0 and 100. If the new step is not within this range, it is clamped to the nearest valid value.
 * 2. Retrieves the current step of the simulation.
 * 3. If the validated new step is the same as the current step, the function returns immediately.
 * 4. In a batch operation, it updates the current step to the validated new step and sets the previous step to the current step.
 */
export const setSimulationStep = (newStep: number) => {
    // TODO: I implement some hard-coded rules here
    // it is an INTEGER between 0 100
    const validatedStep = Math.max(0, Math.min(Math.round(Number(newStep)), 100))
    const previous = step.peek()
    
    // only update if the step has changed
    if (validatedStep === previous) return
    
    batch(() => {
        step.value = validatedStep
        previousStep.value = previous
    })
}

/**
 * Directly reset the simulation step to a preconfigured value.
 * This is needed if the user loads a project from storage or file.
 * 
 * @param newStep - The new step of the simulation.
 * @param previous - The previous step of the simulation.
 */
export const resetSimulationStep = (newStep: number, previous: number) => {
    batch(() => {
        step.value = newStep
        previousStep.value = previous
    })
}

// this is one of the tests right now: try to only update the treeLine as an effect of a changing step
effect(() => {
    // check if we need to decrease or increase the treeAge
    const ageChange = simulationStep.value.current - simulationStep.value.previous

    // update all treeLines accordingly
    updateAllLineAges(ageChange)
})

// Add some simulation effects here
// These are things that happen as the simulation progresses.

// first we need a new simulation state:
// if the simulation step is > 0, it is 'touched'
export const simulationIsTouched = computed<boolean>(() => simulationStep.value.current > 0)

// if the simulation is Touched and there is more than one tree, we enable the option
// to visualize the canopy instead of a circle layer
effect(() => {
    if (simulationIsTouched.value && readOnlyRawTreeLineFeatures.value.length > 0) {
        // check if is already there
        if (!Object.keys(layerVisibility.peek()).includes("canopyLayer")) {
            // enable the open by setting the layer visibility
            layerVisibility.value = {...layerVisibility.peek(), "canopyLayer": "visible"}

            // TODO: here we could handle the discoverability of this feature
        }
    }

    // remove the layer switch possibility if there are no features
    if (readOnlyRawTreeLineFeatures.value.length === 0 && Object.keys(layerVisibility.peek()).includes("canopyLayer")) {
        // remove the option
        const { "canopyLayer": _, ...others } = layerVisibility.peek()
        layerVisibility.value = others
    }
})

// define a model type for canopy
interface CanopyProperties extends TreeLocationProperties {
    canopyArea: number,
    canopyWidth?: number,
    error?: string

}
export type Canopy = GeoJSON.FeatureCollection<GeoJSON.Polygon, CanopyProperties>

// now the existence of the 'canopyLayer' can be used to calculate the canopy only conditionally
export const canopyLayerFeatures = computed<Canopy["features"]>(() => {
    // if there is no need for a layer, return an empty array
    if (!Object.keys(layerVisibility.value).includes('canopyLayer')) {
        return []
    } else {
        // otherwise buffer the treeLocations
        return treeLocationFeatures.value.map(tree => {
            // tree buffer defaults to 1m 
            const buffered = buffer(tree, tree.properties.canopyWidth || 1, {units: 'meters'})
            
            return {
                ...buffered,
                properties: {
                    ...tree.properties,
                    canopyArea: area(buffered),
                    canopyWidth: tree.properties.canopyWidth,
                    error: !tree.properties.canopyWidth ? `Tree ${tree.properties.id} has no canopy width set` : undefined
                }
            }
        })
    }
})

export const canopyLayer = computed<Canopy>(() => {
    return {
        type: 'FeatureCollection',
        features: canopyLayerFeatures.value
    }
})