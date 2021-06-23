
const eventConsole = {
    appendText(text, textDecoration) {
        const now = new Date()
        const p = document.createElement('p')
        p.classList.add(textDecoration)
        p.textContent = `${now.getDate()}/${(now.getMonth() + 1)}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}: ${text}`
        $console.appendChild(p)
    }
}

const controller = new MapController(eventConsole)

const eventConsoleTextElement = document.getElementById('event-console')
const $clearConsole = document.getElementById('event-console-clear-btn')
const $console = document.querySelector('#event-console')
const $gridCheckbox = document.querySelector('#grid')

$clearConsole.addEventListener('click', (e) => {
    e.preventDefault()
    eventConsoleTextElement.textContent = ""
})

$gridCheckbox.addEventListener('click', (e) => {
    if (e.target.checked) {
        controller.drawGroupGrid()
    } else {
        controller.removeGrid()
    }
})

