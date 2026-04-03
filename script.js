const header = document.getElementById("site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");
const navLinks = nav ? Array.from(nav.querySelectorAll('a[href^="#"]')) : [];

const MOBILE_BREAKPOINT = 820;

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeMobileMenu() {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

function toggleMobileMenu() {
  if (!menuToggle || !nav) return;
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
}

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMobileMenu);
}

window.addEventListener(
  "resize",
  () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      closeMobileMenu();
    }
  },
  { passive: true }
);

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

document.addEventListener("click", (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor) return;

  const href = anchor.getAttribute("href");
  if (!href || href.length <= 1) return;

  const target = document.querySelector(href);
  if (!target) return;

  event.preventDefault();
  const headerHeight = header ? header.offsetHeight : 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight + 2;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: "smooth"
  });

  closeMobileMenu();
});

document.addEventListener("click", (event) => {
  if (!nav || !menuToggle) return;
  const isMenuOpen = nav.classList.contains("is-open");
  if (!isMenuOpen) return;

  const clickedInsideNav = event.target.closest("#site-nav");
  const clickedToggle = event.target.closest(".menu-toggle");
  if (!clickedInsideNav && !clickedToggle) {
    closeMobileMenu();
  }
});

const sectionMap = navLinks
  .map((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    return section ? { link, section } : null;
  })
  .filter(Boolean);

function setActiveNavLink() {
  if (!sectionMap.length) return;
  const marker = window.scrollY + (header ? header.offsetHeight : 0) + 80;

  let current = sectionMap[0];
  for (const item of sectionMap) {
    if (item.section.offsetTop <= marker) {
      current = item;
    }
  }

  navLinks.forEach((link) => link.classList.remove("active"));
  current.link.classList.add("active");
}

window.addEventListener("scroll", setActiveNavLink, { passive: true });
setActiveNavLink();

const revealNodes = Array.from(document.querySelectorAll(".reveal"));
if (revealNodes.length) {
  revealNodes.forEach((node) => {
    const delay = Number.parseFloat(node.dataset.revealDelay);
    if (!Number.isNaN(delay) && delay > 0) {
      node.style.transitionDelay = `${delay}s`;
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -4% 0px" }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
}

const faqItems = Array.from(document.querySelectorAll(".faq-item"));
if (faqItems.length) {
  faqItems.forEach((item) => {
    const button = item.querySelector("button");
    const panel = item.querySelector(".faq-panel");
    if (!button || !panel) return;

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      faqItems.forEach((other) => {
        const otherButton = other.querySelector("button");
        const otherPanel = other.querySelector(".faq-panel");
        if (!otherButton || !otherPanel) return;
        otherButton.setAttribute("aria-expanded", "false");
        otherPanel.style.maxHeight = "";
      });

      if (!isExpanded) {
        button.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });
}

const heroVisual = document.querySelector(".hero-visual");
if (heroVisual && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let raf = 0;

  const onMove = (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      heroVisual.style.setProperty("--mx", `${x * 14}px`);
      heroVisual.style.setProperty("--my", `${y * 10}px`);
    });
  };

  const reset = () => {
    heroVisual.style.setProperty("--mx", "0px");
    heroVisual.style.setProperty("--my", "0px");
  };

  heroVisual.addEventListener("mousemove", onMove);
  heroVisual.addEventListener("mouseleave", reset);
}

const form = document.getElementById("tg-form");
const statusNode = document.getElementById("status");
const TELEGRAM_BOT_TOKEN = "7673985541:AAH2PnkO-TW1i09ZSHFwMLa7Gj8NghOZi14";
const TELEGRAM_CHAT_ID = "2091631815";

if (form && statusNode) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const preferredDay = String(formData.get("preferred_day") || "").trim();
    const comment = String(formData.get("comment") || "").trim();

    if (!name || !phone) {
      statusNode.textContent = "Укажите имя и телефон.";
      statusNode.style.color = "#9e2f2f";
      return;
    }

    statusNode.textContent = "Отправляю заявку...";
    statusNode.style.color = "";

    const lines = [
      "Новая заявка с сайта Марии Подолог",
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      preferredDay ? `День: ${preferredDay}` : null,
      comment ? `Комментарий: ${comment}` : null,
      `Время: ${new Date().toLocaleString("ru-RU")}`
    ].filter(Boolean);

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: lines.join("\n")
        })
      });

      if (!response.ok) {
        throw new Error(`Telegram error: ${response.status}`);
      }

      statusNode.textContent = "Спасибо, заявка отправлена. Я свяжусь с вами в ближайшее время.";
      statusNode.style.color = "#2c5641";
      form.reset();
    } catch (error) {
      statusNode.textContent = "Не удалось отправить автоматически. Напишите в WhatsApp или Telegram, отвечу быстро.";
      statusNode.style.color = "#9e2f2f";
      console.error(error);
    }
  });
}
