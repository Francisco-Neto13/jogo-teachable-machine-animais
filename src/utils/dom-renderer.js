import { 
    animalListContainer, 
    animalImageDisplay,
    state 
} from '../../index.js';

import { appendToLog } from './log-utility.js';

export function renderAnimalImage(imageUrl) {
    if (!animalImageDisplay) {
        console.error("Elemento animalImageDisplay não encontrado.");
        return;
    }
    
    animalImageDisplay.innerHTML = '';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Imagem do animal a ser adivinhado';
    
    img.style.cssText = `
        width: 100%;
        max-height: 250px;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    `;
    
    animalImageDisplay.appendChild(img);
}

export function renderAnimalList(animalsWithProb) {
    animalListContainer.innerHTML = '';

    const title = document.createElement('h3');
    title.style.cssText = `
        color: var(--cor-secundaria); 
        text-align: center;
    `;
    title.textContent = 'Opções de Palpite (Use os Sinais 1-5)';
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
        `;

        li.dataset.animalName = animal.name;

        li.style.cssText = `
            padding: 8px;
            margin-bottom: 5px;
            cursor: default;
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

        list.appendChild(li);
    });

    animalListContainer.appendChild(list);
}
