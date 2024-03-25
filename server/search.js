import cheerio from "cheerio";
import fetch from "node-fetch";

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:57.0) Gecko/20100101 Firefox/57.0",
];

export async function fetchSearchResults(query) {
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, { headers: { "User-Agent": randomUserAgent } });
    const html = await response.text();
    const $ = cheerio.load(html);

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
    const $ = cheerio.load(html);

    const content = $("body").text().trim();

    return content;
}
