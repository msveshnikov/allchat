import { load } from "cheerio";
import { MAX_SEARCH_RESULT_LENGTH } from "./index.js";

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
];

export async function fetchSearchResults(query) {
    try {
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
    } catch (error) {
        return null;
    }
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const TIMEOUT = 10000; // 10 seconds

export async function fetchPageContent(url) {
    try {
        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

        const response = await fetch(url, {
            headers: { "User-Agent": randomUserAgent },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Check content type
        const contentType = response.headers.get("Content-Type");
        if (
            contentType &&
            (contentType.includes("application/pdf") ||
                contentType.includes("audio") ||
                contentType.includes("video") ||
                contentType.includes("image"))
        ) {
            console.log(`fetchPageContent skipped (${contentType})`, url);
            return null;
        }

        // Check file size
        const contentLength = response.headers.get("Content-Length");
        if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
            console.log("fetchPageContent skipped (file too large)", url);
            return null;
        }

        const html = await response.text();
        const $ = load(html);
        $("script, style").remove();
        const content = $("body *")
            .map((_, el) => $(el).text().trim())
            .get()
            .join(" ");
        return content?.slice(0, MAX_SEARCH_RESULT_LENGTH);
    } catch (error) {
        if (error.name === "AbortError") {
            console.log("fetchPageContent timed out", url);
        } else {
            console.error("fetchPageContent error", error);
        }
        return null;
    }
}

export const googleNews = async (lang) => {
    const fetchData = async (lang) => {
        const result = await fetch("https://news.google.com/rss?hl=" + lang, {
            headers: { "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)] },
        });
        return load(await result.text(), { xmlMode: true });
    };
    const $ = await fetchData(lang);

    const articles = [];
    $("item").each((index, item) => {
        const title = $(item).find("title").text();
        const link = $(item).find("link").text();
        const pubDate = $(item).find("pubDate").text();
        const description = $(item)
            .find("description")
            .text()
            .replace(/(<([^>]+)>)/gi, "");
        const source = $(item).find("source").text();

        articles.push({ title, link, pubDate, description, source });
    });

    return articles;
};
