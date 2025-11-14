import { logDisplay } from '../index.js'; 

export function appendToLog(message, type = 'info') {
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
    
    logDisplay.prepend(logEntry);

    while (logDisplay.children.length > 10) {
        logDisplay.removeChild(logDisplay.lastChild);
    }
}