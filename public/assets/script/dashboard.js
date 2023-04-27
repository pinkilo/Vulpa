const page = {
  loadingPlaceholder: document.getElementById("loading"),
  alertHistory: document.querySelector("#alert_history ul"),
  main: document.querySelector("main"),
}

async function load() {
  const alertHistory = await getAlertHistory()
  const listElements = mapAlertsToLI(alertHistory.reverse())
  page.alertHistory.innerHTML = ""
  page.alertHistory.append(...listElements)
  page.main.hidden = false
  page.loadingPlaceholder.hidden = true
}

/**
 *
 * @param {Alert[]} alerts
 * @returns {HTMLElement[]}
 */
function mapAlertsToLI(alerts) {
  return alerts.map(
    ({ description, redeemer: { name, id }, sound, durationSec }) => {
      const li = document.createElement("li")
      const desc = document.createElement("span")
      const redeemer = document.createElement("span")
      const soundPath = document.createElement("span")
      const dur = document.createElement("span")
      const replay = document.createElement("button")
      replay.innerText = "replay"
      replay.onclick = () => {
        // TODO Alert replay
        console.log("TODO")
      }
      desc.innerText = description
      redeemer.innerText = name
      redeemer.setAttribute("data-state", "name")
      redeemer.onclick = () => {
        switch (redeemer.getAttribute("data-state")) {
          case "name":
            redeemer.innerText = id
            redeemer.setAttribute("data-state", "id")
            break
          case "id":
            redeemer.innerText = name
            redeemer.setAttribute("data-state", "name")
            break
        }
      }
      soundPath.innerText = sound
      dur.innerText = `${durationSec.toLocaleString()} sec`
      li.append(desc, redeemer, soundPath, dur)
      return li
    }
  )
}

/**
 * @returns {Promise<Alert[]>}
 */
async function getAlertHistory() {
  console.log("fetching alert history")
  const resp = await fetch("/api/alerts/history")
  const { payload } = await resp.json()
  console.log("Alert history", payload)
  return payload
}

load()
