import { useCallback, useEffect, useState } from "react"
import { useDrag } from "react-dnd"
import { ageToSize, treeIconsLoaded, treeSpecies } from "../../appState/backendSignals"
import { SEASON, currentSeason } from "../../appState/simulationSignals"
import { useSignalEffect } from "@preact/signals-react"


export interface TreeDropProperties {
    treeType: string
    age: number
}


const DraggableTree: React.FC<TreeDropProperties> = ({ treeType, age }) => {
    // get the current source, given the age
    const [src, setSrc] = useState<string>('icons/default-tree.png')
    const [season, setSeason] = useState<SEASON>(currentSeason.peek())
    const [treeShape, setTreeShape] = useState<string>('Form1')

    // listen for changes in the season
    useSignalEffect(() => {
        setSeason(currentSeason.value)
    })

    useEffect(() => {
        // search the list of tree species to figure out the shape
        const shape = treeSpecies.peek().find(species => species.latin_name === treeType)?.shape || 'Form1'
        setTreeShape(shape)
    }, [treeType, treeIconsLoaded.value])

    // listen for changes in the age and treeType
    const updateSrc = useCallback(() => {
        // check if we have a shape
        if (!treeShape) {
            setSrc('icons/default-tree.png')
        } else {
            // translate age to size
            const size = ageToSize(age)
            const newSrc = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/icons/${treeShape}_${size}_${season}.png`
            setSrc(newSrc)
        }
    }, [age, treeShape, season])

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
        <img src={src} ref={drag} style={{opacity: isDragging ? 0.4 : 0.9, width: '50px', height: '50px'}} />
    </>
}

export default DraggableTree