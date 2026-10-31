/* Al-Fajr Academy — interactions */
(() => {
  "use strict";

  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("primaryNav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = nav ? Array.from(nav.querySelectorAll(".nav__link")) : [];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header state ---------- */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "فتح القائمة");
  };

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    });

    navLinks.forEach((link) => link.addEventListener("click", closeNav));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) closeNav();
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ---------- Active nav link ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const linkFor = (id) => navLinks.find((link) => link.getAttribute("href") === `#${id}`);

  if ("IntersectionObserver" in window && sections.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const active = linkFor(entry.target.id);
          if (!active) return;
          navLinks.forEach((link) => {
            const isActive = link === active;
            link.classList.toggle("is-active", isActive);
            if (isActive) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => activeObserver.observe(section));
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Salawat pop ---------- */
  const salawatPop = document.getElementById("salawatPop");
  const salawatClose = salawatPop ? salawatPop.querySelector(".salawat-pop__close") : null;
  if (salawatPop) {
    let salawatTimer = null;
    let salawatHideTimer = null;

    const hideSalawat = () => {
      salawatPop.classList.remove("is-visible");
      salawatPop.setAttribute("aria-hidden", "true");
      if (salawatHideTimer) { clearTimeout(salawatHideTimer); salawatHideTimer = null; }
    };

    const showSalawat = () => {
      if (document.hidden) return;
      salawatPop.classList.add("is-visible");
      salawatPop.setAttribute("aria-hidden", "false");
      if (salawatHideTimer) clearTimeout(salawatHideTimer);
      salawatHideTimer = setTimeout(hideSalawat, 5000);
    };

    const scheduleSalawat = (delay) => {
      if (salawatTimer) clearTimeout(salawatTimer);
      salawatTimer = setTimeout(() => {
        showSalawat();
        scheduleSalawat(45000);
      }, delay);
    };

    if (salawatClose) {
      salawatClose.addEventListener("click", hideSalawat);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (salawatTimer) { clearTimeout(salawatTimer); salawatTimer = null; }
        hideSalawat();
      } else {
        scheduleSalawat(5000);
      }
    });

    if (!prefersReducedMotion) {
      scheduleSalawat(5000);
    } else {
      // Show once, briefly, for reduced-motion users
      setTimeout(() => { showSalawat(); }, 5000);
    }
  }


  /* ---------- Testimonials carousel ---------- */
  const tTrack = document.getElementById("testimonialsTrack");
  const tPrev = document.querySelector(".t-nav--prev");
  const tNext = document.querySelector(".t-nav--next");
  if (tTrack && tPrev && tNext) {
    let tIndex = 0;
    const cards = () => Array.from(tTrack.children);
    const perView = () => (window.innerWidth >= 981 ? 3 : window.innerWidth >= 720 ? 2 : 1);
    const maxIndex = () => Math.max(0, cards().length - perView());
    const cardStep = () => {
      const c = cards()[0];
      if (!c) return 0;
      const gap = parseFloat(getComputedStyle(tTrack).gap) || 0;
      return c.getBoundingClientRect().width + gap;
    };
    const isRtl = getComputedStyle(tTrack).direction === "rtl";
    const update = () => {
      const x = isRtl ? tIndex * cardStep() : -tIndex * cardStep();
      tTrack.style.transform = "translateX(" + x + "px)";
      tPrev.disabled = tIndex <= 0;
      tNext.disabled = tIndex >= maxIndex();
    };
    tNext.addEventListener("click", () => {
      if (tIndex < maxIndex()) { tIndex++; update(); }
    });
    tPrev.addEventListener("click", () => {
      if (tIndex > 0) { tIndex--; update(); }
    });
    window.addEventListener("resize", () => {
      tIndex = Math.min(tIndex, maxIndex());
      update();
    });
    update();
  }

})();
