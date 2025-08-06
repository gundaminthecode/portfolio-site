// script.js
document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      alert(`You clicked on ${card.textContent}`);
    });
  });
});
