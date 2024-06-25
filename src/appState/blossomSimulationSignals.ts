/**
 * This file contains the signals that are used in the blossom simulation.
 */

import { computed, signal } from "@preact/signals-react";
import { treeLocationFeatures } from "./geoJsonSignals";
import { germanSpecies, simulationTimeSteps, treeDatabase, treeSpecies } from "./backendSignals";
import range from "lodash.range";
import { seasonMonth } from "./simulationSignals";
import { buffer } from "@turf/turf";
import { appView } from "./appViewSignals";

// the actual signal for the current variable is local
export type BlossomVariable = 'blossoms' | 'pollen' | 'nectar'
const blossomVar = signal<BlossomVariable>('blossoms')

// export a read only signal
export const blossomVariable = computed<BlossomVariable>(() => blossomVar.value)
export const setBlossomVariable = (variable: BlossomVariable) => {
    blossomVar.value = variable
}

interface BlossomVarSimulation {
    total: number[],
    [treeSpecies: string]: number[]
}
// whenever the tree-types change, export the blossom species
export const blossomVarSimulation = computed<BlossomVarSimulation>(() => {
    // get the time steps
    const steps = simulationTimeSteps.value

    // create a result container
    const result: BlossomVarSimulation = {
        total: Array(steps.length).fill(0),
    }

    // get the tree locations
    const trees = treeLocationFeatures.value
    if (trees.length === 0) return result

    // get the currently available species
    const species = [...new Set(trees.map(tree => tree.properties.treeType))]

    // create emty arrays for each species
    species.forEach(sp => result[sp] = Array(steps.length).fill(0))

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

// export the active months for each tree Species
interface BlossomMonths {
    total: number[]
    [treeSpecies: string]: number[]
}
export const activeBlossomsMonths = computed<BlossomMonths>(() => {
    // create a result container
    const result: BlossomMonths = {
        total: Array(12).fill(0)
    }

    // get the tree locations
    const trees = treeLocationFeatures.value
    if (trees.length === 0) return result
    
    // get the species
    const species = [...new Set(trees.map(tree => tree.properties.treeType))]

    // create empty arrays for each species
    species.forEach(sp => result[sp] = Array(12).fill(0))

    // for each tree, add the active months
    trees.forEach(tree => {
        range(0, 12).forEach(index => {
            // check if this tree has blossoms in this month
            if (!!(tree.properties as any)[`flowering_${index + 1}`]) {
                result[tree.properties.treeType][index] += 1
                result['total'][index] += 1
            }
        })
    })

    // return the result container
    return result
})

// explicitly set the buffer width
const bufferWidth = Number(process.env.REACT_APP_BLOSSOM_WIDTH) || 2.5
// export a GeoJSON signal for the blossoms
export const blossomIndicatorArea = computed<GeoJSON.FeatureCollection<GeoJSON.Polygon>>(() => {
    // create a container for the features
    const features: GeoJSON.Feature<GeoJSON.Polygon>[] = []
    
    // only do something if the blossoms tab is active
    if (appView.value === "blossoms") {
        // get the tree locations and the current seasonMonth to react to these signals
        const trees = treeLocationFeatures.value
        const month = seasonMonth.value

        // map the trees into the features
        trees.forEach(tree => {
            // only create a feature if the tree is currently flowering
            if (!!(tree.properties as any)[`flowering_${month}`]) {
                // create the feature
                features.push({
                    ...buffer(tree.geometry, bufferWidth, {units: 'meters'}),
                    properties: {
                        german_name: germanSpecies.peek()[tree.properties.treeType],
                        age: tree.properties.age,
                    }
                })
            }
        })
    }

    // return the GeoJSON
    return {
        type: 'FeatureCollection',
        features
    }
})