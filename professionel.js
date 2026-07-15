/* ==========================================================================
   PHONE FIELDS - MULTIPLE FORMS
========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initPhoneFields();
  });
  
  function initPhoneFields() {
    if (typeof window.intlTelInput !== "function") return;
  
    const forms = document.querySelectorAll("form");
  
    forms.forEach((form, formIndex) => {
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
  
      phoneInputs.forEach((phoneInput, phoneIndex) => {
        if (phoneInput.dataset.itiInitialized === "true") return;
  
        phoneInput.dataset.itiInitialized = "true";
  
        /*
         * Corrige les IDs dupliqués lorsque plusieurs formulaires
         * Webflow utilisent tous l'ID "Phone".
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
  
        phoneInput.itiInstance = iti;
  
        /*
         * Convertit le numéro en format international
         * avant l'envoi du formulaire.
         */
        form.addEventListener("submit", () => {
          updatePhoneValue(phoneInput, iti);
        });
  
        /*
         * Sécurité supplémentaire pour les formulaires Webflow
         * avec bouton personnalisé.
         */
        form
          .querySelectorAll(
            'input[type="submit"], button[type="submit"], .submit--btn'
          )
          .forEach((submitButton) => {
            submitButton.addEventListener("click", () => {
              updatePhoneValue(phoneInput, iti);
            });
          });
      });
    });
  }
  
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
     PARALLAX IMAGES
  ========================================================================== */
  
  window.addEventListener("load", () => {
    if (
      typeof gsap === "undefined" ||
      typeof ScrollTrigger === "undefined"
    ) {
      return;
    }
  
    gsap.registerPlugin(ScrollTrigger);
  
    document.querySelectorAll('[animation="parallax"]').forEach((img) => {
      const wrapper =
        img.closest(".full--image-wrapper") || img.parentElement;
  
      if (!wrapper) return;
  
      gsap.set(wrapper, {
        overflow: "hidden",
        position: "relative"
      });
  
      gsap.set(img, {
        scale: 1.18,
        yPercent: -10,
        willChange: "transform"
      });
  
      gsap.to(img, {
        yPercent: 10,
        ease: "none",
  
        scrollTrigger: {
          trigger: wrapper,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });
    });
  
    ScrollTrigger.refresh();
  });