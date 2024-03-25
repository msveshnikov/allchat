import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:57.0) Gecko/20100101 Firefox/57.0",
];

export async function fetchSearchResults(query) {
    const browser = await puppeteer.launch({
        product: "firefox",
        executablePath: "/usr/bin/firefox-esr",
    });
    const page = await browser.newPage();
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(randomUserAgent);

    // Navigate to Google Search
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    // Extract relevant information from the search results
    const extractedData = await page.evaluate(() => {
        const results = Array.from(document.querySelectorAll(".g"));
        return results.map((result) => {
            const title = result.querySelector("h3").innerText;
            const link = result.querySelector("a").href;
            const snippet = result.querySelector(".VwiC3b").innerText;
            return { title, link, snippet };
        });
    });

    await browser.close();
    return extractedData;
}

export async function fetchPageContent(url) {
    const browser = await puppeteer.launch({
        product: "firefox",
        executablePath: "/usr/bin/firefox-esr",
    });
    const page = await browser.newPage();
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(randomUserAgent);

    await page.goto(url, { waitUntil: "networkidle2" });
    const html = await page.content();

    const dom = new JSDOM(html);
    const content = dom.window.document.documentElement.textContent;

    await browser.close();
    return content;
}
