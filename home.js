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