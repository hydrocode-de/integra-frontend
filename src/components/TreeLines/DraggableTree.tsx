import { useEffect, useState } from "react"
import { useDrag } from "react-dnd"
import { loadClosestDataPoint } from "../../appState/backendSignals"


export interface TreeDropProperties {
    treeType: string
    age: number
}


const DraggableTree: React.FC<TreeDropProperties> = ({ treeType, age }) => {
    // get the current source, given the age
    const [src, setSrc] = useState<string>('icons/default-tree.png')

    // listen for changes in the age and treeType
    useEffect(() => {
        const dataPoint = loadClosestDataPoint(treeType, age)
        // console.log(`icons/${dataPoint.filename}`)
        setSrc(`icons/${dataPoint.filename}`)
    }, [age, treeType])

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