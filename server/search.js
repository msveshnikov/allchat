import puppeteer from "puppeteer";

export async function fetchSearchResults(query) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

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
