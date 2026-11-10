(() => {
  const gate = document.getElementById("nexusIntro");
  if (!gate) return;
  const skip = document.getElementById("introSkip");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let finished = false;

  function closeGate() {
    if (finished) return;
    finished = true;
    gate.classList.add("is-opening");
    window.setTimeout(() => {
      gate.classList.add("is-gone");
      document.body.classList.remove("nexus-entry-lock");
      window.setTimeout(() => gate.remove(), 750);
    }, reducedMotion ? 50 : 1450);
    try { sessionStorage.setItem("nexusAcademyIntroSeen", "yes"); } catch (_) {}
  }

  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem("nexusAcademyIntroSeen") === "yes"; } catch (_) {}
  if (alreadySeen || reducedMotion) {
    gate.remove();
    document.body.classList.remove("nexus-entry-lock");
    return;
  }

  if (skip) skip.addEventListener("click", closeGate);
  // Let the welcome message be read before the two technology doors open.
  window.setTimeout(closeGate, 3900);
})();
