/* js/main.js */
const sectors = {
  s1: { label: "100K", type: "prize", rotation: 30, area: [5, 55] },
  s2: { label: "Pierdes", type: "loss", rotation: 330, area: [305, 355] },
  s3: { label: "50K", type: "prize", rotation: 270, area: [245, 295] },
  s4: { label: "Otro Intento", type: "joker", rotation: 210, area: [185, 235] },
  s5: { label: "30K", type: "prize", rotation: 150, area: [125, 175] },
  s6: { label: "Pierdes", type: "loss", rotation: 90, area: [65, 115] },
}

let prize = parseInt(prompt("ingresa un indice"))

const joker = 3
let score = 0

document.addEventListener("DOMContentLoaded", () => {
  const spinButton = document.getElementById("spin-button")
  const finalizarButton = document.getElementById("finalizar-button")
  const modal = document.getElementById("modal")
  const modalText = document.getElementById("modal-text")
  const prizeWheel = document.querySelector(".spin--wheel")
  const marker = document.querySelector(".spin--marker")

  let spinResult
  let spinning = false

  // Function to define the spin result
  function defineSpinResult() {
    console.log("defineSpinResult - prize:", prize)
    const randomNumber = Math.random()
    let result = ""
    let prizeProbability = 0.4

    if (score >= 2) {
      prizeProbability = 1
    }

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
    const minAngle = selectedArea[0]
    const maxAngle = selectedArea[1]
    const possibleAngles = []
    for (let angle = minAngle; angle <= maxAngle; angle += 5) {
      possibleAngles.push(angle)
    }

    const randomIndex = Math.floor(Math.random() * possibleAngles.length)
    const finalRotationPoint = possibleAngles[randomIndex]

    let rotation = finalRotationPoint
    console.log(rotation)

    const animationDuration = 10000 // 10 seconds
    prizeWheel.style.transition = `transform ${animationDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
    prizeWheel.style.transform = `rotate(${3600 + rotation}deg)`

    setTimeout(() => {
      prizeWheel.style.transition = "none"
      prizeWheel.style.transform = `rotate(${rotation}deg)`
      spinning = false

      if (sectors[spinResult].type === "joker") {
        console.log("spinPrizeWheel - type: joker, label:", sectors[spinResult].label)
        spinButton.disabled = false
        modalText.textContent = "¡Otro intento! Vuelve a girar."
        modal.style.display = "block"
      } else if (sectors[spinResult].type === "prize") {
        console.log("spinPrizeWheel - type: prize, label:", sectors[spinResult].label)
        const prizeText = `¡Felicitaciones, ganaste ${sectors[spinResult].label}!`
        modalText.textContent = prizeText
        modal.style.display = "block"
        document.getElementById("game").classList.add("hidden")
        document.getElementById("payment").classList.remove("hidden")

        setTimeout(() => {
          finalizarButton.style.display = "block"
        }, 2000)
      } else if (sectors[spinResult].type === "loss") {
        console.log("spinPrizeWheel - type: loss, label:", sectors[spinResult].label)
        modalText.textContent = "¡Pierdes! Inténtalo de nuevo."
        modal.style.display = "block"
      }
    }, animationDuration)
  }

  // Function to hide the modal
  function hideModal() {
    location.reload()
  }

  // Event listeners
  spinButton.addEventListener("click", spinPrizeWheel)
  finalizarButton.addEventListener("click", hideModal)

  spinButton.disabled = false
})
