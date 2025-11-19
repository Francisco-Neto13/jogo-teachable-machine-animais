import { 
    animalListContainer, 
    state 
} from '../../index.js';

import { appendToLog } from './log-utility.js'; 
import { submitAnimalGuess } from '../game/game-logic.js'; 


export function renderAnimalList(animalsWithProb) {
    animalListContainer.innerHTML = '';

    const title = document.createElement('h3');
    title.style.cssText = `
        color: var(--cor-secundaria); 
        text-align: center;
    `;
    title.textContent = 'Animais';
    animalListContainer.appendChild(title);

    const list = document.createElement('ul');
    list.style.cssText = `
        list-style: none;
        padding: 0;
    `;

    animalsWithProb.forEach((animal, i) => {
        const li = document.createElement('li');

        li.innerHTML = `
            <span style="color:#5ea1d6; font-weight:700;">${i + 1}</span>
            — <strong>${animal.name}</strong>
            <span style="font-size:0.8em; color:#aaa;">
                (${animal.probability.toFixed(0)}%)
            </span>
        `;

        li.dataset.animalName = animal.name;

        li.style.cssText = `
            padding: 8px;
            margin-bottom: 5px;
            cursor: pointer;
            background: #303030;
            border-radius: 4px;
            transition: 0.2s;
        `;

        li.addEventListener('mouseover', () => {
            li.style.background = '#404040';
        });

        li.addEventListener('mouseout', () => {
            li.style.background = '#303030';
        });

        li.addEventListener('click', () => {
            if (state.roundLocked) {
                appendToLog('⚠️ Aguarde a nova rodada carregar.', 'info');
                return;
            }

            submitAnimalGuess(animal.name);
        });

        list.appendChild(li);
    });

    animalListContainer.appendChild(list);
}
