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
  /* ==========================================================================
   WEBFLOW NATIVE FORMS → HUBSPOT
   DAUMUS — 4 FORMULAIRES FR / NL
========================================================================== */

window.addEventListener("load", function () {
  "use strict";

  /* ==========================================================================
     CONFIGURATION
  ========================================================================== */

  const HUBSPOT_PORTAL_ID = "26541958";
  const DEBUG_MODE = true;

  const FORMS_CONFIG = [
    /* HERO — FR */
    {
      selector: "#wf-form-Professionel-Form---fr",
      hubspotFormId: "c9678d78-160b-4efb-bb46-76adfa6373ed",
      language: "fr",
      formName: "Hero FR",
      defaultPostalCode: "Non renseigné",
      loadingText: "Envoi en cours...",
      publicErrorText: "Une erreur est survenue. Merci de réessayer."
    },

    /* HERO — NL */
    {
      selector: "#wf-form-Professionel-Form---nl",
      hubspotFormId: "67884b28-127e-4117-b5b5-26948bcd9c30",
      language: "nl",
      formName: "Hero NL",
      defaultPostalCode: "Niet ingevuld",
      loadingText: "Bezig met verzenden...",
      publicErrorText: "Er is een fout opgetreden. Probeer het opnieuw."
    },

    /* DEUXIÈME FORMULAIRE — FR */
    {
      selector: "#wf-form-Demande-Form---fr",
      hubspotFormId: "408f44f1-773a-44b7-bbf8-5f996739d28b",
      language: "fr",
      formName: "Demande FR",
      defaultPostalCode: "Non renseigné",
      loadingText: "Envoi en cours...",
      publicErrorText: "Une erreur est survenue. Merci de réessayer."
    },

    /* DEUXIÈME FORMULAIRE — NL */
    {
      selector: "#wf-form-Demande-Form---nl",
      hubspotFormId: "c3900d89-2180-4ea7-b143-6d9899a7e9a6",
      language: "nl",
      formName: "Demande NL",
      defaultPostalCode: "Niet ingevuld",
      loadingText: "Bezig met verzenden...",
      publicErrorText: "Er is een fout opgetreden. Probeer het opnieuw."
    }
  ];

  /* ==========================================================================
     FIELDS
  ========================================================================== */

  function getField(form, fieldNames) {
    const names = Array.isArray(fieldNames)
      ? fieldNames
      : [fieldNames];

    for (const fieldName of names) {
      const field = form.querySelector(`[name="${fieldName}"]`);

      if (field) {
        return field;
      }
    }

    return null;
  }

  function getFieldValue(form, fieldNames) {
    const field = getField(form, fieldNames);

    if (!field) {
      return "";
    }

    if (field.type === "checkbox") {
      return field.checked ? String(field.value || "true").trim() : "";
    }

    if (field.type === "radio") {
      const checkedField = form.querySelector(
        `[name="${field.name}"]:checked`
      );

      return checkedField
        ? String(checkedField.value || "").trim()
        : "";
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
      getField(form, ["Phone", "phone", "name"]) ||
      form.querySelector('input[type="tel"]');

    if (!phoneInput) {
      return "";
    }

    if (
      window.intlTelInput &&
      typeof window.intlTelInput.getInstance === "function"
    ) {
      const instance = window.intlTelInput.getInstance(phoneInput);

      if (instance && typeof instance.getNumber === "function") {
        const number = instance.getNumber();

        if (number) {
          return number;
        }
      }
    }

    if (
      window.intlTelInputGlobals &&
      typeof window.intlTelInputGlobals.getInstance === "function"
    ) {
      const instance =
        window.intlTelInputGlobals.getInstance(phoneInput);

      if (instance && typeof instance.getNumber === "function") {
        const number = instance.getNumber();

        if (number) {
          return number;
        }
      }
    }

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
     PAYLOAD
  ========================================================================== */

  function buildHubSpotFields(form, config) {
    const fields = [];

    /* Nom Webflow → lastname HubSpot */
    addHubSpotField(
      fields,
      "lastname",
      getFieldValue(form, ["Nom", "lastname", "Last-name"])
    );

    /* Prénom Webflow → firstname HubSpot */
    addHubSpotField(
      fields,
      "firstname",
      getFieldValue(form, ["Pr-nom", "Prenom", "firstname", "First-name"])
    );

    /* Email */
    addHubSpotField(
      fields,
      "email",
      getFieldValue(form, ["Email", "email"])
    );

    /* Téléphone international */
    addHubSpotField(
      fields,
      "phone",
      getInternationalPhone(form)
    );

    /*
     * Code postal HubSpot obligatoire sur les 4 formulaires.
     *
     * - Sur les formulaires Hero, on utilise la valeur saisie.
     * - Sur les formulaires Demande, aucun champ Code postal n'existe dans
     *   le HTML : on envoie donc une valeur de secours afin que HubSpot
     *   n'empêche pas la soumission.
     */
    const postalCode = getFieldValue(form, [
      "Code-postal",
      "code_postal",
      "zip",
      "postal-code"
    ]);

    addHubSpotField(
      fields,
      "code_postal",
      postalCode || config.defaultPostalCode || "Non renseigné"
    );

    /* Message — présent dans les deuxièmes formulaires */
    addHubSpotField(
      fields,
      "message",
      getFieldValue(form, ["Text", "Message", "message"])
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

    if (responseData && Array.isArray(responseData.errors)) {
      responseData.errors.forEach(function (error) {
        if (error.message) {
          messages.push(error.message);
        } else if (error.errorType) {
          messages.push(error.errorType);
        } else {
          try {
            messages.push(JSON.stringify(error));
          } catch (jsonError) {
            messages.push("Erreur HubSpot non détaillée");
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
      fields: buildHubSpotFields(form, config),
      context: buildHubSpotContext()
    };

    if (DEBUG_MODE) {
      console.group(`HubSpot — ${config.formName}`);
      console.log("Formulaire Webflow :", config.selector);
      console.log("Formulaire HubSpot :", config.hubspotFormId);
      console.log("Endpoint :", endpoint);
      console.log("Payload :", payload);
      console.log("Payload JSON :", JSON.stringify(payload, null, 2));
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
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

    if (DEBUG_MODE) {
      console.log("HTTP :", response.status);
      console.log("Réponse :", responseData);
      console.groupEnd();
    }

    if (!response.ok) {
      const errorMessage = getHubSpotErrorMessage(
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
        formBlock?.querySelector(".w-form-done") || null,
      errorMessage:
        formBlock?.querySelector(".w-form-fail") || null
    };
  }

  function hideMessages(form) {
    const messages = getFormMessages(form);

    if (messages.successMessage) {
      messages.successMessage.style.display = "none";
      messages.successMessage.setAttribute("aria-hidden", "true");
    }

    if (messages.errorMessage) {
      messages.errorMessage.style.display = "none";
      messages.errorMessage.setAttribute("aria-hidden", "true");
    }
  }

  function showSuccess(form) {
    const messages = getFormMessages(form);

    form.style.display = "none";

    if (messages.errorMessage) {
      messages.errorMessage.style.display = "none";
      messages.errorMessage.setAttribute("aria-hidden", "true");
    }

    if (messages.successMessage) {
      messages.successMessage.style.display = "block";
      messages.successMessage.setAttribute("aria-hidden", "false");
      messages.successMessage.focus();
    }
  }

  function showError(form, message) {
    const messages = getFormMessages(form);

    form.style.display = "";

    if (messages.successMessage) {
      messages.successMessage.style.display = "none";
      messages.successMessage.setAttribute("aria-hidden", "true");
    }

    if (messages.errorMessage) {
      const errorText = messages.errorMessage.querySelector("div");

      if (errorText) {
        errorText.textContent = message;
      }

      messages.errorMessage.style.display = "block";
      messages.errorMessage.setAttribute("aria-hidden", "false");
      messages.errorMessage.focus();
    }
  }

  /* ==========================================================================
     CUSTOM BUTTON
  ========================================================================== */

  function getCustomButton(form) {
    return form.querySelector(".btn--wrapper .button");
  }

  function getCustomButtonText(button) {
    if (!button) {
      return null;
    }

    return (
      Array.from(button.children).find(function (child) {
        return !child.classList.contains("button-bg");
      }) || null
    );
  }

  function setSubmittingState(form, config, isSubmitting) {
    const nativeSubmit = form.querySelector('input[type="submit"]');
    const customButton = getCustomButton(form);
    const customButtonText = getCustomButtonText(customButton);

    if (nativeSubmit) {
      nativeSubmit.disabled = isSubmitting;
    }

    if (customButton) {
      customButton.style.pointerEvents = isSubmitting ? "none" : "";
      customButton.setAttribute(
        "aria-disabled",
        isSubmitting ? "true" : "false"
      );
    }

    if (customButtonText) {
      if (!customButtonText.dataset.originalText) {
        customButtonText.dataset.originalText =
          customButtonText.textContent.trim();
      }

      customButtonText.textContent = isSubmitting
        ? config.loadingText
        : customButtonText.dataset.originalText;
    }
  }

  /* ==========================================================================
     INITIALIZATION
  ========================================================================== */

  FORMS_CONFIG.forEach(function (config) {
    const form = document.querySelector(config.selector);

    if (!form) {
      console.warn(`Formulaire introuvable : ${config.selector}`);
      return;
    }

    if (form.dataset.hubspotInitialized === "true") {
      return;
    }

    form.dataset.hubspotInitialized = "true";
    form.dataset.hubspotSubmitting = "false";

    hideMessages(form);

    const customButton = getCustomButton(form);
    const nativeSubmit = form.querySelector('input[type="submit"]');

    if (customButton) {
      customButton.addEventListener("click", function (event) {
        event.preventDefault();

        if (form.dataset.hubspotSubmitting === "true") {
          return;
        }

        if (typeof form.requestSubmit === "function") {
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
      });
    }

    form.addEventListener(
      "submit",
      async function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (form.dataset.hubspotSubmitting === "true") {
          return;
        }

        hideMessages(form);

        if (
          typeof form.reportValidity === "function" &&
          !form.reportValidity()
        ) {
          return;
        }

        form.dataset.hubspotSubmitting = "true";
        setSubmittingState(form, config, true);

        try {
          await sendToHubSpot(form, config);

          console.log(
            `${config.formName} envoyé correctement à HubSpot.`
          );

          form.reset();
          showSuccess(form);
        } catch (error) {
          console.error(`Erreur ${config.formName} :`, error);

          const visibleMessage = DEBUG_MODE
            ? `HubSpot : ${error.message}`
            : config.publicErrorText;

          showError(form, visibleMessage);
        } finally {
          form.dataset.hubspotSubmitting = "false";
          setSubmittingState(form, config, false);
        }
      },
      true
    );
  });
});