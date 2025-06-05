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
        r: Math.random() * 1.2 + 0.2,
        speed: 0.2 + depth * 0.4
      });
    }
  }

  let pointerX = 0;
  let pointerY = 0;

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
      s.y += s.speed;
      if (s.y - s.r > height) {
        s.y = -s.r;
        s.x = Math.random() * width;
      }
      const x = (s.x + pointerX * s.z * 20) % width;
      const y = s.y + pointerY * s.z * 10;
      ctx.globalAlpha = 1 - s.z * 0.3;
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (e) => {
    pointerX = (e.clientX / width) - 0.5;
    pointerY = (e.clientY / height) - 0.5;
  });

  initStars();
  draw();
})();
