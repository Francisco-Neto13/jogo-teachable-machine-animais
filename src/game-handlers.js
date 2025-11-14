import { 
    confirmButton, resultDisplay,
    testAreaWrapper, gameArea, gameWebcamSlot, state
} from '../index.js';
import { appendToLog } from './log-utility.js';
import { resetAIState } from './ai-classifier.js';
import { startNewRound, mapNumberToAnimal, checkGameGuess } from './game-logic.js';

export function handleConfirmation() {

    if (state.roundLocked) return;

    confirmButton.disabled = true; 

    state.roundLocked = true;
    state.aiLocked = true;

    if (!state.currentAIChoice) {
        appendToLog('⚠️ Não há palpite fixado.', 'error');
        
        setTimeout(() => {
            state.roundLocked = false;
            state.aiLocked = false;
        }, 400); 
        return;
    }

    if (!state.gameActive) {
        appendToLog(`TESTE: Sinal ${state.currentAIChoice.number} (${state.currentAIChoice.name})`, 'success');
        resetAIState();
        
        setTimeout(() => {
            state.roundLocked = false;
            state.aiLocked = false;
        }, 400);

        return;
    }

    const guessedAnimal = mapNumberToAnimal(state.currentAIChoice.number);
    
    resultDisplay.style.color = '#5ea1d6'; 
    resultDisplay.textContent = 'Processando palpite...';

    if (!guessedAnimal) {
        appendToLog("❌ Erro interno: número não mapeado!", "error");
        resetAIState();
        
        setTimeout(() => {
            state.roundLocked = false;
            state.aiLocked = false;
        }, 400);
        return;
    }

    checkGameGuess(guessedAnimal);

    resetAIState();
}

export function startGame() {
    if (!state.model || !state.webcam) {
        alert("Aguarde a IA carregar.");
        return;
    }

    if (!state.gameActive) {
        testAreaWrapper.style.display = 'none';
        gameArea.style.display = 'block';

        gameWebcamSlot.innerHTML = '';
        const webcamCanvas = document.getElementById('webcam-container').querySelector('canvas');
        if (webcamCanvas) gameWebcamSlot.appendChild(webcamCanvas);

        const gameControlsContainer = document.createElement('div');
        gameControlsContainer.id = 'game-controls-container'; 
        gameControlsContainer.style.cssText = 'display:flex; flex-direction:column; align-items:center; margin-top:20px;';
        gameControlsContainer.appendChild(resultDisplay);
        gameControlsContainer.appendChild(confirmButton);

        const gameContentFlex = document.getElementById('game-content-flex');
        gameArea.insertBefore(gameControlsContainer, gameContentFlex.nextSibling);

        state.gameActive = true;
    }

    startNewRound();
}