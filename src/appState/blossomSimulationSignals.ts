/**
 * This file contains the signals that are used in the blossom simulation.
 */

import { computed, signal } from "@preact/signals-react";
import { treeLocationFeatures } from "./geoJsonSignals";
import { simulationTimeSteps, treeDatabase } from "./backendSignals";

// the actual signal for the current variable is local
export type BlossomVariable = 'blossoms' | 'pollen' | 'nectar'
const blossomVar = signal<BlossomVariable>('blossoms')

// export a read only signal
export const blossomVariable = computed<BlossomVariable>(() => blossomVar.value)
export const setBlossomVariable = (variable: BlossomVariable) => {
    blossomVar.value = variable
}

interface BlossomVarSimulation {
    [treeSpecies: string]: number[]
}
// whenever the tree-types change, export the blossom species
export const blossomVarSimulation = computed<BlossomVarSimulation>(() => {
    // create a result container
    const result: BlossomVarSimulation = {}

    // get the tree locations
    const trees = treeLocationFeatures.value
    if (trees.length === 0) return result

    // get the time steps
    const steps = simulationTimeSteps.value

    // get the currently available species
    const species = [...new Set(trees.map(tree => tree.properties.treeType))]

    // create emty arrays for each species
    species.forEach(sp => result[sp] = Array(steps.length).fill(0))

    // add an empty array for the total timeseries
    result['total'] = Array(steps.length).fill(0)

    // for each time step, aggregate the data
    steps.forEach((step, idx) => {
        // for each tree
        trees.forEach(tree => {
            // load the data from the tree database
            const data = treeDatabase.peek().find(t => t.latin_name === tree.properties.treeType)?.data.find(d => d.age === step)
            if (data) {
                result[tree.properties.treeType][idx] += data[blossomVar.value] || 0
            }
        })

        // calculate the total
        result['total'][idx] = species.reduce((acc, sp) => acc + result[sp][idx], 0)
    })

    // return result
    return result
})