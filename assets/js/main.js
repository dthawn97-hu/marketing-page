document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  toggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-item.has-dropdown > .nav-link").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (window.innerWidth > 900) return;
      e.preventDefault();
      const item = btn.closest(".nav-item");
      const isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      nav?.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    }
  });
});
