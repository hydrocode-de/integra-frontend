import { Typography } from "@mui/material"
import { activeTreeLineIds, editTreeLineId, treeFeatures } from "../../appState/treeLocationSignals"
import { useSignal, useSignalEffect } from "@preact/signals-react"

interface TreeLineSummary {
    id: string
    lineLength?: number
    treeCount: number
    averageAge?: number

}

const TreeLinesOverview: React.FC = () => {
    // create a state to handle the line calculations
    const treeLines = useSignal<TreeLineSummary[]>([])

    useSignalEffect(() => {
        const lines: TreeLineSummary[] = []
        const allTrees = treeFeatures.value

        activeTreeLineIds.peek().forEach(lineId => {
            const trees = allTrees.filter(t => t.properties.treeLineId === lineId)

            lines.push({
                id: lineId,
                treeCount: trees.length,
                averageAge: trees.reduce((acc, t) => acc + t.properties.age!, 0) / trees.length
            })
        })

        treeLines.value = lines
    })

    return <>
        <Typography variant="body2">
            aktuelle Reihe: { treeLines.value.map(l => l.id).includes(editTreeLineId.value) ? editTreeLineId.value : <i>neue Linie anlegen</i>}
        </Typography>
        {/* THIS LINE crashes the Application
            You CANNOT loop over anything that was derived from a signal anymore
            I don't know why, but that means we kind of have to remove signals altogether?!
        */}
        {/* { calculatedTreeLineFeatures.value.map(f => <div key={f.properties.id}>{f.properties.lineLength}</div>) } */}
        {/* {treeLocations.value.features.map(l => <div key={l.id}>{l.id}:</div>)} */}
        { treeLines.value.map(l => <div key={l.id}>Reihe <i>{l.id}</i>: {l.treeCount} Bäume ({l.averageAge?.toFixed(1)} Jahre)</div>) }
        
        {/* This line works just fine. We can see the signal beeing updated correctly and the UI 
            responding to that. Just map, forEach over the state of the signal does not work anymore.
            */}
        {/* <pre><code>{ JSON.stringify(calculatedTreeLineFeatures.value, null, 2) }</code></pre> */}
        {/* <pre><code>{ JSON.stringify(treeLines.value, null, 2) }</code></pre> */}

    </>
}

export default TreeLinesOverview