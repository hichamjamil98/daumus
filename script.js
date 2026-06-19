document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const body = document.body;
  const isMobile = () => window.innerWidth <= 991;

  /* ===============================
     WOW LOAD ANIMATION
  =============================== */

  const loadElements = document.querySelectorAll('[animation="load"]');

  if (typeof gsap !== "undefined" && loadElements.length) {
    gsap.set(loadElements, {
      opacity: 0,
      y: "2rem",
      filter: "blur(8px)"
    });

    const tl = gsap.timeline({
      delay: 0.2
    });

    tl.to(loadElements, {
      opacity: 1,
      y: "0rem",
      filter: "blur(0px)",
      duration: 1.2,
      stagger: {
        each: 0.12,
        from: "start"
      },
      ease: "power4.out"
    });

    tl.set(loadElements, {
      clearProps: "willChange,filter"
    });
  }

  /* ===============================
     SCROLL ANIMATIONS
  =============================== */

  const animationSelector = [
    '[animation="loading"]',
    '[animation="loading-split"]',
    '[animation="fade"]',
    '[animation="fade-split"]',
    '[animation="fade-text-stagger"]',
    '[animation="fade-item"]'
  ].join(",");

  const staggerSelector = [
    '[animation="fade-stagger"]',
    '[animation="loading-stagger"]'
  ].join(",");

  const animatedItems = document.querySelectorAll(animationSelector);
  const staggerWrappers = document.querySelectorAll(staggerSelector);

  const showElement = (el) => {
    el.classList.add("is-visible");
  };

  const showStagger = (wrapper) => {
    [...wrapper.children].forEach((child, index) => {
      setTimeout(() => {
        child.classList.add("is-visible");
      }, index * 100);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (entry.target.matches(staggerSelector)) {
          showStagger(entry.target);
        } else {
          showElement(entry.target);
        }

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -5% 0px"
    }
  );

  animatedItems.forEach((el) => observer.observe(el));
  staggerWrappers.forEach((el) => observer.observe(el));

  /* ===============================
     NAVBAR HEIGHT MOBILE
  =============================== */

  const navbar = document.querySelector(".navbar");

  const setNavbarHeight = () => {
    if (!navbar || !isMobile()) {
      body.style.setProperty("--navbar-height-mobile", "0px");
      return;
    }

    body.style.setProperty("--navbar-height-mobile", `${navbar.offsetHeight}px`);
  };

  setNavbarHeight();
  window.addEventListener("resize", setNavbarHeight);
  window.addEventListener("load", setNavbarHeight);

  /* ===============================
     NAVBAR DROPDOWNS
  =============================== */

  document.querySelectorAll(".nav--dropdown").forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav--dropdown-trigger");
    const list = dropdown.querySelector(".nav--dropdown-list");

    if (!trigger || !list) return;

    const openDropdown = () => {
      dropdown.classList.add("is-open");

      if (isMobile()) {
        list.style.height = `${list.scrollHeight}px`;
      }
    };

    const closeDropdown = () => {
      dropdown.classList.remove("is-open");

      if (isMobile()) {
        list.style.height = "0px";
      }
    };

    trigger.addEventListener("click", (e) => {
      if (!isMobile()) return;

      e.preventDefault();
      e.stopPropagation();

      const isOpen = dropdown.classList.contains("is-open");

      document.querySelectorAll(".nav--dropdown.is-open").forEach((item) => {
        if (item === dropdown) return;

        const itemList = item.querySelector(".nav--dropdown-list");

        item.classList.remove("is-open");

        if (itemList) {
          itemList.style.height = "0px";
        }
      });

      isOpen ? closeDropdown() : openDropdown();
    });
  });

  /* ===============================
     MOBILE / TABLET HAMBURGER
  =============================== */

  const menuTrigger = document.querySelector(".navbar-menu-trigger");
  const menu = document.querySelector(".navbar--menu");
  const navbarTop = document.querySelector(".navbar--top");

  let scrollPosition = 0;

  const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth;
  };

  const lockPageScroll = () => {
    scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const scrollbarWidth = getScrollbarWidth();

    body.style.position = "fixed";
    body.style.top = `-${scrollPosition}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    html.classList.add("nav-open");
    body.classList.add("is-nav-open");
  };

  const unlockPageScroll = () => {
    html.classList.remove("nav-open");
    body.classList.remove("is-nav-open");

    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.paddingRight = "";

    window.scrollTo(0, scrollPosition);
  };

  const closeAllDropdowns = () => {
    document.querySelectorAll(".nav--dropdown.is-open").forEach((dropdown) => {
      const list = dropdown.querySelector(".nav--dropdown-list");

      dropdown.classList.remove("is-open");

      if (list && isMobile()) {
        list.style.height = "0px";
      }
    });
  };

  const openMenu = () => {
    if (!isMobile()) return;

    if (menu) {
      menu.classList.add("is-open");
    }

    lockPageScroll();

    if (navbarTop) {
      navbarTop.setAttribute("aria-hidden", "true");
    }
  };

  const closeMenu = () => {
    if (menu) {
      menu.classList.remove("is-open");
    }

    closeAllDropdowns();
    unlockPageScroll();

    if (navbarTop) {
      navbarTop.removeAttribute("aria-hidden");
    }
  };

  if (menuTrigger && menu) {
    menuTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      html.classList.contains("nav-open") ? closeMenu() : openMenu();
    });
  }

  window.addEventListener("resize", () => {
    setNavbarHeight();

    if (!isMobile()) {
      closeMenu();

      document.querySelectorAll(".nav--dropdown-list").forEach((list) => {
        list.style.height = "";
      });
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && html.classList.contains("nav-open")) {
      closeMenu();
    }
  });

  /* ===============================
     BUTTON HOVER
  =============================== */

  document.querySelectorAll(".button").forEach((button) => {
    const bg = button.querySelector(".button-bg");

    if (!bg) return;

    button.addEventListener("mouseenter", () => {
      button.classList.add("is-hover");
    });

    button.addEventListener("mouseleave", () => {
      button.classList.remove("is-hover");
    });
  });

  /* ===============================
     FOOTER YEAR
  =============================== */

  document.querySelectorAll(".footer-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});