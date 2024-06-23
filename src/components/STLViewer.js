import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

const STLViewer = ({ fileContent }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const width = Math.min(400, window.innerWidth - 80); // Adjust for mobile
        const height = 300;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(width, height);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        mountRef.current.appendChild(renderer.domElement);

        // Gradient background
        const vertexShader = `
            varying vec3 vPosition;
            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec3 vPosition;
            void main() {
                vec3 topColor = vec3(0.5, 0.7, 1.0); // Light blue
                vec3 bottomColor = vec3(1.0, 1.0, 1.0); // White
                float h = normalize(vPosition).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, h), 1.0);
            }
        `;

        const uniforms = {};
        const backgroundMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            side: THREE.BackSide,
        });

        const backgroundGeometry = new THREE.SphereGeometry(500, 32, 32);
        const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        scene.add(backgroundMesh);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight1.position.set(1, 1, 1);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight2.position.set(-1, -1, -1);
        scene.add(directionalLight2);

        // Add point light for specular highlights
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(0, 5, 0);
        scene.add(pointLight);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Load the model
        const loader = new STLLoader();
        const geometry = loader.parse(fileContent);

        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(1, 1, 0).convertSRGBToLinear(),
            roughness: 0.1,
            metalness: 0,
            envMapIntensity: 1,
            emissive: new THREE.Color(1, 0.7, 0.2).convertSRGBToLinear(),
            emissiveIntensity: 0.2,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Center the model
        const box = new THREE.Box3().setFromObject(mesh);
        const center = box.getCenter(new THREE.Vector3());
        mesh.position.sub(center);

        // Adjust camera
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.1; // Zoom in a bit more
        camera.position.set(cameraZ, cameraZ, cameraZ);
        camera.lookAt(0, 0, 0);

        // Update the camera's near and far planes
        camera.near = cameraZ / 100;
        camera.far = cameraZ * 100;
        camera.updateProjectionMatrix();

        // Update controls

        controls.maxDistance = cameraZ * 2;
        controls.target.set(0, 0, 0);
        controls.update();

        // Render loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resizing
        const handleResize = () => {
            const width = Math.min(400, window.innerWidth - 40);
            const height = 300;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [fileContent]);

    return <div ref={mountRef} />;
};

export default STLViewer;
