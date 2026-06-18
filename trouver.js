/* ==========================================
   MAP CONCESSIONAIRE ANIMATION
   ========================================== */

   document.addEventListener("DOMContentLoaded", () => {
    const maps = document.querySelectorAll(".map--concessionaire");
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.25
      }
    );
  
    maps.forEach((map) => observer.observe(map));
  });