import { TreeLocation } from "../../appState/treeLine.model"

import { Vector3 } from "three"
import { OrbitControls, useGLTF, Text,  Sky, Sphere, SoftShadows } from "@react-three/drei"

import * as projection from "@turf/projection"
import bbox from "@turf/bbox"

import { treeLocations } from "../../appState/treeLineSignals"
import { batch, signal,  useSignal, useSignalEffect } from "@preact/signals-react"
import Ground from "./GroundLayer"
import {DefaultTreeModel, CommonOakModel} from "./TreeModel"


export const groundTexture = signal<string>("wheat")

useGLTF.preload("/tree.glb")

const AgroforestryScene:React.FC = () => {
    // this should also be handled differently
    // const obj = useGLTF("/tree.glb")

    const features = useSignal<TreeLocation["features"]>([])
    const bounds = useSignal<GeoJSON.BBox>([0, 0, 100, 100])

    const centerTarget = useSignal<Vector3>(new Vector3(0, 0, 0))

    // subscribe to the current treelocations
    useSignalEffect(() => {
        // transform to merctor
        const mercLocations = projection.toMercator(treeLocations.value)

        // get the bounding box in mercator coordiantes
        const box = bbox(mercLocations)
        
        features.value = mercLocations.features.map(f => {
            return {
                ...f,
                geometry: {
                    ...f.geometry,
                    coordinates: [f.geometry.coordinates[0] - box[0], f.geometry.coordinates[1] - box[1]]
                }
            }
        })

        // in a batch operation, update the bounds and the target of the camera
        batch(() => {
            // update the bounding box of the translated and projected locations
            bounds.value = bbox({type: "FeatureCollection", features: features.peek()})

            // get the center of the features
            centerTarget.value = new Vector3(
                bounds.peek()[2] / 2,
                0,
                - bounds.peek()[3] / 2
            )
        })
    })
    

    return <>
        {/* Camera controls */}
        <OrbitControls maxPolarAngle={Math.PI / 2} panSpeed={10} target={centerTarget.value} />

        {/* set general scene lights */}
        <Sky />
        <ambientLight intensity={0.3} />
        <directionalLight intensity={0.5} position={[-5, 20, 5]} />
        <directionalLight intensity={0.5} position={[0, 1, 0]} />
        <SoftShadows />
        
        {/* mark the origin with a blue sphere */}
        <Sphere position={[bounds.value[0], 0, bounds.value[0]]}>
            <meshStandardMaterial color="blue" />
        </Sphere>

        {/* draw the ground */}
        <Ground center={centerTarget.value} scale={[bounds.value[2] + 10, 0.1, bounds.value[3] + 10]} textureUrl={`/3d/textures/${groundTexture.value}.png`} />

        {/* render a heading - replace by the project name */}
        <Text  color="darkgreen" anchorY="bottom" anchorX="center"  position={[bounds.value[2] / 2, 20, -bounds.value[3]]} fontSize={40}>
            Mein Agroforstsystem
        </Text>

        {/* add the trees to the scene */}
        { features.value.map((f, i) => {
            if (f.properties.treeType === 'Eiche') {
                return <CommonOakModel key={i} id={f.id as string} position={[f.geometry.coordinates[0], 0, -f.geometry.coordinates[1]]} height={f.properties.height} />
            } else {
                return <DefaultTreeModel key={i} id={f.id as string} position={[f.geometry.coordinates[0], 0, -f.geometry.coordinates[1]]} height={f.properties.height} />
            }
        })}
    </>
}

export default AgroforestryScene