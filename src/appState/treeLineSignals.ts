/**
 * Add the state of computed tree line features
 * 
 * These lines are a signal of its own but use an effect to update the geometry of the line
 * This way, a change in the tree location will effect the line, but the line can also hold line data
 * which can be changed independently of the tree locations. (like its width or usage)
 */
import { computed, effect, signal } from "@preact/signals-react"
import { CalculatedTreeLine, RawTreeLocation, TreeLineArea, TreeLineProperties } from "./tree.model"
import { rawTreeLocationSeedData } from "./treeLocationSignals"
import { treeLocationFeatures } from "./geoJsonSignals"
import center from "@turf/center"
import distance from "@turf/distance"
import length from "@turf/length"
import { lineString } from "@turf/helpers"
import buffer from "@turf/buffer"
import { referenceArea } from "./referenceAreaSignals"
import difference from "@turf/difference"
import union from "@turf/union"

const calculatedTreeLineProps = signal<TreeLineProperties[]>([])


// function to create new default treeLineProps, whenever there is a tree that is not part of any tree line.
const createMissingTreeLineProps = (tree: RawTreeLocation) => {
    // the the treeLineId in question
    const treeLineId = tree.treeLineId

    // peek the length of the tree porps, to get the next number
    const nextNumber = calculatedTreeLineProps.peek().length + 1

    // creaze the properties with defaults
    const props = { id: treeLineId, width: 5, name: `Baumreihe ${nextNumber}`, num: nextNumber }

    // create the new state of the treelineprops
    const newTreeLineProps = [...calculatedTreeLineProps.peek(), {...props}]

    // update the signal
    calculatedTreeLineProps.value = newTreeLineProps
}
// define an effect to add a new treeLineProps whenever a tree is added with an treeLineId that is not yet in the list
effect(() => {
    // whenever rawTreeLocationSeedData changes, we need to check if there are new treeLineIds
    rawTreeLocationSeedData.value.forEach(tree => {
        // get active lines
        const activeLines = calculatedTreeLineProps.peek().map(l => l.id)
        
        // check if the active treeLineIds contain the treeLineId already
        if (!activeLines.includes(tree.treeLineId)) {
            console.log('Added missing treelineprops')
            createMissingTreeLineProps(tree)
        }
    })
})

// define a function to update the properties of a tree line
export const updateTreeLineProps = (lineId: string, props: Partial<TreeLineProperties>) => {
    // get the index of the line in question
    const index = calculatedTreeLineProps.peek().findIndex(l => l.id === lineId)

    // get the current properties
    const currentProps = calculatedTreeLineProps.peek()[index]

    // // update the properties
    const newProps = {...currentProps, ...props, id: lineId}

    // // update the signal
    const newTreeLineProps = [...calculatedTreeLineProps.peek()]
    newTreeLineProps[index] = newProps
    // console.log(newTreeLineProps)
    calculatedTreeLineProps.value = newTreeLineProps

}

// create calculatedTreeLineFeatures from the props. It is possible that we have props, that do not have 
// trees anymore. These are just ignored here
export const calculatedTreeLineFeatures = computed<CalculatedTreeLine["features"]>(() => {
    // container for the line features
    const treeLines: CalculatedTreeLine["features"] = []

    const allTrees = treeLocationFeatures.value
    const allLineProperties = calculatedTreeLineProps.value

    // for each activeTreeLineId and filter all trees that belong to this line
    allLineProperties.forEach(props => {
    //activeTreeLineIds.peek().forEach(lineId => {
        const trees = allTrees.filter(tree => tree.properties.treeLineId === props.id)

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
        
        // build the line stirng
        const line = lineString(orderedTrees.map(tree => tree.geometry.coordinates))
        
        // push the line to the treeLines
        treeLines.push({
            ...line,
            properties: {
                ...props,
                treeCount: trees.length,
                lineLength: length(line, {units: 'meters'})
            }
        })
    })

    return [...treeLines]
})


// build tree line Areas fron the calculatedTreeLineFeatures
export const treeLineAreaFeatures = computed<TreeLineArea["features"]>(() => {
    // get the current line features
    const lines = calculatedTreeLineFeatures.value

    // if there are no lines, return an empty array
    if (lines.length === 0) return []
    
    // map them into buffer of given length
    return lines.map(line => {
        const lineArea = buffer(line, line.properties.width / 2, {units: 'meters'})
        return {
            ...lineArea,
            properties: {
                ...line.properties
            }
        }
        
    })
})

export const treeLineArea = computed<TreeLineArea>(() => {
    return {
        type: 'FeatureCollection',
        features: treeLineAreaFeatures.value
    }
})

// export the agricultural area, which is the difference of the reference area and the treeLine area
export type AgriculturalArea = GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>

export const agriculturalArea = computed<AgriculturalArea>(() => {
    const reference = referenceArea.value
    const treeArea = treeLineArea.value

    // return nothing if any of the above is still empty
    if (reference.features.length === 0) {
        return {type: 'FeatureCollection', features: []}
    }

    // otherwise, union all the tree areas into a Multipolygon
    let lineUnion: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> = {type: 'Feature', geometry: {type: 'Polygon', 'coordinates': []}, properties: {}}
    treeArea.features.forEach(f => lineUnion = union(lineUnion, f) || lineUnion)

    // get the difference between the reference area and the union of treeLines
    const diff = difference(reference.features[0], lineUnion) || reference.features[0]

    // return the collection
    return {
        type: 'FeatureCollection',
        features: [diff]
    }
})

