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

const callbar = document.getElementById("callbar");
window.addEventListener(
  "scroll",
  () => {
    callbar.classList.toggle("show", window.scrollY > 420);
  },
  { passive: true }
);

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

const journey = document.getElementById("toothJourney");
const journeyInner = document.getElementById("toothJourneyInner");
const progressBar = document.getElementById("scrollProgress");

const journeyStops = [
  { sel: ".hero", x: 0.5, y: 0.82, s: 0.62, o: 1 },
  { sel: ".trustbar", x: 0.9, y: 0.42, s: 0.38, o: 0.85 },
  { sel: "#uslugi", x: 0.945, y: 0.46, s: 0.3, o: 0.45 },
  { sel: "#liczby", x: 0.175, y: 0.4, s: 1.15, o: 1 },
  { sel: "#mikroskop", x: 0.955, y: 0.42, s: 0.34, o: 0.8 },
  { sel: "#lekarz", x: 0.945, y: 0.46, s: 0.3, o: 0.45 },
  { sel: "#faq", x: 0.11, y: 0.42, s: 0.62, o: 0.95 },
  { sel: "#kontakt", x: 0.97, y: 0.5, s: 0.26, o: 0.45 },
  { sel: ".cta-band", x: 0.78, y: 0.6, s: 0.5, o: 0.95 },
];

let waypoints = [];

function measureJourney() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  waypoints = journeyStops
    .map((stop) => {
      const el = document.querySelector(stop.sel);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const center = rect.top + window.scrollY + rect.height / 2;
      return {
        pos: center - vh / 2,
        x: stop.x * vw,
        y: stop.y * vh,
        s: stop.s,
        o: stop.o,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.pos - b.pos);
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function journeyState(scroll) {
  if (!waypoints.length) return null;
  if (scroll <= waypoints[0].pos) return waypoints[0];
  const last = waypoints[waypoints.length - 1];
  if (scroll >= last.pos) return last;
  let i = 0;
  while (scroll > waypoints[i + 1].pos) i++;
  const a = waypoints[i];
  const b = waypoints[i + 1];
  const t = smoothstep((scroll - a.pos) / (b.pos - a.pos));
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    s: a.s + (b.s - a.s) * t,
    o: a.o + (b.o - a.o) * t,
  };
}

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

  const docH = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar && docH > 0) {
    progressBar.style.transform = `scaleX(${(currentY / docH).toFixed(4)})`;
  }

  if (journey) {
    const state = journeyState(currentY);
    if (state) {
      const rotZ = Math.sin(currentY * 0.0012) * 12;
      const rotY = Math.sin(currentY * 0.0016) * 42;
      journey.style.transform = `translate3d(${(state.x - 100).toFixed(1)}px, ${(state.y - 148).toFixed(1)}px, 0) rotate(${rotZ.toFixed(2)}deg) scale(${state.s.toFixed(3)})`;
      journey.style.opacity = state.o.toFixed(3);
      journeyInner.style.transform = `perspective(800px) rotateY(${rotY.toFixed(2)}deg)`;
    }
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
  measureJourney();
  window.addEventListener("resize", () => {
    measure();
    measureJourney();
  });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("load", () => {
    measure();
    measureJourney();
    onScroll();
  });
  onScroll();
} else if (journey) {
  journey.style.display = "none";
}
