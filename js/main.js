/* js/main.js */

const spinButton = document.getElementById("spin-button")
const finalizeButton = document.getElementById("finalizar-button")
const modal = document.getElementById("modal")
const modalText = document.getElementById("modal-text")
const prizeWheel = document.querySelector(".spin--wheel")
const marker = document.querySelector(".spin--marker")

const sectors = {
  s1: { label: "100K", type: "prize", rotation: 30, area: [5, 55] },
  s2: { label: "Pierdes", type: "loss", rotation: 330, area: [305, 355] },
  s3: { label: "50K", type: "prize", rotation: 270, area: [245, 295] },
  s4: { label: "Otro Intento", type: "joker", rotation: 210, area: [185, 235] },
  s5: { label: "30K", type: "prize", rotation: 270, area: [245, 295] },
  s6: { label: "Pierdes", type: "loss", rotation: 330, area: [305, 355] },
}

const documentValidationPatterns = {
  cc: {
    pattern: /^\d{7,10}$/,
    errorMessage: "La Cédula de Ciudadanía debe ser un número de 7 a 10 dígitos.",
  },
  ce: {
    pattern: /^\d{6,10}$/,
    errorMessage: "La Cédula de Extranjería debe ser un número de 6 a 10 dígitos.",
  },
  pa: {
    pattern: /^[a-zA-Z0-9]{6,10}$/,
    errorMessage: "El Pasaporte debe ser alfanumérico y tener entre 6 y 10 caracteres.",
  },
}

let spinResult
let spinning = false

const joker = 3
// let prize = parseInt(prompt("ingresa un indice"))
let prize = 1
let score = 0

document.addEventListener("DOMContentLoaded", () => {
  // --- Helper functions ---
  const getFinalRotationPoint = (selectedArea) => {
    const minAngle = selectedArea[0]
    const maxAngle = selectedArea[1]
    const possibleAngles = []
    for (let angle = minAngle; angle <= maxAngle; angle += 5) {
      possibleAngles.push(angle)
    }

    const randomIndex = Math.floor(Math.random() * possibleAngles.length)
    return possibleAngles[randomIndex]
  }

  const toggleModal = (show) => {
    if (show) {
      modal.classList.remove("hidden")
    } else {
      modal.classList.add("hidden")
    }
  }

  const messagePrizeWheel = (sector) => {
    if (sector.type === "prize") {
      console.log("spinPrizeWheel - type: prize, label:", sector.label)
      const prizeText = `¡Felicitaciones, ganaste ${sector.label}!`
      modalText.textContent = prizeText
      finalizeButton.style.display = "block"
    } else if (sector.type === "loss") {
      console.log("spinPrizeWheel - type: loss, label:", sector.label)
      modalText.textContent = "¡Pierdes! Inténtalo de nuevo."
      finalizeButton.style.display = "block"
    } else {
      modalText.textContent = ""
      finalizeButton.style.display = "none"
    }
  }

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

    spinResult = defineSpinResult()
    console.log("spinPrizeWheel - spinResult:", spinResult)

    let selectedArea = sectors[spinResult].area
    let rotation = getFinalRotationPoint(selectedArea)
    console.log(rotation)

    const animationDuration = 6000 // 10 seconds
    prizeWheel.style.transition = `transform ${animationDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
    prizeWheel.style.transform = `rotate(${3600 + rotation}deg)`

    setTimeout(() => {
      prizeWheel.style.transition = "none"
      prizeWheel.style.transform = `rotate(${rotation}deg)`
      spinning = false

      displayModal(sectors[spinResult])
    }, animationDuration)
  }

  // Function to hide the modal
  function hideModal() {
    location.reload()
  }

  // Event listeners
  spinButton.addEventListener("click", spinPrizeWheel)
  finalizeButton.addEventListener("click", hideModal)

  function setupRegisterForm() {
    const documentTypeSelect = document.getElementById("document-type")
    const documentIdInput = document.getElementById("document-id")

    documentTypeSelect.addEventListener("change", () => {
      const selectedDocumentType = documentTypeSelect.value

      if (selectedDocumentType === "cc" || selectedDocumentType === "ce") {
        documentIdInput.setAttribute("inputmode", "numeric")
        documentIdInput.setAttribute("pattern", "[0-9]*")
        documentIdInput.placeholder = "Ingrese solo números"
      } else if (selectedDocumentType === "pa") {
        documentIdInput.removeAttribute("inputmode")
        documentIdInput.removeAttribute("pattern")
        documentIdInput.placeholder = "Ingrese letras y números"
      } else {
        documentIdInput.removeAttribute("inputmode")
        documentIdInput.removeAttribute("pattern")
        documentIdInput.placeholder = "Ingrese su documento"
      }

      // Validate document ID
      const documentId = documentIdInput.value
      const isValid = validateDocumentId(selectedDocumentType, documentId)

      if (!isValid) {
        const errorMessageSpan = document.getElementById("document-id-error");
        errorMessageSpan.textContent = documentValidationPatterns[selectedDocumentType].errorMessage;
      } else {
        const errorMessageSpan = document.getElementById("document-id-error");
        errorMessageSpan.textContent = "";
      }
    });
  }

  setupRegisterForm()

  function validateDocumentId(documentType, documentId) {
    const validationPattern = documentValidationPatterns[documentType];
    if (!validationPattern) {
      return true; // No validation needed
    }
    const regex = new RegExp(validationPattern.pattern);
    return regex.test(documentId);
  }

  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted (but not actually sending data)");
  });
})
