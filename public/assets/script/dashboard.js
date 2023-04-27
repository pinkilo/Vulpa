const page = {
  loadingPlaceholder: document.getElementById("loading"),
  alertHistory: document.querySelector("#alert_history ul"),
  chatHistory: document.querySelector("#chat_history ul"),
  main: document.querySelector("main"),
}
let chatPage = 0
let chatPollRate = 5 * 1000

load()

async function load() {
  await loadAlertHistory()
  await loadChat()
  page.main.hidden = false
  page.loadingPlaceholder.hidden = true
}
wwwwwwwww
async function loadChat() {
  const chat = await getChat()
  if (chat.length > 0) {
    const listElements = mapChatToLI(chat)
    page.chatHistory.append(...listElements)
    chatPage += chat.length
  }
  setTimeout(loadChat, chatPollRate)
}

async function loadAlertHistory() {
  const alertHistory = await getAlertHistory()
  const listElements = mapAlertsToLI(alertHistory.reverse())
  page.alertHistory.innerHTML = ""
  page.alertHistory.append(...listElements)
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

/**
 * @param {Promise<Schema$LiveChatMessage[]>}
 * @returns {HTMLElement[]}
 */
function mapChatToLI(messages) {
  return messages.map(
    ({ authorDetails, snippet: { displayMessage, publishedAt } }) => {
      const li = document.createElement("li")
      const author = document.createElement("span")
      const message = document.createElement("span")
      const date = document.createElement("span")
      author.innerText = authorDetails.displayName
      message.innerText = displayMessage
      date.innerText = publishedAt || ""
      li.append(author, message, date)
      return li
    }
  )
}

/**
 * @returns {Promise<Schema$LiveChatMessage[]>}
 */
async function getChat() {
  console.log(`fetching chat page ${chatPage}`)
  const resp = await fetch(`/api/chat?page=${chatPage}`)
  const { payload } = await resp.json()
  console.log("chat", payload)
  return payload
}
