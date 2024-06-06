import { computed, signal } from "@preact/signals-react";
import { RawTreeLocation, TreeLocation } from "./tree.model";
import { loadClosestDataPoint, treeSpecies } from "./backendSignals"
import { nanoid } from "nanoid";

/**
 * General workflow:
 * 
 * 1. signal the raw tree location and the type
 * 2. compute into a Basic GeoJSON Feature with full data point
 * 3. change existing points
 */


// new main signal to store rawTreeLocation data which is the single source of truth
// to where trees are located.
export const rawTreeLocationSeedData = signal<RawTreeLocation[]>([]);

// as soon as the rawTreeLocationSeedData changes, we can compile a list of all existing treeLineIds
// this could be extended to some basic metadata about these lines.
// export const activeTreeLineIds = computed<string[]>(() => {
//     // go for all unique treeLineIds in lines
//     const ids = rawTreeLocationSeedData.value.map(tree => tree.treeLineId).filter((value, index, self) => self.indexOf(value) === index)    

//     return ids
// })

// turn the raw tree locations into a GeoJSON Features
export const rawTreeFeatures = computed<TreeLocation["features"]>(() => {
    // new container for the features
    const features = rawTreeLocationSeedData.value.map(tree => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [tree.location.lng, tree.location.lat]
            },
            properties: {
                treeType: tree.treeType,
                icon_abbrev: tree.icon_abbrev,
                treeLineId: tree.treeLineId,
                ...loadClosestDataPoint(tree.treeType, tree.age),
                age: tree.age,
                harvestAge: tree.harvestAge,
                id: tree.id
            },
            id: tree.id
        } as TreeLocation["features"][0]
    })
//    console.log(features)
    return features
})

// export a list of all unique tree types planted (or about to plant) on the area
export const activeTreeTypes = computed<string[]>(() => {
    // go for all unique tree types in the seed data
    const uniqueTypes = new Set<string>(rawTreeFeatures.value.map(feature => feature.properties.treeType))

    return Array.from(uniqueTypes)
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
//    console.log(newTrees)
    return newTrees
})

// create signals to compute the current edit Settings
export const editAge = signal<number>(1)
export const editHarvestAge = signal<number>(100)
export const editTreeLineId = signal<string>(nanoid(8))


/**
 *  tree location signal functions
 */


// add a new tree after the user dropped it on the map
export const addNewTree = (tree: {location: {lat: number, lng: number}, treeType: string}) => {
    // get the next id
    const nextId = `s${rawTreeLocationSeedData.peek().length + 1}`

    // get the shape associated to this tree
    const icon_abbrev = treeSpecies.peek().find(species => species.latin_name === tree.treeType)!.icon_abbrev
    if (!icon_abbrev) {
        console.log(`ERROR: addNewTree('${tree.treeType}'): no icon associated to this treeType`)
        console.log(treeSpecies.peek())
    }

    rawTreeLocationSeedData.value = [
        ...rawTreeLocationSeedData.value,
        {
            ...tree,
            id: nextId,
            age: editAge.peek(),
            harvestAge: editHarvestAge.peek(),
            treeLineId: editTreeLineId.peek(),
            icon_abbrev: icon_abbrev
        }
    ]
}

// change all tree ages at once
export const updateAllTreeAges = (ageChange: number) => {
    // build the neww array
    const newTreeLocations = rawTreeLocationSeedData.peek().map(tree => {
        return {
            ...tree,
            age: tree.age + ageChange
        }
    })

    // upade the signal
    rawTreeLocationSeedData.value = newTreeLocations
}

export const updateSingleTreeSeed = (treeId: string, opts: Partial<RawTreeLocation>) => {
    // fing the tree in question
    const tree = rawTreeLocationSeedData.peek().find(t => t.id === treeId)

    // this should never be undefined
    if (!tree) {
        console.log(`updateSingleTreeSeed(${treeId}): this treeId is not in rawTreeLocationSeedData`)
        return
    }

    // create the new seed array
    const newTreeLocationSeeds = rawTreeLocationSeedData.peek().map(t => {
        if (t.id === treeId) {
            return {
                ...t,
                ...opts
            }
        }
        return {...t}
    })

    // update the signal
    rawTreeLocationSeedData.value = newTreeLocationSeeds
}

// update tree location position
export const updateTreePosition = (treeId: string, position: {lon: number, lat: number}) => {
    // find the tree
    const tree = rawTreeLocationSeedData.peek().find(t => t.id === treeId)

    // this should never be undefined
    if (!tree) {
        console.log(`updateTreePosition(${treeId}): this treeId is not in rawTreeLocationSeedData`)
        return
    }

    // create the new state array
    const newTreeLocationSeeds = rawTreeLocationSeedData.peek().map(t => {
        if (t.id === treeId) {
            return {
                ...t,
                location: {lat: position.lat, lng: position.lon}
            }
        }
        return {...t}
    })
    
    // console.log(newTreeLocationSeeds)

    // update the signal
    rawTreeLocationSeedData.value = newTreeLocationSeeds
}

// delete a tree location again
export const deleteTreeLocation = (treeId: string) => {
    // create a new treeLocationSeed 
    const updatedTreeLocationSeed = rawTreeLocationSeedData.peek().filter(t => t.id !== treeId)

    // update the signal
    rawTreeLocationSeedData.value = updatedTreeLocationSeed
}
