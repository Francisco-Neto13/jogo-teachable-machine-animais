import { translateAnimalToEnglish } from '../utils/translation-utility.js';

export async function fetchAnimalImage(animalName) {
    const englishAnimalName = translateAnimalToEnglish(animalName);

    try {
        const response = await fetch(`/api/pexels?animal=${englishAnimalName}`);

        if (!response.ok) {
            console.error("Erro chamando backend:", response.status);
            return './assets/fallback-animal.jpg';
        }

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.medium;
        }

        return './assets/fallback-animal.jpg';

    } catch (error) {
        console.error("Erro ao consultar backend:", error);
        return './assets/fallback-animal.jpg';
    }
}
