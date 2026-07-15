/* ==========================================================================
   PARALLAX IMAGES
========================================================================== */

window.addEventListener("load", () => {
    gsap.registerPlugin(ScrollTrigger);
  
    document.querySelectorAll('[animation="parallax"]').forEach((img) => {
      const wrapper =
        img.closest(".full--image-wrapper") || img.parentElement;
  
      gsap.set(wrapper, {
        overflow: "hidden",
        position: "relative",
      });
  
      gsap.set(img, {
        scale: 1.18,
        yPercent: -10,
        willChange: "transform",
      });
  
      gsap.to(img, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });
  
    ScrollTrigger.refresh();
  });