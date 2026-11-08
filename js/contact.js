// contact.js: the contact page's form.
import { qs, getLocalStorage, setLocalStorage } from "./utils.js";
import { setupMenu } from "./menu.js";

setupMenu();

const form = qs("#contact-form");

// ---------- Fetch: load the topic drop-down from a JSON file ----------
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

// ---------- localStorage: fill in the name and email from last time ----------
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

// ---------- Validation ----------
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// One check per field (keys match each input's name).
// Each returns an error message, or "" if the value is OK.
const validators = {
  name: (value) => (value.length < 2 ? "Please enter your name." : ""),
  email: (value) => (emailPattern.test(value) ? "" : "Please enter a valid email, like name@example.com."),
  topic: (value) => (value === "" ? "Please choose a topic." : ""),
  message: (value) => (value.length < 10 ? "Your message needs at least 10 characters." : ""),
};

// Shows (or clears) the message under one field
function showError(input, message) {
  qs(`#${input.id}-error`).textContent = message;
  input.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", message !== "");
}

// Checks one field and returns true if it's valid
function validateField(input) {
  const message = validators[input.name](input.value.trim());
  showError(input, message);
  return message === "";
}

// Checks every field and returns true if they're all valid
function validateForm() {
  let isValid = true;

  for (const name of Object.keys(validators)) {
    if (!validateField(form.elements[name])) {
      isValid = false;
    }
  }
  return isValid;
}

// ---------- Events ----------
form.addEventListener("submit", (event) => {
  if (!validateForm()) {
    event.preventDefault(); // don't go to thanks.html
    qs(".invalid", form).focus(); // jump to the first problem
    return;
  }

  // Valid: remember the name and email for next time, then let the form submit
  setLocalStorage("contactInfo", {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
  });
});

// Once a field shows an error, re-check it as the user fixes it
form.addEventListener("input", (event) => {
  if (event.target.classList.contains("invalid")) {
    validateField(event.target);
  }
});

loadTopics();
loadSavedInfo();
