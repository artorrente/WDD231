// utils.js: small helper functions shared by the other modules.

// Shortcut for querySelector
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// localStorage only stores strings, so convert to and from JSON
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Reads one value from the URL.
// On thanks.html?name=Alex, getParam("name") returns "Alex"
export function getParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}
