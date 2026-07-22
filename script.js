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

  const showElement = (element) => {
    element.classList.add("is-visible");
  };

  const showStagger = (wrapper) => {
    [...wrapper.children].forEach((child, index) => {
      window.setTimeout(() => {
        child.classList.add("is-visible");
      }, index * 100);
    });
  };

  if ("IntersectionObserver" in window) {
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

    animatedItems.forEach((element) => observer.observe(element));
    staggerWrappers.forEach((element) => observer.observe(element));
  } else {
    animatedItems.forEach(showElement);
    staggerWrappers.forEach(showStagger);
  }

  /* ===============================
     NAVBAR HEIGHT MOBILE
  =============================== */

  const navbar = document.querySelector(".navbar");

  const setNavbarHeight = () => {
    if (!navbar || !isMobile()) {
      body.style.setProperty("--navbar-height-mobile", "0px");
      return;
    }

    body.style.setProperty(
      "--navbar-height-mobile",
      `${navbar.offsetHeight}px`
    );
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

    trigger.addEventListener("click", (event) => {
      if (!isMobile()) return;

      event.preventDefault();
      event.stopPropagation();

      const isOpen = dropdown.classList.contains("is-open");

      document
        .querySelectorAll(".nav--dropdown.is-open")
        .forEach((item) => {
          if (item === dropdown) return;

          const itemList = item.querySelector(".nav--dropdown-list");

          item.classList.remove("is-open");

          if (itemList) {
            itemList.style.height = "0px";
          }
        });

      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });
  });

  /* ===============================
     MOBILE / TABLET HAMBURGER
  =============================== */

  const menuTrigger = document.querySelector(
    ".navbar-menu-trigger"
  );

  const menus = Array.from(
    document.querySelectorAll(".navbar--menu")
  );

  const navbarTop = document.querySelector(".navbar--top");

  let scrollPosition = 0;

  const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth;
  };

  const getCurrentNavbarType = () => {
    /*
     * 1. Source principale : le sélecteur
     * Particulier / Professionnel actif dans Webflow.
     */
    const professionalTypeLink = document.querySelector(
      [
        ".nav--type-link.is--professional.w--current",
        ".nav--type-link.is--professionel.w--current",
        '.nav--type-link.is--professional[aria-current="page"]',
        '.nav--type-link.is--professionel[aria-current="page"]'
      ].join(",")
    );

    if (professionalTypeLink) {
      return "professional";
    }

    const particulierTypeLink = document.querySelector(
      [
        ".nav--type-link.is--particulier.w--current",
        '.nav--type-link.is--particulier[aria-current="page"]'
      ].join(",")
    );

    if (particulierTypeLink) {
      return "particulier";
    }

    /*
     * 2. Sur une sous-page, on vérifie dans quel
     * navbar--menu se trouve le lien Webflow courant.
     */
    const professionalMenu = document.querySelector(
      ".navbar--menu.is--professional"
    );

    const particulierMenu = document.querySelector(
      ".navbar--menu.is--particulier"
    );

    if (
      professionalMenu?.querySelector(
        'a.w--current, a[aria-current="page"]'
      )
    ) {
      return "professional";
    }

    if (
      particulierMenu?.querySelector(
        'a.w--current, a[aria-current="page"]'
      )
    ) {
      return "particulier";
    }

    /*
     * 3. Sécurité supplémentaire selon l’URL.
     */
    const currentPath = window.location.pathname
      .toLowerCase()
      .replace(/\/+$/, "");

    const professionalPathPatterns = [
      "/professionnel",
      "/nl/professionnel"
    ];

    const isProfessionalPath =
      professionalPathPatterns.some((path) => {
        return (
          currentPath === path ||
          currentPath.startsWith(`${path}/`)
        );
      });

    if (isProfessionalPath) {
      return "professional";
    }

    return "particulier";
  };

  const getCurrentMenu = () => {
    const navbarType = getCurrentNavbarType();

    if (navbarType === "professional") {
      return document.querySelector(
        ".navbar--menu.is--professional"
      );
    }

    return document.querySelector(
      ".navbar--menu.is--particulier"
    );
  };

  const syncMenuVisibility = (activeMenu = null) => {
    menus.forEach((menu) => {
      const shouldOpen = menu === activeMenu;

      menu.classList.toggle("is-open", shouldOpen);
      menu.setAttribute(
        "aria-hidden",
        shouldOpen ? "false" : "true"
      );
    });
  };

  const lockPageScroll = () => {
    scrollPosition =
      window.scrollY || document.documentElement.scrollTop;

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

    if (menuTrigger) {
      menuTrigger.classList.add("is-open");
      menuTrigger.setAttribute("aria-expanded", "true");
    }
  };

  const unlockPageScroll = () => {
    const wasLocked =
      html.classList.contains("nav-open") ||
      body.classList.contains("is-nav-open");

    html.classList.remove("nav-open");
    body.classList.remove("is-nav-open");

    if (menuTrigger) {
      menuTrigger.classList.remove("is-open");
      menuTrigger.setAttribute("aria-expanded", "false");
    }

    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.paddingRight = "";

    if (wasLocked) {
      window.scrollTo(0, scrollPosition);
    }
  };

  const closeAllDropdowns = () => {
    document
      .querySelectorAll(".nav--dropdown.is-open")
      .forEach((dropdown) => {
        const list = dropdown.querySelector(
          ".nav--dropdown-list"
        );

        dropdown.classList.remove("is-open");

        if (list && isMobile()) {
          list.style.height = "0px";
        }
      });
  };

  const openMenu = () => {
    if (!isMobile()) return;

    const currentMenu = getCurrentMenu();

    if (!currentMenu) return;

    syncMenuVisibility(currentMenu);
    lockPageScroll();

    if (navbarTop) {
      navbarTop.setAttribute("aria-hidden", "true");
    }
  };

  const closeMenu = () => {
    syncMenuVisibility();
    closeAllDropdowns();
    unlockPageScroll();

    if (navbarTop) {
      navbarTop.removeAttribute("aria-hidden");
    }
  };

  if (menuTrigger && menus.length) {
    menuTrigger.setAttribute("aria-expanded", "false");

    menuTrigger.addEventListener("click", (event) => {
      if (!isMobile()) return;

      event.preventDefault();
      event.stopPropagation();

      if (html.classList.contains("nav-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  window.addEventListener("resize", () => {
    setNavbarHeight();

    if (!isMobile()) {
      closeMenu();

      document
        .querySelectorAll(".nav--dropdown-list")
        .forEach((list) => {
          list.style.height = "";
        });
    }
  });

  window.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      html.classList.contains("nav-open")
    ) {
      closeMenu();
    }
  });

  /* ===============================
     BUTTON HOVER
  =============================== */

  document.querySelectorAll(".button").forEach((button) => {
    const background = button.querySelector(".button-bg");

    if (!background) return;

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

  document.querySelectorAll(".footer-year").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
});

