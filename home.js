/* ==========================================
   SWIPERS
   ========================================== */

   document.addEventListener("DOMContentLoaded", () => {
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
      const slider = document.querySelector(sliderConfig.selector);
      if (!slider || typeof Swiper === "undefined") return;
  
      const section = slider.closest("section");
      if (!section) return;
  
      const nextBtn = section.querySelector(".swiper-btn-next");
      const prevBtn = section.querySelector(".swiper-btn-prev");
  
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
  
        navigation: {
          nextEl: nextBtn,
          prevEl: prevBtn
        },
  
        slidesPerView: sliderConfig.desktopSlides,
        spaceBetween: 24,
  
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
        }
      });
    });
  });
  
  
  /* ==========================================
     VIDEO MODAL
     ========================================== */
  
  document.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.querySelector(".video--play");
    const modal = document.querySelector(".video-modal");
    const modalInside = document.querySelector(".video-modal_inside");
    const closeBtn = document.querySelector(".modal-close-button");
    const iframe = modal?.querySelector("iframe");
  
    if (!playBtn || !modal || !iframe) return;
  
    const videoSrc =
      "https://www.youtube.com/embed/CLuFK9Zxbm8?autoplay=1&rel=0";
  
    function openModal(e) {
      e.preventDefault();
  
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
  
      iframe.src = videoSrc;
    }
  
    function closeModal(e) {
      if (e) e.preventDefault();
  
      modal.style.display = "none";
      document.body.style.overflow = "";
  
      iframe.src = "";
    }
  
    playBtn.addEventListener("click", openModal);
  
    closeBtn?.addEventListener("click", closeModal);
  
    modal.addEventListener("click", (e) => {
      if (modalInside && !modalInside.contains(e.target)) {
        closeModal(e);
      }
    });
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        closeModal(e);
      }
    });
  });
  
  
  /* ==========================================
     FORM ENHANCEMENTS
     Phone Indicatif + Flag / Date Picker / Fake Submit
     ========================================== */
  
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#wf-form-Particulier-Form");
    const phoneInput = document.querySelector("#Phone");
    const dateInput = document.querySelector("#Date-Contact");
    const fakeSubmit = form?.querySelector(".btn--wrapper .button");
    const realSubmit = form?.querySelector(".submit--btn");
  
    /* ---------- Phone Field ---------- */
  
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
  
    /* ---------- Date Picker ---------- */
  
    if (dateInput && window.flatpickr) {
      flatpickr(dateInput, {
        locale: "fr",
        enableTime: true,
        dateFormat: "d/m/Y à H:i",
        minDate: "today",
        time_24hr: true,
        minuteIncrement: 15,
        disableMobile: true
      });
    }
  
    /* ---------- Fake Button Submit ---------- */
  
    if (fakeSubmit && realSubmit) {
      realSubmit.style.display = "none";
  
      fakeSubmit.addEventListener("click", (e) => {
        e.preventDefault();
        realSubmit.click();
      });
    }
  });