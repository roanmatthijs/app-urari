(function() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const LAYERS = [0.3, 0.6, 1];
  const STAR_COUNT = 120;
  const stars = [];

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      const depth = LAYERS[Math.floor(Math.random() * LAYERS.length)];
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: depth,
        r: Math.random() * 1.2 + 0.2
      });
    }
  }

  let pointerX = 0;
  let pointerY = 0;
  let scrollFactor = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initStars();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    for (const s of stars) {
      const offsetX = pointerX * s.z * 20;
      const offsetY = pointerY * s.z * 20 + scrollFactor * s.z * 50;
      let x = (s.x + offsetX) % width;
      if (x < 0) x += width;
      let y = (s.y + offsetY) % height;
      if (y < 0) y += height;
      ctx.globalAlpha = 1 - s.z * 0.3;
      ctx.beginPath();
      ctx.arc(x, y, s.r * (1 + scrollFactor * 0.3), 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (e) => {
    pointerX = (e.clientX / width) - 0.5;
    pointerY = (e.clientY / height) - 0.5;
  });
  window.addEventListener('scroll', () => {
    scrollFactor = window.scrollY / window.innerHeight;
  });

  initStars();
  draw();
})();
