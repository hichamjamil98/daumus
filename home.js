/* ==========================================================================
   HOME
   Swipers / Video Modal / Forms
   ========================================================================== */

   document.addEventListener("DOMContentLoaded", () => {
    initSwipers();
    initVideoModals();
    initForms();
  });
  
  
  /* ==========================================================================
     SWIPERS
     ========================================================================== */
  
  function initSwipers() {
    if (typeof Swiper === "undefined") return;
  
    const sliders = [
      {
        selector: ".swiper.is--advices",
        desktopSlides: 2,
        autoplay: true
      },
      {
        selector: ".swiper.is--testimonial",
        desktopSlides: 3,
        autoplay: true
      }
    ];
  
    sliders.forEach((sliderConfig) => {
      document
        .querySelectorAll(sliderConfig.selector)
        .forEach((slider, sliderIndex) => {
          if (slider.swiper) return;
  
          const section =
            slider.closest("section") ||
            slider.closest(".section") ||
            slider.parentElement;
  
          const nextBtn = section?.querySelector(".swiper-btn-next");
          const prevBtn = section?.querySelector(".swiper-btn-prev");
  
          new Swiper(slider, {
            loop: true,
            speed: 700,
  
            autoplay: sliderConfig.autoplay
              ? {
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true
                }
              : false,
  
            navigation:
              nextBtn && prevBtn
                ? {
                    nextEl: nextBtn,
                    prevEl: prevBtn
                  }
                : false,
  
            slidesPerView: sliderConfig.desktopSlides,
            spaceBetween: 24,
  
            observer: true,
            observeParents: true,
            watchOverflow: true,
  
            breakpoints: {
              0: {
                slidesPerView: 1,
                spaceBetween: 16
              },
  
              768: {
                slidesPerView: 1,
                spaceBetween: 20
              },
  
              992: {
                slidesPerView: sliderConfig.desktopSlides,
                spaceBetween: 24
              }
            },
  
            on: {
              init(swiper) {
                slider.dataset.swiperInitialized = "true";
                slider.dataset.swiperIndex = String(sliderIndex);
              }
            }
          });
        });
    });
  }
  
  
  /* ==========================================================================
     VIDEO MODALS
     ========================================================================== */
  
  function initVideoModals() {
    const playButtons = document.querySelectorAll(".video--play");
  
    if (!playButtons.length) return;
  
    playButtons.forEach((playBtn) => {
      const modalSelector = playBtn.getAttribute("data-video-modal");
  
      const modal = modalSelector
        ? document.querySelector(modalSelector)
        : document.querySelector(".video-modal");
  
      if (!modal) return;
  
      const modalInside = modal.querySelector(".video-modal_inside");
      const closeBtn = modal.querySelector(".modal-close-button");
      const iframe = modal.querySelector("iframe");
  
      if (!iframe) return;
  
      const videoSrc =
        playBtn.getAttribute("data-video-src") ||
        iframe.getAttribute("data-video-src") ||
        "https://www.youtube.com/embed/CLuFK9Zxbm8?autoplay=1&rel=0";
  
      function openModal(event) {
        event.preventDefault();
  
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
  
        document.documentElement.classList.add("is--modal-open");
        document.body.classList.add("is--modal-open");
  
        iframe.src = addAutoplay(videoSrc);
      }
  
      function closeModal(event) {
        if (event) event.preventDefault();
  
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
  
        document.documentElement.classList.remove("is--modal-open");
        document.body.classList.remove("is--modal-open");
  
        iframe.src = "";
      }
  
      playBtn.addEventListener("click", openModal);
      closeBtn?.addEventListener("click", closeModal);
  
      modal.addEventListener("click", (event) => {
        if (!modalInside || !modalInside.contains(event.target)) {
          closeModal(event);
        }
      });
  
      document.addEventListener("keydown", (event) => {
        if (
          event.key === "Escape" &&
          modal.style.display === "flex"
        ) {
          closeModal(event);
        }
      });
    });
  }
  
  
  /**
   * Ajoute autoplay=1 à une URL vidéo sans casser
   * les paramètres déjà présents.
   */
  function addAutoplay(url) {
    if (!url) return "";
  
    try {
      const parsedUrl = new URL(url, window.location.origin);
  
      parsedUrl.searchParams.set("autoplay", "1");
  
      return parsedUrl.toString();
    } catch (error) {
      const separator = url.includes("?") ? "&" : "?";
  
      return url.includes("autoplay=")
        ? url
        : `${url}${separator}autoplay=1`;
    }
  }
  
  
  /* ==========================================================================
     FORM ENHANCEMENTS
     Plusieurs formulaires par page
     Phone / Date Picker / Fake Submit
     ========================================================================== */
  
  function initForms() {
    const forms = document.querySelectorAll(
      [
        "#wf-form-Particulier-Form",
        "form[data-enhanced-form]",
        ".w-form form"
      ].join(",")
    );
  
    if (!forms.length) return;
  
    forms.forEach((form, formIndex) => {
      if (form.dataset.formEnhanced === "true") return;
  
      form.dataset.formEnhanced = "true";
      form.dataset.formIndex = String(formIndex);
  
      initPhoneFields(form, formIndex);
      initDateFields(form);
      initFakeSubmit(form);
    });
  }
  
  
  /* ==========================================================================
     PHONE FIELDS
     ========================================================================== */
  
  function initPhoneFields(form, formIndex) {
    if (typeof window.intlTelInput !== "function") return;
  
    const phoneInputs = form.querySelectorAll(
      [
        'input[type="tel"]',
        'input[name="Phone"]',
        'input[name="phone"]',
        'input[name*="phone" i]',
        'input[id="Phone"]',
        "[data-phone-input]"
      ].join(",")
    );
  
    if (!phoneInputs.length) return;
  
    phoneInputs.forEach((phoneInput, phoneIndex) => {
      if (phoneInput.dataset.itiInitialized === "true") return;
  
      phoneInput.dataset.itiInitialized = "true";
  
      /*
       * Les IDs doivent normalement être uniques.
       * Cette partie corrige les IDs dupliqués par Webflow
       * lorsque plusieurs formulaires sont présents.
       */
      if (phoneInput.id) {
        phoneInput.id = `${phoneInput.id}-${formIndex + 1}-${phoneIndex + 1}`;
      }
  
      const initialCountry =
        phoneInput.getAttribute("data-initial-country") || "be";
  
      const preferredCountriesAttribute = phoneInput.getAttribute(
        "data-preferred-countries"
      );
  
      const preferredCountries = preferredCountriesAttribute
        ? preferredCountriesAttribute
            .split(",")
            .map((country) => country.trim().toLowerCase())
            .filter(Boolean)
        : ["be", "fr", "ma", "ch", "es"];
  
      const iti = window.intlTelInput(phoneInput, {
        initialCountry,
        preferredCountries,
        separateDialCode: true,
        nationalMode: false,
        formatAsYouType: true,
        autoPlaceholder: "polite",
        dropdownContainer: document.body,
  
        utilsScript:
          "https://cdn.jsdelivr.net/npm/intl-tel-input@25/build/js/utils.js"
      });
  
      /*
       * Sauvegarde l'instance directement sur l'input.
       * Utile pour accéder ensuite à :
       * phoneInput._itiInstance
       */
      phoneInput._itiInstance = iti;
  
      /*
       * Avant envoi, la valeur visible est remplacée
       * par le numéro international complet.
       */
      form.addEventListener("submit", () => {
        updatePhoneValue(phoneInput, iti);
      });
  
      /*
       * Webflow peut déclencher un clic sur le bouton submit
       * avant l'événement submit selon la structure utilisée.
       */
      const submitButtons = form.querySelectorAll(
        [
          'input[type="submit"]',
          'button[type="submit"]',
          ".submit--btn"
        ].join(",")
      );
  
      submitButtons.forEach((button) => {
        button.addEventListener("click", () => {
          updatePhoneValue(phoneInput, iti);
        });
      });
    });
  }
  
  
  /**
   * Remplace la valeur locale par le numéro international complet.
   */
  function updatePhoneValue(phoneInput, iti) {
    if (!phoneInput || !iti) return;
  
    const currentValue = phoneInput.value.trim();
  
    if (!currentValue) return;
  
    const internationalNumber = iti.getNumber();
  
    if (internationalNumber) {
      phoneInput.value = internationalNumber;
    }
  }
  
  
  /* ==========================================================================
     DATE FIELDS
     ========================================================================== */
  
  function initDateFields(form) {
    if (typeof window.flatpickr !== "function") return;
  
    const dateInputs = form.querySelectorAll(
      [
        'input[id="Date-Contact"]',
        'input[name="Date-Contact"]',
        'input[name*="date" i]',
        "[data-date-picker]"
      ].join(",")
    );
  
    dateInputs.forEach((dateInput) => {
      if (dateInput.dataset.flatpickrInitialized === "true") return;
  
      dateInput.dataset.flatpickrInitialized = "true";
  
      window.flatpickr(dateInput, {
        locale:
          document.documentElement.lang?.toLowerCase().startsWith("nl")
            ? "nl"
            : "fr",
  
        enableTime: true,
        dateFormat: "d/m/Y à H:i",
        minDate: "today",
        time_24hr: true,
        minuteIncrement: 15,
        disableMobile: true,
        allowInput: false
      });
    });
  }
  
  
  /* ==========================================================================
     FAKE SUBMIT BUTTONS
     ========================================================================== */
  
  function initFakeSubmit(form) {
    const fakeButtons = form.querySelectorAll(
      [
        ".btn--wrapper .button",
        "[data-fake-submit]"
      ].join(",")
    );
  
    const realSubmit = form.querySelector(
      [
        ".submit--btn",
        'input[type="submit"]',
        'button[type="submit"]:not([data-fake-submit])'
      ].join(",")
    );
  
    if (!fakeButtons.length || !realSubmit) return;
  
    /*
     * On ne masque le vrai bouton que s'il ne correspond
     * pas lui-même au bouton visible.
     */
    fakeButtons.forEach((fakeButton) => {
      if (fakeButton === realSubmit) return;
  
      fakeButton.addEventListener("click", (event) => {
        event.preventDefault();
  
        /*
         * requestSubmit() respecte la validation HTML native,
         * contrairement à form.submit().
         */
        if (typeof form.requestSubmit === "function") {
          form.requestSubmit(realSubmit);
        } else {
          realSubmit.click();
        }
      });
    });
  
    if (![...fakeButtons].includes(realSubmit)) {
      realSubmit.style.display = "none";
    }
  }