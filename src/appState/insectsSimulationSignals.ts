/**
 * This module contains the signals and computed values for the insect simulation.
 */

import { computed, signal } from "@preact/signals-react"
import { simulationStep } from "./simulationSignals"
import { treeLocationFeatures } from "./geoJsonSignals"
import range from "lodash.range"
import { loadClosestDataPoint } from "./backendSignals"

interface InsectPopulation {
    latin_name: string,
    german_name: string,
    pollenPerLavae: number,
    startMonth: number,
    endMonth: number
}

// hard-code the insect data- change later
export const allInsects: InsectPopulation[] = [
    {latin_name: 'Andrena cineraria', german_name: 'Graue Sandbiene', pollenPerLavae: 32.2, startMonth: 3, endMonth: 5},
    {latin_name: 'Andrena haemorrhoa', german_name: 'Rotschopfige Sandbiene', pollenPerLavae: 20.1, startMonth: 3, endMonth: 7},
    {latin_name: 'Andrena helvola', german_name: 'Sandbiene', pollenPerLavae: 29.6, startMonth: 3, endMonth: 8},
    {latin_name: 'Andrena nitida', german_name: 'Glänzende Düstersandbiene', pollenPerLavae: 28.9, startMonth: 3, endMonth: 11},
    {latin_name: 'Apis mellifera', german_name: 'Honigbiene', pollenPerLavae: 43.6, startMonth: 3, endMonth: 12},
    {latin_name: 'Bombus lapidarius', german_name: 'Steinhummel', pollenPerLavae: 56.8, startMonth: 3, endMonth: 6},
    {latin_name: 'Bombus pascuorum', german_name: 'Ackerhummel', pollenPerLavae: 56.8, startMonth: 3, endMonth: 10},
    {latin_name: 'Bombus terrestris', german_name: 'Erdhummel', pollenPerLavae: 61.7, startMonth: 3, endMonth: 6},
    {latin_name: 'Colletes cunicularius', german_name: 'Frühlings-Seidenbiene', pollenPerLavae: 72, startMonth: 3, endMonth: 4},
]

// export the current insect population
export const insectPopulationName = signal<string>('Bombus terrestris')

export const insectPopulation = computed<InsectPopulation>(() => {
    return allInsects.find(insect => insect.latin_name === insectPopulationName.value) || allInsects[7]
})

export interface InsectsSimulation {
    [treeSpecies: string]: number[]
}

export const insectsSimulation = computed<InsectsSimulation>(() => {
    // emtpty container for the insect simulation
    const result: InsectsSimulation = {}

    // this signal depends on changes on the treeLocations and simulationStep
    const simOffset = simulationStep.value.current
    const trees = treeLocationFeatures.value

    // get the tree species
    const species = trees.map(tree => tree.properties.treeType).filter((value, index, self) => self.indexOf(value) === index)

    // for each tree species set the initial value
    species.forEach(sp => result[sp] = Array(99).fill(0))
    result['total'] = Array(99).fill(0)

    // for each year from 1 to 100, combine the simulation data
    range(99).forEach(year =>{
        // process each treee on the map
        trees.forEach(tree => {
           // get sim age
           const age = tree.properties.age! - simOffset + year

           // get the data
           const data = loadClosestDataPoint(tree.properties.treeType, age)

           // check if this year was already simulated
           result[tree.properties.treeType][year + 1] += (data['pollen']) || 0
        })

        // add the total numbers
        result['total'][year + 1] = species.map(acc => result[acc][year + 1]).reduce((prev, acc) => prev + acc, 0)
    })

    // return the results
    return result
})

// derive which months are active given the tree population
export const activeBlossomsMonths = computed<{[month: number]: number}>(() => {
    // subscribe to changes in the tree locations
    const trees = treeLocationFeatures.value

    // build the result container
    const result: {[month: number]: number} = {}
    range(1, 12).forEach(month => result[month] = 0)
    
    // go for each tree
    trees.forEach(tree => {
        // get for each month
        range(1, 12).forEach(month => {
            // check if this specific tree has blossoms in this month
            if (!!(tree.properties as any)[`flowering_${month}`]) {
                result[month] += 1
            }
        })
    })
    // return the result
    return result
})