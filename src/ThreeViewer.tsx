import { Environment, useGLTF, CameraControls} from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Group, Object3D, SkinnedMesh, Sphere, Vector3 } from "three"
import { useMemo } from "react"
import { useHelper } from "@react-three/drei"
import { BoxHelper } from "three"

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
    const gltf = useGLTF(name);    
    const skinnedMeshes: Array<SkinnedMesh> = [];
    gltf.scene.traverse((child) => {
        if (child.type === "SkinnedMesh") {
            skinnedMeshes.push(child as SkinnedMesh);
        }
    });
    
    // gltf.scene.updateMatrixWorld(true);
    // gltf.scene.matrixWorldAutoUpdate = true
    const box = new Box3().setFromObject(gltf.scene);
    const bsphere = useMemo(() => {return new Sphere()},[]);
    box.getBoundingSphere(bsphere);
    const groupRef = useRef<Group>(new Group());
    const meshRef = useRef<Object3D>(new Object3D());
    const box3 = new Box3().setFromObject(gltf.scene);
    // useHelper(meshRef, BoxHelper, 'cyan');

    const currentScale = new Vector3(0.001,0.001,0.001);
    const [introAnimation,setIntroAnimation] = useState<boolean>(true);


    useEffect(() => {
        if (camControlsRef.current) {
            camControlsRef.current.fitToSphere(bsphere, false);
        }
    }, [box, bsphere]);

    useFrame(() => {
        if (skinnedMeshes.length > 0) {
            skinnedMeshes.forEach((mesh: SkinnedMesh) => {
                mesh.geometry.computeBoundingBox();
                mesh.computeBoundingBox();
                mesh.updateMatrixWorld(true);
                mesh.matrixWorldAutoUpdate = true;
                mesh.matrixWorldNeedsUpdate = true;
                mesh.matrixAutoUpdate = true;
            })
        }
        if (introAnimation) {
            groupRef.current.scale.copy(currentScale);
            groupRef.current.updateMatrixWorld(true);
            groupRef.current.matrixWorldAutoUpdate = true;
            groupRef.current.matrixWorldNeedsUpdate = true;
            groupRef.current.matrixAutoUpdate = true;

            meshRef.current.updateMatrixWorld(true);
            meshRef.current.matrixWorldAutoUpdate = true;
            meshRef.current.matrixWorldNeedsUpdate = true;
            meshRef.current.matrixAutoUpdate = true;
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
        console.log("Cycling model");
        if (selectedModel === "Gump.glb") {
            setSelectedModel("egg.glb")
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