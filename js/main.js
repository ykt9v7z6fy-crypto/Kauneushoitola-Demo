const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const panel = document.querySelector("#valikko");
const toggleLabel = toggle?.querySelector(".sr-only");

function closeNav() {
  document.body.classList.remove("nav-open");
  toggle?.setAttribute("aria-expanded", "false");
  if (toggleLabel) toggleLabel.textContent = "Avaa valikko";
}

function openNav() {
  document.body.classList.add("nav-open");
  toggle?.setAttribute("aria-expanded", "true");
  if (toggleLabel) toggleLabel.textContent = "Sulje valikko";
  panel?.querySelector("a")?.focus();
}

toggle?.addEventListener("click", () => {
  if (document.body.classList.contains("nav-open")) {
    closeNav();
    toggle.focus();
  } else {
    openNav();
  }
});

panel?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeNav());
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
    closeNav();
    toggle?.focus();
  }
});

function onScroll() {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const select = document.querySelector("#palvelu");
    if (select) select.value = link.getAttribute("data-service") || "";
    closeNav();
  });
});

const navLinks = [...document.querySelectorAll(".nav-panel a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));
}

function bindForm(form, successText) {
  const status = form.querySelector("[data-status]");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const errors = [];
    const name = form.elements.nimi;
    const email = form.elements.email;
    const phone = form.elements.puhelin;
    const service = form.elements.palvelu;
    const message = form.elements.viesti;

    form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));

    if (!name.value.trim() || name.value.trim().length < 2) {
      errors.push("Kirjoita nimesi.");
      name.setAttribute("aria-invalid", "true");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      errors.push("Tarkista sähköpostiosoite.");
      email.setAttribute("aria-invalid", "true");
    }
    if (phone && phone.value.trim() && phone.value.replace(/\D/g, "").length < 7) {
      errors.push("Tarkista puhelinnumero.");
      phone.setAttribute("aria-invalid", "true");
    }
    if (service && !service.value) {
      errors.push("Valitse palvelu.");
      service.setAttribute("aria-invalid", "true");
    }
    if (message && message.required && message.value.trim().length < 5) {
      errors.push("Kirjoita viesti.");
      message.setAttribute("aria-invalid", "true");
    }

    status.className = "form-status";
    if (errors.length) {
      status.textContent = errors.join(" ");
      status.classList.add("is-error");
      form.querySelector("[aria-invalid='true']")?.focus();
      return;
    }

    const chosen = service?.selectedOptions?.[0]?.text || "";
    status.textContent = chosen ? `${successText} Valittu palvelu: ${chosen}.` : successText;
    status.classList.add("is-ok");
    form.reset();
  });
}

const bookingForm = document.querySelector("#varauslomake");
if (bookingForm) {
  bindForm(
    bookingForm,
    "Kiitos. Pyyntö näkyy tässä esittelyssä, mutta sitä ei lähetetä eteenpäin. Oikealla sivustolla vahvistaisimme ajan sähköpostilla tai tekstiviestillä."
  );
}

const contactForm = document.querySelector("#viestilomake");
if (contactForm) {
  bindForm(
    contactForm,
    "Kiitos viestistä. Esittelysivusto ei lähetä viestiä eteenpäin."
  );
}

const dialog = document.querySelector("#kuva");
const dialogImg = dialog?.querySelector("img");
const dialogCap = dialog?.querySelector("figcaption");

document.querySelectorAll(".shot").forEach((shot) => {
  shot.addEventListener("click", (event) => {
    if (!dialog || !dialogImg || !dialogCap) return;
    event.preventDefault();
    const image = shot.querySelector("img");
    dialogImg.src = shot.getAttribute("href");
    dialogImg.alt = image?.alt || "";
    dialogCap.textContent = shot.dataset.caption || "";
    dialog.showModal();
  });
});

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

dialog?.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());

dialog?.addEventListener("close", () => {
  dialogImg?.removeAttribute("src");
});
