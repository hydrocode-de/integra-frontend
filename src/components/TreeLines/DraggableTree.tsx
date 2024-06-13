import { useCallback, useEffect, useState } from "react"
import { useDrag } from "react-dnd"
import { ageToSize, germanSpecies, treeIconsLoaded, treeSpecies } from "../../appState/backendSignals"
import { SEASON, getSeason, seasonMonth } from "../../appState/simulationSignals"
import { useSignalEffect } from "@preact/signals-react"
import { Tooltip } from "@mui/material"


export interface TreeDropProperties {
    treeType: string
    age: number
}


const DraggableTree: React.FC<TreeDropProperties> = ({ treeType, age }) => {
    // get the current source, given the age
    const [src, setSrc] = useState<string>('icons/default-tree.png')
    const [season, setSeason] = useState<SEASON>('summer')
    const [iconAbbrev, setIconAbbrev] = useState<string>('')

    // we need to translate from preact-signals to react useEffect by hand here
    const [iconsLoaded, setIconsLoaded] = useState<boolean>(treeIconsLoaded.peek())
    useSignalEffect(() => {
        setIconsLoaded(treeIconsLoaded.value)
    })

    // listen for changes in the season
    useSignalEffect(() => {
        // listen to changes in the current month
        const month = seasonMonth.value
        
        // determine the season and set to state
        const currentSeason = getSeason(month, treeType, age)
        setSeason(currentSeason)
    })

    useEffect(() => {
        // make react happy
        if (!iconsLoaded) return
        // search the list of tree species to figure out the shape
        const icon = treeSpecies.peek().find(species => species.latin_name === treeType)?.icon_abbrev || ''
        setIconAbbrev(icon)
    }, [treeType, iconsLoaded])

    // listen for changes in the age and treeType
    const updateSrc = useCallback(() => {
        // check if we have a shape
        if (!iconAbbrev || iconAbbrev === '') {
            setSrc('icons/default-tree.png')
        } else {
            // translate age to size
            const size = ageToSize(age)
            const newSrc = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/icons/${size}_${season}_${iconAbbrev}.png`
            setSrc(newSrc)
        }
    }, [age, iconAbbrev, season])

    useEffect(() => {
        if (!iconsLoaded) return
        updateSrc()
    }, [updateSrc, iconsLoaded])

    // get the drag and drop handler
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'tree',
        item: () => ({ treeType: treeType, }),
        collect: monitor => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
        
    }), [treeType])

    return <>
        <Tooltip title={germanSpecies.value[treeType]}>
        <img src={src} ref={drag} style={{opacity: isDragging ? 0.4 : 0.9, width: '50px', height: '50px'}} alt="" />
        </Tooltip>
    </>
}

export default DraggableTree