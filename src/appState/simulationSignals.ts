/**
 * Simulations are used to change the state of the treeLine in place.
 * 
 * A simulation is controlled by a step since the start of the simulation
 * and is measured in years.
 */

import { batch, computed, effect, signal } from "@preact/signals-react";
import { layerVisibility } from "./mapSignals";
import { editAge, updateAllTreeAges } from "./treeLocationSignals";
import { treeLocationFeatures } from "./geoJsonSignals";
import { loadClosestDataPoint } from "./backendSignals";
import range from "lodash.range";

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

// DEV: this line controls whether new trees are placed at age 1 or using the current simulation step
effect(() => {
    editAge.value = simulationStep.value.current + 1
})

// season
export const seasonMonth = signal<number>(6)
export type SEASON = "flowering" | "summer" | "autumn" | "winter"

export const getSeason = ( month: number, treeType: string, age: number): SEASON => {
    // october and november are always autumn
    if ([10, 11].includes(month)) return "autumn"

    // december is always winter
    if (month === 12) return "winter"

    // otherwise we default to summer
    let season: SEASON = "summer"

    // in any other case, we check the flowering data
    const treeData = loadClosestDataPoint(treeType, age)

    // flag is flowering is over
    let wasFlowering = false

    // not sure how to break a loop correctly, so we need another flag
    let didMatch = false

    range(1, 10).forEach(m => {
        if (didMatch) return
        // set the flowering flag to true
        if (!!treeData[`flowering_${m}` as keyof typeof treeData]) {
            wasFlowering = true
            // if this is the month, return the flowering season
            if (m === month && !didMatch) { 
                didMatch = true
                season = "flowering"
            }
        }
        
        // now it can only be summer or winter if the months match
        if (m === month && !didMatch) {
            didMatch = true
            season = wasFlowering ? "summer" : "winter"
        }
    })

    // if we reach this point, something went wrong
    return season
    
}

// use a function to go to the next season month to handle the order correctly
// this can then later implement the half-months
// export const nextSeasonMonth = () => {
//     const currentMonth = seasonMonth.value
//     if (currentMonth === 12) {
//         seasonMonth.value = 1
//     } else {
//         seasonMonth.value = currentMonth + 1
    
//     }
// }

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

    // update all single trees accordingly
    updateAllTreeAges(ageChange)
})

// Add some simulation effects here
// These are things that happen as the simulation progresses.

// first we need a new simulation state:
// if the simulation step is > 0, it is 'touched'
export const simulationIsTouched = computed<boolean>(() => simulationStep.value.current > 0)

// if the simulation is Touched and there is more than one tree, we enable the option
// to visualize the canopy instead of a circle layer
effect(() => {
    if (simulationIsTouched.value && treeLocationFeatures.value.length > 0) {
        // check if is already there
        if (!Object.keys(layerVisibility.peek()).includes("canopyLayer")) {
            // enable the open by setting the layer visibility
            layerVisibility.value = {...layerVisibility.peek(), "canopyLayer": "visible"}

            // TODO: here we could handle the discoverability of this feature
        }
    }

    // remove the layer switch possibility if there are no features
    if (treeLocationFeatures.value.length === 0 && Object.keys(layerVisibility.peek()).includes("canopyLayer")) {
        // remove the option
        const { "canopyLayer": _, ...others } = layerVisibility.peek()
        layerVisibility.value = others
    }
})
