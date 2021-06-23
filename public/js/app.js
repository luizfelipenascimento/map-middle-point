const eventConsoleTextElement = document.getElementById('event-console')
const $clearConsole = document.getElementById('event-console-clear-btn')
const $console = document.querySelector('#event-console')

$clearConsole.addEventListener('click', (e) => {
    e.preventDefault()
    eventConsoleTextElement.textContent = ""
})

const eventConsole = {
    appendText(text, textDecoration) {
        const now = new Date()
        const p = document.createElement('p')
        p.classList.add(textDecoration)
        p.textContent = `${now.getDate()}/${(now.getMonth() + 1)}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}: ${text}`
        $console.appendChild(p)
    }
}

eventConsole.appendText('Loading Map')
const controller = new MapController(eventConsole)
initializeMap = function () {
    controller.initializeMap()
}