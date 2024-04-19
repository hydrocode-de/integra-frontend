import { useDrag } from "react-dnd"


export interface TreeDropProperties {
    treeType: string
    treeLineId: string
    age: number
    harvestAge?: number
}
interface DraggableTreeItem extends TreeDropProperties {
    src: string
}

const DraggableTree: React.FC<DraggableTreeItem> = ({ src, treeType, treeLineId, age, harvestAge }) => {

    // get the drag and drop handler
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'tree',
        item: { treeType, treeLineId, age, harvestAge },
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