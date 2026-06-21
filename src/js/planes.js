const planeCount = 10;
const planes = [];
let container;

setTimeout(function createPlanes() {
  container = document.getElementById('plane-container')
  const emoji = container.getAttribute('emoji');
  if (emoji != "null") {
  planes.length = 0; // vorherige löschen, falls resize
  container.innerHTML = '';
  
  for (let i = 0; i < planeCount; i++) {
    const plane = document.createElement('div');
    plane.className = 'plane';
    plane.textContent = emoji;
    container.appendChild(plane);

    planes.push({
      element: plane,
      x: Math.random() * container.clientWidth,
      y: Math.random() * container.clientHeight,
      speedX: (Math.random() * 2 - 1) * 0.5,
      speedY: (Math.random() * 2 - 1) * 0.5
    });
  }
  }
}, 1000);

function animatePlanes() {
  planes.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;

    // innerhalb des Containers abprallen
    if (p.x < 0 || p.x > container.clientWidth - 24) p.speedX *= -1;
    if (p.y < 0 || p.y > container.clientHeight - 24) p.speedY *= -1;

    p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
  });

  requestAnimationFrame(animatePlanes);
}

//createPlanes();
animatePlanes();

// Resize Event: Containergröße passt sich an
window.addEventListener('resize', () => {
  createPlanes(); // Flugzeuge neu erstellen, damit alles im Container bleibt
});