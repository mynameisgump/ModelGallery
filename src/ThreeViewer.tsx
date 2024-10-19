import { OrbitControls, Gltf, Environment, Bounds, useBounds, useGLTF} from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Group, Object3D, Vector3 } from "three"
import { Box3 } from "three"

type GlbModelProps = {
    name: string
}


const GlbModel = ({name}: GlbModelProps) => {
    const boundsApi = useBounds();    
    const gltf = useGLTF(name);
    const box = new Box3().setFromObject(gltf.scene);
    const groupRef = useRef<Group>(new Group());
    const currentScale = new Vector3(0,0,0);

    boundsApi.refresh(box).fit().clip();

    
    useFrame(() => {
        groupRef.current.scale.copy(currentScale);
        currentScale.lerp(new Vector3(1,1,1), 0.1);
        // console.log(currentScale);
    });

    return (
        <group ref={groupRef}  >
            <primitive object={gltf.scene}></primitive>
            {/* <Gltf src={name} scale={currentScale}></Gltf> */}
        </group>
    );
}

const GalleryController = () => {
    const [selectedModel, setSelectedModel] = useState<string>("Gump.glb");

    const cycleSelectedModel = () => {
        if (selectedModel === "Gump.glb") {
            setSelectedModel("MansonFish.glb")
        } else {
            setSelectedModel("Gump.glb")
        }
    }
    
    return (
        <Bounds maxDuration={0}>
            <group onClick={cycleSelectedModel}>
                <GlbModel name={selectedModel}></GlbModel> 
            </group>
        </Bounds>
    )
}

const ThreeViewer = () => {
    return (
        <Canvas>
            <OrbitControls></OrbitControls>
            <ambientLight  />
            <Environment preset="sunset" />
            {/* <pointLight position={[10, 10, 10]} /> */}
            <GalleryController></GalleryController>
        </Canvas>
    )
}

export default ThreeViewer;