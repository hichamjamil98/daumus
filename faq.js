document.addEventListener("DOMContentLoaded", () => {

  const faqItems = document.querySelectorAll(".faq--item");

  if (!faqItems.length) return;

  faqItems.forEach((item) => {

    const question = item.querySelector(".faq--question");
    const answer = item.querySelector(".faq--answer");

    if (!question || !answer) return;

    answer.style.maxHeight = "0px";

    question.addEventListener("click", () => {

      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((otherItem) => {

        otherItem.classList.remove("is-open");

        const otherAnswer = otherItem.querySelector(".faq--answer");

        if (otherAnswer) {
          otherAnswer.style.maxHeight = "0px";
        }

      });

      if (!isOpen) {

        item.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";

      }

    });

  });

  let resizeTimer;

  window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

      document.querySelectorAll(".faq--item.is-open").forEach((item) => {

        const answer = item.querySelector(".faq--answer");

        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + "px";
        }

      });

    }, 100);

  });

});