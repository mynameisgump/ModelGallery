import { Environment, useGLTF, CameraControls} from "@react-three/drei"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Group, Mesh, Object3D, SkinnedMesh, Sphere, Vector3 } from "three"
import { useMemo } from "react"
import { useHelper } from "@react-three/drei"
import { BoxHelper } from "three"
import { STLLoader } from "three/examples/jsm/Addons.js"

import { Box3 } from "three"
type GlbModelProps = {
    name: string
}



const GlbModel = ({name}: GlbModelProps) => {
    const camControlsRef = useRef<CameraControls>(null);
    // const [meshVisible, setMeshVisible] = useState<boolean>(false);
    const [prevName, setPrevName] = useState(name);
    if (prevName !== name) {
        setPrevName(name);
        // setMeshVisible(false);
    }
    const gltf = useLoader(STLLoader, name);
    // const skinnedMeshes: Array<SkinnedMesh> = [];
    // gltf.traverse((child) => {
    //     if (child.type === "SkinnedMesh") {
    //         skinnedMeshes.push(child as SkinnedMesh);
    //     }
    // });
    
    // gltf.scene.updateMatrixWorld(true);
    // gltf.scene.matrixWorldAutoUpdate = true
    gltf.computeBoundingBox();
    gltf.computeBoundingSphere();
    // gltf.rotateZ(-Math.PI / 2);
    const box = gltf.boundingBox as Box3;
    const bsphere = gltf.boundingSphere as Sphere;
    console.log(bsphere)
    // box.getBoundingSphere(bsphere);
    
   
    const groupRef = useRef<Group>(new Group());
    const meshRef = useRef<Mesh>(new Mesh());
    // useHelper(meshRef, BoxHelper, 'cyan');

    const currentScale = new Vector3(0.001,0.001,0.001);
    const [introAnimation,setIntroAnimation] = useState<boolean>(true);


    useEffect(() => {
        if (camControlsRef.current) {
            camControlsRef.current.fitToSphere(bsphere, false);
        }
    }, [bsphere]);

    useFrame(() => {
        if (introAnimation) {
            groupRef.current.scale.copy(currentScale);
            currentScale.lerp(new Vector3(1,1,1), 0.1);
        }
    });

    return (
        <group ref={groupRef}>
            <mesh rotation={[-Math.PI / 2,0,0]} onPointerEnter={()=>{console.log("Testing")}} ref={meshRef} geometry={gltf}></mesh>
            <CameraControls ref={camControlsRef} makeDefault/>
        </group>
    );
}

const GalleryController = () => {
    const [selectedModel, setSelectedModel] = useState<string>("2022.stl");

    
    const cycleSelectedModel = () => {
        console.log("Cycling model");
        if (selectedModel === "2022.stl") {
            setSelectedModel("2023.stl")
        } else {
            setSelectedModel("2022.stl")
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