// main.js: makes the hamburger menu open and close.
// Clicking the button adds or removes the "open" class on the nav.
// The CSS in style.css does the sliding animation.

const nav = document.querySelector("#nav");
const button = document.querySelector("#menu-button");

button.addEventListener("click", () => {
  // toggle() adds or removes the class and returns true if it's now open
  const isOpen = nav.classList.toggle("open");
  button.setAttribute("aria-expanded", isOpen);
});