/* ==========================================================================
   BLOG LINKS HOVER
========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") return;

  document.querySelectorAll(".conseil--link").forEach((link) => {
    const rod = link.querySelector(".rod--orange");

    if (!rod) return;

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

document.addEventListener("DOMContentLoaded", () => {
  const breadcrumbWrapper = document.querySelector(
    ".arianne--wrapper"
  );

  if (!breadcrumbWrapper) return;

  function normalizePath(path) {
    if (!path) return "/";

    const normalized = path
      .split("?")[0]
      .split("#")[0]
      .replace(/\/+/g, "/")
      .replace(/\/$/, "");

    return normalized || "/";
  }

  function cleanText(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const currentPath = normalizePath(window.location.pathname);

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

  function createBreadcrumbLink(label, href) {
    const link = document.createElement("a");

    link.href = href;
    link.className = "link--arianne";
    link.textContent = cleanText(label);

    return link;
  }

  function createCurrentPage(label) {
    const current = document.createElement("span");

    current.className = "link--arianne is--current";
    current.textContent = cleanText(label);
    current.setAttribute("aria-current", "page");

    return current;
  }

  function findCurrentNavigationLink() {
    const navigationLinks = Array.from(
      document.querySelectorAll(
        [
          ".navbar a[href]",
          ".footer a[href]"
        ].join(",")
      )
    );

    return navigationLinks.find((link) => {
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
        linkPath = normalizePath(
          new URL(
            link.href,
            window.location.origin
          ).pathname
        );
      } catch (error) {
        return false;
      }

      return linkPath === currentPath;
    });
  }

  function getCurrentPageName(currentNavigationLink) {
    if (currentNavigationLink) {
      const navigationLabel = cleanText(
        currentNavigationLink.textContent
      );

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

    const currentSlug = currentPath
      .split("/")
      .filter(Boolean)
      .pop();

    if (currentSlug) {
      return currentSlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) => {
          return letter.toUpperCase();
        });
    }

    return "Accueil";
  }

  function getDropdownParent(currentNavigationLink) {
    if (!currentNavigationLink) return null;

    const dropdown = currentNavigationLink.closest(
      ".nav--dropdown"
    );

    if (!dropdown) return null;

    let dropdownTrigger = null;

    try {
      dropdownTrigger = dropdown.querySelector(
        ":scope > .nav--dropdown-trigger"
      );
    } catch (error) {
      dropdownTrigger = Array.from(dropdown.children).find(
        (child) =>
          child.classList &&
          child.classList.contains(
            "nav--dropdown-trigger"
          )
      );
    }

    if (!dropdownTrigger) return null;

    const parentHref = dropdownTrigger.getAttribute("href");
    const parentLabel = cleanText(
      dropdownTrigger.textContent
    );

    if (
      !parentHref ||
      parentHref === "#" ||
      !parentLabel
    ) {
      return null;
    }

    let parentPath;

    try {
      parentPath = normalizePath(
        new URL(
          parentHref,
          window.location.origin
        ).pathname
      );
    } catch (error) {
      return null;
    }

    if (parentPath === currentPath) {
      return null;
    }

    return {
      label: parentLabel,
      href: dropdownTrigger.href
    };
  }

  function appendBreadcrumbItem(
    element,
    addSeparatorBefore
  ) {
    if (addSeparatorBefore) {
      breadcrumbWrapper.appendChild(
        createSeparator()
      );
    }

    breadcrumbWrapper.appendChild(element);
  }

  function buildBreadcrumb() {
    const currentNavigationLink =
      findCurrentNavigationLink();

    const currentPageName =
      getCurrentPageName(currentNavigationLink);

    const dropdownParent =
      getDropdownParent(currentNavigationLink);

    const items = [];

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
    breadcrumbWrapper.setAttribute(
      "aria-label",
      "Fil d’Ariane"
    );

    items.forEach((item, index) => {
      const element =
        item.type === "current"
          ? createCurrentPage(item.label)
          : createBreadcrumbLink(
              item.label,
              item.href
            );

      appendBreadcrumbItem(
        element,
        index > 0
      );
    });
  }

  buildBreadcrumb();
});

/* ==========================================================================
   LANGUAGE VISIBILITY — FR / NL
========================================================================== */

