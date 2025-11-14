import { 
    ALL_ANIMALS, confirmButton, 
    resultDisplay, state 
} from '../index.js';
import { renderAnimalList } from './dom-renderer.js'; 
import { appendToLog } from './log-utility.js';
import { resetAIState } from './ai-classifier.js'; 

export function startNewRound() {
    
    state.roundLocked = false; 
    state.aiLocked = false; 
    confirmButton.disabled = true; 

    state.currentRoundAnimals = getFiveUniqueAnimals(ALL_ANIMALS);

    const { answer, animalsWithProb } = defineAnswerWithProbabilities(state.currentRoundAnimals);
    state.correctAnimal = answer;

    renderAnimalList(animalsWithProb);

    state.currentAIChoice = null;
    
    resultDisplay.textContent = `Nova Rodada! Probabilidade do animal correto: ${state.correctAnimal.probability.toFixed(0)}%`;
    resultDisplay.style.color = '#5ea1d6';

    appendToLog(`Nova Rodada Iniciada.`, 'info');
}

export function getFiveUniqueAnimals(baseList) {
    const shuffled = [...baseList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
}

export function defineAnswerWithProbabilities(animals) {
    const numAnimals = animals.length;
    let totalProb = 100;
    let animalsWithProb = [];

    for (let i = 0; i < numAnimals; i++) {
        let weight = (i === numAnimals - 1) 
            ? totalProb 
            : Math.max(10, Math.floor(Math.random() * (totalProb - (numAnimals - 1 - i) * 10))); 
        
        animalsWithProb.push({
            name: animals[i],
            probability: weight
        });
        totalProb -= weight;
    }
    
    const finalSum = animalsWithProb.reduce((s, a) => s + a.probability, 0);
    if (finalSum !== 100) {
        animalsWithProb[numAnimals - 1].probability += (100 - finalSum);
    }

    let r = Math.random() * 100;
    let sum = 0;

    let answer = animalsWithProb.find(a => (sum += a.probability) > r);

    return { answer, animalsWithProb };
}

export function mapNumberToAnimal(number) {
    const index = number - 1;
    if (!state.currentRoundAnimals[index]) return null;
    return state.currentRoundAnimals[index];
}

export function checkGameGuess(guessedAnimalName) {
    let message = '';
    let type = '';

    if (guessedAnimalName === state.correctAnimal.name) {
        message = `ACERTOU! O animal correto era ${state.correctAnimal.name}.`;
        type = 'success';
    } else {
        message = `ERROU! Você escolheu ${guessedAnimalName}, mas o correto era ${state.correctAnimal.name}.`;
        type = 'error';
    }

    appendToLog(message, type);

    resultDisplay.textContent = "Atualizando lista... Nova rodada em instantes.";
    resultDisplay.style.color = '#ffc107';

    setTimeout(startNewRound, 2500);
}

export function submitAnimalGuess(name) {
    if (state.roundLocked) return; 
    state.roundLocked = true;
    state.aiLocked = true;
    
    resultDisplay.style.color = '#5ea1d6'; 
    resultDisplay.textContent = 'Processando palpite...';
    
    checkGameGuess(name);
    
    resetAIState();
}