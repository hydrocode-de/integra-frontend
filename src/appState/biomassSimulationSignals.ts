/**
 * This module collects all calculation needed for the biomass result tab
 * 
 * Currently this is:
 *  - the canopy layer
 */

import { computed, signal } from "@preact/signals-react"
import { TreeLocationProperties } from "./tree.model"
import { appView } from "./appViewSignals"
import { treeLocationFeatures } from "./geoJsonSignals"
import range from "lodash.range"

import buffer from "@turf/buffer"
import area from "@turf/area"
import { loadClosestDataPoint, treeSpecies } from "./backendSignals"
import { simulationStep } from "./simulationSignals"

// define a model type for canopy
interface CanopyProperties extends TreeLocationProperties {
    canopyArea: number,
    canopyWidth?: number,
    error?: string

}
export type Canopy = GeoJSON.FeatureCollection<GeoJSON.Polygon, CanopyProperties>

// now the existence of the 'canopyLayer' can be used to calculate the canopy only conditionally
export const canopyLayerFeatures = computed<Canopy["features"]>(() => {
    // if the app view is not on biomass, we don't need a canopy
    if (appView.value !== 'biomass') {
        return []
    } else {
        // otherwise buffer the treeLocations
        return treeLocationFeatures.value.map(tree => {
            // tree buffer defaults to 1m 
            const buffered = buffer(tree, (tree.properties.canopyWidth || 1) / 2, {units: 'meters'})
            
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


/**
 * Simulation data
 * 
 * For the biomass simulation, we need to calculate the full simulation for each tree, that is 
 * currently on the map. This is done for one of the properties at a time only, but for each tree
 * species separated.
 */

export const biomassProperty = signal<'agb' | 'carbon'>('agb')

export interface BiomassSimulation {
    [treeSpecies: string]: number[]
}

export const biomassSimulation = computed<BiomassSimulation>(() => {
    // empty container for biomass simulation
    const result = {} as BiomassSimulation

    // if the appView is not biomass, return empty object
    if (appView.value !== 'biomass') return result

    // if there are not trees, return empty object
    const trees = treeLocationFeatures.value
    if (trees.length === 0) return result

    // in any other case we run a full simulation
    const feature = biomassProperty.value

    // get a set of all used treeSpecies
    const species = trees.map(tree => tree.properties.treeType).filter((tree, idx, arr) => arr.indexOf(tree) === idx)
    
    // add an empty array for each species
    species.forEach(sp => result[sp] = Array(99).fill(0))

    // add an empty array for the total timeseries
    result['total'] = Array(99).fill(0)

    // peek on the current simulation step to calculate the offset of the result simulation
    const simOffset = simulationStep.peek().current

    // for each year from 1 to 100, combine the simulation data
    range(99).forEach(year => {
        // process each tree on the map
        trees.forEach(tree => {
            // get sim age
            const age = tree.properties.age! - simOffset + year

            // skip if this tree was/in not active at the current sim step
            if (age < 1 || (tree.properties.harvestAge && age > tree.properties.harvestAge)) return

            // get the data
            const data = loadClosestDataPoint(tree.properties.treeType, age)

            // check if this year was already simulated
            result[tree.properties.treeType][year + 1] += data[feature] || 0
            
        })

        // add the total numbers
        result['total'][year + 1] = species.map(acc => result[acc][year + 1]).reduce((prev, acc) => prev + acc, 0)
    })

    // return the results
    // console.log(result)
    return result
})