(function () {
  "use strict";

  const SUPPORTED_LANGUAGES = ["fr", "nl"];
  const HIDDEN_CLASS = "is--language-hidden";

  function normalizeLanguage(language) {
    if (!language) return "";

    return language
      .toString()
      .trim()
      .toLowerCase()
      .split("-")[0];
  }

  function getCurrentLanguage() {
    const htmlLanguage = normalizeLanguage(
      document.documentElement.getAttribute("lang")
    );

    if (
      SUPPORTED_LANGUAGES.includes(htmlLanguage)
    ) {
      return htmlLanguage;
    }

    const pathSegments = window.location.pathname
      .toLowerCase()
      .split("/")
      .filter(Boolean);

    if (pathSegments.includes("nl")) {
      return "nl";
    }

    return "fr";
  }

  function getLanguageFields(element) {
    if (
      element.matches(
        "input, select, textarea, button"
      )
    ) {
      return [element];
    }

    return Array.from(
      element.querySelectorAll(
        "input, select, textarea, button"
      )
    );
  }

  function updateFieldState(
    field,
    shouldDisplay
  ) {
    if (!shouldDisplay) {
      if (
        !field.hasAttribute(
          "data-language-was-disabled"
        )
      ) {
        field.setAttribute(
          "data-language-was-disabled",
          field.disabled ? "true" : "false"
        );
      }

      field.disabled = true;
      return;
    }

    const wasDisabled = field.getAttribute(
      "data-language-was-disabled"
    );

    if (wasDisabled === "false") {
      field.disabled = false;
    }

    field.removeAttribute(
      "data-language-was-disabled"
    );
  }

  function updateLanguageElements() {
    const currentLanguage =
      getCurrentLanguage();

    const htmlElement =
      document.documentElement;

    htmlElement.classList.remove(
      "is--language-fr",
      "is--language-nl"
    );

    htmlElement.classList.add(
      `is--language-${currentLanguage}`
    );

    const languageElements =
      document.querySelectorAll(
        [
          'body [lang="fr"]',
          'body [lang^="fr-"]',
          'body [lang="nl"]',
          'body [lang^="nl-"]'
        ].join(",")
      );

    languageElements.forEach((element) => {
      const elementLanguage =
        normalizeLanguage(
          element.getAttribute("lang")
        );

      const shouldDisplay =
        elementLanguage === currentLanguage;

      element.classList.toggle(
        HIDDEN_CLASS,
        !shouldDisplay
      );

      element.setAttribute(
        "aria-hidden",
        shouldDisplay ? "false" : "true"
      );

      const formFields =
        getLanguageFields(element);

      formFields.forEach((field) => {
        updateFieldState(
          field,
          shouldDisplay
        );
      });
    });

    document.dispatchEvent(
      new CustomEvent(
        "languageVisibilityUpdated",
        {
          detail: {
            language: currentLanguage
          }
        }
      )
    );
  }

  function initLanguageVisibility() {
    updateLanguageElements();

    const htmlObserver =
      new MutationObserver((mutations) => {
        const languageChanged =
          mutations.some((mutation) => {
            return (
              mutation.type === "attributes" &&
              mutation.attributeName === "lang"
            );
          });

        if (languageChanged) {
          updateLanguageElements();
        }
      });

    htmlObserver.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: ["lang"]
      }
    );

    let updateQueued = false;

    const queueLanguageUpdate = () => {
      if (updateQueued) return;

      updateQueued = true;

      window.requestAnimationFrame(() => {
        updateQueued = false;
        updateLanguageElements();
      });
    };

    const bodyObserver =
      new MutationObserver((mutations) => {
        const hasNewLanguageElements =
          mutations.some((mutation) => {
            return Array.from(
              mutation.addedNodes
            ).some((node) => {
              if (node.nodeType !== 1) {
                return false;
              }

              const element = node;

              return (
                element.matches?.(
                  '[lang="fr"], [lang^="fr-"], [lang="nl"], [lang^="nl-"]'
                ) ||
                element.querySelector?.(
                  '[lang="fr"], [lang^="fr-"], [lang="nl"], [lang^="nl-"]'
                )
              );
            });
          });

        if (hasNewLanguageElements) {
          queueLanguageUpdate();
        }
      });

    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.addEventListener(
      "popstate",
      updateLanguageElements
    );

    window.addEventListener(
      "hashchange",
      updateLanguageElements
    );

    document.addEventListener(
      "languageChanged",
      updateLanguageElements
    );

    document.addEventListener(
      "weglotLanguageChanged",
      updateLanguageElements
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initLanguageVisibility
    );
  } else {
    initLanguageVisibility();
  }
})();

