import { useTexture } from "@react-three/drei"
import { Vector3 } from "@react-three/fiber"
import { RepeatWrapping } from "three"

const Ground: React.FC<{center: Vector3, scale: [number, number, number], textureUrl: string}> = ({ center, scale, textureUrl }) => {
    const texture = useTexture(textureUrl)
    texture.repeat.set(10, 10)
    texture.wrapS = texture.wrapT = RepeatWrapping
    
    return <>
    <mesh position={center}>
        <boxGeometry args={[...scale, 10, 10, 1]}  />
        <meshStandardMaterial map={texture}  toneMapped={false}  />
    </mesh>
    </>
}

export default Ground