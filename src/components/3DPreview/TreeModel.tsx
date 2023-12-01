import { useFBX, useGLTF } from "@react-three/drei"
import { Vector3 } from "@react-three/fiber"

// preload the models as soon as possible
useGLTF.preload('/3d/models/default_tree.glb')
useFBX.preload('/3d/models/common_oak.fbx')

// The default tree model
export const DefaultTreeModel: React.FC<{id: string, position: Vector3, height?: number}> = ({id, position, height }) => {
    const obj = useGLTF('/3d/models/default_tree.glb')

    return (
        <group key={id}>
            <primitive 
                object={obj.scene.clone()}
                position={position}
                scale={1.0 * (height || 1.0)}
            />
        </group>
    )
}


export const CommonOakModel: React.FC<{id: string, position: Vector3, height?: number}> = ({id, position, height }) => {
    const obj = useFBX('/3d/models/common_oak.fbx')

    return (
        <group key={id}>
            <primitive 
                object={obj.clone()}
                position={position}
                scale={0.01 * (height || 1.0)}
            />
        </group>
    )
}
