
/* NEXUS ACADEMY entry gate — show once per browser, not on every reload */
(() => {
  const gate = document.getElementById("nexusIntro");
  if (!gate) return;

  const skip = document.getElementById("introSkip");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmallScreen = window.matchMedia("(max-width: 760px)").matches;
  let finished = false;

  function markSeen() {
    try {
      localStorage.setItem("nexusAcademyIntroSeen", "yes");
      sessionStorage.setItem("nexusAcademyIntroSeen", "yes");
    } catch (_) {}
  }

  function closeGate() {
    if (finished) return;
    finished = true;
    markSeen();
    gate.classList.add("is-opening");

    window.setTimeout(() => {
      gate.classList.add("is-gone");
      document.body.classList.remove("nexus-entry-lock");
      window.setTimeout(() => gate.remove(), 700);
    }, reducedMotion || isSmallScreen ? 50 : 1100);
  }

  let alreadySeen = false;

  try {
    alreadySeen =
      localStorage.getItem("nexusAcademyIntroSeen") === "yes" ||
      sessionStorage.getItem("nexusAcademyIntroSeen") === "yes";
  } catch (_) {}

  /* Avoid the cinematic zoom/door animation on mobile and repeat visits. */
  if (alreadySeen || reducedMotion || isSmallScreen) {
    markSeen();
    gate.remove();
    document.body.classList.remove("nexus-entry-lock");
    return;
  }

  if (skip) skip.addEventListener("click", closeGate);
  window.setTimeout(closeGate, 3200);
})();
