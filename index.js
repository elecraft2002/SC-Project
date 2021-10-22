import puppeteer from 'puppeteer';

async function start() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    page.goto("https://shop.sc-project.com/en-CZ/")
}

start()