import { computed, signal } from "@preact/signals-react";
import { TreeLocation } from "./treeLine.model";
import { loadClosestDataPoint } from "./backendSignals"

/**
 * General workflow:
 * 
 * 1. signal the raw tree location and the type
 * 2. compute into a Basic GeoJSON Feature with full data point
 * 3. change existing points
 */

interface RawTreeLocation {
    location: {lat: number, lng: number},
    treeType: string,
    treeLineId: string,
    age: number,
}
// new main signal to store rawTreeLocation data which is the single source of truth
// to where trees are located.
const rawTreeLocationSeedData = signal<RawTreeLocation[]>([]);

// as soon as the rawTreeLocationSeedData changes, we can compile a list of all existing treeLineIds
// this could be extended to some basic metadata about these lines.
export const activeTreeLineIds = computed<string[]>(() => {
    // go for all unique treeLineIds in lines
    const ids = rawTreeLocationSeedData.value.map(tree => tree.treeLineId).filter((value, index, self) => self.indexOf(value) === index)    

    return ids
})

// turn the raw tree locations into a GeoJSON Features
export const rawTreeFeatures = computed<TreeLocation["features"]>(() => {
    // new container for the features
    const features = rawTreeLocationSeedData.value.map((tree, index) => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [tree.location.lng, tree.location.lat]
            },
            properties: {
                id: index.toString(),
                treeType: tree.treeType,
                treeLineId: tree.treeLineId,
                age: tree.age,
                ...loadClosestDataPoint(tree.treeType, tree.age)    
            }
        } as TreeLocation["features"][0]
    })
    console.log(features)
    return features
})

/* 
 * generate the various filtered views on rawTreeFeatures
 */
// the 'active' trees, already planted and not yet harvested
export const treeFeatures = computed<TreeLocation["features"]>(() => {
    // filter rawTreeFeatures for trees which are already planted and not yet harvested
    const newTrees = rawTreeFeatures.value.filter(
        tree => tree.properties.age! > 0 && 
        (!tree.properties.harvestAge || (tree.properties.harvestAge && tree.properties.age! < tree.properties.harvestAge))
    )
    console.log(newTrees)
    return newTrees
})

// only trees that are not yet planted
export const futureTreeFeatures = computed<TreeLocation["features"]>(() => {
    // filter rawTreeFeatures for trees which are not yet planted
    return rawTreeFeatures.value.filter(tree => tree.properties.age! <= 0)
})

// only trees that are already harvested
export const harvestedTreeFeatures = computed<TreeLocation["features"]>(() => {
    // filter rawTreeFeatures for trees which are already harvested
    return rawTreeFeatures.value.filter(
        tree => tree.properties.harvestAge && tree.properties.age! >= tree.properties.harvestAge
    )
})

// add a new tree after the user dropped it on the map
export const addNewTree = (tree: RawTreeLocation) => {
    rawTreeLocationSeedData.value = [...rawTreeLocationSeedData.value, {...tree}]
}
