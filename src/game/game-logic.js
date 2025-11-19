import {
    ALL_ANIMALS,
    confirmButton,
    resultDisplay,
    state
} from '../../index.js';

import { renderAnimalList } from '../utils/dom-renderer.js';
import { appendToLog } from '../utils/log-utility.js';
import { resetAIState } from '../ia/ai-classifier.js';


export function startNewRound() {
    state.roundLocked = false;
    state.aiLocked = false;
    confirmButton.disabled = true;

    state.currentRoundAnimals = getFiveUniqueAnimals(ALL_ANIMALS);

    const { answer, animalsWithProb } =
        defineAnswerWithProbabilities(state.currentRoundAnimals);

    state.correctAnimal = answer;

    renderAnimalList(animalsWithProb);

    state.currentAIChoice = null;

    resultDisplay.textContent = 'Nova Rodada!';
    resultDisplay.style.color = '#5ea1d6';

    appendToLog('', 'clear', true);
    appendToLog(
        'Nova Rodada iniciada. Tente o sinal correspondente ao animal correto.',
        'info',
        true
    );
}

export function getFiveUniqueAnimals(baseList) {
    const shuffled = [...baseList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
}

export function defineAnswerWithProbabilities(animals) {
    const answerIndex = Math.floor(Math.random() * animals.length);
    const answerName = animals[answerIndex];

    const raw = [];
    for (let i = 0; i < animals.length; i++) {
        raw.push(Math.random());
    }

    const total = raw.reduce((a, b) => a + b, 0);
    let percentages = raw.map(v => Math.floor((v / total) * 100));

    const diff = 100 - percentages.reduce((a, b) => a + b, 0);
    percentages[0] += diff;

    const animalsWithProb = animals.map((name, idx) => ({
        name,
        isCorrect: idx === answerIndex,
        probability: percentages[idx]
    }));

    return {
        answer: { name: answerName },
        animalsWithProb
    };
}

export function mapNumberToAnimal(number) {
    const animalEntry = state.currentRoundAnimals[number - 1];
    return animalEntry || null;
}

export function checkGameGuess(guessedAnimalName) {
    let message = '';
    let type = '';

    if (guessedAnimalName === state.correctAnimal.name) {
        message = `ACERTOU! O animal correto era ${state.correctAnimal.name}.`;
        type = 'success';
    } else {
        message = `ERROU! Você escolheu **${guessedAnimalName}**, mas o correto era ${state.correctAnimal.name}.`;
        type = 'error';
    }

    appendToLog(message, type, true);

    resultDisplay.textContent = 'Atualizando lista... Nova rodada em instantes.';
    resultDisplay.style.color = '#ffc107';

    state.roundLocked = true;
    resetAIState();

    setTimeout(startNewRound, 2500);
}

export function submitAnimalGuess(name) {
    if (state.roundLocked) return;
    checkGameGuess(name);
}
