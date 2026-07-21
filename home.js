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
  /* ==========================================================================
   WEBFLOW NATIVE FORMS → HUBSPOT
   DAUMUS — CONTACT PARTICULIER FR / NL
========================================================================== */

window.addEventListener("load", function () {
  "use strict";

  /* ==========================================================================
     CONFIGURATION
  ========================================================================== */

  const HUBSPOT_PORTAL_ID = "26541958";

  const HUBSPOT_DATE_PROPERTY = "date_de_contact";

  const DEBUG_MODE = true;

  const FORMS_CONFIG = [
    {
      selector: "#wf-form-Particulier-Form---Fr",
      hubspotFormId: "ef087c85-92e1-43b9-885c-99fb576b540d",
      language: "fr",
      loadingText: "Envoi en cours...",
      publicErrorText:
        "Une erreur est survenue. Merci de réessayer."
    },
    {
      selector: "#wf-form-Particulier-Form---Nl",
      hubspotFormId: "11e7abc5-33a5-46f1-ace6-3559f9379169",
      language: "nl",
      loadingText: "Bezig met verzenden...",
      publicErrorText:
        "Er is een fout opgetreden. Probeer het opnieuw."
    }
  ];

  /* ==========================================================================
     FIELDS
  ========================================================================== */

  function getField(form, fieldName) {
    return form.querySelector(`[name="${fieldName}"]`);
  }

  function getFieldValue(form, fieldName) {
    const field = getField(form, fieldName);

    if (!field) {
      return "";
    }

    return String(field.value || "").trim();
  }

  function addHubSpotField(fields, name, value) {
    if (!name || value === undefined || value === null) {
      return;
    }

    const cleanValue = String(value).trim();

    if (!cleanValue) {
      return;
    }

    fields.push({
      name: name,
      value: cleanValue
    });
  }

  /* ==========================================================================
     HUBSPOT COOKIE
  ========================================================================== */

  function getHubSpotCookie() {
    const cookie = document.cookie
      .split("; ")
      .find(function (item) {
        return item.startsWith("hubspotutk=");
      });

    return cookie ? cookie.split("=")[1] || "" : "";
  }

  /* ==========================================================================
     PHONE — INTL TEL INPUT
  ========================================================================== */

  function getInternationalPhone(form) {
    const phoneInput =
      getField(form, "Phone") ||
      getField(form, "phone") ||
      form.querySelector('input[type="tel"]');

    if (!phoneInput) {
      return "";
    }

    /*
     * intl-tel-input moderne
     */
    if (
      window.intlTelInput &&
      typeof window.intlTelInput.getInstance === "function"
    ) {
      const instance =
        window.intlTelInput.getInstance(phoneInput);

      if (
        instance &&
        typeof instance.getNumber === "function"
      ) {
        const number = instance.getNumber();

        if (number) {
          return number;
        }
      }
    }

    /*
     * Compatibilité anciennes versions
     */
    if (
      window.intlTelInputGlobals &&
      typeof window.intlTelInputGlobals.getInstance ===
        "function"
    ) {
      const instance =
        window.intlTelInputGlobals.getInstance(phoneInput);

      if (
        instance &&
        typeof instance.getNumber === "function"
      ) {
        const number = instance.getNumber();

        if (number) {
          return number;
        }
      }
    }

    /*
     * Fallback manuel
     */
    let phoneValue = String(phoneInput.value || "")
      .trim()
      .replace(/[^\d+]/g, "");

    if (!phoneValue) {
      return "";
    }

    if (phoneValue.startsWith("+")) {
      return phoneValue;
    }

    const phoneWrapper = phoneInput.closest(".iti");

    const dialCode =
      phoneWrapper
        ?.querySelector(".iti__selected-dial-code")
        ?.textContent
        ?.trim() || "";

    phoneValue = phoneValue.replace(/^0+/, "");

    return `${dialCode}${phoneValue}`;
  }

  /* ==========================================================================
     DATE
  ========================================================================== */

  function convertDateToHubSpotTimestamp(value) {
    if (!value) {
      return "";
    }

    const cleanValue = String(value).trim();

    /*
     * Formats acceptés :
     *
     * 22/07/2026
     * 22/07/2026 à 12:00
     * 22/07/2026 at 12:00
     * 22-07-2026
     * 2026-07-22
     */

    let day;
    let month;
    let year;
    let hours = 0;
    let minutes = 0;
    let match;

    /*
     * DD/MM/YYYY avec heure optionnelle
     */
    match = cleanValue.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s*(?:à|at)\s*(\d{1,2}):(\d{2}))?$/i
    );

    if (match) {
      day = Number(match[1]);
      month = Number(match[2]);
      year = Number(match[3]);
      hours = Number(match[4] || 0);
      minutes = Number(match[5] || 0);
    }

    /*
     * DD-MM-YYYY avec heure optionnelle
     */
    if (!year) {
      match = cleanValue.match(
        /^(\d{1,2})-(\d{1,2})-(\d{4})(?:\s*(?:à|at)\s*(\d{1,2}):(\d{2}))?$/i
      );

      if (match) {
        day = Number(match[1]);
        month = Number(match[2]);
        year = Number(match[3]);
        hours = Number(match[4] || 0);
        minutes = Number(match[5] || 0);
      }
    }

    /*
     * YYYY-MM-DD avec heure optionnelle
     */
    if (!year) {
      match = cleanValue.match(
        /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{2}))?$/
      );

      if (match) {
        year = Number(match[1]);
        month = Number(match[2]);
        day = Number(match[3]);
        hours = Number(match[4] || 0);
        minutes = Number(match[5] || 0);
      }
    }

    if (!year || !month || !day) {
      console.warn(
        "Format de date non reconnu :",
        cleanValue
      );

      return "";
    }

    const date = new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        hours,
        minutes,
        0,
        0
      )
    );

    /*
     * Vérification de validité
     */
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      console.warn(
        "Date invalide :",
        cleanValue
      );

      return "";
    }

    /*
     * HubSpot attend un timestamp en millisecondes.
     */
    return String(date.getTime());
  }

  /* ==========================================================================
     PAYLOAD
  ========================================================================== */

  function buildHubSpotFields(form) {
    const fields = [];

    addHubSpotField(
      fields,
      "lastname",
      getFieldValue(form, "lastname")
    );

    addHubSpotField(
      fields,
      "firstname",
      getFieldValue(form, "firstname")
    );

    addHubSpotField(
      fields,
      "phone",
      getInternationalPhone(form)
    );

    addHubSpotField(
      fields,
      "code_postal",
      getFieldValue(form, "Code-postal")
    );

    const contactDate = getFieldValue(
      form,
      "Quand-souhaitez-vous-tre-recontact"
    );

    addHubSpotField(
      fields,
      HUBSPOT_DATE_PROPERTY,
      convertDateToHubSpotTimestamp(contactDate)
    );

    return fields;
  }

  function buildHubSpotContext() {
    const context = {
      pageUri: window.location.href,
      pageName: document.title
    };

    const hutk = getHubSpotCookie();

    if (hutk) {
      context.hutk = hutk;
    }

    return context;
  }

  /* ==========================================================================
     HUBSPOT ERROR
  ========================================================================== */

  function getHubSpotErrorMessage(responseData, status) {
    const messages = [];

    if (
      responseData &&
      Array.isArray(responseData.errors)
    ) {
      responseData.errors.forEach(function (error) {
        if (error.message) {
          messages.push(error.message);
        } else if (error.errorType) {
          messages.push(error.errorType);
        } else {
          try {
            messages.push(JSON.stringify(error));
          } catch (jsonError) {
            messages.push(
              "Erreur HubSpot non détaillée"
            );
          }
        }
      });
    }

    if (messages.length) {
      return messages.join(" | ");
    }

    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.rawResponse) {
      return responseData.rawResponse;
    }

    return `Erreur HubSpot ${status}`;
  }

  /* ==========================================================================
     SEND TO HUBSPOT
  ========================================================================== */

  async function sendToHubSpot(form, config) {
    const endpoint =
      "https://api.hsforms.com/submissions/v3/integration/submit/" +
      `${HUBSPOT_PORTAL_ID}/${config.hubspotFormId}`;

    const payload = {
      submittedAt: Date.now(),
      fields: buildHubSpotFields(form),
      context: buildHubSpotContext()
    };

    console.group(
      `HubSpot — ${config.language.toUpperCase()}`
    );

    console.log("Endpoint :", endpoint);
    console.log("Payload :", payload);
    console.log(
      "Payload JSON :",
      JSON.stringify(payload, null, 2)
    );

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json;charset=UTF-8"
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();

    let responseData = null;

    if (responseText) {
      try {
        responseData = JSON.parse(responseText);
      } catch (error) {
        responseData = {
          rawResponse: responseText
        };
      }
    }

    console.log("HTTP :", response.status);
    console.log("Réponse :", responseData);
    console.groupEnd();

    if (!response.ok) {
      const errorMessage =
        getHubSpotErrorMessage(
          responseData,
          response.status
        );

      const error = new Error(errorMessage);

      error.status = response.status;
      error.response = responseData;
      error.payload = payload;

      throw error;
    }

    return responseData;
  }

  /* ==========================================================================
     WEBFLOW MESSAGES
  ========================================================================== */

  function getFormMessages(form) {
    const formBlock = form.closest(".w-form");

    return {
      formBlock: formBlock,
      successMessage:
        formBlock?.querySelector(".w-form-done") ||
        null,
      errorMessage:
        formBlock?.querySelector(".w-form-fail") ||
        null
    };
  }

  function hideMessages(form) {
    const messages = getFormMessages(form);

    if (messages.successMessage) {
      messages.successMessage.style.display =
        "none";

      messages.successMessage.setAttribute(
        "aria-hidden",
        "true"
      );
    }

    if (messages.errorMessage) {
      messages.errorMessage.style.display =
        "none";

      messages.errorMessage.setAttribute(
        "aria-hidden",
        "true"
      );
    }
  }

  function showSuccess(form) {
    const messages = getFormMessages(form);

    form.style.display = "none";

    if (messages.errorMessage) {
      messages.errorMessage.style.display =
        "none";

      messages.errorMessage.setAttribute(
        "aria-hidden",
        "true"
      );
    }

    if (messages.successMessage) {
      messages.successMessage.style.display =
        "block";

      messages.successMessage.setAttribute(
        "aria-hidden",
        "false"
      );

      messages.successMessage.focus();
    }
  }

  function showError(form, message) {
    const messages = getFormMessages(form);

    form.style.display = "";

    if (messages.successMessage) {
      messages.successMessage.style.display =
        "none";

      messages.successMessage.setAttribute(
        "aria-hidden",
        "true"
      );
    }

    if (messages.errorMessage) {
      const errorText =
        messages.errorMessage.querySelector("div");

      if (errorText) {
        errorText.textContent = message;
      }

      messages.errorMessage.style.display =
        "block";

      messages.errorMessage.setAttribute(
        "aria-hidden",
        "false"
      );

      messages.errorMessage.focus();
    }
  }

  /* ==========================================================================
     CUSTOM BUTTON
  ========================================================================== */

  function getCustomButton(form) {
    return form.querySelector(
      ".btn--wrapper .button"
    );
  }

  function getCustomButtonText(button) {
    if (!button) {
      return null;
    }

    return (
      Array.from(button.children).find(
        function (child) {
          return !child.classList.contains(
            "button-bg"
          );
        }
      ) || null
    );
  }

  function setSubmittingState(
    form,
    config,
    isSubmitting
  ) {
    const nativeSubmit = form.querySelector(
      'input[type="submit"]'
    );

    const customButton =
      getCustomButton(form);

    const customButtonText =
      getCustomButtonText(customButton);

    if (nativeSubmit) {
      nativeSubmit.disabled = isSubmitting;
    }

    if (customButton) {
      customButton.style.pointerEvents =
        isSubmitting ? "none" : "";

      customButton.setAttribute(
        "aria-disabled",
        isSubmitting ? "true" : "false"
      );
    }

    if (customButtonText) {
      if (
        !customButtonText.dataset.originalText
      ) {
        customButtonText.dataset.originalText =
          customButtonText.textContent.trim();
      }

      customButtonText.textContent =
        isSubmitting
          ? config.loadingText
          : customButtonText.dataset.originalText;
    }
  }

  /* ==========================================================================
     INITIALIZATION
  ========================================================================== */

  FORMS_CONFIG.forEach(function (config) {
    const form = document.querySelector(
      config.selector
    );

    if (!form) {
      console.warn(
        `Formulaire introuvable : ${config.selector}`
      );

      return;
    }

    if (
      form.dataset.hubspotInitialized === "true"
    ) {
      return;
    }

    form.dataset.hubspotInitialized = "true";
    form.dataset.hubspotSubmitting = "false";

    hideMessages(form);

    const customButton =
      getCustomButton(form);

    const nativeSubmit = form.querySelector(
      'input[type="submit"]'
    );

    if (customButton) {
      customButton.addEventListener(
        "click",
        function (event) {
          event.preventDefault();

          if (
            form.dataset.hubspotSubmitting ===
            "true"
          ) {
            return;
          }

          if (
            typeof form.requestSubmit ===
            "function"
          ) {
            if (nativeSubmit) {
              form.requestSubmit(nativeSubmit);
            } else {
              form.requestSubmit();
            }

            return;
          }

          if (nativeSubmit) {
            nativeSubmit.click();
          }
        }
      );
    }

    form.addEventListener(
      "submit",
      async function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (
          form.dataset.hubspotSubmitting ===
          "true"
        ) {
          return;
        }

        hideMessages(form);

        if (
          typeof form.reportValidity ===
            "function" &&
          !form.reportValidity()
        ) {
          return;
        }

        form.dataset.hubspotSubmitting = "true";

        setSubmittingState(
          form,
          config,
          true
        );

        try {
          await sendToHubSpot(form, config);

          console.log(
            `Formulaire ${config.language.toUpperCase()} envoyé à HubSpot.`
          );

          form.reset();

          showSuccess(form);
        } catch (error) {
          console.error(
            `Erreur formulaire ${config.language.toUpperCase()} :`,
            error
          );

          const visibleMessage = DEBUG_MODE
            ? `HubSpot : ${error.message}`
            : config.publicErrorText;

          showError(
            form,
            visibleMessage
          );
        } finally {
          form.dataset.hubspotSubmitting =
            "false";

          setSubmittingState(
            form,
            config,
            false
          );
        }
      },
      true
    );
  });
});