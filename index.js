const URL = "./model/";
let model, webcam, maxPredictions;

const gestureToNumberMap = {
    "SINAL_1": { number: 1, name: "Um" }, 
    "SINAL_2": { number: 2, name: "Dois" },
    "SINAL_3": { number: 3, name: "Três" },
    "SINAL_4": { number: 4, name: "Quatro" },
    "SINAL_5": { number: 5, name: "Cinco" }
};

const resultDisplay = document.getElementById('result-display');
const confirmButton = document.getElementById('confirm-button');
const logDisplay = document.getElementById('log-display'); 

let currentAIChoice = null; 
const confidenceThreshold = 0.8; 
const STABILITY_DELAY = 500; 

let stabilityTimer = null; 
let pendingPrediction = null; 

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

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        
        resultDisplay.textContent = 'IA pronta. Mostre um sinal de 1 a 5.';
        confirmButton.disabled = true;

    } catch (error) {
        resultDisplay.textContent = 'ERRO: Verifique o console (F12) para detalhes. (Webcam/Modelo).';
        resultDisplay.style.color = 'red';
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
    resultDisplay.style.color = 'lime'; 

    if (stabilityTimer) {
        clearTimeout(stabilityTimer);
        stabilityTimer = null;
    }
}

async function classifyImage() {
    if (!webcam || !model) { return; }
    
    const prediction = await model.predict(webcam.canvas);
    
    let bestPrediction = { probability: 0, className: "" };
    prediction.forEach(p => {
        if (p.probability > bestPrediction.probability) {
            bestPrediction = p;
        }
    });

    const predictedClassKey = bestPrediction.className;
    const probability = bestPrediction.probability;
    
    if (predictedClassKey === "NENHUM" || probability < confidenceThreshold) {
        
        if (stabilityTimer) {
            clearTimeout(stabilityTimer);
            stabilityTimer = null;
        }
        
        if (currentAIChoice) {
            currentAIChoice = null;
            confirmButton.disabled = true;
            resultDisplay.textContent = 'Sinal perdido. Mostre um sinal claro de 1 a 5.';
            resultDisplay.style.color = 'red';
        } else {
            resultDisplay.textContent = 'A IA está vendo: NENHUM (ou confiança baixa).';
            confirmButton.disabled = true;
            resultDisplay.style.color = 'gray';
        }
        
        pendingPrediction = null;
        return;
    }

    if (gestureToNumberMap[predictedClassKey]) {
        const numberInfo = gestureToNumberMap[predictedClassKey];
        
        if (pendingPrediction && pendingPrediction.name === numberInfo.name) {
            resultDisplay.textContent = `Quase lá: SINAL ${numberInfo.number} (${numberInfo.name}). Mantenha fixo!`;
            resultDisplay.style.color = 'yellow';
            
        } 
        
        else if (!pendingPrediction || pendingPrediction.name !== numberInfo.name) {
            
            if (stabilityTimer) {
                clearTimeout(stabilityTimer);
            }
            
            pendingPrediction = numberInfo;
            
            stabilityTimer = setTimeout(() => {
                setStableChoice(numberInfo);
            }, STABILITY_DELAY);
            
            resultDisplay.textContent = `SINAL ${numberInfo.number} detectado! Mantenha fixo por um momento...`;
            resultDisplay.style.color = 'yellow';
        }
    }
}

function handleConfirmation() {
    if (currentAIChoice) {
        const message = `✅ PALPITE CONFIRMADO: Sinal ${currentAIChoice.number} (${currentAIChoice.name}).`;
        
        const logEntry = document.createElement('p');
        logEntry.textContent = message;
        logEntry.style.color = '#00bff'; 
        logEntry.style.margin = '5px 0';
        logDisplay.prepend(logEntry);

        currentAIChoice = null; 
        confirmButton.disabled = true;
        
        resultDisplay.textContent = 'Pronto para o próximo palpite. Mostre outro sinal.';
        resultDisplay.style.color = 'blue';

    } else {
        resultDisplay.textContent = 'Não há um palpite fixado da IA para confirmar.';
        resultDisplay.style.color = 'red';
    }
}

confirmButton.addEventListener('click', handleConfirmation);

window.onload = init;