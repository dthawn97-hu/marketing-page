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

  const dropdowns = document.querySelectorAll(".nav-item.has-dropdown");
  const closeDropdowns = (except) => dropdowns.forEach((item) => {
    if (item === except) return;
    item.classList.remove("is-open");
    item.querySelector(".nav-link").setAttribute("aria-expanded", "false");
  });
  dropdowns.forEach((item) => {
    const btn = item.querySelector(".nav-link");
    btn.addEventListener("click", () => {
      closeDropdowns(item);
      btn.setAttribute("aria-expanded", String(item.classList.toggle("is-open")));
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-item.has-dropdown")) closeDropdowns();
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

  document.querySelectorAll("[data-slider]").forEach((track) => {
    const section = track.closest("section");
    const cards = [...track.children];
    const step = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth);
    section.querySelectorAll("[data-slide]").forEach((btn) => {
      btn.addEventListener("click", () => {
        track.scrollBy({ left: Number(btn.dataset.slide) * step(), behavior: "smooth" });
      });
    });
    // Optional dot indicator, one dot per card
    const dots = section.querySelector("[data-slider-dots]");
    if (!dots) return;
    dots.innerHTML = cards.map(() => "<span></span>").join("");
    const sync = () => {
      const i = Math.round(track.scrollLeft / step());
      [...dots.children].forEach((d, k) => d.classList.toggle("is-active", k === i));
    };
    sync();
    track.addEventListener("scroll", sync, { passive: true });
  });

  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = list.querySelectorAll('[role="tab"]');
    tabs.forEach((tab) => tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.setAttribute("aria-selected", String(t === tab));
        document.getElementById(t.getAttribute("aria-controls")).hidden = t !== tab;
      });
    }));
  });

  // Footer link columns and [data-mobile-collapse] cards: open on desktop, collapsed accordion on mobile
  if (window.matchMedia("(max-width: 760px)").matches) {
    document.querySelectorAll(".footer-col, [data-mobile-collapse]").forEach((col) => col.removeAttribute("open"));
  }

  // Lead form (FORM CHUẨN): inline error under each field, VN phone check, source page, thank-you state.
  // ponytail: data is not sent anywhere yet – wire the submit to email/CRM before going to production.
  const VN_PHONE = /^(?:0|\+?84)(?:[35789]\d{8}|2\d{9})$/;
  const errorFor = (input) => {
    if (input.type === "checkbox") return input.required && !input.checked ? "Vui lòng đồng ý để Lifrooms liên hệ." : "";
    const value = input.value.trim();
    if (input.required && !value) return "Vui lòng nhập thông tin này.";
    if (value && input.type === "email" && !input.checkValidity()) return "Email chưa đúng định dạng.";
    if (value && input.hasAttribute("data-vn-phone") && !VN_PHONE.test(value.replace(/[\s.-]/g, ""))) return "Số điện thoại chưa đúng (ví dụ: 0366071468).";
    return "";
  };
  const showError = (input, message) => {
    const field = input.closest(".field");
    let error = field.querySelector(".field-error");
    if (!message) {
      error?.remove();
      input.removeAttribute("aria-invalid");
      return message;
    }
    if (!error) {
      error = document.createElement("p");
      error.className = "field-error";
      error.id = `${input.id || input.name}-error`;
      field.append(error);
    }
    error.textContent = message;
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", error.id);
    return message;
  };
  document.querySelectorAll("[data-lead-form]").forEach((form) => {
    form.elements.trang_nguon.value = location.pathname;
    const inputs = [...form.querySelectorAll("[required], [data-vn-phone]")];
    inputs.forEach((input) => {
      input.addEventListener(input.type === "checkbox" ? "change" : "blur", () => showError(input, errorFor(input)));
      input.addEventListener("input", () => input.hasAttribute("aria-invalid") && showError(input, errorFor(input)));
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const invalid = inputs.filter((input) => showError(input, errorFor(input)));
      if (invalid.length) return invalid[0].focus();
      form.hidden = true;
      form.nextElementSibling.hidden = false;
    });
  });

  // Tick a service chip in the lead form from ?dich-vu=<value> (e.g. the Set up CTA on the homepage)
  const service = new URLSearchParams(location.search).get("dich-vu");
  const serviceChip = service && document.querySelector(`[data-lead-form] input[name="services"][value="${CSS.escape(service)}"]`);
  if (serviceChip) serviceChip.checked = true;

  // Blog post: table of contents generated from the article's H2s; collapsed dropdown on mobile
  const toc = document.querySelector("[data-toc]");
  if (toc) {
    const slug = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    document.querySelectorAll("[data-post-body] h2").forEach((heading) => {
      heading.id ||= slug(heading.textContent);
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      const item = document.createElement("li");
      item.append(link);
      toc.append(item);
    });
    const tocBox = toc.closest("details");
    const mobile = window.matchMedia("(max-width: 900px)");
    if (mobile.matches) tocBox.removeAttribute("open");
    toc.addEventListener("click", (e) => e.target.closest("a") && mobile.matches && tocBox.removeAttribute("open"));
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      nav?.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
      closeDropdowns();
    }
  });
});
