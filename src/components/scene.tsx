import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { updatingAtom } from "../atoms/updating";
import { functionAtom } from "../atoms/function";

export default function ThreeScene() {

    const canvasRef = useRef<any>(null);

    const [functione] = useAtom(functionAtom)
    const [lineSize, setLineSize] = useState(0);
    const [updating] = useAtom(updatingAtom);

    const numbers = [0,1,2,3,4,5,6,7,8,9];

    function calculateFunc(xValue: number) {
        const splitted = functione.split("");
        let result = 0;
    
        // Step 2: Loop through the characters to handle terms
        //assume first var is x and second is y
        for (let i = 0; i < splitted.length; i++) {
            const char = splitted[i];
    
            // Check if the character is 'x'
            if (char === "x") {
                // Look for a possible coefficient (e.g., '2x', '-x')
                let coefficient = 1; // Default coefficient for 'x' is 1
                if (i > 0 && splitted[i - 1] !== '+' && splitted[i - 1] !== '-' && splitted[i - 1] !== ' ') {
                    // If there's a number before 'x', use it as the coefficient
                    const prevChar = splitted[i - 1];
                    coefficient = parseFloat(prevChar);
                }
                // Add the term (coefficient * x^2) to the result
                result += coefficient * Math.pow(xValue, 2);
            }
            // If the character is a number or operator, handle accordingly (e.g., constants or operations)
            else if (!isNaN(parseFloat(char))) {
                result += parseFloat(char);
            }
        }
    
        return result;
    }

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
        camera.position.set(25,25,25);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias:  true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        //check if current already exists:
        if (canvasRef.current && canvasRef.current.firstChild) {
            canvasRef.current.removeChild(canvasRef.current.firstChild);
        }
        canvasRef.current.appendChild(renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 0.1);
        light.position.set(7, 3, 3);
        scene.add(light);

        const graphLength = 10;

        function createVectorLines(size: number) {
            setLineSize(size);
            const geometry = new THREE.BufferGeometry();
            const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
            const vectors = [];

            //calculate positions
            //first we have the x which is:
            vectors.push(new THREE.Vector3(0, 0, 0));
            vectors.push(new THREE.Vector3(size, 0, 0)); //could be 10,0,0
            //we have to calculate the y which is 90 degrees on the xy plane
            vectors.push(new THREE.Vector3(0, 0, 0));
            vectors.push(new THREE.Vector3(0, size, 0));
            vectors.push(new THREE.Vector3(0, 0, 0));
            vectors.push(new THREE.Vector3(0, 0, size));

            geometry.setFromPoints( vectors );
            const line = new THREE.Line(geometry, material);
            scene.add( line );

            //create the grids
            const gridHelper = new THREE.GridHelper(size * 2, size * 2);
            scene.add(gridHelper);
        }

        createVectorLines(graphLength);

        //add orbit controls
        const orbit = new OrbitControls(camera, renderer.domElement);
        orbit.enableDamping = true;

        //then render
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        function updateGraphWithFunction() {
            //start with discrete first and 2d 
            const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
            const geometry = new THREE.BufferGeometry();
            let vertices = [];
            //calculate x and y:
            const x = [- graphLength / 2, (graphLength / 2)];
            const y = [- graphLength / 2, (graphLength / 2)];
            console.log(x);
            const step = 0.03;
            //nested for loop to take care of every point
            for (let i = x[0]; i < x[1]; i +=step) {
                for (let j = y[0]; j < y[1]; j+=step) {
                    //sinxcosy for now:
                    let z = Math.sin(j) * Math.cos(i);
                    //push function inside vertices 
                    console.log(z);
                    vertices.push(i,j,z);
                }
            }
            //render
            geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 5));
            //then mesh
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
        }

        if (updating) {
            updateGraphWithFunction();
        }
        animate();
    }, [updating]);

    return (
        <main ref={canvasRef}>

        </main>
    )
} 