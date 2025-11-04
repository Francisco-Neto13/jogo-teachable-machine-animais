const URL = "./model_4classes/"; 
let model, labelContainer, maxPredictions;
let imageElement; 
const resultDisplay = document.getElementById("result-display");

let score = 0;
let streak = 0;

const animalImageFiles = [
    {path: "./imagens/cachorro.jpg", class: "cachorro"}, 
    {path: "./imagens/gato.png", class: "gato"},      
    {path: "./imagens/vaca.jpg", class: "vaca"},   
    {path: "./imagens/cavalo.jpg", class: "cavalo"}
];
const interrogationImage = "./imagens/interrogacao.png";

let currentAnimalImagePath = null;
let currentAnimalActualClass = null;
let currentPrediction = null;

function updateScoreboard() {
    document.getElementById("score-display").textContent = `Pontos: ${score}`;
    document.getElementById("streak-display").textContent = `Streak: ${streak}`;
}

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
        
        imageElement = document.getElementById("current-image");

        updateScoreboard(); 
        resetGameRound();

    } catch (error) {
        console.error("ERRO FATAL: Falha ao carregar o modelo. Verifique a pasta '/model_4classes/' e o 'numClasses' no metadata.json.", error);
    }
}

async function classifyImage(imgElementToClassify) {
    const classNames = model.getClassLabels(); 
    
    let randomProbabilities = [];
    let total = 0;
    
    for (let i = 0; i < maxPredictions; i++) {
        const value = Math.random() * 100;
        randomProbabilities.push(value);
        total += value;
    }
    
    const predictionData = classNames.map((className, index) => {
        return {
            className: className,
            probability: randomProbabilities[index] / total
        };
    });

    currentPrediction = predictionData; 

    labelContainer.innerHTML = ''; 
    currentPrediction.sort((a, b) => b.probability - a.probability);
    
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = 
            currentPrediction[i].className.toUpperCase() + ": " + 
            (currentPrediction[i].probability * 100).toFixed(2) + "%";
        
        const color = (i === 0) ? '#007bff' : '#ffffff'; 
        
        labelContainer.innerHTML += `<div style="color: ${color};">${classPrediction}</div>`;
    }
}

async function resetGameRound() {
    document.querySelectorAll('.guess-buttons button').forEach(btn => btn.disabled = true);

    const randomIndex = Math.floor(Math.random() * animalImageFiles.length);
    const selectedAnimal = animalImageFiles[randomIndex];
    
    currentAnimalImagePath = selectedAnimal.path;
    currentAnimalActualClass = selectedAnimal.class;

    imageElement.src = interrogationImage + "?t=" + Date.now();
    imageElement.style.display = 'block'; 
    
    resultDisplay.textContent = 'Qual é o animal?';
    resultDisplay.style.color = '#ffffff'; 
    
    await new Promise(resolve => imageElement.onload = resolve);
    
    await classifyImage(imageElement);

    document.querySelectorAll('.guess-buttons button').forEach(btn => btn.disabled = false);
}


async function handleGuess(guessedClass) {
    if (!currentPrediction) {
        resultDisplay.textContent = "Aguarde a primeira previsão...";
        return;
    }

    document.querySelectorAll('.guess-buttons button').forEach(btn => btn.disabled = true);
    
    imageElement.src = currentAnimalImagePath;
    await new Promise(resolve => imageElement.onload = resolve);

    if (guessedClass === currentAnimalActualClass) {
        resultDisplay.textContent = `✅ Correto! É um(a) ${currentAnimalActualClass.toUpperCase()}!`;
        resultDisplay.style.color = 'green';
        
        score += 1;
        streak += 1;
        
    } else {
        resultDisplay.textContent = `❌ Errado. O animal era: ${currentAnimalActualClass.toUpperCase()}.`;
        resultDisplay.style.color = 'red';
        
        streak = 0; 
    }
    
    updateScoreboard();
    
    setTimeout(resetGameRound, 2500); 
}

window.onload = init;