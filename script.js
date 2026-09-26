
(() => {
  const stateKey = "shoito-audio-enabled";
  const getEnabled = () => localStorage.getItem(stateKey) !== "off";

  const audioFile = document.body.dataset.audio;
  let bg = null;
  let enabled = getEnabled();

  if (audioFile) {
    bg = new Audio(audioFile);
    bg.loop = true;
    bg.preload = "auto";
    bg.volume = document.body.dataset.audioVolume ? Number(document.body.dataset.audioVolume) : 0.28;
  }

  const toggle = document.querySelector("[data-sound-toggle]");
  const updateToggle = () => {
    if (!toggle) return;
    toggle.textContent = enabled ? "音 ON" : "音 OFF";
    toggle.setAttribute("aria-label", enabled ? "音をオフにする" : "音をオンにする");
  };

  async function startAudio() {
    if (!bg || !enabled) return;
    try { await bg.play(); } catch (_) {}
  }

  function stopAudio() {
    if (!bg) return;
    bg.pause();
    bg.currentTime = 0;
  }

  if (toggle) {
    toggle.addEventListener("click", async () => {
      enabled = !enabled;
      localStorage.setItem(stateKey, enabled ? "on" : "off");
      if (enabled) await startAudio(); else stopAudio();
      updateToggle();
    });
  }

  // Browsers generally block audible autoplay until a user gesture.
  // Start the page ambience on the first gesture anywhere.
  const gesture = () => {
    startAudio();
    document.removeEventListener("pointerdown", gesture);
    document.removeEventListener("keydown", gesture);
  };
  document.addEventListener("pointerdown", gesture, {once:true});
  document.addEventListener("keydown", gesture, {once:true});
  updateToggle();

  // Diary: play a writing sound, then redirect.
  document.querySelectorAll("[data-diary-link]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.href;
      const s = new Audio("diary.wav");
      s.volume = 0.7;
      s.play().catch(() => {});
      setTimeout(() => location.href = href, 520);
    });
  });

  // Discography: cassette-like click sound, then CD animation and redirect.
  const overlay = document.querySelector(".cd-overlay");
  const discSound = () => {
    const s = new Audio("disc.wav");
    s.volume = 0.55;
    s.play().catch(() => {});
  };
  document.querySelectorAll("[data-track]").forEach((track) => {
    track.addEventListener("click", () => {
      discSound();
      if (overlay) {
        const cd = overlay.querySelector(".cd");
        cd.style.setProperty("--disc", track.dataset.cover || "#ddd");
        overlay.querySelector("[data-cd-title]").textContent = track.dataset.title || "";
        overlay.classList.add("show");
      }
      setTimeout(() => {
        const href = track.dataset.url;
        if (href && href !== "#") location.href = href;
      }, 1300);
    });
  });
})();
