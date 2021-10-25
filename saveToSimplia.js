const puppeteer = require('puppeteer');
const fs = require("fs");
const { Parser } = require("json2csv");
const config = require("./config");

async function startBrowser() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    return page
}

async function login(page, USERNAME, PASSWORD, eshopUrl) {
    //Jde na login page
    await page.goto(`${eshopUrl}admin/`)
    //Zadá informace do stránky
    await page.evaluate((USERNAME, PASSWORD) => {
        document.getElementsByName("_username")[0].value = USERNAME
        document.getElementsByName("_password")[0].value = PASSWORD
        document.querySelector("button[type=submit]").click()
        console.log(USERNAME)
    }, USERNAME, PASSWORD)
    return page
}

async function importProducts(page) {
    await page.goto(`${eshopUrl}admin/importy/`)
    await page.evaluate((data) => {
        
    }, data)
    return
}
async function saving(USERNAME, PASSWORD, eshopUrl/* Př www.rutan.cz (simplia.cz) */, json, jsonLength) {
    let page = await startBrowser()
    page = await login(page, USERNAME, PASSWORD, eshopUrl)
    page = await importProducts(page)
}


saving(config.username(), config.password(), "https://www.rutan.cz/", "", 50)
