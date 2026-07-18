const toggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealEls = document.querySelectorAll(".reveal");
const groups = new Map();

revealEls.forEach((el) => {
  const parent = el.parentElement;
  const count = groups.get(parent) || 0;
  el.style.setProperty("--reveal-delay", `${Math.min(count * 0.09, 0.45)}s`);
  groups.set(parent, count + 1);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

revealEls.forEach((el) => revealObserver.observe(el));

function formatNumber(value) {
  return value.toLocaleString("pl-PL").replace(/,/g, " ");
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) {
    el.textContent = formatNumber(target) + suffix;
    return;
  }
  const duration = 1800;
  let start = null;
  function step(ts) {
    if (start === null) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(2, -10 * progress);
    el.textContent = formatNumber(Math.round(target * eased)) + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = formatNumber(target) + suffix;
    }
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll(".stat-num").forEach((el) => counterObserver.observe(el));

const plxEls = Array.from(document.querySelectorAll("[data-plx]")).map((el) => ({
  el,
  speed: parseFloat(el.dataset.plx),
  base: 0,
}));

const toothStage = document.getElementById("toothStage");

let targetY = window.scrollY;
let currentY = window.scrollY;
let ticking = false;

function measure() {
  plxEls.forEach((item) => {
    const rect = item.el.getBoundingClientRect();
    item.base = rect.top + window.scrollY + rect.height / 2;
  });
}

function frame() {
  currentY += (targetY - currentY) * 0.09;
  if (Math.abs(targetY - currentY) < 0.1) currentY = targetY;

  const viewCenter = currentY + window.innerHeight / 2;

  plxEls.forEach((item) => {
    const delta = (viewCenter - item.base) * item.speed * 0.35;
    item.el.style.transform = `translate3d(0, ${delta.toFixed(2)}px, 0)`;
  });

  if (toothStage) {
    const rect = toothStage.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const ratio = (window.innerHeight / 2 - center) / window.innerHeight;
    const rotY = Math.max(-1, Math.min(1, ratio)) * 38;
    const rotZ = Math.max(-1, Math.min(1, ratio)) * -7;
    toothStage.style.transform = `perspective(900px) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`;
  }

  if (currentY !== targetY) {
    requestAnimationFrame(frame);
  } else {
    ticking = false;
  }
}

function onScroll() {
  targetY = window.scrollY;
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(frame);
  }
}

if (!reduceMotion) {
  measure();
  window.addEventListener("resize", measure);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
