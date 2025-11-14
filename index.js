const URL = "./model/"; 

let model, webcam, maxPredictions;
let gameActive = false; 

const gestureToNumberMap = {
    "SINAL_1": { number: 1, name: "Um" }, 
    "SINAL_2": { number: 2, name: "Dois" },
    "SINAL_3": { number: 3, name: "Três" },
    "SINAL_4": { number: 4, name: "Quatro" },
    "SINAL_5": { number: 5, name: "Cinco" }
};

const confidenceThreshold = 0.8;
const STABILITY_DELAY = 500;

let stabilityTimer = null;
let pendingPrediction = null;
let currentAIChoice = null;

let roundLocked = false; 
let aiLocked = false; 

let currentRoundAnimals = [];
let correctAnimal = null;

const ALL_ANIMALS = [
    "Cachorro", "Gato", "Elefante", "Leão", "Tigre",
    "Girafa", "Zebra", "Macaco", "Panda", "Coelho",
    "Urso", "Lobo", "Raposa", "Esquilo", "Pássaro",
    "Peixe", "Cobra", "Tartaruga", "Cavalo", "Vaca"
];

let resultDisplay;
let confirmButton;
let logDisplay;
let testAreaWrapper; 
let gameArea;
let gameWebcamSlot;
let animalListContainer; 

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

async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true; 
        webcam = new tmImage.Webcam(400, 400, flip);
        
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);

        document.getElementById("webcam-container").innerHTML = "";
        document.getElementById("webcam-container").appendChild(webcam.canvas);

        resultDisplay.textContent = 'IA Pronta. Mostre um sinal de 1 a 5.';
        resultDisplay.style.color = '#e6e6e6';
        confirmButton.disabled = true;
        
    } catch (error) {
        console.error("Erro ao inicializar IA ou Webcam:", error);
        resultDisplay.textContent = 'ERRO: Falha ao carregar a IA ou conectar a webcam.';
        resultDisplay.style.color = 'red';
        confirmButton.disabled = true;
    }
}


function loop() {
    if (webcam && model) {
        webcam.update(); 
        classifyImage();
    }
    window.requestAnimationFrame(loop);
}

function setStableChoice(numberInfo) {
    if (currentAIChoice && currentAIChoice.name === numberInfo.name) return;

    currentAIChoice = numberInfo;
    confirmButton.disabled = false;

    resultDisplay.textContent = `Palpite fixado: SINAL ${numberInfo.number} (${numberInfo.name}). CLIQUE EM CONFIRMAR!`;
    resultDisplay.style.color = '#6fdc8c';

    if (stabilityTimer) {
        clearTimeout(stabilityTimer);
        stabilityTimer = null;
    }
}

async function classifyImage() {
    
    if (aiLocked) return;

    if (!webcam || !model) return;
    
    const prediction = await model.predict(webcam.canvas);
    
    let bestPrediction = { probability: 0, className: "" };
    prediction.forEach(p => {
        if (p.probability > bestPrediction.probability) bestPrediction = p;
    });

    const predictedClassKey = bestPrediction.className;
    const probability = bestPrediction.probability;
    
    if (predictedClassKey === "NENHUM" || probability < confidenceThreshold) {
        if (stabilityTimer) clearTimeout(stabilityTimer);
        
        if (currentAIChoice) {
            currentAIChoice = null;
            confirmButton.disabled = true;
            resultDisplay.textContent = 'Sinal perdido.';
            resultDisplay.style.color = 'red';
        } else {
            resultDisplay.textContent = 'Aguardando sinal...';
            resultDisplay.style.color = '#bbbbbb';
        }
        pendingPrediction = null; 
        return;
    }

    if (gestureToNumberMap[predictedClassKey]) {
        const numberInfo = gestureToNumberMap[predictedClassKey];
        
        if (currentAIChoice && currentAIChoice.name === numberInfo.name) return;

        if (pendingPrediction && pendingPrediction.name === numberInfo.name) {
            if (!currentAIChoice) {
                resultDisplay.textContent = `Quase lá: SINAL ${numberInfo.number} (${numberInfo.name}).`;
                resultDisplay.style.color = '#ffc107';
            }
        } else {
            if (stabilityTimer) clearTimeout(stabilityTimer);
            pendingPrediction = numberInfo;
            
            stabilityTimer = setTimeout(() => {
                setStableChoice(numberInfo); 
            }, STABILITY_DELAY);
            
            resultDisplay.textContent = `SINAL ${numberInfo.number} detectado! Mantenha...`;
            resultDisplay.style.color = '#ffc107';
        }
    }
}


