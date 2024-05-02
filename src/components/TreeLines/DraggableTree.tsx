import { useCallback, useEffect, useState } from "react"
import { useDrag } from "react-dnd"
import { loadClosestDataPoint, treeIconsLoaded } from "../../appState/backendSignals"


export interface TreeDropProperties {
    treeType: string
    age: number
}


const DraggableTree: React.FC<TreeDropProperties> = ({ treeType, age }) => {
    // get the current source, given the age
    const [src, setSrc] = useState<string>('icons/default-tree.png')

    // listen for changes in the age and treeType
    const updateSrc = useCallback(() => {
        const dataPoint = loadClosestDataPoint(treeType, age)
        
        // set if there is a filename
        // TODO: this is sometimes undefined, no idea why 
        if (dataPoint.filename!) {
            setSrc(`icons/${dataPoint.filename}`)
        }
    }, [age, treeType])

    useEffect(() => {
        updateSrc()
    }, [updateSrc, treeIconsLoaded.value])

    // run only once on startup
    //useEffect(() => updateSrc(), [])

    // get the drag and drop handler
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'tree',
        item: () => ({ treeType: treeType, }),
        collect: monitor => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
        
    }))

    return <>
        <img src={src} ref={drag} style={{opacity: isDragging ? 0.4 : 0.9}} />
    </>
}

export default DraggableTree