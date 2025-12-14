// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-out-cubic',
    once: true
});

// --- 1. Three.js Particle Background ---
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15; // Spread
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material - Silver/Blueish
const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xc0c0c0,
    transparent: true,
    opacity: 0.8,
});

const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

camera.position.z = 3;

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate entire system slowly
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = mouseY * 0.5;
    particlesMesh.rotation.y += mouseX * 0.5;

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}
animate();

// Resize Handle
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- 2. 3D Tilt Effect for Cards ---
const cards = document.querySelectorAll('.tilt-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});


// --- 3. Contact Form Handling (Supabase/Firebase Placeholder) ---
// Note: To make this functional, you need to Initialize Supabase.
// See README.md for instructions.

const contactForm = document.getElementById('contactForm');
const statusMessage = document.getElementById('statusMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const btn = document.querySelector('.submit-btn');

    btn.innerText = 'Sending...';
    btn.style.opacity = '0.7';

    // --- SUPABASE INTEGRATION START ---
    // Uncomment and fill these in after setting up Supabase

    const { createClient } = supabase;
    const supabaseUrl = 'https://wbrmmhcqiclhdkspmhrz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indicm1taGNxaWNsaGRrc3BtaHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MjYwMTUsImV4cCI6MjA4MTMwMjAxNX0.etQkCdZOuQlQOO1MSTNkPBqgkSfh661TD-y588JRYoA';
    const _supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await _supabase
        .from('messages') // Ensure you created a 'messages' table
        .insert([{ name, email, message }]);

    if (error) {
        statusMessage.innerText = "Error sending message. Please try again.";
        statusMessage.style.color = "red";
    } else {
        statusMessage.innerText = "Message sent successfully! I will reply soon.";
        statusMessage.style.color = "#c0c0c0";
        contactForm.reset();
    }

    // --- SUPABASE INTEGRATION END ---

    // Simulation for display purposes (Remove this block when backend is active)
    setTimeout(() => {
        statusMessage.innerText = "Message sent successfully! (Demo Mode)";
        statusMessage.style.color = "#c0c0c0";
        contactForm.reset();
        btn.innerText = 'Send Message';
        btn.style.opacity = '1';
    }, 1500);
});