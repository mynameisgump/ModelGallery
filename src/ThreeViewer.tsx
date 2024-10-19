import { OrbitControls, Gltf, Environment, Bounds, useBounds, useGLTF, meshBounds, useHelper, Bvh} from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useCallback, useEffect, useRef, useState } from "react"
import { BoxHelper, Group, Object3D, Vector3, BoxGeometry, MeshBasicMaterial } from "three"
import { Box3 } from "three"
type GlbModelProps = {
    name: string
}

const GlbModel = ({name}: GlbModelProps) => {
    const boundsApi = useBounds();
    const gltf = useGLTF(name);
    gltf.scene.visible = false;
    gltf.scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(gltf.scene);
    const groupRef = useRef<Group>(new Group());
    const meshRef = useRef<Object3D>(new Object3D());

    const currentScale = new Vector3(0,0,0);
    const [meshVisible, setMeshVisible] = useState<boolean>(false);
    const [introAnimation, setIntroAnimation] = useState<boolean>(false);

    useEffect(() => {
        console.log("Refresh")
        // boundsApi.refresh(box).fit().clip();

        
        gltf.scene.visible = true;
        //setMeshVisible(true);
    }, [box, boundsApi]);

    useFrame(() => {

        if (introAnimation) {
            groupRef.current.scale.copy(currentScale);
            currentScale.lerp(new Vector3(1,1,1), 0.1);
        }
    });

    return (
        <group ref={groupRef}>
            <primitive onPointerEnter={()=>{console.log("Testing")}} ref={meshRef} object={gltf.scene}></primitive>
        </group>
    );
}

const GalleryController = () => {
    const [selectedModel, setSelectedModel] = useState<string>("MansonFish.glb");

    
    const cycleSelectedModel = () => {
        console.log("Cycling model");
        if (selectedModel === "Gump.glb") {
            setSelectedModel("MansonFish.glb")
        } else {
            setSelectedModel("Gump.glb")
        }
    };
    
    return (
        <Bounds maxDuration={0}>
            <group onPointerDown={(e)=>{e.stopPropagation(); cycleSelectedModel();}}>
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
            <GalleryController></GalleryController>
        </Canvas>
    )
}

export default ThreeViewer;