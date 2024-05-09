import { computed, effect, signal } from "@preact/signals-react";
import { TreeLocation } from "./treeLine.model";
import { loadClosestDataPoint, treeSpecies } from "./backendSignals"
import { treeLocationFeatures } from "./treeLineSignals";
import { lineString } from "@turf/helpers";
import length from "@turf/length";
import center from "@turf/center";
import distance from "@turf/distance";
import { nanoid } from "nanoid";

/**
 * General workflow:
 * 
 * 1. signal the raw tree location and the type
 * 2. compute into a Basic GeoJSON Feature with full data point
 * 3. change existing points
 */

interface RawTreeLocation {
    id: string,
    location: {lat: number, lng: number},
    treeType: string,
    treeShape: string,
    treeLineId: string,
    age: number,
    harvestAge?: number
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
    const features = rawTreeLocationSeedData.value.map(tree => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [tree.location.lng, tree.location.lat]
            },
            properties: {
                treeType: tree.treeType,
                treeShape: tree.treeShape,
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
    const shape = treeSpecies.peek().find(species => species.latin_name === tree.treeType)!.shape
    if (!shape) {
        console.log(`ERROR: addNewTree(${tree.treeType}): no shape found for this treeType`)
    }

    rawTreeLocationSeedData.value = [
        ...rawTreeLocationSeedData.value,
        {
            ...tree,
            id: nextId,
            age: editAge.peek(),
            harvestAge: editHarvestAge.peek(),
            treeLineId: editTreeLineId.peek(),
            treeShape: shape
        }
    ]
}

/**
 * Add the state of computed tree line features
 * 
 * These lines are a signal of its own but use an effect to update the geometry of the line
 * This way, a change in the tree location will effect the line, but the line can also hold line data
 * which can be changed independently of the tree locations. (like its width or usage)
 */
// The calculatedTreeLineProps need their own interface as editSettings do not apply
interface TreeLineProperties {
    id: string,
    width: number,
    name?: string,
}

interface CalculatedTreeLineProperties extends TreeLineProperties {
    treeCount?: number,
    lineLength?: number,
}

export type CalculatedTreeLine = GeoJSON.FeatureCollection<GeoJSON.LineString, CalculatedTreeLineProperties>

const calculatedTreeLineProps = signal<TreeLineProperties[]>([])



// function to create new default treeLineProps, whenever there is a tree that is not part of any tree line.
const createMissingTreeLineProps = (tree: RawTreeLocation) => {
    // the the treeLineId in question
    const treeLineId = tree.treeLineId

    // creaze the properties with defaults
    const props = { id: treeLineId, width: 5, name: `TreeLine ${treeLineId}` }

    // create the new state of the treelineprops
    const newTreeLineProps = [...calculatedTreeLineProps.peek(), {...props}]

    // update the signal
    calculatedTreeLineProps.value = newTreeLineProps
}
// define an effect to add a new treeLineProps whenever a tree is added with an treeLineId that is not yet in the list
effect(() => {
    // whenever rawTreeLocationSeedData changes, we need to check if there are new treeLineIds
    rawTreeLocationSeedData.value.forEach(tree => {
        // check if the active treeLineIds contain the treeLineId already
        if (!activeTreeLineIds.peek().includes(tree.treeLineId)) {
            createMissingTreeLineProps(tree)
        }
    })
})

// create calculatedTreeLineFeatures from the props. It is possible that we have props, that do not have 
// trees anymore. These are just ignored here
export const calculatedTreeLineFeatures = computed<CalculatedTreeLine["features"]>(() => {
    // container for the line features
    const treeLines: CalculatedTreeLine["features"] = []

    const allTrees = treeLocationFeatures.value
    const allLineProperties = calculatedTreeLineProps.value

    // for each activeTreeLineId and filter all trees that belong to this line
    activeTreeLineIds.peek().forEach(lineId => {
        const trees = allTrees.filter(tree => tree.properties.treeLineId === lineId)

        if (trees.length < 2) return
        // construct the line from these features
        // TODO: here, we could implement an algorithm that adds the points one at a time to contrstuct the 
        // shortest possible path
        
        // get the centroid of the trees
        const centroid = center({type: 'FeatureCollection', features: trees})

        // get the tree that is furthest away from the centroid
        const startTree = trees.reduce((prev, curr) => distance(centroid, curr) > distance(centroid, prev) ? curr : prev)

        // construct the line 
        const distToStartTree = trees.map(t => distance(startTree, t))

        // order the trees by increasing distance to startTree
        const orderedTrees = trees.sort((a, b) => distToStartTree[trees.indexOf(a)] - distToStartTree[trees.indexOf(b)])
        
        const line = lineString(orderedTrees.map(tree => tree.geometry.coordinates))
        treeLines.push({
            ...line,
            properties: {
                ...allLineProperties.find(line => line.id === lineId)!,
                treeCount: trees.length,
                lineLength: length(line, {units: 'meters'})
            }
        })
    })

    return [...treeLines]
})

export const calculatedTreeLines = computed<CalculatedTreeLine>(() => {
    return {
        type: 'FeatureCollection',
        features: calculatedTreeLineFeatures.value
    }
})




/**
 * Functions to change the tree location data
 */
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
