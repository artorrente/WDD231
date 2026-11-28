import { qs, getLocalStorage, setLocalStorage } from "./utils.js";
import { setupMenu } from "./menu.js";

setupMenu();

const IMAGES = {
  forest: "images/forest.webp",
  warrior: {
    passive: "images/warrior-passive.png",
    aggressive: "images/warrior-aggressive.png",
  },
  wizard: {
    passive: "images/wizard-passive.png",
    aggressive: "images/wizard-aggressive.png",
  },
  enemies: {
    spider: "images/spider.png",
    birdman: "images/birdman.png",
    zombie: "images/zombie.png",
  },
};

const CHARACTERS = ["warrior", "wizard"];
const ENEMIES = Object.keys(IMAGES.enemies);
const STORAGE_KEY = "character";
const ENEMY_HEALTH = 3;
const ATTACK_TIME = 1000;

const gameArea = qs("#game");
const startScreen = qs("#start-screen");
const playButton = qs("#play-button");
const scene = qs("#scene");
const status = qs("#status");
const player = qs("#player");
const passiveImg = qs("#player-passive");
const aggressiveImg = qs("#player-aggressive");
const enemyBox = qs("#enemy");
const enemyImg = qs("#enemy-img");
const enemyHealthBar = qs("#enemy-health");
const attackButton = qs("#attack-button");
const walkButton = qs("#walk-button");

let character = null;
let wHeld = false;
let heldTime = 0;
let lastFrame = 0;
let nextBattleAt = randomBattleTime();
let inBattle = false;
let isAttacking = false;
let enemy = null;
let enemyHealth = 0;

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomBattleTime() {
  return 2000 + Math.random() * 1000;
}

function setStatus(message) {
  status.textContent = message;
}

function loadCharacter() {
  const saved = getLocalStorage(STORAGE_KEY);

  if (CHARACTERS.includes(saved)) {
    return saved;
  }

  const chosen = pick(CHARACTERS);
  setLocalStorage(STORAGE_KEY, chosen);
  return chosen;
}

function startGame() {
  character = loadCharacter();

  passiveImg.src = IMAGES[character].passive;
  passiveImg.alt = `Your ${character}`;
  aggressiveImg.src = IMAGES[character].aggressive;

  gameArea.style.backgroundImage = `url("${IMAGES.forest}")`;
  startScreen.hidden = true;
  scene.hidden = false;
}

function startWalking() {
  if (wHeld || !character || inBattle) return;

  wHeld = true;
  player.classList.add("bouncing");
  lastFrame = performance.now();
  requestAnimationFrame(walk);
}

function stopWalking() {
  wHeld = false;
  player.classList.remove("bouncing");
}

function walk(now) {
  if (!wHeld) return;

  heldTime += now - lastFrame;
  lastFrame = now;

  if (heldTime >= nextBattleAt) {
    startBattle();
    return;
  }

  requestAnimationFrame(walk);
}

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "w") {
    startWalking();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key.toLowerCase() === "w") {
    stopWalking();
  }
});

window.addEventListener("blur", stopWalking);

walkButton.addEventListener("pointerdown", (event) => {
  startWalking();
  walkButton.setPointerCapture(event.pointerId);
});
walkButton.addEventListener("pointerup", stopWalking);
walkButton.addEventListener("pointercancel", stopWalking);

walkButton.addEventListener("keydown", (event) => {
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    startWalking();
  }
});
walkButton.addEventListener("keyup", (event) => {
  if (event.key === " " || event.key === "Enter") {
    stopWalking();
  }
});

walkButton.addEventListener("contextmenu", (event) => event.preventDefault());

function updateHealthBar() {
  enemyHealthBar.style.width = `${(enemyHealth / ENEMY_HEALTH) * 100}%`;
}

function startBattle() {
  stopWalking();
  heldTime = 0;
  nextBattleAt = randomBattleTime();

  inBattle = true;
  enemy = pick(ENEMIES);
  enemyHealth = ENEMY_HEALTH;
  updateHealthBar();

  enemyImg.src = IMAGES.enemies[enemy];
  enemyImg.alt = `A ${enemy}`;
  enemyBox.classList.remove("defeated");
  gameArea.classList.add("in-battle");
  attackButton.focus({ preventScroll: true });
}

function attack() {
  if (!inBattle || isAttacking) return;

  isAttacking = true;
  player.classList.add("attacking");
  enemyBox.classList.add("hit");

  enemyHealth -= 1;
  updateHealthBar();

  setTimeout(() => {
    player.classList.remove("attacking");
    enemyBox.classList.remove("hit");
    isAttacking = false;

    if (enemyHealth <= 0) {
      winBattle();
    }
  }, ATTACK_TIME);
}

function winBattle() {
  enemyBox.classList.add("defeated");

  setTimeout(() => {
    gameArea.classList.remove("in-battle");
    inBattle = false;

    if (document.activeElement === attackButton) {
      walkButton.focus({ preventScroll: true });
    }
  }, 600);
}

playButton.addEventListener("click", startGame);
attackButton.addEventListener("click", attack);