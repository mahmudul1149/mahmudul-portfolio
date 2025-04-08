// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 30;

// Enhanced lighting
const ambientLight = new THREE.AmbientLight(0x64ffda, 0.4);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x64ffda, 1);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xe2e8f0, 0.8);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x64ffda,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create floating shapes
const shapes = [];
const geometries = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1, 0)
];

for(let i = 0; i < 15; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x64ffda,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    
    const radius = 15 + Math.random() * 10;
    const angle = (i / 15) * Math.PI * 2;
    
    mesh.position.x = Math.cos(angle) * radius;
    mesh.position.y = (Math.random() - 0.5) * 20;
    mesh.position.z = Math.sin(angle) * radius;
    mesh.scale.setScalar(1 + Math.random());

    shapes.push({
        mesh,
        rotationSpeed: 0.002 + Math.random() * 0.002,
        orbitSpeed: 0.0005 + Math.random() * 0.0005,
        initialAngle: angle,
        radius,
        floatSpeed: 0.01 + Math.random() * 0.005
    });

    scene.add(mesh);
}

// Mouse interaction
const mouse = new THREE.Vector2();

document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    camera.position.x += (mouse.x * 8 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 8 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
});

// Animation
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.001;

    // Animate particles
    particlesMesh.rotation.y = time * 0.1;
    particlesMesh.rotation.x = time * 0.15;

    // Animate shapes
    shapes.forEach((shape, i) => {
        const angle = shape.initialAngle + time * shape.orbitSpeed;
        
        shape.mesh.position.x = Math.cos(angle) * shape.radius;
        shape.mesh.position.z = Math.sin(angle) * shape.radius;
        shape.mesh.position.y += Math.sin(time * 2 + i) * shape.floatSpeed;
        
        shape.mesh.rotation.x += shape.rotationSpeed;
        shape.mesh.rotation.y += shape.rotationSpeed;
        
        // Pulse effect
        const scale = 1 + Math.sin(time * 3 + i) * 0.1;
        shape.mesh.scale.setScalar(scale);
    });

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();