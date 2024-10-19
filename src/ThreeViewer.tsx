import { Box, OrbitControls, Torus } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useState } from "react"

type GlbModelProps = {
    name: string
}

const GlbModel = ({name}: GlbModelProps) => {
    
    if (name === "Box") {
        return (
            <Box></Box>
        )
    }
    if (name === "Torus") {
        return (
            <Torus></Torus>
        )
    }
}

const GalleryController = () => {
    const [selectedModel, setSelectedModel] = useState<string>("Box");

    const cycleSelectedModel = () => {
        if (selectedModel === "Box") {
            setSelectedModel("Torus")
        } else {
            setSelectedModel("Box")
        }
    }

    return (
        <group onClick={cycleSelectedModel}>
            <GlbModel name={selectedModel}></GlbModel> 
        </group>
    )
}

const ThreeViewer = () => {
    return (
        <Canvas>
            <OrbitControls></OrbitControls>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <GalleryController></GalleryController>
        </Canvas>
    )
}

export default ThreeViewer;