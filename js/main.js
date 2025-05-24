/* js/main.js */

const spinButton = document.getElementById("spin-button")
const finalizarButton = document.getElementById("finalizar-button")
const modal = document.getElementById("modal")
const modalText = document.getElementById("modal-text")
const prizeWheel = document.querySelector(".spin--wheel")
const marker = document.querySelector(".spin--marker")

const sectors = {
  s1: { label: "100K", type: "prize", rotation: 30, area: [5, 55] },
  s2: { label: "Pierdes", type: "loss", rotation: 330, area: [305, 355] },
  s3: { label: "50K", type: "prize", rotation: 270, area: [245, 295] },
  s4: { label: "Otro Intento", type: "joker", rotation: 210, area: [185, 235] },
  s5: { label: "30K", type: "prize", rotation: 150, area: [125, 175] },
  s6: { label: "Pierdes", type: "loss", rotation: 90, area: [65, 115] },
}

let spinResult
let spinning = false

const joker = 3
let prize = parseInt(prompt("ingresa un indice"))

let score = 0

document.addEventListener("DOMContentLoaded", () => {
  // Function to define the spin result
  function defineSpinResult() {
    console.log("defineSpinResult - prize:", prize)
    const randomNumber = Math.random()
    let result = ""
    let prizeProbability = 0.4

    if (score >= 2) {
      prizeProbability = 1
    }
    console.log("prizeProbability:", prizeProbability)

    if (randomNumber < prizeProbability) {
      result = Object.keys(sectors)[prize]
    } else {
      result = Object.keys(sectors)[joker]
      score++
    }
    console.log("defineSpinResult - result:", result)
    return result
  }

  // Function to spin the prize-wheel
  function spinPrizeWheel() {
    if (spinning) return
    spinning = true
    spinButton.disabled = true

    spinResult = defineSpinResult();
    console.log("spinPrizeWheel - spinResult:", spinResult);

    let selectedArea = sectors[spinResult].area;
    let rotation = getFinalRotationPoint(selectedArea);
    console.log(rotation);

    const animationDuration = 3000 // 10 seconds
    prizeWheel.style.transition = `transform ${animationDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
    prizeWheel.style.transform = `rotate(${3600 + rotation}deg)`

    setTimeout(() => {
      prizeWheel.style.transition = "none";
      prizeWheel.style.transform = `rotate(${rotation}deg)`;
      spinning = false;

      displayModal(sectors[spinResult]);
    }, animationDuration);
  }

  // Function to hide the modal
  function hideModal() {
    location.reload()
  }

  // Event listeners
  spinButton.addEventListener("click", spinPrizeWheel)
  finalizarButton.addEventListener("click", hideModal)

  spinButton.disabled = false

  function getFinalRotationPoint(selectedArea) {
    const minAngle = selectedArea[0];
    const maxAngle = selectedArea[1];
    const possibleAngles = [];
    for (let angle = minAngle; angle <= maxAngle; angle += 5) {
      possibleAngles.push(angle);
    }

    const randomIndex = Math.floor(Math.random() * possibleAngles.length);
    const finalRotationPoint = possibleAngles[randomIndex];
    return finalRotationPoint;
  }

  function displayModal(sector) {
    messagePrizeWheel(sector);
    if (sector.type === "joker") {
      spinButton.disabled = false;
      toggleModal(false);
    } else {
      toggleModal(true);
    }
  }

  function toggleModal(show) {
    if (show) {
      modal.classList.remove("hidden");
    } else {
      modal.classList.add("hidden");
    }
  }

  function messagePrizeWheel(sector) {
    if (sector.type === "prize") {
      console.log("spinPrizeWheel - type: prize, label:", sector.label);
      const prizeText = `¡Felicitaciones, ganaste ${sector.label}!`;
      modalText.textContent = prizeText;
      finalizarButton.style.display = "block";
    } else if (sector.type === "loss") {
      console.log("spinPrizeWheel - type: loss, label:", sector.label);
      modalText.textContent = "¡Pierdes! Inténtalo de nuevo.";
      finalizarButton.style.display = "block";
    } else {
      modalText.textContent = "";
      finalizarButton.style.display = "none";
    }
  }

  function showPaymentSection() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("payment").classList.remove("hidden");

    setTimeout(() => {
      finalizarButton.style.display = "block";
    }, 2000);
  }
})
