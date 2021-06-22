const eventConsoleTextElement = document.getElementById('event-console')
const clearButton = document.getElementById('event-console-clear-btn')

clearButton.addEventListener('click', (e) => {
    e.preventDefault()
    eventConsoleTextElement.textContent = ""
})

const eventConsole = {
    appendText(text) {
        const now = new Date()
        eventConsoleTextElement.textContent += `${now.getDate()}/${(now.getMonth() + 1)}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}: ${text} \r\n`
    }
}

eventConsole.appendText('Loading Map')
const controller = new MapController(eventConsole)
initializeMap = function () {
    controller.initializeMap()
}