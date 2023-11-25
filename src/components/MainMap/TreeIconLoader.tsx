import { useSignalEffect } from "@preact/signals-react"
import { useMap } from "react-map-gl"
import { treeIconStore } from "../../appState/backendSignals"

const TreeIconLoader: React.FC = () => {
    // use a reference to the map
    const map = useMap()

    useSignalEffect(() => {
        // HERE WE JUST ASSUME THE MAP IS ALREADY LOADED WHEN ALL IMAGES ARRIVE
        // THIS COULD CAUSE TROUBLE IN THE FUTURE
        // to fix we need to mix useEffect and useSignalEffect 
        if (!map.current) {
            console.log("TreeIconLoader - Abort. Map not loaded yet")
            return
        } else {
            Object.entries(treeIconStore.value).forEach(([iconId, imgInfo]) => {
                // it is important to check that the image does not exist, because the the effect could run twice
                if (!map.current?.hasImage(iconId)) {
                    map.current?.addImage(iconId, imgInfo.icon)
                    //console.log(`add ${iconId}`)
                }
            })
            //console.log(treeIconStore.peek())
        }
    })
    return <></>
}

export default TreeIconLoader