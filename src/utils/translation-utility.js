const ANIMAL_TRANSLATIONS = {
    "Cachorro": "Dog",
    "Gato": "Cat",
    "Elefante": "Elephant",
    "Leão": "Lion",
    "Tigre": "Tiger",
    "Girafa": "Giraffe",
    "Zebra": "Zebra",
    "Macaco": "Monkey",
    "Panda": "Panda",
    "Coelho": "Rabbit",
    "Urso": "Bear",
    "Lobo": "Wolf",
    "Raposa": "Fox",
    "Esquilo": "Squirrel",
    "Pássaro": "Bird",
    "Peixe": "Fish",
    "Cobra": "Snake",
    "Tartaruga": "Turtle",
    "Cavalo": "Horse",
    "Vaca": "Cow"
};

export function translateAnimalToEnglish(portugueseName) {
    return ANIMAL_TRANSLATIONS[portugueseName] || portugueseName;
}