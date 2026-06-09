document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // LOADING
    // ==================================================
  
    const loadingScreen = document.querySelector(".loading--screen");
  
    if (loadingScreen) {
  
      const alreadySeen = sessionStorage.getItem("loading-seen");
  
      if (!alreadySeen) {
  
        document.body.style.overflow = "hidden";
  
        setTimeout(() => {
  
          loadingScreen.classList.add("is-hidden");
  
          document.body.style.overflow = "";
  
          sessionStorage.setItem("loading-seen", "true");
  
        }, 1800);
  
      } else {
  
        loadingScreen.style.display = "none";
  
      }
    }
  
    // ==================================================
    // FADE IN ELEMENTS
    // ==================================================
  
    const fadeElements = document.querySelectorAll(`
      [animation="fade"],
      [animation="loading"],
      [animation="fade-split"]
    `);
  
    const fadeObserver = new IntersectionObserver((entries) => {
  
      entries.forEach(entry => {
  
        if (entry.isIntersecting) {
  
          entry.target.classList.add("is-visible");
  
          fadeObserver.unobserve(entry.target);
  
        }
  
      });
  
    }, {
      threshold: 0.15
    });
  
    fadeElements.forEach(el => fadeObserver.observe(el));
  
    // ==================================================
    // STAGGER ITEMS
    // ==================================================
  
    const staggerWrappers = document.querySelectorAll(`
      [animation="fade-stagger"],
      [animation="loading-stagger"]
    `);
  
    staggerWrappers.forEach(wrapper => {
  
      const items = [...wrapper.children];
  
      const observer = new IntersectionObserver(entries => {
  
        entries.forEach(entry => {
  
          if (!entry.isIntersecting) return;
  
          items.forEach((item, index) => {
  
            setTimeout(() => {
  
              item.classList.add("is-visible");
  
            }, index * 120);
  
          });
  
          observer.unobserve(wrapper);
  
        });
  
      }, {
        threshold: 0.1
      });
  
      observer.observe(wrapper);
  
    });
  
    // ==================================================
    // NAVBAR MOBILE
    // ==================================================
  
    const menuTrigger = document.querySelector(".navbar-menu-trigger");
    const navbarMenu = document.querySelector(".navbar--menu");
  
    if (menuTrigger && navbarMenu) {
  
      menuTrigger.addEventListener("click", () => {
  
        const isOpen = navbarMenu.classList.toggle("is-open");
  
        menuTrigger.classList.toggle("is-open");
  
        document.body.style.overflow = isOpen ? "hidden" : "";
  
      });
  
    }
  
    // ==================================================
    // NAVBAR DROPDOWNS
    // ==================================================
  
    document.querySelectorAll(".nav--dropdown").forEach(dropdown => {
  
      const trigger = dropdown.querySelector(".nav--dropdown-trigger");
  
      const content = dropdown.querySelector(".nav--dropdown-list");
  
      const arrow = dropdown.querySelector(".nav--drop-arrow");
  
      if (!trigger || !content) return;
  
      trigger.addEventListener("click", () => {
  
        const isOpen = dropdown.classList.toggle("is-open");
  
        if (window.innerWidth <= 991) {
  
          content.style.maxHeight = isOpen
            ? content.scrollHeight + "px"
            : "0px";
  
        }
  
        if (arrow) {
          arrow.style.transform =
            isOpen
              ? "rotate(180deg)"
              : "rotate(0deg)";
        }
  
      });
  
    });
  
    // ==================================================
    // FAQ
    // ==================================================
  
    document.querySelectorAll(".faq--item").forEach(item => {
  
      const answer = item.querySelector(".faq--response");
  
      if (!answer) return;
  
      answer.style.maxHeight = "0px";
  
      item.addEventListener("click", () => {
  
        const isOpen = item.classList.toggle("open");
  
        answer.style.maxHeight = isOpen
          ? answer.scrollHeight + "px"
          : "0px";
  
      });
  
    });
  
    // ==================================================
    // BUTTON HOVER
    // ==================================================
  
    document.querySelectorAll(".button").forEach(button => {
  
      const bg = button.querySelector(".button-bg");
  
      if (!bg) return;
  
      button.addEventListener("mouseenter", () => {
        bg.classList.add("is-hover");
      });
  
      button.addEventListener("mouseleave", () => {
        bg.classList.remove("is-hover");
      });
  
    });
  
  });