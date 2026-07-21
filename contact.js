document.addEventListener("DOMContentLoaded", () => {
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
  
      form?.addEventListener("submit", () => {
        phoneInput.value = iti.getNumber();
      });
    }
  });
  /* ==========================================================================
   WEBFLOW NATIVE FORMS → HUBSPOT
   DAUMUS — PAGE CONTACT FR / NL
========================================================================== */

window.addEventListener("load", function () {
  "use strict";

  /* ==========================================================================
     CONFIGURATION
  ========================================================================== */

  const HUBSPOT_PORTAL_ID = "26541958";

  /*
   * true  = affiche l'erreur technique HubSpot
   * false = affiche uniquement le message public
   */
  const DEBUG_MODE = true;

  const FORMS_CONFIG = [
    {
      selector: "#wf-form-Particulier-Form---Fr",
      hubspotFormId: "ffaa5326-2360-4fba-af67-bde1daa5e345",
      language: "fr",
      loadingText: "Envoi en cours...",
      publicErrorText:
        "Une erreur est survenue. Merci de réessayer."
    },
    {
      selector: "#wf-form-Particulier-Form---Nl",
      hubspotFormId: "59b0a4c2-da5f-4005-8f5a-c71449f6667a",
      language: "nl",
      loadingText: "Bezig met verzenden...",
      publicErrorText:
        "Er is een fout opgetreden. Probeer het opnieuw."
    }
  ];

  /* ==========================================================================
     FIELD HELPERS
  ========================================================================== */

  function findField(form, selectors) {
    for (const selector of selectors) {
      const field = form.querySelector(selector);

      if (field) {
        return field;
      }
    }

    return null;
  }

  function getFieldValue(form, selectors) {
    const field = findField(form, selectors);

    if (!field) {
      return "";
    }

    return String(field.value || "").trim();
  }

  function addHubSpotField(fields, name, value) {
    if (
      !name ||
      value === undefined ||
      value === null
    ) {
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
     HUBSPOT TRACKING COOKIE
  ========================================================================== */

  function getHubSpotCookie() {
    const cookie = document.cookie
      .split("; ")
      .find(function (item) {
        return item.startsWith("hubspotutk=");
      });

    return cookie
      ? cookie.split("=")[1] || ""
      : "";
  }

  /* ==========================================================================
     PHONE — INTL TEL INPUT
  ========================================================================== */

  function getInternationalPhone(form) {
    const phoneInput = findField(form, [
      'input[name="Phone"]',
      'input[name="phone"]',
      ".iti input[type='tel']",
      'input[type="tel"]'
    ]);

    if (!phoneInput) {
      return "";
    }

    /*
     * intl-tel-input moderne.
     */
    if (
      window.intlTelInput &&
      typeof window.intlTelInput.getInstance ===
        "function"
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
     * Compatibilité avec certaines anciennes versions.
     */
    if (
      window.intlTelInputGlobals &&
      typeof window.intlTelInputGlobals
        .getInstance === "function"
    ) {
      const instance =
        window.intlTelInputGlobals.getInstance(
          phoneInput
        );

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
     * Fallback manuel.
     */
    let number = String(phoneInput.value || "")
      .trim()
      .replace(/[^\d+]/g, "");

    if (!number) {
      return "";
    }

    if (number.startsWith("+")) {
      return number;
    }

    const itiWrapper = phoneInput.closest(".iti");

    const dialCode =
      itiWrapper
        ?.querySelector(
          ".iti__selected-dial-code"
        )
        ?.textContent
        ?.trim() || "";

    /*
     * Exemple :
     * 0470123456 + indicatif +32
     * devient +32470123456
     */
    number = number.replace(/^0+/, "");

    return `${dialCode}${number}`;
  }

  /* ==========================================================================
     PRIVACY CHECKBOX
  ========================================================================== */

  function getPrivacyCheckbox(form) {
    return findField(form, [
      'input[name="politique"]',
      'input[name="Politique"]',
      "input#politique",
      'input[type="checkbox"][required]'
    ]);
  }

  function isPrivacyAccepted(form) {
    const checkbox = getPrivacyCheckbox(form);

    return Boolean(
      checkbox && checkbox.checked
    );
  }

  /* ==========================================================================
     HUBSPOT FIELD MAPPING
  ========================================================================== */

  function buildHubSpotFields(form) {
    const fields = [];

    /*
     * Où se situe votre problème ?
     */
    addHubSpotField(
      fields,
      "probleme",
      getFieldValue(form, [
        '[name="probleme"]',
        "#probleme"
      ])
    );

    /*
     * Quels sont les symptômes rencontrés ?
     */
    addHubSpotField(
      fields,
      "quels_sont_les_symptomes_rencontres__",
      getFieldValue(form, [
        '[name="symptomes"]',
        "#symptomes"
      ])
    );

    /*
     * Nom.
     */
    addHubSpotField(
      fields,
      "lastname",
      getFieldValue(form, [
        '[name="Nom"]',
        '[name="lastname"]',
        "#Nom"
      ])
    );

    /*
     * Prénom.
     */
    addHubSpotField(
      fields,
      "firstname",
      getFieldValue(form, [
        '[name="Pr-nom"]',
        '[name="firstname"]',
        "#Prenom"
      ])
    );

    /*
     * Téléphone.
     */
    addHubSpotField(
      fields,
      "phone",
      getInternationalPhone(form)
    );

    /*
     * Email.
     */
    addHubSpotField(
      fields,
      "email",
      getFieldValue(form, [
        'input[type="email"]',
        '[name="Email"]',
        '[name="email"]',
        "#Email"
      ])
    );

    /*
     * Adresse.
     */
    addHubSpotField(
      fields,
      "address",
      getFieldValue(form, [
        '[name="Adresse"]',
        '[name="address"]',
        "#Adresse"
      ])
    );

    /*
     * Numéro / boîte.
     *
     * Nom interne exact HubSpot :
     * n____boite
     */
    addHubSpotField(
      fields,
      "n____boite",
      getFieldValue(form, [
        '[name="Num-Boite"]',
        '[name="Num-ro-Bo-te"]',
        '[name="numero-boite"]',
        '[name="numero_boite"]',
        "#Num-Boite",
        "#Numero-Boite"
      ])
    );

    /*
     * Ville.
     */
    addHubSpotField(
      fields,
      "city",
      getFieldValue(form, [
        '[name="Ville"]',
        '[name="city"]',
        "#Ville"
      ])
    );

    /*
     * Code postal.
     *
     * Nom interne exact HubSpot :
     * code_postal
     */
    addHubSpotField(
      fields,
      "code_postal",
      getFieldValue(form, [
        '[name="Code-postal"]',
        '[name="code_postal"]',
        '[name="zip"]',
        "#Code-postal"
      ])
    );

    /*
     * Message.
     */
    addHubSpotField(
      fields,
      "message",
      getFieldValue(form, [
        '[name="message"]',
        '[name="Message"]',
        "textarea#message",
        "textarea"
      ])
    );

    /*
     * Politique de vie privée.
     *
     * Nom interne exact HubSpot :
     * j_accepte_la_politique_de_vie_privee
     */
    addHubSpotField(
      fields,
      "j_accepte_la_politique_de_vie_privee",
      isPrivacyAccepted(form)
        ? "true"
        : "false"
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
     HUBSPOT ERROR PARSER
  ========================================================================== */

  function getHubSpotErrorMessage(
    responseData,
    status
  ) {
    const messages = [];

    if (
      responseData &&
      Array.isArray(responseData.errors)
    ) {
      responseData.errors.forEach(
        function (error) {
          if (error.message) {
            messages.push(error.message);
            return;
          }

          if (error.errorType) {
            messages.push(error.errorType);
            return;
          }

          try {
            messages.push(
              JSON.stringify(error)
            );
          } catch (jsonError) {
            messages.push(
              "Erreur HubSpot non détaillée"
            );
          }
        }
      );
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
      `HubSpot Contact — ${config.language.toUpperCase()}`
    );

    console.log("Endpoint :", endpoint);
    console.log(
      "HubSpot Form ID :",
      config.hubspotFormId
    );
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

    const responseText =
      await response.text();

    let responseData = null;

    if (responseText) {
      try {
        responseData =
          JSON.parse(responseText);
      } catch (error) {
        responseData = {
          rawResponse: responseText
        };
      }
    }

    console.log(
      "Statut HTTP :",
      response.status
    );

    console.log(
      "Réponse HubSpot :",
      responseData
    );

    console.groupEnd();

    if (!response.ok) {
      const message =
        getHubSpotErrorMessage(
          responseData,
          response.status
        );

      const hubSpotError =
        new Error(message);

      hubSpotError.status =
        response.status;

      hubSpotError.response =
        responseData;

      hubSpotError.payload =
        payload;

      throw hubSpotError;
    }

    return responseData;
  }

  /* ==========================================================================
     WEBFLOW SUCCESS / ERROR
  ========================================================================== */

  function getFormMessages(form) {
    const formBlock =
      form.closest(".w-form");

    return {
      success:
        formBlock?.querySelector(
          ".w-form-done"
        ) || null,

      error:
        formBlock?.querySelector(
          ".w-form-fail"
        ) || null
    };
  }

  function hideMessages(form) {
    const messages =
      getFormMessages(form);

    if (messages.success) {
      messages.success.style.display =
        "none";

      messages.success.setAttribute(
        "aria-hidden",
        "true"
      );
    }

    if (messages.error) {
      messages.error.style.display =
        "none";

      messages.error.setAttribute(
        "aria-hidden",
        "true"
      );
    }
  }

  function showSuccess(form) {
    const messages =
      getFormMessages(form);

    form.style.display = "none";

    if (messages.error) {
      messages.error.style.display =
        "none";

      messages.error.setAttribute(
        "aria-hidden",
        "true"
      );
    }

    if (messages.success) {
      messages.success.style.display =
        "block";

      messages.success.setAttribute(
        "aria-hidden",
        "false"
      );

      messages.success.focus();
    }
  }

  function showError(form, message) {
    const messages =
      getFormMessages(form);

    form.style.display = "";

    if (messages.success) {
      messages.success.style.display =
        "none";

      messages.success.setAttribute(
        "aria-hidden",
        "true"
      );
    }

    if (messages.error) {
      const text =
        messages.error.querySelector("div");

      if (text) {
        text.textContent = message;
      }

      messages.error.style.display =
        "block";

      messages.error.setAttribute(
        "aria-hidden",
        "false"
      );

      messages.error.focus();
    }
  }

  /* ==========================================================================
     CUSTOM WEBFLOW BUTTON
  ========================================================================== */

  function getCustomButton(form) {
    return form.querySelector(
      ".btn--wrapper .button"
    );
  }

  function getButtonText(button) {
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
    const nativeSubmit =
      form.querySelector(
        'input[type="submit"]'
      );

    const customButton =
      getCustomButton(form);

    const buttonText =
      getButtonText(customButton);

    if (nativeSubmit) {
      nativeSubmit.disabled =
        isSubmitting;
    }

    if (customButton) {
      customButton.style.pointerEvents =
        isSubmitting ? "none" : "";

      customButton.setAttribute(
        "aria-disabled",
        isSubmitting
          ? "true"
          : "false"
      );
    }

    if (buttonText) {
      if (
        !buttonText.dataset.originalText
      ) {
        buttonText.dataset.originalText =
          buttonText.textContent.trim();
      }

      buttonText.textContent =
        isSubmitting
          ? config.loadingText
          : buttonText.dataset.originalText;
    }
  }

  /* ==========================================================================
     INITIALIZATION
  ========================================================================== */

  FORMS_CONFIG.forEach(
    function (config) {
      const form =
        document.querySelector(
          config.selector
        );

      if (!form) {
        console.warn(
          `Formulaire introuvable : ${config.selector}`
        );

        return;
      }

      if (
        form.dataset
          .hubspotInitialized === "true"
      ) {
        return;
      }

      form.dataset.hubspotInitialized =
        "true";

      form.dataset.hubspotSubmitting =
        "false";

      hideMessages(form);

      const customButton =
        getCustomButton(form);

      const nativeSubmit =
        form.querySelector(
          'input[type="submit"]'
        );

      /*
       * Le bouton visuel Webflow est un lien.
       * Il déclenche le véritable submit.
       */
      if (customButton) {
        customButton.addEventListener(
          "click",
          function (event) {
            event.preventDefault();

            if (
              form.dataset
                .hubspotSubmitting ===
              "true"
            ) {
              return;
            }

            if (
              typeof form.requestSubmit ===
              "function"
            ) {
              if (nativeSubmit) {
                form.requestSubmit(
                  nativeSubmit
                );
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

      /*
       * Interception avant Webflow.
       */
      form.addEventListener(
        "submit",
        async function (event) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          if (
            form.dataset
              .hubspotSubmitting ===
            "true"
          ) {
            return;
          }

          hideMessages(form);

          /*
           * Validation HTML native.
           */
          if (
            typeof form.reportValidity ===
              "function" &&
            !form.reportValidity()
          ) {
            return;
          }

          /*
           * La politique doit être cochée.
           */
          if (
            !isPrivacyAccepted(form)
          ) {
            const checkbox =
              getPrivacyCheckbox(form);

            if (checkbox) {
              checkbox.setCustomValidity(
                config.language === "nl"
                  ? "Gelieve het privacybeleid te accepteren."
                  : "Veuillez accepter la politique de confidentialité."
              );

              checkbox.reportValidity();

              checkbox.addEventListener(
                "change",
                function clearError() {
                  checkbox.setCustomValidity(
                    ""
                  );

                  checkbox.removeEventListener(
                    "change",
                    clearError
                  );
                }
              );
            }

            return;
          }

          form.dataset.hubspotSubmitting =
            "true";

          setSubmittingState(
            form,
            config,
            true
          );

          try {
            await sendToHubSpot(
              form,
              config
            );

            console.log(
              `Formulaire Contact ${config.language.toUpperCase()} envoyé à HubSpot.`
            );

            form.reset();

            showSuccess(form);
          } catch (error) {
            console.error(
              `Erreur formulaire ${config.language.toUpperCase()} :`,
              error
            );

            const visibleMessage =
              DEBUG_MODE
                ? `HubSpot : ${error.message}`
                : config.publicErrorText;

            showError(
              form,
              visibleMessage
            );
          } finally {
            form.dataset
              .hubspotSubmitting =
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
    }
  );
});