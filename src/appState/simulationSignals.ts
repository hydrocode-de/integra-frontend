/**
 * Simulations are used to change the state of the treeLine in place.
 * 
 * A simulation is controlled by a step since the start of the simulation
 * and is measured in years.
 */

import { batch, computed, effect, signal } from "@preact/signals-react";
import { updateAllLineAges } from "./treeLineSignals";

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

// this is one of the tests right now: try to only update the treeLine as an effect of a changing step
effect(() => {
    // check if we need to decrease or increase the treeAge
    const ageChange = simulationStep.value.current - simulationStep.value.previous

    // update all treeLines accordingly
    updateAllLineAges(ageChange)
})