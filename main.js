const nav = document.querySelector("#nav");
const button = document.querySelector("#menu-button");

button.addEventListener("click", () => {

  const isOpen = nav.classList.toggle("open");
  button.setAttribute("aria-expanded", isOpen);
});
