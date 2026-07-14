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


  /* =============================== BLOG Links Hover  =============================== */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") return;

  document.querySelectorAll(".conseil--link").forEach(link => {

    const rod = link.querySelector(".rod--orange");

    gsap.set(rod, {
      scaleX: 0,
      transformOrigin: "left center"
    });

    link.addEventListener("mouseenter", () => {

      gsap.killTweensOf(rod);

      gsap.set(rod, {
        transformOrigin: "left center"
      });

      gsap.to(rod, {
        scaleX: 1,
        duration: 0.65,
        ease: "expo.out"
      });

    });

    link.addEventListener("mouseleave", () => {

      gsap.killTweensOf(rod);

      gsap.set(rod, {
        transformOrigin: "right center"
      });

      gsap.to(rod, {
        scaleX: 0,
        duration: 0.5,
        ease: "expo.out",
        onComplete: () => {
          gsap.set(rod, {
            transformOrigin: "left center"
          });
        }
      });

    });

  });
});


  /* ==========================================================================
     FIL D’ARIANE
  ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  const breadcrumbWrapper = document.querySelector(".arianne--wrapper");

  if (!breadcrumbWrapper) return;

  const currentPath = normalizePath(window.location.pathname);

  /**
   * Nettoie les chemins pour faciliter les comparaisons.
   * Exemple :
   * /humidite-mur/ devient /humidite-mur
   */
  function normalizePath(path) {
    if (!path) return "/";

    const normalized = path
      .split("?")[0]
      .split("#")[0]
      .replace(/\/+/g, "/")
      .replace(/\/$/, "");

    return normalized || "/";
  }

  /**
   * Transforme un texte en texte propre.
   */
  function cleanText(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Crée le séparateur SVG.
   */
  function createSeparator() {
    const namespace = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(namespace, "svg");
    svg.setAttribute("xmlns", namespace);
    svg.setAttribute("width", "100%");
    svg.setAttribute("viewBox", "0 0 8 8");
    svg.setAttribute("fill", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("icon--8");

    const path = document.createElementNS(namespace, "path");
    path.setAttribute(
      "d",
      "M2.75 0L2 0.75L5.25 4L2 7.25L2.75 8L6.75 4L2.75 0Z"
    );
    path.setAttribute("fill", "currentColor");

    svg.appendChild(path);

    return svg;
  }

  /**
   * Crée un lien du fil d’Ariane.
   */
  function createBreadcrumbLink(label, href) {
    const link = document.createElement("a");

    link.href = href;
    link.className = "link--arianne";
    link.textContent = cleanText(label);

    return link;
  }

  /**
   * Crée le texte correspondant à la page actuelle.
   */
  function createCurrentPage(label) {
    const current = document.createElement("span");

    current.className = "link--arianne is--current";
    current.textContent = cleanText(label);
    current.setAttribute("aria-current", "page");

    return current;
  }

  /**
   * Recherche le lien de navigation correspondant à la page actuelle.
   */
  function findCurrentNavigationLink() {
    const navigationLinks = Array.from(
      document.querySelectorAll(
        [
          ".navbar a[href]",
          ".footer a[href]"
        ].join(",")
      )
    );

    return navigationLinks.find(function (link) {
      const href = link.getAttribute("href");

      if (
        !href ||
        href === "#" ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return false;
      }

      let linkPath;

      try {
        linkPath = normalizePath(new URL(link.href, window.location.origin).pathname);
      } catch (error) {
        return false;
      }

      return linkPath === currentPath;
    });
  }

  /**
   * Récupère le nom de la page actuelle.
   *
   * Priorité :
   * 1. lien actif dans la navigation ;
   * 2. H1 de la page ;
   * 3. titre HTML ;
   * 4. slug de l’URL.
   */
  function getCurrentPageName(currentNavigationLink) {
    if (currentNavigationLink) {
      const navigationLabel = cleanText(currentNavigationLink.textContent);

      if (navigationLabel) {
        return navigationLabel;
      }
    }

    const pageHeading = document.querySelector("main h1");

    if (pageHeading) {
      const headingText = cleanText(pageHeading.textContent);

      if (headingText) {
        return headingText;
      }
    }

    const documentTitle = cleanText(
      document.title
        .split("|")[0]
        .split("–")[0]
        .split("—")[0]
    );

    if (documentTitle) {
      return documentTitle;
    }

    const currentSlug = currentPath.split("/").filter(Boolean).pop();

    if (currentSlug) {
      return currentSlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, function (letter) {
          return letter.toUpperCase();
        });
    }

    return "Accueil";
  }

  /**
   * Recherche le parent du dropdown contenant la page active.
   *
   * Exemple :
   * Traitement de l’humidité > Humidité mur
   */
  function getDropdownParent(currentNavigationLink) {
    if (!currentNavigationLink) return null;

    const dropdown = currentNavigationLink.closest(".nav--dropdown");

    if (!dropdown) return null;

    const dropdownTrigger = dropdown.querySelector(
      ":scope > .nav--dropdown-trigger"
    );

    if (!dropdownTrigger) return null;

    const parentHref = dropdownTrigger.getAttribute("href");
    const parentLabel = cleanText(dropdownTrigger.textContent);

    if (!parentHref || parentHref === "#" || !parentLabel) {
      return null;
    }

    const parentPath = normalizePath(
      new URL(parentHref, window.location.origin).pathname
    );

    if (parentPath === currentPath) {
      return null;
    }

    return {
      label: parentLabel,
      href: dropdownTrigger.href
    };
  }

  /**
   * Ajoute un élément au fil d’Ariane avec son séparateur.
   */
  function appendBreadcrumbItem(element, addSeparatorBefore) {
    if (addSeparatorBefore) {
      breadcrumbWrapper.appendChild(createSeparator());
    }

    breadcrumbWrapper.appendChild(element);
  }

  /**
   * Génération du fil d’Ariane.
   */
  function buildBreadcrumb() {
    const currentNavigationLink = findCurrentNavigationLink();
    const currentPageName = getCurrentPageName(currentNavigationLink);
    const dropdownParent = getDropdownParent(currentNavigationLink);

    const items = [];

    /*
     * On n’affiche pas "Accueil > Accueil"
     * sur la page d’accueil.
     */
    if (currentPath !== "/") {
      items.push({
        type: "link",
        label: "Accueil",
        href: "/"
      });
    }

    if (dropdownParent) {
      items.push({
        type: "link",
        label: dropdownParent.label,
        href: dropdownParent.href
      });
    }

    items.push({
      type: "current",
      label: currentPageName
    });

    breadcrumbWrapper.innerHTML = "";
    breadcrumbWrapper.setAttribute("aria-label", "Fil d’Ariane");

    items.forEach(function (item, index) {
      const element =
        item.type === "current"
          ? createCurrentPage(item.label)
          : createBreadcrumbLink(item.label, item.href);

      appendBreadcrumbItem(element, index > 0);
    });
  }

  buildBreadcrumb();
});
