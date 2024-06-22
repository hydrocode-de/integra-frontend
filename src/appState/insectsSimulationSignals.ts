/**
 * This module contains the signals and computed values for the insect simulation.
 */

import { computed, signal } from "@preact/signals-react"
import { simulationStep } from "./simulationSignals"
import { treeLocationFeatures } from "./geoJsonSignals"
import range from "lodash.range"
import { loadClosestDataPoint, treeSpecies } from "./backendSignals"
import { activeTreeTypes } from "./treeLocationSignals"


interface InsectPopulation {
    latin_name: string,
    german_name: string,
    pollenPerLavae: number,
    startMonth: number,
    endMonth: number
}

// Due to the lack of time, we add this data here hard-coded instead of calling it from the backend
// the order matches the boolean insect abundance array of TreeSpecies and indicates the phanological months
export const insectPhano = [[5, 6], [3, 3], [4, 4], [3, 6], [3, 3], [4, 6], [3, 6], [5, 6], [4, 5], [3, 5], [5, 5], [3, 6], [5, 5], [3, 6], [5, 5], [3, 5], [5, 6], [3, 5], [3, 7], [3, 8], [4, 4], [5, 5], [3, 4], [4, 4], [3, 6], [3, 10], [3, 4], [3, 11], [4, 6], [3, 3], [3, 6], [5, 5], [4, 4], [3, 3], [3, 6], [3, 3], [3, 6], [4, 6], [4, 4], [4, 5], [4, 6], [3, 5], [3, 3], [3, 3], [3, 3], [3, 4], [5, 6], [5, 5], [4, 4], [3, 12], [4, 6], [6, 6], [3, 6], [3, 6], [4, 6], [3, 8], [3, 6], [3, 6], [5, 5], [3, 6], [5, 5], [5, 5], [5, 5], [5, 5], [5, 6], [3, 4], [6, 6], [5, 5], [6, 6], [5, 5], [6, 6], [4, 6], [5, 5], [4, 5], [5, 6], [4, 6], [6, 6], [4, 6], [4, 6], [6, 6], [6, 6], [1, 6], [5, 6], [5, 6], [5, 5], [6, 6], [6, 6], [5, 5], [6, 6], [6, 6], [3, 9], [5, 6], [4, 6], [3, 6], [3, 6], [5, 6], [5, 5], [5, 6], [3, 6], [4, 4], [3, 6], [5, 5], [3, 5], [3, 5], [3, 6], [4, 5], [4, 6], [4, 6], [4, 6], [5, 5], [4, 6], [5, 5], [4, 5], [4, 6], [6, 6], [6, 6], [3, 6], [6, 6], [4, 5], [4, 5], [5, 5], [4, 4], [3, 5], [3, 3], [3, 4], [4, 6], [6, 6], [3, 4], [5, 5], [5, 5], [6, 6], [6, 6], [4, 4], [5, 5], [6, 6], [5, 5], [3, 6]]

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
    {latin_name: 'Lasioglossum laticeps', german_name: 'Breitkopf-Schmalbiene', pollenPerLavae: 11, startMonth: 3, endMonth: 6},
    {latin_name: 'Megachile rotundata', german_name: 'Luzerne-Blattschneiderbiene', pollenPerLavae: 15.2, startMonth: 5, endMonth: 7},
    {latin_name: 'Osmia bicornis', german_name: 'Rostrote Mauerbiene', pollenPerLavae: 28.8, startMonth: 4, endMonth: 6},
    {latin_name: 'Osmia cornuta', german_name: 'Gehörnte Mauerbiene', pollenPerLavae: 52.2, startMonth: 3, endMonth: 4},
    {latin_name: 'Xylocopa violacea', german_name: 'Große Blaue Holzbiene', pollenPerLavae: 207.1, startMonth: 3, endMonth: 6}
]

// create a view on the insects, whenever the species change
export const speciesToInsects = computed<{[species: string]: boolean[]}>(()=> {
    const spec = Object.fromEntries(treeSpecies.value.map(species => {
        return [species.latin_name, species.insects || []]
    }))

    console.log(spec)
    return spec
})

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
export const activeBlossomsMonths = computed<number[]>(() => {
    // subscribe to changes in the tree locations
    const trees = treeLocationFeatures.value

    // build the result container
    const result: number[] = Array(12).fill(0)
    
    // go for each tree
    trees.forEach(tree => {
        // get for each month
        range(0, 12).forEach(index => {
            // check if this specific tree has blossoms in this month
            if (!!(tree.properties as any)[`flowering_${index + 1}`]) {
                result[index] += 1
            }
        })
    })
    console.log(result)
    // return the result
    return result
})

// derive the insect abundance for each species and month based on the trees we have
export const insectPhanologicalMonths = computed<number[]>(() => {
    // react to changes in the tree locations -> we need a list of all species
    const treeTypes = activeTreeTypes.value

    // we peek into the species to get the insect months
    const allSpecies = treeSpecies.peek()

    // container for the results
    const result: number[] = Array(12).fill(0)

    // for each active type, get all species
    treeTypes.forEach(treeType => {
        // get the insect data
        const insects = allSpecies.find(species => species.latin_name === treeType)?.insects || []

        // for every true insect, we need to increase the counter at the respective months
        insects.forEach((isAbundant, index) => {
            if (isAbundant) {
                // TODO: this should maybe be imlplemented as a matrix operation
                // especially if we implement the tree ages and / or the blossoms for each tree age / month
                range(insectPhano[index][0], insectPhano[index][1] + 1).forEach(month => {
                    result[month - 1] += 1
                })
            }
        })
    })

    // return the result
    return result
})