import { init } from './src/ia/ai-classifier.js';
import { startGame, handleConfirmation } from './src/game/game-handlers.js';
import { loadComponent } from './src/utils/component-loader.js';

export const URL = "./model/";

export const state = {
    model: null,
    webcam: null,
    maxPredictions: 0,
    
    stabilityTimer: null,
    pendingPrediction: null,
    currentAIChoice: null,
    
    roundLocked: false,
    aiLocked: false,
    gameActive: false,
    
    currentRoundAnimals: [],
    correctAnimal: null,
};

export const gestureToNumberMap = {
    "SINAL_1": { number: 1, name: "Um" }, 
    "SINAL_2": { number: 2, name: "Dois" },
    "SINAL_3": { number: 3, name: "Três" },
    "SINAL_4": { number: 4, name: "Quatro" },
    "SINAL_5": { number: 5, name: "Cinco" }
};

export const confidenceThreshold = 0.8;
export const STABILITY_DELAY = 500;

export const ALL_ANIMALS = [
    "Cachorro", "Gato", "Elefante", "Leão", "Tigre",
    "Girafa", "Zebra", "Macaco", "Panda", "Coelho",
    "Urso", "Lobo", "Raposa", "Esquilo", "Pássaro",
    "Peixe", "Cobra", "Tartaruga", "Cavalo", "Vaca"
];

export let resultDisplay;
export let confirmButton;
export let logDisplay; 
export let testAreaWrapper; 
export let gameArea;
export let gameWebcamSlot;
export let animalListContainer; 

export let resultDisplayGame;
export let confirmButtonGame;
export let gameLogDisplay;

async function setupDOMAndListeners() {
    
    await loadComponent('./components/game-area.html', 'game-area-slot');
    await loadComponent('./components/guide-side.html', 'guide-slot');

    resultDisplay = document.getElementById('result-display');
    confirmButton = document.getElementById('confirm-button');
    logDisplay = document.getElementById('log-display'); 
    testAreaWrapper = document.getElementById('test-area-wrapper');
    gameArea = document.getElementById('game-area');
    gameWebcamSlot = document.getElementById('game-webcam-slot');
    animalListContainer = document.getElementById('animal-list-container'); 
    
    resultDisplayGame = document.getElementById('result-display-game');
    confirmButtonGame = document.getElementById('confirm-button-game');
    gameLogDisplay = document.getElementById('game-log-display');

    if (confirmButton) {
        confirmButton.addEventListener('click', handleConfirmation);
    }
    
    if (confirmButtonGame) {
        confirmButtonGame.addEventListener('click', handleConfirmation);
    }
    
    const startGameButton = document.getElementById('start-game');
    if (startGameButton) {
        startGameButton.addEventListener('click', startGame);
    }

    init();
}

document.addEventListener("DOMContentLoaded", setupDOMAndListeners);