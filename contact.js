<script>
/* ==========================================================================
   DAUMUS CONTACT
   WEBFLOW FR / NL → HUBSPOT
   + INTL TEL INPUT
========================================================================== */

window.addEventListener("load", function () {
  "use strict";

  /* ==========================================================================
     HUBSPOT CONFIG
  ========================================================================== */

  const HUBSPOT_PORTAL_ID = "26541958";
  const DEBUG_MODE = true;

  const FORMS_CONFIG = [
    {
      selector: "#wf-form-Particulier-Form---Fr",
      hubspotFormId: "ffaa5326-2360-4fba-af67-bde1daa5e345",
      language: "fr",
      loadingText: "Envoi en cours...",
      errorText:
        "Une erreur est survenue. Merci de réessayer."
    },

    {
      selector: "#wf-form-Particulier-Form---Nl",
      hubspotFormId: "59b0a4c2-da5f-4005-8f5a-c71449f6667a",
      language: "nl",
      loadingText: "Bezig met verzenden...",
      errorText:
        "Er is een fout opgetreden. Probeer het opnieuw."
    }
  ];

  /* ==========================================================================
     INTL TEL INPUT
  ========================================================================== */

  const phoneInstances = new WeakMap();

  function initPhone(form) {
    const input =
      form.querySelector('input[type="tel"]');

    if (!input) return;

    if (input.dataset.itiInitialized === "true") {
      return;
    }

    if (typeof window.intlTelInput !== "function") {
      console.warn(
        "intl-tel-input n'est pas chargé."
      );
      return;
    }

    const iti = window.intlTelInput(input, {
      initialCountry: "be",

      preferredCountries: [
        "be",
        "fr",
        "ma",
        "ch",
        "es",
        "ae",
        "cn"
      ],

      separateDialCode: true,

      nationalMode: true,

      formatOnDisplay: true
    });

    input.dataset.itiInitialized = "true";

    phoneInstances.set(input, iti);
  }

  function getInternationalPhone(form) {
    const input =
      form.querySelector('input[type="tel"]');

    if (!input) return "";

    const instance =
      phoneInstances.get(input);

    /*
     * Première méthode :
     * instance créée par ce script.
     */
    if (
      instance &&
      typeof instance.getNumber === "function"
    ) {
      const fullNumber = instance.getNumber();

      if (fullNumber) {
        return fullNumber;
      }
    }

    /*
     * Si intl-tel-input avait déjà été
     * initialisé ailleurs.
     */
    if (
      window.intlTelInput &&
      typeof window.intlTelInput.getInstance ===
        "function"
    ) {
      const existing =
        window.intlTelInput.getInstance(input);

      if (
        existing &&
        typeof existing.getNumber === "function"
      ) {
        const fullNumber =
          existing.getNumber();

        if (fullNumber) {
          return fullNumber;
        }
      }
    }

    /*
     * Fallback manuel.
     */
    let number =
      String(input.value || "")
        .trim()
        .replace(/[^\d+]/g, "");

    if (!number) return "";

    if (number.startsWith("+")) {
      return number;
    }

    const itiWrapper =
      input.closest(".iti");

    const dialCode =
      itiWrapper
        ?.querySelector(
          ".iti__selected-dial-code"
        )
        ?.textContent
        ?.trim() || "";

    number = number.replace(/^0+/, "");

    return `${dialCode}${number}`;
  }

  /* ==========================================================================
     GENERIC FIELD HELPERS
  ========================================================================== */

  function findField(form, selectors) {
    for (const selector of selectors) {
      const element =
        form.querySelector(selector);

      if (element) {
        return element;
      }
    }

    return null;
  }

  function getValue(form, selectors) {
    const field =
      findField(form, selectors);

    if (!field) return "";

    return String(
      field.value || ""
    ).trim();
  }

  function addHubSpotField(
    fields,
    name,
    value
  ) {
    if (
      !name ||
      value === undefined ||
      value === null
    ) {
      return;
    }

    const cleanValue =
      String(value).trim();

    if (!cleanValue) {
      return;
    }

    fields.push({
      name,
      value: cleanValue
    });
  }

  /* ==========================================================================
     CHECKBOX GROUPS
  ========================================================================== */

  /*
   * Récupère les checkbox cochées situées
   * dans un .form--item.
   *
   * On utilise data-name en priorité afin
   * d'obtenir le texte propre.
   */
  function getCheckedValues(container) {
    if (!container) {
      return [];
    }

    return Array.from(
      container.querySelectorAll(
        'input[type="checkbox"]:checked'
      )
    ).map(function (checkbox) {
      return (
        checkbox.dataset.name ||
        checkbox.value ||
        checkbox.name
      ).trim();
    });
  }

  /*
   * Premier groupe :
   * Où se situe votre problème ?
  */
  function getProblemValues(form) {
    const title =
      Array.from(
        form.querySelectorAll(
          ".form--item"
        )
      ).find(function (item) {
        const label =
          item.querySelector(
            ".heading-style-18"
          );

        if (!label) return false;

        const text =
          label.textContent
            .trim()
            .toLowerCase();

        return (
          text.includes(
            "où se situe"
          ) ||
          text.includes(
            "waar bevindt"
          )
        );
      });

    return getCheckedValues(title);
  }

  /*
   * Deuxième groupe :
   * symptômes.
  */
  function getSymptomsValues(form) {
    const title =
      Array.from(
        form.querySelectorAll(
          ".form--item"
        )
      ).find(function (item) {
        const label =
          item.querySelector(
            ".heading-style-18"
          );

        if (!label) return false;

        const text =
          label.textContent
            .trim()
            .toLowerCase();

        return (
          text.includes(
            "symptômes"
          ) ||
          text.includes(
            "symptomen"
          )
        );
      });

    return getCheckedValues(title);
  }

  /*
   * HubSpot multiple checkbox utilise
   * généralement des valeurs séparées
   * par des points-virgules.
  */
  function formatCheckboxValues(values) {
    return values.join(";");
  }

  /* ==========================================================================
     HUBSPOT COOKIE
  ========================================================================== */

  function getHubSpotCookie() {
    const cookie =
      document.cookie
        .split("; ")
        .find(function (item) {
          return item.startsWith(
            "hubspotutk="
          );
        });

    return cookie
      ? cookie.split("=")[1] || ""
      : "";
  }

  /* ==========================================================================
     HUBSPOT MAPPING
  ========================================================================== */

  function buildHubSpotFields(form) {
    const fields = [];

    /*
     * PROBLÈME
     */
    const problems =
      getProblemValues(form);

    addHubSpotField(
      fields,
      "probleme",
      formatCheckboxValues(problems)
    );

    /*
     * SYMPTÔMES
     *
     * Nom interne confirmé précédemment
     * par HubSpot.
     */
    const symptoms =
      getSymptomsValues(form);

    addHubSpotField(
      fields,
      "quels_sont_les_symptomes_rencontres__",
      formatCheckboxValues(symptoms)
    );

    /*
     * NOM
     *
     * FR = Nom
     * NL = Naam
     */
    addHubSpotField(
      fields,
      "lastname",
      getValue(form, [
        '[name="Nom"]',
        '[name="Naam"]',
        '[name="lastname"]'
      ])
    );

    /*
     * PRÉNOM
     *
     * FR = Pr-nom
     * NL = Voornaam
     */
    addHubSpotField(
      fields,
      "firstname",
      getValue(form, [
        '[name="Pr-nom"]',
        '[name="Voornaam"]',
        '[name="firstname"]'
      ])
    );

    /*
     * PHONE
     */
    addHubSpotField(
      fields,
      "phone",
      getInternationalPhone(form)
    );

    /*
     * EMAIL
     */
    addHubSpotField(
      fields,
      "email",
      getValue(form, [
        '[name="Adresse-Mail"]',
        '[name="E-mailadres"]',
        '[name="Email"]',
        '[name="email"]',
        'input[type="email"]'
      ])
    );

    /*
     * ADRESSE COMPLÈTE
     */
    addHubSpotField(
      fields,
      "address",
      getValue(form, [
        '[name="Adresse-Compl-te"]',
        '[name="Volledig-adres"]',
        '[name="Adresse"]',
        '[name="address"]'
      ])
    );

    /*
     * CODE POSTAL
     *
     * Nom interne HubSpot confirmé :
     * code_postal
     */
    addHubSpotField(
      fields,
      "code_postal",
      getValue(form, [
        '[name="Code-postal"]',
        '[name="Postcode"]',
        '[name="code_postal"]'
      ])
    );

    /*
     * VILLE
     */
    addHubSpotField(
      fields,
      "city",
      getValue(form, [
        '[name="Ville"]',
        '[name="Stad"]',
        '[name="city"]'
      ])
    );

    /*
     * MESSAGE
     *
     * FR = message
     * NL = Uw-bericht
     */
    addHubSpotField(
      fields,
      "message",
      getValue(form, [
        '[name="message"]',
        '[name="Uw-bericht"]',
        "textarea"
      ])
    );

    return fields;
  }

  function buildHubSpotContext() {
    const context = {
      pageUri:
        window.location.href,

      pageName:
        document.title
    };

    const hutk =
      getHubSpotCookie();

    if (hutk) {
      context.hutk = hutk;
    }

    return context;
  }

  /* ==========================================================================
     HUBSPOT ERROR
  ========================================================================== */

  function parseHubSpotError(
    data,
    status
  ) {
    if (
      data &&
      Array.isArray(data.errors)
    ) {
      return data.errors
        .map(function (error) {
          return (
            error.message ||
            error.errorType ||
            JSON.stringify(error)
          );
        })
        .join(" | ");
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.rawResponse) {
      return data.rawResponse;
    }

    return `HubSpot error ${status}`;
  }

  /* ==========================================================================
     SEND
  ========================================================================== */

  async function sendToHubSpot(
    form,
    config
  ) {
    const endpoint =
      "https://api.hsforms.com/submissions/v3/integration/submit/" +
      `${HUBSPOT_PORTAL_ID}/${config.hubspotFormId}`;

    const payload = {
      submittedAt: Date.now(),

      fields:
        buildHubSpotFields(form),

      context:
        buildHubSpotContext()
    };

    console.group(
      `HubSpot ${config.language.toUpperCase()}`
    );

    console.log(
      "Form ID:",
      config.hubspotFormId
    );

    console.log(
      "Payload:",
      payload
    );

    console.log(
      JSON.stringify(
        payload,
        null,
        2
      )
    );

    const response =
      await fetch(endpoint, {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json;charset=UTF-8"
        },

        body:
          JSON.stringify(payload)
      });

    const responseText =
      await response.text();

    let data = null;

    if (responseText) {
      try {
        data =
          JSON.parse(responseText);
      } catch {
        data = {
          rawResponse:
            responseText
        };
      }
    }

    console.log(
      "HTTP:",
      response.status
    );

    console.log(
      "HubSpot response:",
      data
    );

    console.groupEnd();

    if (!response.ok) {
      throw new Error(
        parseHubSpotError(
          data,
          response.status
        )
      );
    }

    return data;
  }

  /* ==========================================================================
     WEBFLOW UI
  ========================================================================== */

  function getMessages(form) {
    const wrapper =
      form.closest(".w-form");

    return {
      success:
        wrapper?.querySelector(
          ".w-form-done"
        ),

      error:
        wrapper?.querySelector(
          ".w-form-fail"
        )
    };
  }

  function hideMessages(form) {
    const messages =
      getMessages(form);

    if (messages.success) {
      messages.success.style.display =
        "none";
    }

    if (messages.error) {
      messages.error.style.display =
        "none";
    }
  }

  function showSuccess(form) {
    const messages =
      getMessages(form);

    form.style.display =
      "none";

    if (messages.error) {
      messages.error.style.display =
        "none";
    }

    if (messages.success) {
      messages.success.style.display =
        "block";

      messages.success.focus();
    }
  }

  function showError(
    form,
    message
  ) {
    const messages =
      getMessages(form);

    form.style.display = "";

    if (messages.success) {
      messages.success.style.display =
        "none";
    }

    if (messages.error) {
      const text =
        messages.error.querySelector(
          "div"
        );

      if (text) {
        text.textContent =
          message;
      }

      messages.error.style.display =
        "block";

      messages.error.focus();
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

  function getButtonText(button) {
    if (!button) return null;

    return Array.from(
      button.children
    ).find(function (child) {
      return !child.classList.contains(
        "button-bg"
      );
    });
  }

  function setSubmittingState(
    form,
    config,
    loading
  ) {
    const nativeSubmit =
      form.querySelector(
        '[type="submit"]'
      );

    const customButton =
      getCustomButton(form);

    const text =
      getButtonText(
        customButton
      );

    if (nativeSubmit) {
      nativeSubmit.disabled =
        loading;
    }

    if (customButton) {
      customButton.style.pointerEvents =
        loading ? "none" : "";

      customButton.setAttribute(
        "aria-disabled",
        loading
          ? "true"
          : "false"
      );
    }

    if (text) {
      if (
        !text.dataset.originalText
      ) {
        text.dataset.originalText =
          text.textContent.trim();
      }

      text.textContent =
        loading
          ? config.loadingText
          : text.dataset.originalText;
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
          "Form not found:",
          config.selector
        );

        return;
      }

      /*
       * Phone flags.
       */
      initPhone(form);

      /*
       * Empêche double initialisation.
       */
      if (
        form.dataset.hubspotInitialized ===
        "true"
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
          '[type="submit"]'
        );

      /*
       * Ton bouton visuel est un <a>.
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
              form.requestSubmit(
                nativeSubmit ||
                undefined
              );
            } else if (
              nativeSubmit
            ) {
              nativeSubmit.click();
            }
          }
        );
      }

      /*
       * SUBMIT
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
           * Validation native Webflow / HTML.
           */
          if (
            typeof form.reportValidity ===
              "function" &&
            !form.reportValidity()
          ) {
            return;
          }

          form.dataset
            .hubspotSubmitting =
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
              `✓ ${config.language.toUpperCase()} envoyé à HubSpot`
            );

            form.reset();

            /*
             * Reset intl-tel-input.
             */
            const phone =
              form.querySelector(
                'input[type="tel"]'
              );

            const iti =
              phoneInstances.get(
                phone
              );

            if (iti) {
              iti.setCountry("be");
            }

            showSuccess(form);

          } catch (error) {

            console.error(
              `HubSpot ${config.language.toUpperCase()}:`,
              error
            );

            showError(
              form,

              DEBUG_MODE
                ? `HubSpot : ${error.message}`
                : config.errorText
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
</script>