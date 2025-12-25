
AOS.init({
    duration: 1000,
    easing: 'ease-out-cubic',
    once: true
});

const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");
const hoverTargets = document.querySelectorAll(".hover-target, a, button, input, textarea");

window.addEventListener("mousemove", function(e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});


hoverTargets.forEach(el => {
    el.addEventListener("mouseenter", () => {
        document.body.classList.add("hovering");
    });
    el.addEventListener("mouseleave", () => {
        document.body.classList.remove("hovering");
    });
});


const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xc0c0c0,
    transparent: true,
    opacity: 0.8,
});

const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

camera.position.z = 3;

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = mouseY * 0.5;
    particlesMesh.rotation.y += mouseX * 0.5;
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const cards = document.querySelectorAll('.tilt-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

const contactForm = document.getElementById('contactForm');
const statusMessage = document.getElementById('statusMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const data = new FormData(contactForm);
        const btn = document.querySelector('.submit-btn');
        const originalBtnText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.style.opacity = '0.7';

        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                statusMessage.innerText = "Message sent successfully! I will reply soon.";
                statusMessage.style.color = "#c0c0c0";
                contactForm.reset();
            } else {
                const errorData = await response.json();
                if (Object.hasOwn(errorData, 'errors')) {
                    statusMessage.innerText = errorData["errors"].map(error => error["message"]).join(", ");
                } else {
                    statusMessage.innerText = "Oops! There was a problem sending your form.";
                }
                statusMessage.style.color = "red";
            }
        } catch (error) {
            statusMessage.innerText = "Error: Could not connect to the server.";
            statusMessage.style.color = "red";
        } finally {
            btn.innerText = originalBtnText;
            btn.style.opacity = '1';
        }
    });
}


const typedTextSpan = document.querySelector(".typewriter-text");
const textArray = ["Shaswat Kumar", "a Developer", "an Engineer", "an Innovator"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } else {
    textArrayIndex++;
    if (textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, typingDelay + 1100);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  if(textArray.length) setTimeout(type, newTextDelay + 250);
});