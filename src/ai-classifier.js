import { 
    URL, gestureToNumberMap, confidenceThreshold, STABILITY_DELAY,
    resultDisplay, confirmButton, state 
} from '../index.js';

export async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        state.model = await tmImage.load(modelURL, metadataURL);
        state.maxPredictions = state.model.getTotalClasses();

        const flip = true; 
        state.webcam = new tmImage.Webcam(400, 400, flip);
        
        await state.webcam.setup();
        await state.webcam.play();
        window.requestAnimationFrame(loop);

        document.getElementById("webcam-container").innerHTML = "";
        document.getElementById("webcam-container").appendChild(state.webcam.canvas);

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

export function loop() {
    if (state.webcam && state.model) {
        state.webcam.update(); 
        classifyImage();
    }
    window.requestAnimationFrame(loop);
}

export function setStableChoice(numberInfo) {
    if (state.currentAIChoice && state.currentAIChoice.name === numberInfo.name) return;

    state.currentAIChoice = numberInfo;
    confirmButton.disabled = false;

    resultDisplay.textContent = `Palpite fixado: SINAL ${numberInfo.number} (${numberInfo.name}). CLIQUE EM CONFIRMAR!`;
    resultDisplay.style.color = '#6fdc8c';

    if (state.stabilityTimer) {
        clearTimeout(state.stabilityTimer);
        state.stabilityTimer = null;
    }
}

export async function classifyImage() {
    
    if (state.aiLocked) return;

    if (!state.webcam || !state.model) return;
    
    const prediction = await state.model.predict(state.webcam.canvas);
    
    let bestPrediction = { probability: 0, className: "" };
    prediction.forEach(p => {
        if (p.probability > bestPrediction.probability) bestPrediction = p;
    });

    const predictedClassKey = bestPrediction.className;
    const probability = bestPrediction.probability;
    
    if (predictedClassKey === "NENHUM" || probability < confidenceThreshold) {
        if (state.stabilityTimer) clearTimeout(state.stabilityTimer);
        
        if (state.currentAIChoice) {
            state.currentAIChoice = null;
            confirmButton.disabled = true;
            resultDisplay.textContent = 'Sinal perdido.';
            resultDisplay.style.color = 'red';
        } else {
            resultDisplay.textContent = 'Aguardando sinal...';
            resultDisplay.style.color = '#bbbbbb';
        }
        state.pendingPrediction = null; 
        return;
    }

    if (gestureToNumberMap[predictedClassKey]) {
        const numberInfo = gestureToNumberMap[predictedClassKey];
        
        if (state.currentAIChoice && state.currentAIChoice.name === numberInfo.name) return;

        if (state.pendingPrediction && state.pendingPrediction.name === numberInfo.name) {
            if (!state.currentAIChoice) {
                resultDisplay.textContent = `Quase lá: SINAL ${numberInfo.number} (${numberInfo.name}).`;
                resultDisplay.style.color = '#ffc107';
            }
        } else {
            if (state.stabilityTimer) clearTimeout(state.stabilityTimer);
            state.pendingPrediction = numberInfo;
            
            state.stabilityTimer = setTimeout(() => {
                setStableChoice(numberInfo); 
            }, STABILITY_DELAY);
            
            resultDisplay.textContent = `SINAL ${numberInfo.number} detectado! Mantenha...`;
            resultDisplay.style.color = '#ffc107';
        }
    }
}

export function resetAIState() {
    state.currentAIChoice = null;
    state.pendingPrediction = null;
    resultDisplay.textContent = 'Pronto para a próxima ação...';
    resultDisplay.style.color = '#5ea1d6';
}