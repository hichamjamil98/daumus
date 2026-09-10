/* ==========================================================================
   DAUMUS — CONTACT PAGE
   WEBFLOW FR / NL → HUBSPOT
   + INTL TEL INPUT
   ========================================================================== */

   (function () {
    "use strict";
  
  
    /* ==========================================================================
       CONFIG
       ========================================================================== */
  
    const HUBSPOT_PORTAL_ID = "26541958";
  
    /*
     * Passe à false quand tout fonctionne.
     */
    const DEBUG_MODE = true;
  
  
    const FORMS_CONFIG = [
  
      {
        language: "fr",
  
        selector:
          "#wf-form-Particulier-Form---Fr",
  
        hubspotFormId:
          "ffaa5326-2360-4fba-af67-bde1daa5e345",
  
        loadingText:
          "Envoi en cours...",
  
        defaultError:
          "Une erreur est survenue. Merci de réessayer."
      },
  
  
      {
        language: "nl",
  
        selector:
          "#wf-form-Particulier-Form---Nl",
  
        hubspotFormId:
          "59b0a4c2-da5f-4005-8f5a-c71449f6667a",
  
        loadingText:
          "Bezig met verzenden...",
  
        defaultError:
          "Er is een fout opgetreden. Probeer het opnieuw."
      }
  
    ];
  
  
    /* ==========================================================================
       PHONE INSTANCES
       ========================================================================== */
  
    const phoneInstances =
      new WeakMap();
  
  
    /* ==========================================================================
       FIND FIELD
       ========================================================================== */
  
    function findField(
      form,
      selectors
    ) {
  
      for (
        const selector of selectors
      ) {
  
        const field =
          form.querySelector(
            selector
          );
  
        if (field) {
          return field;
        }
  
      }
  
      return null;
  
    }
  
  
    function getFieldValue(
      form,
      selectors
    ) {
  
      const field =
        findField(
          form,
          selectors
        );
  
      if (!field) {
        return "";
      }
  
      return String(
        field.value || ""
      ).trim();
  
    }
  
  
    /* ==========================================================================
       PHONE
       ========================================================================== */
  
    function findPhoneField(form) {
  
      /*
       * FR :
       * #phone
       *
       * NL :
       * #Telefoon
       */
  
      return findField(
        form,
        [
          "#phone",
          "#Telefoon",
          'input[type="tel"]'
        ]
      );
  
    }
  
  
    /* ==========================================================================
       INIT INTL TEL INPUT
       ========================================================================== */
  
    function initPhone(form) {
  
      const phoneInput =
        findPhoneField(form);
  
      if (!phoneInput) {
  
        console.warn(
          "Téléphone introuvable :",
          form.id
        );
  
        return;
  
      }
  
  
      /*
       * Déjà initialisé ?
       */
      if (
        phoneInput.closest(".iti")
      ) {
  
        if (
          window.intlTelInput &&
          typeof window.intlTelInput
            .getInstance ===
            "function"
        ) {
  
          const existingInstance =
            window.intlTelInput
              .getInstance(
                phoneInput
              );
  
          if (existingInstance) {
  
            phoneInstances.set(
              phoneInput,
              existingInstance
            );
  
          }
  
        }
  
        return;
  
      }
  
  
      /*
       * Librairie absente.
       */
      if (
        typeof window.intlTelInput !==
        "function"
      ) {
  
        console.warn(
          "intl-tel-input n'est pas encore chargé."
        );
  
        return;
  
      }
  
  
      try {
  
        const instance =
          window.intlTelInput(
            phoneInput,
            {
  
              initialCountry: "be",
  
              separateDialCode: true,
  
              nationalMode: true,
  
              formatOnDisplay: true,
  
              countryOrder: [
                "be",
                "fr",
                "ma",
                "ch",
                "es",
                "ae",
                "cn"
              ]
  
            }
          );
  
  
        phoneInstances.set(
          phoneInput,
          instance
        );
  
  
        console.log(
          "✓ Phone initialized:",
          form.id,
          phoneInput.id
        );
  
  
      } catch (error) {
  
        console.error(
          "Erreur intl-tel-input:",
          error
        );
  
      }
  
    }
  
  
    /* ==========================================================================
       PHONE FULL INTERNATIONAL NUMBER
       ========================================================================== */
  
    function getInternationalPhone(
      form
    ) {
  
      const phoneInput =
        findPhoneField(form);
  
      if (!phoneInput) {
        return "";
      }
  
  
      let instance =
        phoneInstances.get(
          phoneInput
        );
  
  
      /*
       * Récupère éventuellement
       * une instance créée ailleurs.
       */
      if (
        !instance &&
        window.intlTelInput &&
        typeof window.intlTelInput
          .getInstance ===
          "function"
      ) {
  
        instance =
          window.intlTelInput
            .getInstance(
              phoneInput
            );
  
      }
  
  
      /*
       * Méthode officielle.
       */
      if (
        instance &&
        typeof instance.getNumber ===
        "function"
      ) {
  
        const fullNumber =
          instance.getNumber();
  
        if (fullNumber) {
  
          return fullNumber;
  
        }
  
      }
  
  
      /*
       * Fallback manuel.
       */
      let rawNumber =
        String(
          phoneInput.value || ""
        )
          .trim()
          .replace(
            /[^\d+]/g,
            ""
          );
  
  
      if (!rawNumber) {
        return "";
      }
  
  
      if (
        rawNumber.startsWith("+")
      ) {
  
        return rawNumber;
  
      }
  
  
      const itiWrapper =
        phoneInput.closest(".iti");
  
  
      const dialCode =
        itiWrapper
          ?.querySelector(
            ".iti__selected-dial-code"
          )
          ?.textContent
          ?.trim() || "";
  
  
      /*
       * Exemple :
       * 0470... → 470...
       * puis +32
       */
      rawNumber =
        rawNumber.replace(
          /^0+/,
          ""
        );
  
  
      return (
        dialCode +
        rawNumber
      );
  
    }
  
  
    /* ==========================================================================
       WAIT FOR INTL TEL INPUT
       ========================================================================== */
  
    function initPhonesWhenReady() {
  
      let attempts = 0;
  
  
      function tryInit() {
  
        attempts++;
  
  
        if (
          typeof window.intlTelInput ===
          "function"
        ) {
  
          FORMS_CONFIG.forEach(
            function (config) {
  
              const form =
                document.querySelector(
                  config.selector
                );
  
              if (form) {
  
                initPhone(form);
  
              }
  
            }
          );
  
  
          return;
  
        }
  
  
        /*
         * Retry max 5 sec.
         */
        if (attempts < 20) {
  
          setTimeout(
            tryInit,
            250
          );
  
        } else {
  
          console.error(
            "intl-tel-input n'a pas pu être chargé."
          );
  
        }
  
      }
  
  
      tryInit();
  
    }
  
  
    /* ==========================================================================
       CHECKBOX GROUPS
       ========================================================================== */
  
    function getFormItems(form) {
  
      return Array.from(
        form.querySelectorAll(
          ".form--item"
        )
      );
  
    }
  
  
    function findCheckboxGroup(
      form,
      terms
    ) {
  
      const items =
        getFormItems(form);
  
  
      return items.find(
        function (item) {
  
          const heading =
            item.querySelector(
              ".heading-style-18"
            );
  
          if (!heading) {
            return false;
          }
  
  
          const text =
            heading.textContent
              .trim()
              .toLowerCase();
  
  
          return terms.some(
            function (term) {
  
              return text.includes(
                term
              );
  
            }
          );
  
        }
      );
  
    }
  
  
    function getCheckedValues(
      container
    ) {
  
      if (!container) {
        return [];
      }
  
  
      return Array.from(
        container.querySelectorAll(
          'input[type="checkbox"]:checked'
        )
      )
        .map(
          function (checkbox) {
  
            /*
             * data-name contient
             * le label Webflow propre.
             */
  
            return String(
              checkbox.dataset.name ||
              checkbox.value ||
              checkbox.name ||
              ""
            ).trim();
  
          }
        )
        .filter(Boolean);
  
    }
  
  
    /* ==========================================================================
       PROBLEM
       ========================================================================== */
  
    function getProblemValues(form) {
  
      const container =
        findCheckboxGroup(
          form,
          [
            "où se situe",
            "waar bevindt"
          ]
        );
  
  
      return getCheckedValues(
        container
      );
  
    }
  
  
    /* ==========================================================================
       SYMPTOMS
       ========================================================================== */
  
    function getSymptomValues(form) {
  
      const container =
        findCheckboxGroup(
          form,
          [
            "symptômes",
            "symptomen"
          ]
        );
  
  
      return getCheckedValues(
        container
      );
  
    }
  
  
    function formatMultiCheckbox(
      values
    ) {
  
      return values.join(";");
  
    }
  
  
    /* ==========================================================================
       HUBSPOT FIELD
       ========================================================================== */
  
    function addHubSpotField(
      fields,
      name,
      value
    ) {
  
      if (
        value === undefined ||
        value === null
      ) {
        return;
      }
  
  
      const clean =
        String(value).trim();
  
  
      if (!clean) {
        return;
      }
  
  
      fields.push({
        name: name,
        value: clean
      });
  
    }
  
  
    /* ==========================================================================
       FIELD MAPPING
       ========================================================================== */
  
    function buildHubSpotFields(
      form
    ) {
  
      const fields = [];
  
  
      /* --------------------------------------------------------------------------
         PROBLÈME
         -------------------------------------------------------------------------- */
  
      addHubSpotField(
        fields,
  
        "probleme",
  
        formatMultiCheckbox(
          getProblemValues(
            form
          )
        )
      );
  
  
      /* --------------------------------------------------------------------------
         SYMPTÔMES
         -------------------------------------------------------------------------- */
  
      addHubSpotField(
        fields,
  
        "quels_sont_les_symptomes_rencontres__",
  
        formatMultiCheckbox(
          getSymptomValues(
            form
          )
        )
      );
  
  
      /* --------------------------------------------------------------------------
         LASTNAME
         -------------------------------------------------------------------------- */
  
      addHubSpotField(
        fields,
  
        "lastname",
  
        getFieldValue(
          form,
          [
            "#Nom",
            "#Naam",
  
            '[name="Nom"]',
            '[name="Naam"]'
          ]
        )
      );
  
  
      /* --------------------------------------------------------------------------
         FIRSTNAME
         -------------------------------------------------------------------------- */
  
      addHubSpotField(
        fields,
  
        "firstname",
  
        getFieldValue(
          form,
          [
            "#Prenom",
            "#Voornaam",
  
            '[name="Pr-nom"]',
            '[name="Voornaam"]'
          ]
        )
      );
  
  
      /* --------------------------------------------------------------------------
         PHONE
         -------------------------------------------------------------------------- */
  
      addHubSpotField(
        fields,
  
        "phone",
  
        getInternationalPhone(
          form
        )
      );
  
  
      /* --------------------------------------------------------------------------
         EMAIL
         -------------------------------------------------------------------------- */
  
      addHubSpotField(
        fields,
  
        "email",
  
        getFieldValue(
          form,
          [
            "#Adresse-Mail",
            "#E-mailadres",
  
            '[name="Adresse-Mail"]',
            '[name="E-mailadres"]',
  
            'input[type="email"]'
          ]
        )
      );
  
  
      /* --------------------------------------------------------------------------
         ADDRESS
         -------------------------------------------------------------------------- */
  
      addHubSpotField(
        fields,
  
        "address",
  
        getFieldValue(
          form,
          [
            "#Adresse-Compl-te",
            "#Volledig-adres",
  
            '[name="Adresse-Compl-te"]',
            '[name="Volledig-adres"]'
          ]
        )
      );
  
  
      /* --------------------------------------------------------------------------
         POST CODE
         -------------------------------------------------------------------------- */
  
      addHubSpotField(
        fields,
  
        "code_postal",
  
        getFieldValue(
          form,
          [
            "#Code-postal",
            "#Postcode",
  
            '[name="Code-postal"]',
            '[name="Postcode"]'
          ]
        )
      );
  
  
      /* --------------------------------------------------------------------------
         CITY
         -------------------------------------------------------------------------- */
  
      addHubSpotField(
        fields,
  
        "city",
  
        getFieldValue(
          form,
          [
            "#Ville",
            "#Gemeente",
  
            '[name="Ville"]',
            '[name="Gemeente"]'
          ]
        )
      );
  
  
      /* --------------------------------------------------------------------------
         MESSAGE
         -------------------------------------------------------------------------- */
  
      addHubSpotField(
        fields,
  
        "message",
  
        getFieldValue(
          form,
          [
            "#message",
            "#Uw-bericht",
  
            '[name="message"]',
            '[name="Uw-bericht"]',
  
            "textarea"
          ]
        )
      );
  
  
      return fields;
  
    }
  
  
    /* ==========================================================================
       HUBSPOT COOKIE
       ========================================================================== */
  
    function getHubSpotCookie() {
  
      const item =
        document.cookie
          .split("; ")
          .find(
            function (cookie) {
  
              return cookie.startsWith(
                "hubspotutk="
              );
  
            }
          );
  
  
      if (!item) {
        return "";
      }
  
  
      return (
        item.split("=")[1] ||
        ""
      );
  
    }
  
  
    /* ==========================================================================
       CONTEXT
       ========================================================================== */
  
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
  
        context.hutk =
          hutk;
  
      }
  
  
      return context;
  
    }
  
  
    /* ==========================================================================
       ERROR PARSER
       ========================================================================== */
  
    function parseHubSpotError(
      data,
      status
    ) {
  
      if (
        data &&
        Array.isArray(
          data.errors
        )
      ) {
  
        return data.errors
          .map(
            function (error) {
  
              return (
                error.message ||
                error.errorType ||
                JSON.stringify(
                  error
                )
              );
  
            }
          )
          .join(" | ");
  
      }
  
  
      if (
        data &&
        data.message
      ) {
  
        return data.message;
  
      }
  
  
      return (
        "HubSpot error " +
        status
      );
  
    }
  
  
    /* ==========================================================================
       SEND HUBSPOT
       ========================================================================== */
  
    async function sendToHubSpot(
      form,
      config
    ) {
  
      const endpoint =
        "https://api.hsforms.com/submissions/v3/integration/submit/" +
        HUBSPOT_PORTAL_ID +
        "/" +
        config.hubspotFormId;
  
  
      const payload = {
  
        submittedAt:
          Date.now(),
  
        fields:
          buildHubSpotFields(
            form
          ),
  
        context:
          buildHubSpotContext()
  
      };
  
  
      if (DEBUG_MODE) {
  
        console.group(
          "HubSpot " +
          config.language.toUpperCase()
        );
  
        console.log(
          "Form:",
          form.id
        );
  
        console.log(
          "HubSpot form:",
          config.hubspotFormId
        );
  
        console.log(
          "Fields:",
          payload.fields
        );
  
        console.log(
          "Payload:",
          payload
        );
  
        console.groupEnd();
  
      }
  
  
      const response =
        await fetch(
          endpoint,
          {
  
            method: "POST",
  
            headers: {
  
              "Content-Type":
                "application/json;charset=UTF-8"
  
            },
  
            body:
              JSON.stringify(
                payload
              )
  
          }
        );
  
  
      const raw =
        await response.text();
  
  
      let data = null;
  
  
      if (raw) {
  
        try {
  
          data =
            JSON.parse(raw);
  
        } catch {
  
          data = {
            rawResponse: raw
          };
  
        }
  
      }
  
  
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
       WEBFLOW MESSAGES
       ========================================================================== */
  
    function getMessages(form) {
  
      const wrapper =
        form.closest(
          ".w-form"
        );
  
  
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
  
  
      if (
        messages.success
      ) {
  
        messages.success.style.display =
          "none";
  
      }
  
  
      if (
        messages.error
      ) {
  
        messages.error.style.display =
          "none";
  
      }
  
    }
  
  
    function showSuccess(form) {
  
      const messages =
        getMessages(form);
  
  
      form.style.display =
        "none";
  
  
      if (
        messages.error
      ) {
  
        messages.error.style.display =
          "none";
  
      }
  
  
      if (
        messages.success
      ) {
  
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
  
  
      form.style.display =
        "";
  
  
      if (
        messages.success
      ) {
  
        messages.success.style.display =
          "none";
  
      }
  
  
      if (
        messages.error
      ) {
  
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
       BUTTON
       ========================================================================== */
  
    function getButton(form) {
  
      return form.querySelector(
        ".btn--wrapper .button"
      );
  
    }
  
  
    function getButtonLabel(
      button
    ) {
  
      if (!button) {
        return null;
      }
  
  
      return Array.from(
        button.children
      ).find(
        function (child) {
  
          return !child.classList
            .contains(
              "button-bg"
            );
  
        }
      );
  
    }
  
  
    function setLoading(
      form,
      config,
      loading
    ) {
  
      const submit =
        form.querySelector(
          'input[type="submit"]'
        );
  
  
      const button =
        getButton(form);
  
  
      const label =
        getButtonLabel(
          button
        );
  
  
      if (submit) {
  
        submit.disabled =
          loading;
  
      }
  
  
      if (button) {
  
        button.style.pointerEvents =
          loading
            ? "none"
            : "";
  
        button.setAttribute(
          "aria-disabled",
  
          loading
            ? "true"
            : "false"
        );
  
      }
  
  
      if (label) {
  
        if (
          !label.dataset.originalText
        ) {
  
          label.dataset.originalText =
            label.textContent.trim();
  
        }
  
  
        label.textContent =
          loading
            ? config.loadingText
            : label.dataset.originalText;
  
      }
  
    }
  
  
    /* ==========================================================================
       INIT HUBSPOT FORM
       ========================================================================== */
  
    function initHubSpotForm(
      config
    ) {
  
      const form =
        document.querySelector(
          config.selector
        );
  
  
      if (!form) {
  
        console.warn(
          "Formulaire introuvable:",
          config.selector
        );
  
        return;
  
      }
  
  
      /*
       * Initialisation téléphone.
       */
      initPhone(form);
  
  
      /*
       * Évite double init HubSpot.
       */
      if (
        form.dataset
          .hubspotContactInitialized ===
        "true"
      ) {
  
        return;
  
      }
  
  
      form.dataset
        .hubspotContactInitialized =
        "true";
  
  
      form.dataset
        .hubspotSubmitting =
        "false";
  
  
      hideMessages(form);
  
  
      const button =
        getButton(form);
  
  
      const nativeSubmit =
        form.querySelector(
          'input[type="submit"]'
        );
  
  
      /* ==========================================================================
         CUSTOM WEBFLOW BUTTON
         ========================================================================== */
  
      if (button) {
  
        button.addEventListener(
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
  
            } else if (
              nativeSubmit
            ) {
  
              nativeSubmit.click();
  
            }
  
          }
        );
  
      }
  
  
      /* ==========================================================================
         SUBMIT
         ========================================================================== */
  
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
           * Validation HTML.
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
  
  
          setLoading(
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
              "✓ HubSpot " +
              config.language.toUpperCase() +
              " OK"
            );
  
  
            /*
             * Reset avant message success.
             */
            form.reset();
  
  
            const phoneInput =
              findPhoneField(
                form
              );
  
  
            const instance =
              phoneInput
                ? phoneInstances.get(
                    phoneInput
                  )
                : null;
  
  
            if (instance) {
  
              try {
  
                instance.setCountry(
                  "be"
                );
  
                phoneInput.value =
                  "";
  
              } catch (error) {
  
                console.warn(
                  "Phone reset error:",
                  error
                );
  
              }
  
            }
  
  
            showSuccess(form);
  
  
          } catch (error) {
  
  
            console.error(
              "HubSpot " +
              config.language.toUpperCase(),
              error
            );
  
  
            showError(
              form,
  
              DEBUG_MODE
  
                ? "HubSpot : " +
                  error.message
  
                : config.defaultError
            );
  
  
          } finally {
  
  
            form.dataset
              .hubspotSubmitting =
              "false";
  
  
            setLoading(
              form,
              config,
              false
            );
  
          }
  
        },
  
        true
      );
  
    }
  
  
    /* ==========================================================================
       START
       ========================================================================== */
  
    function initContactPage() {
  
      /*
       * Initialisation immédiate
       * des formulaires.
       */
  
      FORMS_CONFIG.forEach(
        initHubSpotForm
      );
  
  
      /*
       * Puis retry pour les téléphones
       * si intlTelInput était encore
       * en cours de chargement.
       */
  
      initPhonesWhenReady();
  
    }
  
  
    if (
      document.readyState ===
      "loading"
    ) {
  
      document.addEventListener(
        "DOMContentLoaded",
        initContactPage
      );
  
    } else {
  
      initContactPage();
  
    }
  
  })();