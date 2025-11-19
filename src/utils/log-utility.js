import { 
    logDisplay, 
    gameLogDisplay, 
    state 
} from '../../index.js'; 


export function appendToLog(message, type = 'info', clear = false) {
    const currentLogDisplay = state.gameActive 
        ? gameLogDisplay 
        : logDisplay;
    
    if (!currentLogDisplay) {
        console.error("Elemento de log não encontrado.");
        return;
    }

    if (clear) {
        currentLogDisplay.innerHTML = '';
    }

    const logEntry = document.createElement('p');

    logEntry.innerHTML = message;

    const colors = {
        success: "#6fdc8c",
        error: "#dc3545",
        info: "#5ea1d6"
    };

    logEntry.style.color = colors[type] || "#e6e6e6";
    logEntry.style.margin = '5px 0';
    logEntry.style.paddingLeft = '5px';
    logEntry.style.borderLeft = `3px solid ${logEntry.style.color}`;

    currentLogDisplay.prepend(logEntry);

    while (currentLogDisplay.children.length > 10) {
        currentLogDisplay.removeChild(currentLogDisplay.lastChild);
    }
}
