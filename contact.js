window.addEventListener("load", function () {
  "use strict";

  /* ==========================================================================
     PHONE FIELD — INTL TEL INPUT
  ========================================================================== */

  const form = document.querySelector("#wf-form-Particulier-Form");
  const phoneInput = document.querySelector("#Phone");

  if (phoneInput && window.intlTelInput) {
    const iti = window.intlTelInput(phoneInput, {
      initialCountry: "be",
      preferredCountries: ["be", "fr", "ma", "ch", "es"],
      separateDialCode: true,
      nationalMode: false,
      formatAsYouType: true,
      utilsScript:
        "https://cdn.jsdelivr.net/npm/intl-tel-input@25/build/js/utils.js"
    });

    if (form) {
      form.addEventListener("submit", function () {
        const completePhoneNumber = iti.getNumber();

        if (completePhoneNumber) {
          phoneInput.value = completePhoneNumber;
        }
      });
    }
  }

  /* ==========================================================================
     PARALLAX ANIMATION
  ========================================================================== */

  if (!window.gsap || !window.ScrollTrigger) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  document
    .querySelectorAll('[animation="parallax"]')
    .forEach(function (image) {
      const wrapper =
        image.closest(".full--image-wrapper") || image.parentElement;

      if (!wrapper) return;

      gsap.set(wrapper, {
        overflow: "hidden",
        position: "relative"
      });

      gsap.set(image, {
        scale: 1.18,
        yPercent: -10,
        willChange: "transform"
      });

      gsap.to(image, {
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