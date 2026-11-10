import { qs } from "./utils.js";

export function setupMenu() {
  const nav = qs("#nav");
  const button = qs("#menu-button");

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", isOpen);
  });
}
