// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 30;

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x64ffda, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Create floating code symbols
const codeSymbols = [];
const symbols = ['<>', '/>', '{;}', '()', '[]', '//'];
const fontLoader = new THREE.FontLoader();

fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    symbols.forEach((symbol, index) => {
        const textGeometry = new THREE.TextGeometry(symbol, {
            font: font,
            size: 1,
            height: 0.2,
        });

        const material = new THREE.MeshStandardMaterial({
            color: 0x64ffda,
            metalness: 0.7,
            roughness: 0.2,
        });

        const textMesh = new THREE.Mesh(textGeometry, material);
        
        textMesh.position.x = Math.random() * 40 - 20;
        textMesh.position.y = Math.random() * 40 - 20;
        textMesh.position.z = Math.random() * 40 - 20;

        codeSymbols.push({
            mesh: textMesh,
            rotationSpeed: Math.random() * 0.01,
            floatSpeed: 0.02 + Math.random() * 0.01
        });

        scene.add(textMesh);
    });
});

// Create connection lines
const connectionLines = [];
const linesMaterial = new THREE.LineBasicMaterial({ color: 0x64ffda, transparent: true, opacity: 0.3 });

function createConnections() {
    codeSymbols.forEach((symbol, index) => {
        for(let i = index + 1; i < codeSymbols.length; i++) {
            if(Math.random() > 0.5) continue;
            
            const geometry = new THREE.BufferGeometry().setFromPoints([
                symbol.mesh.position,
                codeSymbols[i].mesh.position
            ]);
            
            const line = new THREE.Line(geometry, linesMaterial);
            connectionLines.push(line);
            scene.add(line);
        }
    });
}

// Mouse interaction
const mouse = new THREE.Vector2();
const targetRotation = new THREE.Vector2();

document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    targetRotation.x = mouse.y * 0.5;
    targetRotation.y = mouse.x * 0.5;
});

// Animation loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Animate code symbols
    codeSymbols.forEach((symbol, index) => {
        symbol.mesh.rotation.x += symbol.rotationSpeed;
        symbol.mesh.rotation.y += symbol.rotationSpeed;
        symbol.mesh.position.y += Math.sin(time + index) * symbol.floatSpeed;
    });

    // Update connection lines
    connectionLines.forEach(line => {
        line.geometry.verticesNeedUpdate = true;
    });

    // Smooth camera rotation
    camera.rotation.x += (targetRotation.x - camera.rotation.x) * 0.05;
    camera.rotation.y += (targetRotation.y - camera.rotation.y) * 0.05;

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize connections and start animation
setTimeout(createConnections, 1000);
animate();