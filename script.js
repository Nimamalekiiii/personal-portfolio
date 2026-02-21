document.addEventListener("DOMContentLoaded", () => {

  /* ================= HAMBURGER MENU ================= */

  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");
  const overlay = document.getElementById("nav-overlay");

  function openNav() {
    nav.classList.add("active");
    menuToggle.classList.add("open");
    if (overlay) overlay.classList.add("active");
  }

  function closeNav() {
    nav.classList.remove("active");
    menuToggle.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
  }

  if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {
      if (nav.classList.contains("active")) {
        closeNav();
      } else {
        openNav();
      }
    });

    document.querySelectorAll("#nav a").forEach(link => {
      link.addEventListener("click", () => {
        closeNav();
      });
    });

    if (overlay) {
      overlay.addEventListener("click", () => {
        closeNav();
      });
    }

    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeNav();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeNav();
      }
    });
  }

  /* ================= CONTACT MODAL ================= */

  const openBtn = document.getElementById("openContact");
  const modal = document.getElementById("contactModal");
  const closeBtn = document.getElementById("closeContact");
  const contactForm = document.getElementById("contactForm");

  if (openBtn && modal && closeBtn) {

    openBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        modal.style.display = "none";
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector(".send-btn");
      btn.textContent = "Sent!";
      btn.style.background = "#00ffae";
      btn.style.color = "#050505";
      setTimeout(() => {
        modal.style.display = "none";
        contactForm.reset();
        btn.textContent = "Send Message";
        btn.style.background = "#5865F2";
        btn.style.color = "white";
      }, 2000);
    });
  }

  /* ================= NETWORK BACKGROUND ================= */

  const canvas = document.getElementById("network");

  if (canvas) {

    const ctx = canvas.getContext("2d");

    let particles = [];
    let animationId;
    let particleCount;

    function setParticleCount() {
      particleCount = window.innerWidth < 768 ? 45 : 85;
    }

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x <= 0 || p.x >= window.innerWidth) p.dx *= -1;
        if (p.y <= 0 || p.y >= window.innerHeight) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${1 - distance / 130})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    function init() {
      setParticleCount();
      resizeCanvas();
      createParticles();
      animate();
    }

    window.addEventListener("resize", () => {
      cancelAnimationFrame(animationId);
      init();
    });

    init();
  }

});
