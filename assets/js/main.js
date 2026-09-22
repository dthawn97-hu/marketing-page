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

  document.querySelectorAll("[data-hero-slider]").forEach((slider) => {
    const slides = slider.querySelectorAll(".hero-slide");
    const dots = slider.querySelectorAll("[data-hero-dots] button");
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = Number(dot.dataset.index);
        slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
        dots.forEach((d) => d.classList.toggle("is-active", d === dot));
      });
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
