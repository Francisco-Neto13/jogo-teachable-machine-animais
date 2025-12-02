import { 
    confirmButton, resultDisplay, logDisplay,
    logDisplayContainer,
    confirmButtonGame, resultDisplayGame,
    testAreaWrapper, gameArea, gameWebcamSlot, state
} from '../../index.js';
import { appendToLog } from '../utils/log-utility.js';
import { resetAIState } from '../ia/ai-classifier.js';
import { startNewRound, mapNumberToAnimal, checkGameGuess } from './game-logic.js';

export function handleConfirmation() {
    const btn = state.gameActive ? confirmButtonGame : confirmButton;
    const resDisplay = state.gameActive ? resultDisplayGame : resultDisplay;

    if (state.roundLocked) return;

    btn.disabled = true;
    state.roundLocked = true;
    state.aiLocked = true;

    if (!state.currentAIChoice) {
        appendToLog('Não há palpite fixado.', 'error');

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

    resDisplay.style.color = '#5ea1d6';
    resDisplay.textContent = 'Processando palpite...';

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

        if (logDisplayContainer) {
            logDisplayContainer.style.visibility = 'hidden';
        }

        gameWebcamSlot.innerHTML = '';
        const webcamCanvas = document.getElementById('webcam-container').querySelector('canvas');

        if (webcamCanvas) {
            gameWebcamSlot.appendChild(webcamCanvas);
            document.getElementById('webcam-container').innerHTML = '<span style="color:#666;">Webcam movida para o Jogo...</span>';
        }

        if (resultDisplay.parentNode) resultDisplay.parentNode.removeChild(resultDisplay);
        if (confirmButton.parentNode) confirmButton.parentNode.removeChild(confirmButton);
        if (logDisplay.parentNode) logDisplay.parentNode.removeChild(logDisplay);

        state.gameActive = true;
    }

    startNewRound();
}
