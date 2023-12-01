import { Card, CardActionArea, CardContent, CardMedia, MenuList, Popover, Typography } from "@mui/material"
import { useSignal } from "@preact/signals-react"
import { useRef } from "react"

import { groundTexture } from "./AgroforestryScene"

const availableTextures = [
    {name: "Weizenkultur", texture: "wheat"},
    {name: "Gras", texture: "grass"},
    {name: "Brachfläche", texture: "dirt"},
]

const GroundLayerSwitch: React.FC = () => {
    // state to manage the current state
    const open = useSignal<boolean>(false)
    const anchorRef = useRef<HTMLButtonElement>(null)
    
    const toggleMenu = () => {
        open.value = !open.peek()
    }

    const onSelect = (textureName: string) => {
        if (groundTexture.peek() !== textureName) {
            groundTexture.value = textureName
        }
        open.value = false
    }

    return <>
        <CardActionArea onClick={toggleMenu} ref={anchorRef}>
            <img src={`/3d/textures/${groundTexture.value}.png`} style={{objectFit: 'cover', width: '100%', height: '100%', cursor: 'pointer'}} />
        </CardActionArea>
        <Popover 
            open={open.value} 
            anchorEl={anchorRef.current}
            anchorOrigin={{vertical: 'top', horizontal: 'left'}}
            transformOrigin={{vertical: 'bottom', horizontal: 'left'}}
            onClose={() => open.value = false}
        >
            <MenuList sx={{p: 1}}>
                { availableTextures.map((opt, i) => {
                    return (
                        <Card key={i} sx={{mt: 1}}>
                            <CardActionArea onClick={() => onSelect(opt.texture)} disabled={opt.texture===groundTexture.value}>
                            <CardMedia sx={{height: '90px'}} image={`/3d/textures/${opt.texture}.png`} />
                            <CardContent>
                                <Typography variant="body2" sx={{textAlign: 'center'}}>{opt.name}</Typography>
                            </CardContent>
                            </CardActionArea>
                        </Card>
                    )
                }) }
            </MenuList>
        </Popover>

    </>
}

export default GroundLayerSwitch