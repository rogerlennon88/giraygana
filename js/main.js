/* js/main.js */

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const documentTypeSelect = document.getElementById("document-type");
  const documentInfo = document.querySelector(".document-info");
  const codeInfo = document.querySelector(".code-info");
  const documentIdInput = document.getElementById("document-id");
  const codeIdInput = document.getElementById("code");
  const marker = document.querySelector(".spin--marker");
  const prizeWheel = document.querySelector(".spin--wheel");
  const spinButton = document.getElementById("spin-button");
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modal-text");
  const finalizeButton = document.getElementById("finalizar-button");

  const documentValidationPatterns = {
    cc: {
      pattern: "^[0-9]{7,10}$",
      message: "Debe ser un número de 7 a 10 dígitos.",
    },
    ce: {
      pattern: "^[0-9]{6,10}$",
      message: "Debe ser un número de 6 a 10 dígitos.",
    },
    pa: {
      pattern: "^(?!^0+$)[a-zA-Z0-9]{3,20}$",
      message: "Debe ser alfanumérico y tener entre 6 y 15 caracteres.",
    },
  };

  const sectors = {
    s1: { label: "100K", type: "prize", rotation: 30, area: [5, 55] },
    s2: { label: "Pierdes", type: "loss", rotation: 330, area: [305, 355] },
    s3: { label: "50K", type: "prize", rotation: 270, area: [245, 295] },
    s4: { label: "Otro Intento", type: "joker", rotation: 210, area: [185, 235] },
    s5: { label: "30K", type: "prize", rotation: 270, area: [245, 295] },
    s6: { label: "Pierdes", type: "loss", rotation: 330, area: [305, 355] },
  };

  let spinResult;
  let spinning = false;

  let prize = 1;
  const joker = 3;
  let score = 0;

  const getFinalRotationPoint = (selectedArea) => {
    const minAngle = selectedArea[0];
    const maxAngle = selectedArea[1];
    const possibleAngles = [];
    for (let angle = minAngle; angle <= maxAngle; angle += 5) {
      possibleAngles.push(angle);
    }

    const randomIndex = Math.floor(Math.random() * possibleAngles.length);
    return possibleAngles[randomIndex];
  };

  const toggleModal = (show) => {
    if (show) {
      modal.classList.remove("hidden");
    } else {
      modal.classList.add("hidden");
    }
  };

  const messagePrizeWheel = (sector) => {
    if (sector.type === "prize") {
      console.log("spinPrizeWheel - type: prize, label:", sector.label);
      const prizeText = `¡Felicitaciones, ganaste ${sector.label}!`;
      modalText.textContent = prizeText;
      finalizeButton.style.display = "block";
    } else if (sector.type === "loss") {
      console.log("spinPrizeWheel - type: loss, label:", sector.label);
      modalText.textContent = "¡Pierdes! Inténtalo de nuevo.";
      finalizeButton.style.display = "block";
    } else {
      modalText.textContent = "";
      finalizeButton.style.display = "none";
    }
  };

  // Function to define the spin result
  function defineSpinResult() {
    console.log("defineSpinResult - prize:", prize);
    const randomNumber = Math.random();
    let result = "";
    let prizeProbability = 0.4;

    if (score >= 2) {
      prizeProbability = 1;
    }
    console.log("prizeProbability:", prizeProbability);

    if (randomNumber < prizeProbability) {
      result = Object.keys(sectors)[prize];
    } else {
      result = Object.keys(sectors)[joker];
      score++;
    }
    console.log("defineSpinResult - result:", result);
    return result;
  }

  // Function to spin the prize-wheel
  function spinPrizeWheel() {
    if (spinning) return;
    spinning = true;
    spinButton.disabled = true;

    spinResult = defineSpinResult();
    console.log("spinPrizeWheel - spinResult:", spinResult);

    let selectedArea = sectors[spinResult].area;
    let rotation = getFinalRotationPoint(selectedArea);
    console.log(rotation);

    const animationDuration = 6000; // 10 seconds
    prizeWheel.style.transition = `transform ${animationDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    prizeWheel.style.transform = `rotate(${3600 + rotation}deg)`;

    setTimeout(() => {
      prizeWheel.style.transition = "none";
      prizeWheel.style.transform = `rotate(${rotation}deg)`;
      spinning = false;

      displayModal(sectors[spinResult]);
    }, animationDuration);
  }

  // Function to hide the modal
  function hideModal() {
    location.reload();
  }

  function setupRegisterForm() {
    const selectedDocumentType = documentTypeSelect.value;

    if (selectedDocumentType === "cc") {
      documentIdInput.setAttribute("type", "number");
      documentIdInput.setAttribute("maxlength", "10");
      documentIdInput.setAttribute("inputmode", "numeric");
      documentIdInput.setAttribute("pattern", "^[0-9]{7,10}$");
    } else if (selectedDocumentType === "ce") {
      documentIdInput.setAttribute("type", "number");
      documentIdInput.setAttribute("maxlength", "10");
      documentIdInput.setAttribute("inputmode", "numeric");
      documentIdInput.setAttribute("pattern", "^[0-9]{6,10}$");
    } else if (selectedDocumentType === "pa") {
      documentIdInput.setAttribute("type", "text");
      documentIdInput.setAttribute("maxlength", "20");
      documentIdInput.setAttribute("inputmode", "text");
      documentIdInput.setAttribute("pattern", "^(?!^0+$)[a-zA-Z0-9]{3,20}$");
    } else {
      documentIdInput.removeAttribute("inputmode");
      documentIdInput.setAttribute("maxlength", "10");
      documentIdInput.setAttribute("pattern", "^[0-9]{7,10}$");
    }
  }

  function validateDocumentId(documentType, documentId) {
    let validationPattern = documentValidationPatterns[documentType];
    if (!validationPattern) {
      return true; // No validation needed
    }
    const regex = new RegExp(validationPattern.pattern);
    return regex.test(documentId);
  }

  function validateCode(code) {
    const pattern = /^(A01|B02)\d{3}$/;
    return pattern.test(code);
  }

  function submitRegisterForm(event) {
    event.preventDefault();

    // Validate document ID
    const selectedDocumentType = documentTypeSelect.value;
    const documentId = documentIdInput.value;
    const isValidDocumentId = validateDocumentId(selectedDocumentType, documentId);

    // Validate code
    const code = codeIdInput.value;
    const isValidCode = validateCode(code);

    if (!isValidDocumentId) {
      documentInfo.textContent = documentValidationPatterns[selectedDocumentType].message;
      console.log(documentValidationPatterns[selectedDocumentType].message);
    } else {
      documentInfo.textContent = "";
    }

    if (!isValidCode) {
      codeInfo.textContent = "No parece un codigo válido.";
      console.log("No parece un codigo válido.");
    } else {
      codeInfo.textContent = "";
    }

    if (isValidDocumentId && isValidCode) {
      console.log("Formulario enviado");
    } else {
      console.log("Formulario no enviado");
    }
  }

  // Event listeners
  setupRegisterForm();
  documentTypeSelect.addEventListener("change", setupRegisterForm);
  registerForm.addEventListener("submit", submitRegisterForm);
  spinButton.addEventListener("click", spinPrizeWheel);
  finalizeButton.addEventListener("click", hideModal);
});
