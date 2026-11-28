import { qs, getLocalStorage, setLocalStorage } from "./utils.js";
import { setupMenu } from "./menu.js";

setupMenu();

const form = qs("#contact-form");

async function loadTopics() {
  try {
    const response = await fetch("data/topics.json");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    const topics = await response.json();

    const options = topics.map((topic) => `<option value="${topic}">${topic}</option>`);
    qs("#topic").insertAdjacentHTML("beforeend", options.join(""));
  } catch (error) {
    console.error("Could not load topics:", error);
  }
}

function loadSavedInfo() {
  const saved = getLocalStorage("contactInfo");

  if (saved) {
    form.elements.name.value = saved.name;
    form.elements.email.value = saved.email;

    const welcome = qs("#welcome");
    welcome.textContent = `Welcome back, ${saved.name}! Your name and email are filled in.`;
    welcome.hidden = false;
  }
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validators = {
  name: (value) => (value.length < 2 ? "Please enter your name." : ""),
  email: (value) => (emailPattern.test(value) ? "" : "Please enter a valid email, like name@example.com."),
  topic: (value) => (value === "" ? "Please choose a topic." : ""),
  message: (value) => (value.length < 10 ? "Your message needs at least 10 characters." : ""),
};

function showError(input, message) {
  qs(`#${input.id}-error`).textContent = message;
  input.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", message !== "");
}

function validateField(input) {
  const message = validators[input.name](input.value.trim());
  showError(input, message);
  return message === "";
}

function validateForm() {
  let isValid = true;

  for (const name of Object.keys(validators)) {
    if (!validateField(form.elements[name])) {
      isValid = false;
    }
  }
  return isValid;
}

form.addEventListener("submit", (event) => {
  if (!validateForm()) {
    event.preventDefault();
    qs(".invalid", form).focus();
    return;
  }

  setLocalStorage("contactInfo", {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
  });
});

form.addEventListener("input", (event) => {
  if (event.target.classList.contains("invalid")) {
    validateField(event.target);
  }
});

loadTopics();
loadSavedInfo();
