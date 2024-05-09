/**
 * Add the state of computed tree line features
 * 
 * These lines are a signal of its own but use an effect to update the geometry of the line
 * This way, a change in the tree location will effect the line, but the line can also hold line data
 * which can be changed independently of the tree locations. (like its width or usage)
 */
import { computed, effect, signal } from "@preact/signals-react"
import { CalculatedTreeLine, RawTreeLocation, TreeLineProperties } from "./tree.model"
import { activeTreeLineIds, rawTreeLocationSeedData } from "./treeLocationSignals"
import { treeLocationFeatures } from "./geoJsonSignals"
import center from "@turf/center"
import distance from "@turf/distance"
import length from "@turf/length"
import { lineString } from "@turf/helpers"






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