function handleConfirmation() {

    if (roundLocked) return;

    confirmButton.disabled = true; 

    roundLocked = true;
    aiLocked = true;

    if (!currentAIChoice) {
        appendToLog('⚠️ Não há palpite fixado.', 'error');
        
        setTimeout(() => {
            roundLocked = false;
            aiLocked = false;
        }, 400); 
        return;
    }

    if (!gameActive) {
        appendToLog(`✅ TESTE: Sinal ${currentAIChoice.number} (${currentAIChoice.name})`, 'success');
        resetAIState();
        
        setTimeout(() => {
            roundLocked = false;
            aiLocked = false;
        }, 400);

        return;
    }

    const guessedAnimal = mapNumberToAnimal(currentAIChoice.number);
    
    resultDisplay.style.color = '#5ea1d6'; 
    resultDisplay.textContent = 'Processando palpite...';

    if (!guessedAnimal) {
        appendToLog("❌ Erro interno: número não mapeado!", "error");
        resetAIState();
        
        setTimeout(() => {
            roundLocked = false;
            aiLocked = false;
        }, 400);
        return;
    }

    checkGameGuess(guessedAnimal);

    resetAIState();
}

function resetAIState() {
    currentAIChoice = null;
    pendingPrediction = null;
    resultDisplay.textContent = 'Pronto para a próxima ação...';
    resultDisplay.style.color = '#5ea1d6';
}


function startGame() {
    if (!model || !webcam) {
        alert("Aguarde a IA carregar.");
        return;
    }

    if (!gameActive) {
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

        gameActive = true;
    }

    startNewRound();
}

function startNewRound() {
    
    roundLocked = false; 
    aiLocked = false; 
    confirmButton.disabled = true; 

    currentRoundAnimals = getFiveUniqueAnimals(ALL_ANIMALS);

    const { answer, animalsWithProb } = defineAnswerWithProbabilities(currentRoundAnimals);
    correctAnimal = answer;

    renderAnimalList(animalsWithProb);

    currentAIChoice = null;
    
    resultDisplay.textContent = `Nova Rodada! Probabilidade do animal correto: ${correctAnimal.probability.toFixed(0)}%`;
    resultDisplay.style.color = '#5ea1d6';

    appendToLog(`🕹️ Nova Rodada Iniciada.`, 'info');
}

function getFiveUniqueAnimals(baseList) {
    const shuffled = [...baseList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
}

function defineAnswerWithProbabilities(animals) {
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

function renderAnimalList(animalsWithProb) {
    animalListContainer.innerHTML = '';

    const title = document.createElement('h3');
    title.style.cssText = 'color:var(--cor-secundaria); text-align:center;';
    title.textContent = 'Animais';
    animalListContainer.appendChild(title);
    
    const list = document.createElement('ul');
    list.style.cssText = 'list-style:none; padding:0;';

    animalsWithProb.forEach((animal, i) => { 
        const li = document.createElement('li');

        li.innerHTML = `
            <span style="color:#5ea1d6; font-weight:700;">${i + 1}</span> 
            — <strong>${animal.name}</strong> 
            <span style="font-size:0.8em; color:#aaa;">(${animal.probability.toFixed(0)}%)</span>
        `;
        
        li.dataset.animalName = animal.name;

        li.style.cssText = `
            padding:8px;
            margin-bottom:5px;
            cursor:pointer;
            background:#303030;
            border-radius:4px;
            transition:0.2s;
        `;

        li.addEventListener('mouseover', () => li.style.background = '#404040');
        li.addEventListener('mouseout', () => li.style.background = '#303030');
        
        li.addEventListener('click', () => {
            if (roundLocked) {
                appendToLog('⚠️ Aguarde a nova rodada carregar.', 'info');
                return;
            }
            submitAnimalGuess(animal.name);
        });

        list.appendChild(li);
    });

    animalListContainer.appendChild(list);
}


function mapNumberToAnimal(number) {
    const index = number - 1;
    if (!currentRoundAnimals[index]) return null;
    return currentRoundAnimals[index];
}

function checkGameGuess(guessedAnimalName) {
    let message = '';
    let type = '';

    if (guessedAnimalName === correctAnimal.name) {
        message = `🎉 ACERTOU! O animal correto era **${correctAnimal.name}**.`;
        type = 'success';
    } else {
        message = `❌ ERROU! Você escolheu **${guessedAnimalName}**, mas o correto era **${correctAnimal.name}**.`;
        type = 'error';
    }

    appendToLog(message, type);

    resultDisplay.textContent = "Atualizando lista... Nova rodada em instantes.";
    resultDisplay.style.color = '#ffc107';

    setTimeout(startNewRound, 2500);
}

function submitAnimalGuess(name) {
    if (roundLocked) return; 
    roundLocked = true;
    aiLocked = true;
    
    resultDisplay.style.color = '#5ea1d6'; 
    resultDisplay.textContent = 'Processando palpite...';
    
    checkGameGuess(name);
    
    resetAIState();
}


function appendToLog(message, type = 'info') {
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