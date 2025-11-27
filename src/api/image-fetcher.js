const PROXY_ENDPOINT = '/api/image-proxy'; 
const FALLBACK_IMAGE_URL = './assets/fallback-animal.jpg'; 
export async function fetchAnimalImage(animalName) {
    
    const url = `${PROXY_ENDPOINT}?animal=${animalName}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error(`Erro do Proxy para ${animalName}: ${data.error}`);
            
            if (data.error.includes("Nenhuma imagem encontrada")) {
                 console.warn(`Nenhuma imagem encontrada para: ${animalName}`);
            }

            return FALLBACK_IMAGE_URL;
        }

        if (data.imageUrl) {
            return data.imageUrl; 
        }

        console.warn(`Resposta inesperada do proxy para: ${animalName}`);
        return FALLBACK_IMAGE_URL;

    } catch (error) {
        console.error("Erro ao conectar ou receber resposta do Serverless Proxy:", error);
        return FALLBACK_IMAGE_URL;
    }
}