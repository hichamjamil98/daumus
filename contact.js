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