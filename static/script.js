let inactivityTimeout;
let currentDirectory = '/';

let data;

fetch('./data.json')
    .then(response => response.json())
    .then(json => {
        data = json;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

const terminal = document.getElementById('terminal');
const commandInput = document.getElementById('commandInput');
const inputContainer = document.getElementById('inputContainer');
const themeToggleButton = document.getElementById('themeToggleButton');

const username = 'guest';
const host = 'tossell.ca';

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

let themes = ["default", "dark", "light", "green", "blue","red"]; 
let currentThemeIndex = 0;

function switchTheme() {
    document.body.classList.remove(themes[currentThemeIndex]);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.classList.add(themes[currentThemeIndex]);
}

function typeText(element, responseArray, index = 0) {
    if (index === 0) {
        element.currentTypingSpan = document.createElement('span');
       
        element.insertBefore(element.currentTypingSpan, document.getElementById('inputContainer'));
    }

    if (index < responseArray.length) {
        const line = responseArray[index];
        
        if(line.type === "text") {
            element.currentTypingSpan.textContent += line.content;
        } else if (line.type === "link") {
            const link = document.createElement('a');
            link.href = line.content;
            link.textContent = line.label || line.content;
            link.target = "_blank";
            element.currentTypingSpan.appendChild(link);
            element.currentTypingSpan.appendChild(document.createElement('br'));
        }

        const br = document.createElement('br');
        element.insertBefore(br, document.getElementById('inputContainer'));
        setTimeout(() => typeText(element, responseArray, index + 1), 10);
    } else {
        delete element.currentTypingSpan; 
    }
}

function clearTerminal() {
  
  while (terminal.firstChild) {
      terminal.removeChild(terminal.firstChild);  
  }
  terminal.appendChild(inputContainer);
}

function createPromptElement() {
    const div = document.createElement('div');
    const promptText = `${username}@${host} ~${currentDirectory !== '/' ? '/' + currentDirectory : ''} > `;
    div.innerHTML = promptText;
    return div;
}

commandInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      const command = commandInput.value.trim();
          
    if (command === 'clear') {
      clearTerminal();      
      commandInput.value = '';
      commandInput.focus();  
      return; 
    }

    const commandDisplay = document.createElement('div');
    commandDisplay.innerHTML = `${username}@${host} ~${currentDirectory !== '/' ? '/' + currentDirectory : ''} > ${command}`;
    terminal.insertBefore(commandDisplay, document.getElementById('inputContainer'));

    if (command.startsWith('cd ')) {
        const destination = command.split(' ')[1];
        if (destination === '..') {
            currentDirectory = '/';  
        } else if (data[destination]) {
            currentDirectory = destination;
        } else {
            typeText(terminal, `Unknown directory: ${destination}`);
        }
    } else {
        
        const response = data[currentDirectory][command];
        
        if (response !== undefined) {
            typeText(terminal, response);
        } else {
            typeText(terminal, `Command not found: ${command}`);
        }
    }
    commandInput.value = '';       
    }
});

document.addEventListener('click', function(event) {
    if (event.target !== commandInput && !commandInput.contains(event.target) && event.target !== themeToggleButton) {
      commandInput.focus();
  }
});
