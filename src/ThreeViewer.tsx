import { Environment, useGLTF, CameraControls} from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Group, Object3D, SkinnedMesh, Sphere, Vector3 } from "three"
import { useMemo } from "react"
import { Box3 } from "three"

type GlbModelProps = {
    name: string
}

const GlbModel = ({name}: GlbModelProps) => {
    const camControlsRef = useRef<CameraControls>(null);
    const [prevName, setPrevName] = useState(name);
    const [currentName, setCurrentName] = useState(name);
    const [modelState, setModelState] = useState<string>("intro");
    
    if (prevName !== name) {
        setPrevName(name);
    };
    const gltf = useGLTF(name);    
    const skinnedMeshes: Array<SkinnedMesh> = [];
    gltf.scene.traverse((child) => {
        if (child.type === "SkinnedMesh") {
            skinnedMeshes.push(child as SkinnedMesh);
        }
    });

    const box = new Box3().setFromObject(gltf.scene);
    const bsphere = useMemo(() => {return new Sphere()},[]);
    box.getBoundingSphere(bsphere);
    const groupRef = useRef<Group>(new Group());
    const meshRef = useRef<Object3D>(new Object3D());

    const currentScale = new Vector3(0.001,0.001,0.001);
    const [introAnimation, setIntroAnimation] = useState<boolean>(true);

    useEffect(() => {
        if (camControlsRef.current) {
            camControlsRef.current.fitToSphere(bsphere, false);
        }
    }, [box, bsphere]);

    useFrame(() => {
        if (introAnimation) {
            groupRef.current.scale.copy(currentScale);
            currentScale.lerp(new Vector3(1,1,1), 0.1);
        }
    });

    return (
        <group ref={groupRef}>
            <primitive onPointerEnter={()=>{console.log("Testing")}} ref={meshRef} object={gltf.scene}></primitive>
            <CameraControls ref={camControlsRef} makeDefault/>
        </group>
    );
}

const GalleryController = () => {
    const [selectedModel, setSelectedModel] = useState<string>("MansonFish.glb");

    const cycleSelectedModel = () => {
        if (selectedModel === "Gump.glb") {
            setSelectedModel("MansonFish.glb")
        } else {
            setSelectedModel("Gump.glb")
        }
    };
    
    return (
        <group onPointerDown={(e)=>{e.stopPropagation(); cycleSelectedModel();}}>
            <GlbModel name={selectedModel}></GlbModel> 
        </group>
    )
}

const ThreeViewer = () => {
    return (
        <Canvas>
            <ambientLight  />
            <Environment preset="sunset" />
            <GalleryController></GalleryController>
        </Canvas>
    )
}

export default ThreeViewer;