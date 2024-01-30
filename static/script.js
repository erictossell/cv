let inactivityTimeout;
let currentDirectory = '/';

let data;

fetch('./data.json')
    .then(response => response.json())
    .then(json => {
        data = json;
        // Any other initialization or logic that depends on 'data' can go here
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

let themes = ["default", "dark", "light", "green", "blue","red"]; // Names should match CSS class names
let currentThemeIndex = 0;

function switchTheme() {
    // Remove the current theme class from the body
    document.body.classList.remove(themes[currentThemeIndex]);

    // Go to the next theme
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;

    // Add the next theme class to the body
    document.body.classList.add(themes[currentThemeIndex]);
}

function startInactivityTimeout() {
    // Clear existing timeout if any
    if (inactivityTimeout) clearTimeout(inactivityTimeout);
    
    inactivityTimeout = setTimeout(() => {
        typeText(terminal, "Recommended actions:\n- Try 'ls' to list files\n- Use 'cat filename' to read a file");
    }, 30000); // 30000 milliseconds = 30 seconds
}

// Start the inactivity timer when the page loads
startInactivityTimeout();
function updatePrompt() {
    const prompt = document.getElementById('prompt');
    prompt.textContent = `${username}@${host} ~${currentDirectory !== '/' ? '/' + currentDirectory : ''} >`;
}


function typeText(element, responseArray, index = 0) {
    if (index === 0) {
        element.currentTypingSpan = document.createElement('span');
        // Insert the span just before the inputContainer
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
  // Remove all child nodes from the terminal
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
    startInactivityTimeout();
    if (event.key === 'Enter') {
      const command = commandInput.value.trim();
      
    // Check for the 'clear' command
    if (command === 'clear') {
      // Clear the terminal
      clearTerminal();
      
      // Reset the command input
      commandInput.value = '';
      commandInput.focus();  // Set focus back to the input

      return; // Exit the event listener here since we don't want any further processing for the 'clear' command
    }
      
      // Create a new div for the command entered
    const commandDisplay = document.createElement('div');
    commandDisplay.innerHTML = `${username}@${host} ~${currentDirectory !== '/' ? '/' + currentDirectory : ''} > ${command}`;
    terminal.insertBefore(commandDisplay, document.getElementById('inputContainer'));

    // Handle cd command
    if (command.startsWith('cd ')) {
        const destination = command.split(' ')[1];
        if (destination === '..') {
            currentDirectory = '/';  // Moving back to root for simplicity
        } else if (data[destination]) {
            currentDirectory = destination;
        } else {
            typeText(terminal, `Unknown directory: ${destination}`);
        }
        updatePrompt(); // Update the prompt after a directory change
    } else {
        // Get response based on current directory and command
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
  // Check if the clicked element is not the input, 
  // and not the button, 
  // and that the input doesn't contain the clicked element.
  if (event.target !== commandInput && !commandInput.contains(event.target) && event.target !== themeToggleButton) {
      commandInput.focus();
  }
});
