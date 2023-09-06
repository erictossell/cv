const cvData = [
    { type: 'command', content: "$ curl -L eric@tossell.ca/cv\n" },
    { type: 'text', content: "     Name: Eric Tossell\n" },
    { type: 'text', content: "     Position: Integration Specialist\n" },
    { type: 'text', content: "     Location: Toronto, ON\n" },
    { type: 'text', content: "     Phone: 647-123-4567\n" },
    { 
        type: 'link', 
        content: "     Email: ", 
        href: "mailto:eric@tossell.ca", 
        linkText: "eric@tossell.ca\n", 
        linkStart: "     Email: ".length, 
        linkEnd: "     Email: ".length + "eric@tossell.ca\n".length - 1 
    },
    { type: 'text', content: "     Phone: 647-123-4567\n" },
    { type: 'link', content: "     LinkedIn: ", href: "https://www.linkedin.com/in/eric-tossell/", linkText: "https://www.linkedin.com/in/eric-tossell/\n", linkStart: "     LinkedIn: ".length, linkEnd: "     LinkedIn: ".length + "https://www.linkedin.com/in/eric-tossell/\n".length - 1 }
];

const terminalOutput = document.querySelector(".typed-output");
let currentLine = 0;
let currentChar = 0;

const commandSpeed = 150;
const responseSpeed = 1;

function appendToTerminal(content, isHTML = false) {
    if (isHTML) {
        terminalOutput.innerHTML += content;
    } else {
        terminalOutput.textContent += content;
    }
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();  // Prevents the default spacebar action
        toggleTheme();
    }
});
;

function toggleTheme() {
    const body = document.querySelector('body');
    
    if (body.classList.contains('alt-theme')) {
        body.classList.remove('alt-theme');
    } else {
        body.classList.add('alt-theme');
    }
}



function typeCharacter() {
    const currentSpeed = (currentLine === 0) ? commandSpeed : responseSpeed;

    if (currentChar >= cvData[currentLine].content.length) {
        currentLine++;
        currentChar = 0;
        if (currentLine < cvData.length) {
            appendToTerminal('<br>', true);
            setTimeout(typeCharacter, currentSpeed + 500);
        }
        return;
    }

    const lineData = cvData[currentLine];
    const char = lineData.content[currentChar];

    switch (lineData.type) {
        case 'command':
        case 'text':
            appendToTerminal(char);
            break;
        case 'link':
            // When you're in the range of the link:
            if (currentChar === lineData.linkStart) {
                appendToTerminal(`<a href="${lineData.href}" target="_blank">`, true);
            }
            appendToTerminal(char);
            if (currentChar === lineData.linkEnd) {
                appendToTerminal('</a>', true);
            }
            break;
    }

    currentChar++;
    setTimeout(typeCharacter, currentSpeed);
}



typeCharacter(); // Start typing effect
