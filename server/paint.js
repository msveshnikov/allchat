const paintingWords = [
    // English
    "paint",
    "painting",
    "picture",
    "draw",
    "image",
    "drawing",
    "generate",
    "palette",
    "sketch",

    // Mandarin Chinese
    "画",
    "绘画",
    "油画",
    "水彩",
    "素描",
    "画笔",
    "画布",
    "颜色",
    "调色板",
    "艺术",

    // Hindi
    "चित्र",
    "चित्रकारी",
    "रेखाचित्र",
    "कैनवास",
    "रंग",
    "ब्रश",
    "पैलेट",
    "कला",

    // Spanish
    "pintar",
    "pintura",
    "dibujar",
    "dibujo",
    "pincel",
    "lienzo",
    "paleta",
    "boceto",

    // Arabic
    "رسم",
    "لوحة",
    "لون",
    "فرشاة",
    "قماش",
    "فن",

    // Bengali
    "আঁকা",
    "চিত্রকর্ম",
    "রেখাচিত্র",
    "ক্যানভাস",
    "রঙ",
    "ব্রাশ",
    "প্যালেট",
    "শিল্প",

    // Russian
    "рисовать",
    "нарисовать",
    "нарисуй",
    "картина",
    "живопись",
    "рисунок",
    "кисть",
    "холст",
    "цвет",
    "палитра",
    "эскиз",
    "искусство",

    // Portuguese
    "pintar",
    "pintura",
    "desenhar",
    "desenho",
    "pincel",
    "tela",
    "paleta",
    "esboço",

    // French
    "peindre",
    "peinture",
    "dessin",
    "dessiner",
    "pinceau",
    "couleur",
    "palette",
    "esquisse",
    
];

function hasPaintWord(text) {
    const lowerCaseText = text?.toLowerCase();
    return paintingWords.some((word) => lowerCaseText?.includes(word));
}

export default hasPaintWord;
