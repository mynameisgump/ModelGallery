import { OrbitControls, Gltf, Environment, Bounds, useBounds, useGLTF, meshBounds, useHelper, Bvh, CameraControls} from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useCallback, useEffect, useRef, useState } from "react"
import { BoxHelper, Group, Object3D, Vector3, BoxGeometry, MeshBasicMaterial } from "three"

import { Box3 } from "three"
type GlbModelProps = {
    name: string
}

const GlbModel = ({name}: GlbModelProps) => {
    const camControlsRef = useRef<CameraControls>(null);
    const [meshVisible, setMeshVisible] = useState<boolean>(false);
    const [prevName, setPrevName] = useState(name);
    if (prevName !== name) {
        setPrevName(name);
        setMeshVisible(false);
    }

    // const boundsApi = useBounds();
    const gltf = useGLTF(name);
    
    gltf.scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(gltf.scene);
    const groupRef = useRef<Group>(new Group());
    const meshRef = useRef<Object3D>(new Object3D());

    const currentScale = new Vector3(0,0,0);
    const [introAnimation, setIntroAnimation] = useState<boolean>(true);


    useEffect(() => {
        if (camControlsRef.current) {
            camControlsRef.current.fitToBox(box, false);
        }
    }, [box]);

    useFrame(() => {
        if (introAnimation) {
            console.log("Why")
            groupRef.current.scale.copy(currentScale);
            currentScale.lerp(new Vector3(1,1,1), 0.1);
            
        }
        setMeshVisible(true);
    });

    return (
        <group visible={meshVisible} ref={groupRef}>
            <primitive onPointerEnter={()=>{console.log("Testing")}} ref={meshRef} object={gltf.scene}></primitive>
            <CameraControls ref={camControlsRef} makeDefault/>
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
        // <Bounds maxDuration={0}>
            <group onPointerDown={(e)=>{e.stopPropagation(); cycleSelectedModel();}}>
                <GlbModel name={selectedModel}></GlbModel> 
            </group>
        // </Bounds>
    )
}

const ThreeViewer = () => {
    return (
        <Canvas>
            {/* <OrbitControls></OrbitControls> */}
            {/* <CameraControls makeDefault></CameraControls> */}
            <ambientLight  />
            <Environment preset="sunset" />
            <GalleryController></GalleryController>
        </Canvas>
    )
}

export default ThreeViewer;