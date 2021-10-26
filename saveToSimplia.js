const puppeteer = require('puppeteer');
const fs = require("fs");
const { Parser } = require("json2csv");
const XLSX = require("xlsx");
const config = require("./config");

async function startBrowser() {
    const browser = await puppeteer.launch();
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
        return
    }, USERNAME, PASSWORD)
    await page.waitForNavigation()
    return
}

async function importProducts(page, eshopUrl, headers, PATH) {
    console.log(headers)


    const input = await page.$("#soubor")
    await input.uploadFile(PATH)

    await page.evaluate((headers) => {
        settings()
        const table = document.querySelector("tbody")
        const rows = table.getElementsByTagName("tr")
        for (let i = 0; i < rows.length - 1; i++) {
            const row = rows[i + 1];
            const cells = row.getElementsByTagName("td")
            if (headers.includes(cells[3].innerText)) {
                cells[0].getElementsByTagName("input")[0].click()
                console.log(true)
            } else {
                console.log(false)
            }
        }

        function settings() {
            //!IMPORT
            document.querySelector(".widget-body:nth-of-type(2) > div > div:nth-child(3) > label").click()
            //O duplicitě zboží se rozhodovat na základě: podle jeho kódu dodavatele
            document.querySelector(".widget-body:nth-of-type(2) > div > div:nth-child(7) > label").click()
            //O duplicitě zboží se rozhodovat na základě: podle jeho kódu
            //document.querySelector(".widget-body:nth-of-type(2) > div > div:nth-child(6) > label").click()
            //Obrázky:
            if (headers.includes("img_url_1")) {
                document.querySelector(".widget-body:nth-of-type(2) > div > div:nth-child(21) > label").click()
                document.querySelector(".widget-body:nth-of-type(2) > div > div:nth-child(28) > label").click()
            }
        }
        //Upload to SIMPLIA
        document.querySelector(`input[type="submit"]`).click()

    }, headers)
    await page.waitForSelector(".gritter-success, .gritter-error", { timeout: 0 })
    await page.reload({ waitUntil: 'networkidle2' })
    return
}
//Hlavní funkce
async function saving(USERNAME, PASSWORD, eshopUrl/* Př www.rutan.cz (simplia.cz) */, array, arrayLength) {
    let page = await startBrowser()
    array = splitArray(array, arrayLength)
    await login(page, USERNAME, PASSWORD, eshopUrl)
    //await importProducts(page, eshopUrl)
    await page.goto(`${eshopUrl}admin/importy/#zbozi`, { waitUntil: 'networkidle2' })
    await loopImport(page, eshopUrl, array, 0)
}

async function loopImport(page, eshopUrl, array, i) {
    console.log(`Importing ${i + 1} / ${array.length}`)
    //const csv = createCSV(array[i])
    const PATH = "./import.xlsx"
    //createFile(csv, PATH)
    createXLSX(array[i], PATH)
    const headers = Object.keys(array[0][0])
    await importProducts(page, eshopUrl, headers, PATH)
    i++
    if (array.length > i) {
        loopImport(page, eshopUrl, array, i)
    }
}

function createCSV(array) {
    //Vytvoří CSV

    const json2csv = new Parser()
    const arrayCSV = json2csv.parse(array)
    return arrayCSV
}

function createXLSX(array, PATH) {
    const workSheet = XLSX.utils.json_to_sheet(array);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "students")
    // Generate buffer
    XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })

    // Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" })

    XLSX.writeFile(workBook, PATH)
}

function createFile(array, path) {


    //Vytvoří nový soubor
    fs.writeFile(path, array, err => {
        if (err)
            throw err
        console.log("File saved")
    })
}

function splitArray(array, arrayLength) {
    let newArray = []
    //Vytvoří jednotlivé arraye
    for (let i = 0; i < Math.ceil(array.length / arrayLength); i++) {
        newArray[i] = []

    }
    //Naplní je daty
    for (let i = 0; i < array.length; i++) {
        const product = array[i];
        let position = Math.floor(i / arrayLength)
        newArray[position].push(product)
    }
    //console.log(newArray)
    return newArray
}

//saving(config.username(), config.password(), "https://www.rutan.cz/", array, 5)

module.exports.save = (USERNAME, PASSWORD, eshopUrl/* Př www.rutan.cz (simplia.cz) */, array, arrayLength) => {
    saving(USERNAME, PASSWORD, eshopUrl/* Př www.rutan.cz (simplia.cz) */, array, arrayLength)
}