/* D$T/***TOKYO — private concept preview. Links go to the existing public BASE listings. */
const SHOP = {
  products: [
    { name: "D$T/***TOKYO sweatpants-2", url: "https://deadstockttt.base.shop/items/163811511" },
    { name: "D$T/***TOKYO sweatpants-1", url: "https://deadstockttt.base.shop/items/163811323" },
    { name: "D$T/***TOKYO hoodie", url: "https://deadstockttt.base.shop/items/163802895" }
  ]
};

function loadProgressiveStyles() {
  ["v4-1.css", "product-v5.css", "v6.css"].forEach((href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.append(link);
  });
}

function normalizeTickerLoop() {
  const track = document.querySelector(".ticker-track");
  if (!track) return;
  const originalChildren = [...track.children];
  const completeGroup = originalChildren.slice(0, 8);
  if (completeGroup.length < 8) return;
  const firstGroup = completeGroup.map((element) => element.cloneNode(true));
  const secondGroup = completeGroup.map((element) => {
    const clone = element.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    return clone;
  });
  track.replaceChildren(...firstGroup, ...secondGroup);
}

function bindProductData() {
  document.querySelectorAll("[data-product-name]").forEach((element) => {
    const item = SHOP.products[Number(element.dataset.productName)];
    if (item) element.textContent = item.name;
  });
  document.querySelectorAll("[data-product-link]").forEach((link) => {
    const item = SHOP.products[Number(link.dataset.productLink)];
    if (!item) return;
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

const languageButtons = [...document.querySelectorAll("[data-language]")];
function applyLanguage(language) {
  const normalized = language === "ja" ? "ja" : "en";
  document.documentElement.lang = normalized;
  document.querySelectorAll(".i18n").forEach((element) => {
    const translation = element.dataset[normalized];
    if (translation) element.textContent = translation;
  });
  languageButtons.forEach((button) => {
    const selected = button.dataset.language === normalized;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  });
  try { localStorage.setItem("dst-language", normalized); } catch (_) {}
}
languageButtons.forEach((button) => button.addEventListener("click", () => applyLanguage(button.dataset.language)));
function getInitialLanguage() {
  try {
    const saved = localStorage.getItem("dst-language");
    if (saved === "en" || saved === "ja") return saved;
  } catch (_) {}
  return "en";
}

function setupReveal() {
  const elements = [...document.querySelectorAll(".reveal")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -10%", threshold: 0.08 });
  elements.forEach((element) => observer.observe(element));
}

function setupScrollProgress() {
  const bar = document.getElementById("scroll-progress-bar");
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.width = `${progress * 100}%`;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
}

function setupPointerDepth() {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reduceMotion) return;
  document.querySelectorAll(".product-visual").forEach((visual) => {
    const garment = visual.querySelector(".concept-garment");
    if (!garment) return;
    visual.addEventListener("pointermove", (event) => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      garment.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0) scale(1.035) rotate(${x * 1.5}deg)`;
    });
    visual.addEventListener("pointerleave", () => { garment.style.transform = ""; });
  });
}

loadProgressiveStyles();
normalizeTickerLoop();
bindProductData();
applyLanguage(getInitialLanguage());
setupReveal();
setupScrollProgress();
setupPointerDepth();
