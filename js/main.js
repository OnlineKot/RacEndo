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

const CLARITY_PROJECT_ID = "";

function loadClarity() {
  if (!CLARITY_PROJECT_ID || window.clarity) return;
  window.clarity = function () {
    (window.clarity.q = window.clarity.q || []).push(arguments);
  };
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  document.head.appendChild(script);
}

const heroTooth = document.getElementById("heroTooth");
const cookieBubble = document.getElementById("cookieBubble");
const cookieText = document.getElementById("cookieText");
const cookieActions = document.getElementById("cookieActions");
const cookieAccept = document.getElementById("cookieAccept");
const cookieReject = document.getElementById("cookieReject");
const cookieInfo = document.querySelector(".cookie-info");

const consentKey = "rc-cookie-consent";
const storedConsent = localStorage.getItem(consentKey);

if (storedConsent === "accepted") {
  loadClarity();
}

function showCookie() {
  heroTooth.classList.add("cookie-out");
  setTimeout(() => {
    cookieBubble.hidden = false;
    requestAnimationFrame(() => cookieBubble.classList.add("show"));
  }, 1500);
}

function rollBack() {
  cookieBubble.classList.remove("show");
  setTimeout(() => {
    cookieBubble.hidden = true;
    heroTooth.classList.remove("cookie-out");
  }, 380);
}

function chooseCookies(choice) {
  localStorage.setItem(consentKey, choice);
  if (choice === "accepted") {
    loadClarity();
  }
  cookieActions.style.display = "none";
  if (cookieInfo) cookieInfo.style.display = "none";
  cookieText.textContent = "Pamiętaj, aby zawsze po ciastkach umyć zęby!";
  setTimeout(rollBack, 3400);
}

if (heroTooth && cookieBubble && !storedConsent) {
  cookieAccept.addEventListener("click", () => chooseCookies("accepted"));
  cookieReject.addEventListener("click", () => chooseCookies("rejected"));
  setTimeout(showCookie, 1600);
}

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
