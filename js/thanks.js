import { qs, getParam } from "./utils.js";
import { setupMenu } from "./menu.js";

setupMenu();

const name = getParam("name");

if (name) {
  qs("#thanks-title").textContent = `Thanks, ${name}!`;

  ["name", "email", "topic", "message"].forEach((field) => {
    qs(`#thanks-${field}`).textContent = getParam(field);
  });
} else {
  qs("#thanks-title").textContent = "No message found";
  qs("#thanks-details").hidden = true;
}
