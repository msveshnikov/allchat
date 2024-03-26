import { load } from "cheerio";
import fetch from "node-fetch";

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
];

export async function fetchSearchResults(query) {
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, { headers: { "User-Agent": randomUserAgent } });
    const html = await response.text();
    const $ = load(html);

    const results = $(".g")
        .map((_, result) => {
            const title = $(result).find("h3").text().trim();
            const link = $(result).find("a").attr("href");
            const snippet = $(result).find(".VwiC3b").text().trim();
            return { title, link, snippet };
        })
        .get();

    return results;
}

export async function fetchPageContent(url) {
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    const response = await fetch(url, { headers: { "User-Agent": randomUserAgent } });
    const html = await response.text();
    const $ = load(html);

    const content = $("body").text().trim();

    return content;
}

export const google = async (term, lang) => {
    const fetchData = async (term, lang) => {
        const result = await fetch(`https://google.com/search?q=${encodeURIComponent(term)}&hl=${lang}`, {
            headers: { "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)] },
        });
        return load(await result.text());
    };
    const $ = await fetchData(term, lang);
    return (
        $(".PZPZlf span")
            .map((i, element) => $(element).text())
            .get()
            .join(" ")
            .replaceAll("Описание", "")
            .replaceAll("ЕЩЁ", "") + $(".LGOjhe span").text()
    );
};

// console.log(await google("Java", "en"));

export const googleImages = async (term, lang) => {
    const fetchData = async (term, lang) => {
        const result = await fetch(
            `https://www.google.com/search?q=${encodeURIComponent(term)}&oq=${encodeURIComponent(term)}&hl=${lang}` +
                `&tbm=isch&asearch=ichunk&async=_id:rg_s,_pms:s,_fmt:pc&sourceid=chrome&ie=UTF-8`,
            {
                headers: { "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)] },
            }
        );
        return load(await result.text());
    };
    const $ = await fetchData(term, lang);
    let images_results = [];
    $("div.rg_bx").each((i, el) => {
        let json_string = $(el).find(".rg_meta").text();
        images_results.push({
            title: $(el).find(".iKjWAf .mVDMnf").text(),
            source: $(el).find(".iKjWAf .FnqxG").text(),
            link: JSON.parse(json_string).ru,
            original: JSON.parse(json_string).ou,
            thumbnail: $(el).find(".rg_l img").attr("src")
                ? $(el).find(".rg_l img").attr("src")
                : $(el).find(".rg_l img").attr("data-src"),
        });
    });
    return images_results.filter((image) => !image?.original?.includes("x-raw-image://"));
};

//  console.log(await googleImages("cat", "en"));

export const googleNews = async (lang) => {
    const fetchData = async (lang) => {
        const result = await fetch("https://news.google.com/topstories?hl=" + lang, {
            headers: { "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)] },
        });
        return load(await result.text());
    };
    const $ = await fetchData(lang);

    let news_results = [];
    $(".k7Corb").each((i, el) => {
        news_results.push({
            link: $(el).find("a").attr("href"),
            title: $(el).find("h4").text(),
            snippet: $(el).find(".wEwyrc", ".wsLqz").text(),
            thumbnail: $(el).find(".K0q4G img", ".P22Vib img").attr("src"),
        });
    });

    return news_results.filter((r) => r.thumbnail);
};

// console.log(await googleNews("en"));
