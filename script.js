document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();

  // Dark/light theme toggle. The visitor's choice is remembered in this browser.
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle?.querySelector("i");
  const themeLabel = themeToggle?.querySelector("span");
  const applyTheme = (theme) => {
    const isLight = theme === "light";
    document.documentElement.dataset.theme = isLight ? "light" : "dark";
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} theme`);
    }
    if (themeIcon) themeIcon.className = isLight ? "bi bi-moon-stars" : "bi bi-sun";
    if (themeLabel) themeLabel.textContent = isLight ? "Dark mode" : "Light mode";
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", isLight ? "#f4f7fb" : "#080d18");
  };
  let savedTheme = "dark";
  try { savedTheme = localStorage.getItem("portfolio-theme") || "dark"; } catch (_) { /* Storage may be unavailable. */ }
  applyTheme(savedTheme);
  themeToggle?.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    try { localStorage.setItem("portfolio-theme", nextTheme); } catch (_) { /* Theme still works without storage. */ }
  });

  // Keep the page usable even if an animation CDN is unavailable.
  const revealItems = document.querySelectorAll("[data-reveal]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.gsap && !reducedMotion) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (window.TextPlugin) gsap.registerPlugin(TextPlugin);

    revealItems.forEach((element) => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true
        }
      });
    });
  } else {
    revealItems.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  }

  // GSAP TextPlugin typing effect with a graceful static fallback.
  const changingText = document.querySelector(".changing-text");
  const phrases = ["backend systems", "full-stack applications", "cloud solutions", "reliable software"];
  if (changingText && window.gsap && window.TextPlugin && !reducedMotion) {
    let phraseIndex = 0;
    const typeNext = () => {
      const phrase = phrases[phraseIndex];
      gsap.to(changingText, {
        duration: Math.max(0.7, phrase.length * 0.055),
        text: phrase,
        ease: "none",
        onComplete: () => {
          gsap.delayedCall(1.5, () => {
            gsap.to(changingText, {
              duration: Math.max(0.35, phrase.length * 0.025),
              text: "",
              ease: "none",
              onComplete: () => {
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeNext();
              }
            });
          });
        }
      });
    };
    changingText.textContent = "";
    typeNext();
  } else if (changingText) {
    changingText.textContent = "backend systems";
  }

  // Active navigation link while scrolling.
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Close the mobile menu after choosing a section.
  const navCollapse = document.getElementById("mainNav");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.bootstrap && navCollapse && navCollapse.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  // Back-to-top control.
  const backToTop = document.querySelector(".back-to-top");
  const updateBackToTop = () => {
    if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 500);
  };
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));
});
