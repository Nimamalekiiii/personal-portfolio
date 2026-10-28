document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const LINKS = {
    linkedin: "https://www.linkedin.com/in/nima-maleki-188ba929a",
    github: "https://github.com/Nimamalekiiii",
    discord: "https://discord.com/users/710853164894650369"
  };

  /* ================= THEME ================= */

  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function syncBrowserBar() {
    if (themeMeta) themeMeta.content = root.dataset.theme === "light" ? "#eef2ee" : "#08222a";
  }
  syncBrowserBar();

  function setTheme(theme) {
    root.dataset.theme = theme;
    syncBrowserBar();
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* storage unavailable: the choice lasts for this page only */
    }
  }

  function toggleTheme() {
    setTheme(root.dataset.theme === "light" ? "dark" : "light");
  }

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  /* ================= HEADER ================= */

  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeNav() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) closeNav();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ================= CONTACT DIALOG ================= */

  const contact = document.createElement("dialog");
  contact.className = "contact-dialog";
  contact.id = "contactModal";
  contact.setAttribute("aria-labelledby", "contactTitle");
  contact.innerHTML = `
    <div class="contact-box">
      <button type="button" class="close-btn" id="closeContact" aria-label="Close">&times;</button>
      <h2 id="contactTitle">Contact Me</h2>
      <p>Let's discuss your next project</p>
      <form class="contact-form" id="contactForm">
        <label for="cf-name">Name *</label>
        <input id="cf-name" type="text" placeholder="Your name" autocomplete="name" required>
        <label for="cf-phone">Phone Number</label>
        <input id="cf-phone" type="text" placeholder="+47 123 45 678" autocomplete="tel">
        <label for="cf-email">Email *</label>
        <input id="cf-email" type="email" placeholder="your@email.com" autocomplete="email" required>
        <label for="cf-message">Message *</label>
        <textarea id="cf-message" placeholder="Tell me about your project..." required></textarea>
        <button type="submit" class="send-btn">Send Message</button>
      </form>
    </div>`;
  document.body.appendChild(contact);

  const contactForm = contact.querySelector("#contactForm");

  function openContact() {
    closeNav();
    if (!contact.open) contact.showModal();
  }

  document.querySelectorAll("[data-open-contact]").forEach((btn) => btn.addEventListener("click", openContact));
  contact.querySelector("#closeContact").addEventListener("click", () => contact.close());
  contact.addEventListener("click", (e) => {
    if (e.target === contact) contact.close();
  });

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector(".send-btn");
    btn.textContent = "Sent!";
    btn.classList.add("is-sent");
    setTimeout(() => {
      contact.close();
      contactForm.reset();
      btn.textContent = "Send Message";
      btn.classList.remove("is-sent");
    }, 2000);
  });

  /* ================= COMMAND MENU (Cmd/Ctrl + K) ================= */

  const commands = [
    { label: "Home", hint: "Page", run: () => (location.href = "index.html") },
    { label: "About", hint: "Page", run: () => (location.href = "about.html") },
    { label: "Skills", hint: "Page", run: () => (location.href = "skills.html") },
    { label: "Experience", hint: "Page", run: () => (location.href = "projects.html") },
    { label: "Contact me", hint: "Open form", run: openContact },
    { label: "LinkedIn", hint: "Opens in new tab", run: () => window.open(LINKS.linkedin, "_blank", "noopener") },
    { label: "GitHub", hint: "Opens in new tab", run: () => window.open(LINKS.github, "_blank", "noopener") },
    { label: "Discord", hint: "Opens in new tab", run: () => window.open(LINKS.discord, "_blank", "noopener") },
    { label: "Switch light / dark theme", hint: "Appearance", run: toggleTheme }
  ];

  const palette = document.createElement("dialog");
  palette.className = "palette";
  palette.setAttribute("aria-label", "Command menu");
  palette.innerHTML = `
    <div class="palette-box">
      <input class="palette-input" type="text" placeholder="Where do you want to go?" aria-label="Search commands" autocomplete="off" spellcheck="false">
      <div class="palette-list" role="listbox"></div>
      <div class="palette-hint"><span><kbd>&uarr;</kbd><kbd>&darr;</kbd>Move</span><span><kbd>&crarr;</kbd>Open</span><span><kbd>Esc</kbd>Close</span></div>
    </div>`;
  document.body.appendChild(palette);

  const paletteInput = palette.querySelector(".palette-input");
  const paletteList = palette.querySelector(".palette-list");
  let matches = commands;
  let selected = 0;

  function renderPalette() {
    const q = paletteInput.value.trim().toLowerCase();
    matches = commands.filter((c) => c.label.toLowerCase().includes(q));
    selected = Math.min(selected, Math.max(matches.length - 1, 0));
    paletteList.innerHTML = "";

    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "palette-empty";
      empty.textContent = "Nothing matches that. Try \"about\" or \"github\".";
      paletteList.appendChild(empty);
      return;
    }

    matches.forEach((cmd, i) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "palette-item";
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", String(i === selected));
      const label = document.createElement("span");
      label.textContent = cmd.label;
      const hint = document.createElement("small");
      hint.textContent = cmd.hint;
      item.append(label, hint);
      item.addEventListener("click", () => runCommand(cmd));
      item.addEventListener("pointermove", () => {
        if (selected !== i) {
          selected = i;
          renderPalette();
        }
      });
      paletteList.appendChild(item);
    });

    const active = paletteList.querySelector('[aria-selected="true"]');
    if (active) active.scrollIntoView({ block: "nearest" });
  }

  function runCommand(cmd) {
    palette.close();
    cmd.run();
  }

  function openPalette() {
    closeNav();
    if (palette.open) return;
    paletteInput.value = "";
    selected = 0;
    renderPalette();
    palette.showModal();
    paletteInput.focus();
  }

  paletteInput.addEventListener("input", () => {
    selected = 0;
    renderPalette();
  });

  paletteInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!matches.length) return;
      selected = (selected + (e.key === "ArrowDown" ? 1 : -1) + matches.length) % matches.length;
      renderPalette();
    } else if (e.key === "Enter" && matches[selected]) {
      e.preventDefault();
      runCommand(matches[selected]);
    }
  });

  palette.addEventListener("click", (e) => {
    if (e.target === palette) palette.close();
  });

  const paletteBtn = document.getElementById("openPalette");
  if (paletteBtn) {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) paletteBtn.querySelector("kbd").textContent = "Ctrl K";
    paletteBtn.addEventListener("click", openPalette);
  }

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (palette.open) palette.close();
      else openPalette();
    }
  });

  /* ================= HOME: NAME DECRYPTS ON LOAD ================= */

  const hero = document.querySelector(".hero");

  if (hero) {
    const lines = hero.querySelectorAll(".hero-name .line");
    const glyphs = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&$<>/";

    if (!reduceMotion) {
      lines.forEach((line, lineIndex) => {
        const text = line.textContent;
        const start = performance.now() + 250 + lineIndex * 380;
        const perChar = 95;
        const settle = 420;
        line.classList.add("is-cipher");

        function tick(now) {
          const t = now - start;
          let out = "";
          let done = true;
          for (let i = 0; i < text.length; i++) {
            if (t > settle + i * perChar) {
              out += text[i];
            } else {
              done = false;
              out += glyphs[Math.floor(Math.random() * glyphs.length)];
            }
          }
          line.textContent = out;
          if (done) {
            line.textContent = text;
            line.classList.remove("is-cipher");
          } else {
            setTimeout(() => requestAnimationFrame(tick), 45);
          }
        }
        line.textContent = text.replace(/./g, () => glyphs[Math.floor(Math.random() * glyphs.length)]);
        requestAnimationFrame(tick);
      });
    }

    requestAnimationFrame(() => hero.classList.add("is-ready"));

    /* Portrait leans toward the pointer */
    const portrait = hero.querySelector(".portrait");
    const frameEl = hero.querySelector(".portrait-frame");
    if (portrait && frameEl && finePointer && !reduceMotion) {
      portrait.addEventListener("pointermove", (e) => {
        const r = portrait.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        frameEl.style.setProperty("--ry", x * 6 + "deg");
        frameEl.style.setProperty("--rx", -y * 5 + "deg");
      });
      portrait.addEventListener("pointerleave", () => {
        ["--rx", "--ry"].forEach((p) => frameEl.style.removeProperty(p));
      });
    }

    /* Social buttons pull slightly toward the pointer */
    if (finePointer && !reduceMotion) {
      hero.querySelectorAll(".social-link").forEach((link) => {
        link.addEventListener("pointermove", (e) => {
          const r = link.getBoundingClientRect();
          link.style.setProperty("--mag-x", (e.clientX - r.left - r.width / 2) * 0.18 + "px");
          link.style.setProperty("--mag-y", (e.clientY - r.top - r.height / 2) * 0.28 + "px");
        });
        link.addEventListener("pointerleave", () => {
          link.style.removeProperty("--mag-x");
          link.style.removeProperty("--mag-y");
        });
      });
    }
  }

  /* ================= HOME: TERMINAL TYPES ITSELF ================= */

  const term = document.querySelector(".terminal-body");

  if (term) {
    const script = [
      { cmd: "ls ./skills", out: "frontend/  backend/  cybersecurity/" },
      { cmd: "cat status.txt", out: "BSc in IT & Cybersecurity\n2024 – Present" }
    ];
    const caret = '<span class="caret"></span>';
    const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const line = (cmd) => '<span class="prompt">$</span> <span class="cmd">' + esc(cmd) + "</span>";

    if (reduceMotion) {
      term.innerHTML =
        script.map((s) => line(s.cmd) + '\n<span class="out">' + esc(s.out) + "</span>").join("\n") +
        '\n<span class="prompt">$</span> ' + caret;
    } else {
      let done = "";
      let step = 0;

      function typeStep() {
        if (step >= script.length) {
          term.innerHTML = done + '<span class="prompt">$</span> ' + caret;
          return;
        }
        const s = script[step];
        let i = 0;
        (function typeChar() {
          term.innerHTML = done + line(s.cmd.slice(0, i)) + caret;
          if (i < s.cmd.length) {
            i++;
            setTimeout(typeChar, 55 + Math.random() * 60);
          } else {
            setTimeout(() => {
              done += line(s.cmd) + '\n<span class="out">' + esc(s.out) + "</span>\n";
              step++;
              typeStep();
            }, 380);
          }
        })();
      }

      term.innerHTML = '<span class="prompt">$</span> ' + caret;
      setTimeout(typeStep, 2100);
    }
  }

  /* ================= HOME: SIGNAL FIELD ================= */

  const signal = document.querySelector(".signal");

  if (signal) {
    const ctx = signal.getContext("2d");
    const gap = 26;
    let w = 0;
    let h = 0;
    let rgb = "241,238,228";
    let running = true;
    let raf = null;

    function readColor() {
      rgb = root.dataset.theme === "light" ? "8,34,42" : "241,238,228";
    }

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = signal.clientWidth;
      h = signal.clientHeight;
      signal.width = w * dpr;
      signal.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          /* two crossing waves; where both peak, the dot lights up */
          const a = Math.sin(x * 0.011 + y * 0.006 - t * 0.0007);
          const b = Math.sin(x * 0.004 - y * 0.013 + t * 0.0005);
          const v = Math.max(0, a * b);
          const alpha = 0.07 + v * v * 0.5;
          const r = 1 + v * 1.1;
          ctx.fillStyle = "rgba(" + rgb + "," + alpha.toFixed(3) + ")";
          ctx.fillRect(x - r / 2, y - r / 2, r, r);
        }
      }
    }

    function loop(t) {
      draw(t);
      if (running) raf = requestAnimationFrame(loop);
    }

    readColor();
    size();

    if (reduceMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
      new IntersectionObserver((entries) => {
        const visible = entries[0].isIntersecting;
        if (visible && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!visible) {
          running = false;
          cancelAnimationFrame(raf);
        }
      }).observe(signal);
    }

    window.addEventListener("resize", () => {
      size();
      if (reduceMotion) draw(0);
    });
    new MutationObserver(() => {
      readColor();
      if (reduceMotion) draw(0);
    }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ================= ABOUT: TIMELINE ================= */

  const timeline = document.querySelector(".timeline");

  if (timeline) {
    const stages = [...timeline.querySelectorAll(".stage")];

    function updateTimeline() {
      const r = timeline.getBoundingClientRect();
      const marker = window.innerHeight * 0.55;
      const progress = Math.min(Math.max((marker - r.top) / r.height, 0), 1);
      timeline.style.setProperty("--progress", progress.toFixed(4));

      let current = 0;
      stages.forEach((stage, i) => {
        if (stage.getBoundingClientRect().top < marker) current = i;
      });
      stages.forEach((stage, i) => stage.classList.toggle("is-active", i === current));
    }

    window.addEventListener("scroll", updateTimeline, { passive: true });
    window.addEventListener("resize", updateTimeline);
    updateTimeline();
  }
});
