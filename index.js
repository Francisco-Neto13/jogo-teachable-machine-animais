import { init } from './src/ai-classifier.js'; 
import { startGame, handleConfirmation } from './src/game-handlers.js'; 


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

document.addEventListener("DOMContentLoaded", () => {
    resultDisplay = document.getElementById('result-display');
    confirmButton = document.getElementById('confirm-button');
    logDisplay = document.getElementById('log-display'); 
    testAreaWrapper = document.getElementById('test-area-wrapper');
    gameArea = document.getElementById('game-area');
    gameWebcamSlot = document.getElementById('game-webcam-slot');
    animalListContainer = document.getElementById('animal-list-container'); 

    confirmButton.addEventListener('click', handleConfirmation);
    document.getElementById('start-game').addEventListener('click', startGame);

    init();
});