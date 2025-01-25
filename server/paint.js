const paintingWords = [
    // English
    // "paint",
    // "painting",
    // "picture",
    // "draw",
    // "image",
    // "drawing",
    // "generate",
    // "sketch",

    // // Spanish
    // "pintar",
    // "pintura",
    // "dibujar",
    // "dibujo",
    // "pincel",
    // "lienzo",
    // "boceto",

    // // Russian
    // "рисовать",
    // "нарисовать",
    // "нарисуй",
    // "картина",
    // "живопись",
    // "рисунок",
    // "искусство",

    // // Portuguese
    // "pintar",
    // "pintura",
    // "desenhar",
    // "desenho",
    // "pincel",
    // "tela",
    // "esboço",

    // // French
    // "peindre",
    // "peinture",
    // "dessin",
    // "dessiner",
    // "pinceau",
    // "couleur",
    // "esquisse",
    
];

function hasPaintWord(text) {
    const lowerCaseText = text?.toLowerCase();
    return paintingWords.some((word) => lowerCaseText?.includes(word));
}

export default hasPaintWord;
