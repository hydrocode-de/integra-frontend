import {  useState } from "react"
import { CalculatedTreeLine, calculatedTreeLineFeatures, calculatedTreeLines, rawTreeFeatures } from "../../appState/treeLocationSignals"
import { useSignalEffect } from "@preact/signals-react"
import cloneDeep from "lodash.clonedeep"

const TreeLinesOverview: React.FC = () => {

    return <>
        {/* THIS LINE crashes the Application
            You CANNOT loop over anything that was derived from a signal anymore
            I don't know why, but that means we kind of have to remove signals altogether?!
        */}
        {/* {calculatedTreeLines.value.features.map(l => <div key={l.id}>{l.id}:</div>)} */}
        
        {/* This line works just fine. We can see the signal beeing updated correctly and the UI 
            responding to that. Just map, forEach over the state of the signal does not work anymore.
            */}
        <pre><code>{ JSON.stringify(calculatedTreeLineFeatures.value, null, 2) }</code></pre>

    </>
}

export default TreeLinesOverview