document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(
      ".grid--2cl.is--blog .blog--item"
    );
  
    const loadMoreWrapper = document.querySelector(
      ".load--more-wrapper"
    );
  
    const loadMoreButton = loadMoreWrapper?.querySelector(
      ".button"
    );
  
    const visibleItems = 4;
  
    if (!items.length || !loadMoreWrapper || !loadMoreButton) return;
  
    // Masquer tous les items après les 4 premiers
    items.forEach((item, index) => {
      if (index >= visibleItems) {
        item.style.display = "none";
      }
    });
  
    // Cacher le bouton s'il y a 4 items ou moins
    if (items.length <= visibleItems) {
      loadMoreWrapper.style.display = "none";
      return;
    }
  
    loadMoreButton.addEventListener("click", (event) => {
      event.preventDefault();
  
      items.forEach((item) => {
        item.style.display = "";
      });
  
      loadMoreWrapper.style.display = "none";
  
      // Recalcul des animations/positions GSAP si nécessaire
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    });
  });