import { 
    URL,
    gestureToNumberMap,
    confidenceThreshold,
    STABILITY_DELAY,
    resultDisplay,
    confirmButton,
    state,
    resultDisplayGame,
    confirmButtonGame
} from '../../index.js'; 


function getDisplayElements() {
    if (state.gameActive) {
        return {
            display: resultDisplayGame,
            button: confirmButtonGame
        };
    }

    return {
        display: resultDisplay,
        button: confirmButton
    };
}


export async function init() {
    const { display, button } = getDisplayElements();

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

        const container = document.getElementById("webcam-container");
        container.innerHTML = "";
        container.appendChild(state.webcam.canvas);

        display.textContent = 'IA Pronta. Mostre um sinal de 1 a 5.';
        display.style.color = '#e6e6e6';
        button.disabled = true;

    } catch (error) {
        console.error("Erro ao inicializar IA ou Webcam:", error);
        display.textContent = 'ERRO: Falha ao carregar a IA ou conectar a webcam.';
        display.style.color = 'red';
        button.disabled = true;
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
    const { display, button } = getDisplayElements();

    if (state.currentAIChoice && state.currentAIChoice.name === numberInfo.name) {
        return;
    }

    state.currentAIChoice = numberInfo;
    button.disabled = false;

    display.textContent = `Palpite fixado: SINAL ${numberInfo.number} (${numberInfo.name}). CLIQUE EM CONFIRMAR!`;
    display.style.color = '#6fdc8c';

    if (state.stabilityTimer) {
        clearTimeout(state.stabilityTimer);
        state.stabilityTimer = null;
    }
}


export async function classifyImage() {
    const { display, button } = getDisplayElements();

    if (state.aiLocked) return;
    if (!state.webcam || !state.model) return;

    const prediction = await state.model.predict(state.webcam.canvas);

    let bestPrediction = { probability: 0, className: "" };
    prediction.forEach(p => {
        if (p.probability > bestPrediction.probability) {
            bestPrediction = p;
        }
    });

    const predictedClassKey = bestPrediction.className;
    const probability = bestPrediction.probability;

    if (predictedClassKey === "NENHUM" || probability < confidenceThreshold) {
        if (state.stabilityTimer) {
            clearTimeout(state.stabilityTimer);
        }

        if (state.currentAIChoice) {
            state.currentAIChoice = null;
            button.disabled = true;
            display.textContent = 'Sinal perdido.';
            display.style.color = 'red';
        } else {
            display.textContent = state.gameActive
                ? 'Aguardando sinal para o jogo...'
                : 'Aguardando sinal...';
            display.style.color = '#bbbbbb';
        }

        state.pendingPrediction = null;
        return;
    }

    if (gestureToNumberMap[predictedClassKey]) {
        const numberInfo = gestureToNumberMap[predictedClassKey];

        if (state.currentAIChoice && state.currentAIChoice.name === numberInfo.name) {
            return;
        }

        if (state.pendingPrediction && state.pendingPrediction.name === numberInfo.name) {
            if (!state.currentAIChoice) {
                display.textContent = `Quase lá: SINAL ${numberInfo.number} (${numberInfo.name}).`;
                display.style.color = '#ffc107';
            }
        } else {
            if (state.stabilityTimer) {
                clearTimeout(state.stabilityTimer);
            }

            state.pendingPrediction = numberInfo;

            state.stabilityTimer = setTimeout(() => {
                setStableChoice(numberInfo);
            }, STABILITY_DELAY);

            display.textContent = `SINAL ${numberInfo.number} detectado! Mantenha...`;
            display.style.color = '#ffc107';
        }
    }
}


export function resetAIState() {
    const { display } = getDisplayElements();

    state.currentAIChoice = null;
    state.pendingPrediction = null;

    display.textContent = state.gameActive
        ? 'Aguardando próximo animal...'
        : 'Pronto para a próxima ação...';

    display.style.color = '#5ea1d6';
}