/* ==========================================================================
   WEBFLOW LOCALIZATION DROPDOWN
========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const wrappers = document.querySelectorAll(
    ".localization--wrapper"
  );

  wrappers.forEach((wrapper) => {
    const localeItems = Array.from(
      wrapper.querySelectorAll(".w-locales-item")
    );

    if (localeItems.length < 2) return;

    const localesContainer = wrapper.querySelector(
      ".w-locales-items"
    );

    const pageLanguage = (
      document.documentElement.lang || ""
    )
      .trim()
      .toLowerCase()
      .split("-")[0];

    let currentItem = localeItems.find((item) => {
      const link = item.querySelector("a");

      return (
        item.classList.contains("w--current") ||
        link?.classList.contains("w--current") ||
        link?.getAttribute("aria-current") === "page"
      );
    });

    if (!currentItem && pageLanguage) {
      currentItem = localeItems.find((item) => {
        const link = item.querySelector("a");

        const linkLanguage = (
          link?.getAttribute("hreflang") ||
          link?.getAttribute("lang") ||
          item.getAttribute("lang") ||
          ""
        )
          .trim()
          .toLowerCase()
          .split("-")[0];

        const linkText = link?.textContent
          .trim()
          .toLowerCase();

        return (
          linkLanguage === pageLanguage ||
          linkText === pageLanguage
        );
      });
    }

    if (!currentItem) {
      currentItem = localeItems[0];
    }

    localeItems.forEach((item) => {
      item.classList.toggle(
        "is--current-language",
        item === currentItem
      );
    });

    /*
     * Place la langue actuelle en première position.
     */
    if (localesContainer) {
      localesContainer.prepend(currentItem);
    }

    wrapper.setAttribute("role", "button");
    wrapper.setAttribute("tabindex", "0");
    wrapper.setAttribute("aria-haspopup", "menu");
    wrapper.setAttribute("aria-expanded", "false");

    const closeDropdown = () => {
      wrapper.classList.remove("is--open");
      wrapper.setAttribute("aria-expanded", "false");
    };

    const openDropdown = () => {
      document
        .querySelectorAll(
          ".localization--wrapper.is--open"
        )
        .forEach((otherWrapper) => {
          if (otherWrapper !== wrapper) {
            otherWrapper.classList.remove("is--open");
            otherWrapper.setAttribute(
              "aria-expanded",
              "false"
            );
          }
        });

      wrapper.classList.add("is--open");
      wrapper.setAttribute("aria-expanded", "true");
    };

    const toggleDropdown = () => {
      if (wrapper.classList.contains("is--open")) {
        closeDropdown();
      } else {
        openDropdown();
      }
    };

    wrapper.addEventListener("click", (event) => {
      const clickedItem = event.target.closest(
        ".w-locales-item"
      );

      /*
       * Clic sur l'autre langue :
       * on laisse le vrai lien Webflow fonctionner.
       */
      if (
        clickedItem &&
        !clickedItem.classList.contains(
          "is--current-language"
        )
      ) {
        const link = clickedItem.querySelector("a");
        const href = link?.getAttribute("href");

        if (!href || href === "#") {
          event.preventDefault();

          console.error(
            "Le Locale Link doit être connecté à Locales list item > Page dans Webflow."
          );
        }

        return;
      }

      /*
       * Clic sur la langue actuelle ou la flèche.
       */
      event.preventDefault();
      event.stopPropagation();
      toggleDropdown();
    });

    wrapper.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        toggleDropdown();
      }

      if (event.key === "Escape") {
        closeDropdown();
        wrapper.focus();
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        openDropdown();

        const secondaryLink = wrapper.querySelector(
          ".w-locales-item:not(.is--current-language) a"
        );

        secondaryLink?.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!wrapper.contains(event.target)) {
        closeDropdown();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    });
  });
});