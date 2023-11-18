/**
 * Simulations are used to change the state of the treeLine in place.
 * 
 * A simulation is controlled by a step since the start of the simulation
 * and is measured in years.
 */

import { computed, signal } from "@preact/signals-react";

// the iteration is too important, so we make it private to this module
const step = signal<number>(0);

// public read-only access to the duration - we could use a better name here
export const simulationStep = computed<number>(() => step.value)

// public handler to set the simulation duration directly
export const setSimulationStep = (newStep: number) => {
    // TODO: I implement some hard-coded rules here
    // it is an INTEGER between 0 100
    const validatedStep = Math.max(0, Math.min(Math.round(Number(newStep)), 100))

    step.value = validatedStep
}