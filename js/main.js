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

const faqItems = document.querySelectorAll("#faq details");
faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (item.open) {
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});

const reviews = document.getElementById("reviews");
const revPrev = document.getElementById("revPrev");
const revNext = document.getElementById("revNext");

if (reviews && revPrev && revNext) {
  const step = () => {
    const card = reviews.querySelector(".review");
    return card ? card.offsetWidth + 20 : 360;
  };
  revPrev.addEventListener("click", () => {
    reviews.scrollBy({ left: -step(), behavior: "smooth" });
  });
  revNext.addEventListener("click", () => {
    reviews.scrollBy({ left: step(), behavior: "smooth" });
  });
}

const callbar = document.getElementById("callbar");
const progressBar = document.getElementById("scrollProgress");
let ticking = false;

function onScroll() {
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar && docH > 0) {
    progressBar.style.transform = `scaleX(${(window.scrollY / docH).toFixed(4)})`;
  }
  if (callbar) {
    callbar.classList.toggle("show", window.scrollY > 420);
  }
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  },
  { passive: true }
);

onScroll();
