import {
    ALL_ANIMALS,
    confirmButton,
    resultDisplay,
    state
} from '../../index.js';

import { renderAnimalList, renderAnimalImage } from '../utils/dom-renderer.js';
import { fetchAnimalImage } from '../api/image-fetcher.js';
import { appendToLog } from '../utils/log-utility.js';
import { resetAIState } from '../ia/ai-classifier.js';

export async function startNewRound() {
    state.roundLocked = true;
    state.aiLocked = false;
    confirmButton.disabled = true;

    state.currentRoundAnimals = getFiveUniqueAnimals(ALL_ANIMALS);

    const answerIndex = Math.floor(Math.random() * state.currentRoundAnimals.length);
    const correctAnimalName = state.currentRoundAnimals[answerIndex];

    resultDisplay.textContent = 'Carregando imagem...';
    resultDisplay.style.color = '#ffc107';

    const imageUrl = await fetchAnimalImage(correctAnimalName);

    state.correctAnimal = { 
        name: correctAnimalName, 
        imageUrl: imageUrl 
    };

    renderAnimalImage(imageUrl);

    const { animalsWithProb } =
        defineAnswerWithProbabilities(state.currentRoundAnimals, correctAnimalName); 
    
    renderAnimalList(animalsWithProb);

    state.currentAIChoice = null;
    state.roundLocked = false;
    confirmButton.disabled = false;

    resultDisplay.textContent = 'Nova Rodada!';
    resultDisplay.style.color = '#5ea1d6';

    appendToLog('', 'clear', true);
    appendToLog(
        `Nova Rodada: Qual destes é o animal da imagem? O gesto correto corresponde à posição dele na lista (1 a 5).`,
        'info',
        true
    );
}

export function getFiveUniqueAnimals(baseList) {
    const shuffled = [...baseList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
}

export function defineAnswerWithProbabilities(animals, correctAnimalName) {
    const answerIndex = animals.findIndex(name => name === correctAnimalName); 
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
        isCorrect: name === correctAnimalName,
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
        message = `ACERTOU! O animal da imagem era ${state.correctAnimal.name}. Seu gesto corresponde ao nome correto!`;
        type = 'success';
    } else {
        message = `ERROU! Você apontou para ${guessedAnimalName}, mas o animal da imagem era ${state.correctAnimal.name}.`;
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
