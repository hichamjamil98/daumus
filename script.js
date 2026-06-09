document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const body = document.body;
    const isMobile = () => window.innerWidth <= 991;
  
    /* ===============================
       ANIMATIONS
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
       NAVBAR DROPDOWNS
    =============================== */
  
    document.querySelectorAll(".nav--dropdown").forEach((dropdown) => {
      const trigger = dropdown.querySelector(".nav--dropdown-trigger");
      const list = dropdown.querySelector(".nav--dropdown-list");
  
      if (!trigger || !list) return;
  
      const openDropdown = () => {
        dropdown.classList.add("is-open");
  
        if (isMobile()) {
          list.style.height = list.scrollHeight + "px";
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
    const navbarBottom = document.querySelector(".navbar--bottom");
  
    const setMobileNavTop = () => {
      if (!navbarBottom) return;
  
      const navRect = navbarBottom.getBoundingClientRect();
      const navBottomPosition = navRect.bottom;
  
      html.style.setProperty("--nav-mobile-top", `${navBottomPosition}px`);
    };
  
    const closeMenu = () => {
      html.classList.remove("nav-open");
      body.classList.remove("is-nav-open");
  
      if (menu) {
        menu.classList.remove("is-open");
      }
  
      document.querySelectorAll(".nav--dropdown.is-open").forEach((dropdown) => {
        const list = dropdown.querySelector(".nav--dropdown-list");
  
        dropdown.classList.remove("is-open");
  
        if (list && isMobile()) {
          list.style.height = "0px";
        }
      });
    };
  
    const openMenu = () => {
      setMobileNavTop();
  
      html.classList.add("nav-open");
      body.classList.add("is-nav-open");
  
      if (menu) {
        menu.classList.add("is-open");
      }
    };
  
    if (menuTrigger && menu) {
      menuTrigger.addEventListener("click", () => {
        html.classList.contains("nav-open") ? closeMenu() : openMenu();
      });
    }
  
    window.addEventListener("resize", () => {
      setMobileNavTop();
  
      if (!isMobile()) {
        closeMenu();
  
        document.querySelectorAll(".nav--dropdown-list").forEach((list) => {
          list.style.height = "";
        });
      }
    });
  
    /* ===============================
       BUTTON HOVER
    =============================== */
  
    document.querySelectorAll(".button").forEach((button) => {
      const bg = button.querySelector(".button-bg");
  
      if (!bg) return;
  
      button.addEventListener("mouseenter", () => {
        bg.style.transform = "scaleX(1)";
      });
  
      button.addEventListener("mouseleave", () => {
        bg.style.transform = "";
      });
    });
  });