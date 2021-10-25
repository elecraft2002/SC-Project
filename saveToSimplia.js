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
        return
    }, USERNAME, PASSWORD)
    await page.waitForNavigation()
    return
}

async function importProducts(page, eshopUrl, headers, PATH) {
    console.log(headers)
    await page.goto(`${eshopUrl}admin/importy/#zbozi`)
    await page.evaluate((headers, PATH) => {
        const table = document.querySelector("tbody")
        const rows = table.getElementsByTagName("tr")
        console.log(rows)
        for (let i = 0; i < rows.length - 1; i++) {
            const row = rows[i + 1];
            const cells = row.getElementsByTagName("td")
            console.log(cells)
            if (headers.includes(cells[3].innerText)) {
                cells[0].getElementsByTagName("input")[0].click()
                console.log(true)
            }
        }
    }, headers, PATH)
    return
}
//Hlavní funkce
async function saving(USERNAME, PASSWORD, eshopUrl/* Př www.rutan.cz (simplia.cz) */, array, arrayLength) {
    let page = await startBrowser()
    array = splitArray(array, arrayLength)
    await login(page, USERNAME, PASSWORD, eshopUrl)
    //await importProducts(page, eshopUrl)
    await loopImport(page, eshopUrl, array, 0)
    /*     for await (let element of array) {
            console.log(element)
            element = createCSV(element)
            createFile(element)
            page = await importProducts(page, eshopUrl) */
}

async function loopImport(page, eshopUrl, array, i) {
    console.log("Importing")
    const csv = createCSV(array[i])
    const PATH = "./import.csv"
    createFile(csv, PATH)
    const headers = Object.keys(array[0][0])
    await importProducts(page, eshopUrl, headers, PATH)
    i++
    //if (array.length > i)
    //loopImport(page, eshopUrl, array, i)
}

function createCSV(array) {
    //Vytvoří CSV

    const json2csv = new Parser()
    const arrayCSV = json2csv.parse(array)
    return arrayCSV
}

function createFile(array, path) {
    //Cesta k malému souboru
    //let path = "./import.csv"
    //Smaže starý

    /*     fs.exists(path, e => {
            if (e) {
                console.log("File exists")
                
                fs.truncate(path, 0, e => {
                    if (e) throw err
                })
            }
        }); */


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

let array = [
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-91C",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 1,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Link pipe<br>Carbon heat protection <br>Springs and screws<br> Heat-resistant adhesive<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, carbon fiber, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4 1100 Factory</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit is included the carbon heat protection.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/4112_SCP-A18A-91-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/Aprilia_RSV4-RR-1000_my2020_SC1R-Carbonio-Omologato_3-4Posteriore.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-91T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 1,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Link pipe<br>Carbon heat protection <br>Springs and screws<br> Heat-resistant adhesive<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, carbon fiber, with carbon fiber end capDescription<br>SC1-R Muffler, titanium, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4 1100 Factory</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit is included the carbon heat protection.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/4112_SCP-A18A-91-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/Aprilia_RSV4-RR-1000_my2020_SC1R-Carbonio-Omologato_3-4Posteriore.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-91C",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 1,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Link pipe<br>Carbon heat protection <br>Springs and screws<br> Heat-resistant adhesive<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, carbon fiber, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4 1100 Factory</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit is included the carbon heat protection.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/4112_SCP-A18A-91-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/Aprilia_RSV4-RR-1000_my2020_SC1R-Carbonio-Omologato_3-4Posteriore.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-91T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 1,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Link pipe<br>Carbon heat protection <br>Springs and screws<br> Heat-resistant adhesive<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, carbon fiber, with carbon fiber end capDescription<br>SC1-R Muffler, titanium, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4 1100 Factory</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit is included the carbon heat protection.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/4112_SCP-A18A-91-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/Aprilia_RSV4-RR-1000_my2020_SC1R-Carbonio-Omologato_3-4Posteriore.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-T90C",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 740,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Fixing bracket<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, Carbon fiber, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit are incluede the brackets to install the silencer with or witout the passenger pegs.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/816_SCP-A18A-T90-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/IMG_9301r.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-T90T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 740,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Fixing bracket<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, Carbon fiber, with carbon fiber end capDescription<br>SC1-R Muffler, Titanium, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit are incluede the brackets to install the silencer with or witout the passenger pegs.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/816_SCP-A18A-T90-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/IMG_9301r.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-T90C",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 740,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Fixing bracket<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, Carbon fiber, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit are incluede the brackets to install the silencer with or witout the passenger pegs.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/816_SCP-A18A-T90-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/IMG_9301r.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-T90T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 740,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Fixing bracket<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, Carbon fiber, with carbon fiber end capDescription<br>SC1-R Muffler, Titanium, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit are incluede the brackets to install the silencer with or witout the passenger pegs.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/816_SCP-A18A-T90-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/IMG_9301r.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-LT41T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 780,
        "popis": "<h2>Kit contents</h2>Slip-On muffler with SC-Project laser-marked logo<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  ",
        "popis2": "<h2>Description</h2><p>The <strong>S1 </strong>muffler represents for SC-Project the perfect combination of lightness and performance without compromise. Its conical shape with taut and essential lines make the <strong>S1</strong> silencer fascinating giving outburst to <strong>Your Aprilia RSV4</strong>. Born from the experience of the racing department on the circuits of the <strong>WSBK</strong> Championship, the silencer has a <strong>Titanium</strong> body with <strong>Carbon</strong> end cap with a special sound-absorbing material that resists high temperatures. To make it unique and unmistakable our <strong>Technicians</strong> have used the best production processes: brackets and fittings welded with <strong>T.I.G. </strong>technology, the insert bushings in <strong>titanium</strong> made in <strong>CNC </strong>and lasered<strong> Logo</strong>. From the high and powerful sound the <strong>S1</strong> silencer will make the <strong>Sound</strong> of <strong>Your Moto</strong> unique.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/818_A18A-LT41T-S1-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-LT41T_aprilia_rsv4_v4_2018_S1_titanium_sc-project_scarico_terminale_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-LT41T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 780,
        "popis": "<h2>Kit contents</h2>Slip-On muffler with SC-Project laser-marked logo<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  ",
        "popis2": "<h2>Description</h2><p>The <strong>S1 </strong>muffler represents for SC-Project the perfect combination of lightness and performance without compromise. Its conical shape with taut and essential lines make the <strong>S1</strong> silencer fascinating giving outburst to <strong>Your Aprilia RSV4</strong>. Born from the experience of the racing department on the circuits of the <strong>WSBK</strong> Championship, the silencer has a <strong>Titanium</strong> body with <strong>Carbon</strong> end cap with a special sound-absorbing material that resists high temperatures. To make it unique and unmistakable our <strong>Technicians</strong> have used the best production processes: brackets and fittings welded with <strong>T.I.G. </strong>technology, the insert bushings in <strong>titanium</strong> made in <strong>CNC </strong>and lasered<strong> Logo</strong>. From the high and powerful sound the <strong>S1</strong> silencer will make the <strong>Sound</strong> of <strong>Your Moto</strong> unique.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/818_A18A-LT41T-S1-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-LT41T_aprilia_rsv4_v4_2018_S1_titanium_sc-project_scarico_terminale_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36C",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 680,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiber",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36CR",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 760,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiberDescription<br>CR-T Muffler, Carbon fiber, with mesh on exit pipe",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 680,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiberDescription<br>CR-T Muffler, Carbon fiber, with mesh on exit pipeDescription<br>CR-T Muffler, Titanium",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36TR",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 760,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiberDescription<br>CR-T Muffler, Carbon fiber, with mesh on exit pipeDescription<br>CR-T Muffler, TitaniumDescription<br>CR-T Muffler, Titanium, with mesh on exit pipe",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36C",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 680,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiber",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36CR",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 760,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiberDescription<br>CR-T Muffler, Carbon fiber, with mesh on exit pipe",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 680,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiberDescription<br>CR-T Muffler, Carbon fiber, with mesh on exit pipeDescription<br>CR-T Muffler, Titanium",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36TR",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 760,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiberDescription<br>CR-T Muffler, Carbon fiber, with mesh on exit pipeDescription<br>CR-T Muffler, TitaniumDescription<br>CR-T Muffler, Titanium, with mesh on exit pipe",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-LT36T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 680,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, low position, Titanium",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in <strong>Titanium</strong> with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ; In the kit is included the carbon fiber clamp to install of the muffler.</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/1168_SCP-A18A-LT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-LT36_aprilia_rsv4_v4_2018_cr-t_titanium_sc-project_scarico_terminale_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-LT36TR",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 760,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, low position, TitaniumDescription<br>CR-T Muffler, low position, Titanium, with Titanium mesh on exit pipe",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in <strong>Titanium</strong> with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ; In the kit is included the carbon fiber clamp to install of the muffler.</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/1168_SCP-A18A-LT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-LT36_aprilia_rsv4_v4_2018_cr-t_titanium_sc-project_scarico_terminale_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-LT36T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 680,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, low position, Titanium",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in <strong>Titanium</strong> with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ; In the kit is included the carbon fiber clamp to install of the muffler.</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/1168_SCP-A18A-LT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-LT36_aprilia_rsv4_v4_2018_cr-t_titanium_sc-project_scarico_terminale_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-LT36TR",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 760,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, low position, TitaniumDescription<br>CR-T Muffler, low position, Titanium, with Titanium mesh on exit pipe",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in <strong>Titanium</strong> with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ; In the kit is included the carbon fiber clamp to install of the muffler.</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/1168_SCP-A18A-LT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-LT36_aprilia_rsv4_v4_2018_cr-t_titanium_sc-project_scarico_terminale_scproject.jpg\"nazev"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-91C",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 1,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Link pipe<br>Carbon heat protection <br>Springs and screws<br> Heat-resistant adhesive<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, carbon fiber, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4 1100 Factory</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit is included the carbon heat protection.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/4112_SCP-A18A-91-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/Aprilia_RSV4-RR-1000_my2020_SC1R-Carbonio-Omologato_3-4Posteriore.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-91T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 1,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Link pipe<br>Carbon heat protection <br>Springs and screws<br> Heat-resistant adhesive<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, carbon fiber, with carbon fiber end capDescription<br>SC1-R Muffler, titanium, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4 1100 Factory</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit is included the carbon heat protection.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/4112_SCP-A18A-91-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/Aprilia_RSV4-RR-1000_my2020_SC1R-Carbonio-Omologato_3-4Posteriore.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-91C",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 1,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Link pipe<br>Carbon heat protection <br>Springs and screws<br> Heat-resistant adhesive<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, carbon fiber, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4 1100 Factory</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit is included the carbon heat protection.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/4112_SCP-A18A-91-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/Aprilia_RSV4-RR-1000_my2020_SC1R-Carbonio-Omologato_3-4Posteriore.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-91T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 1,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Link pipe<br>Carbon heat protection <br>Springs and screws<br> Heat-resistant adhesive<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, carbon fiber, with carbon fiber end capDescription<br>SC1-R Muffler, titanium, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4 1100 Factory</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit is included the carbon heat protection.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/4112_SCP-A18A-91-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/Aprilia_RSV4-RR-1000_my2020_SC1R-Carbonio-Omologato_3-4Posteriore.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-T90C",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 740,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Fixing bracket<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, Carbon fiber, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit are incluede the brackets to install the silencer with or witout the passenger pegs.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/816_SCP-A18A-T90-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/IMG_9301r.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-T90T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 740,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Fixing bracket<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, Carbon fiber, with carbon fiber end capDescription<br>SC1-R Muffler, Titanium, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit are incluede the brackets to install the silencer with or witout the passenger pegs.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/816_SCP-A18A-T90-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/IMG_9301r.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-T90C",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 740,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Fixing bracket<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, Carbon fiber, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit are incluede the brackets to install the silencer with or witout the passenger pegs.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/816_SCP-A18A-T90-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/IMG_9301r.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-T90T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 740,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Fixing bracket<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>SC1-R Muffler, Carbon fiber, with carbon fiber end capDescription<br>SC1-R Muffler, Titanium, with carbon fiber end cap",
        "popis2": "<h2>Description</h2><p>The muffler <strong>SC1-R </strong>is created and developed by the experience of the SC-Project racing department in the most important World<strong> Competitions</strong>. A look with taut and decided lines will enrich <strong>Your Aprilia RSV4</strong> making it unique and exclusive. The exit pipe obtained by <strong>hydroforming </strong>and the <strong>carbon fiber</strong> end cap from the rhomboidal asymmetric shape make inimitable the silencer <strong>SC1-R</strong>. The lightweight outer body is available in both <strong>Titanium</strong> and <strong>Carbon</strong> version. The weldings with <strong>T.I.G.</strong>, the sound-absorbing material resistant to very high temperatures and the insert bushings made in <strong>CNC</strong> machining embellish the <strong>SC1-R</strong> silencer. In the version with <strong>Titanium</strong> body the <strong>R&amp;D</strong> department of <strong>SC-Project</strong> wanted to make the <strong>SC1-R</strong> more elegant by imprinting the <strong>Logo</strong> by laser, without distorting the look, while in the <strong>Carbon</strong> version, on the silencer is riveted an insert with the <strong>SC-Project</strong> logo as in the versions of our mufflers used in <strong>Competitions</strong>. In the kit are incluede the brackets to install the silencer with or witout the passenger pegs.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/816_SCP-A18A-T90-SC1-R-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/IMG_9301r.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-LT41T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 780,
        "popis": "<h2>Kit contents</h2>Slip-On muffler with SC-Project laser-marked logo<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  ",
        "popis2": "<h2>Description</h2><p>The <strong>S1 </strong>muffler represents for SC-Project the perfect combination of lightness and performance without compromise. Its conical shape with taut and essential lines make the <strong>S1</strong> silencer fascinating giving outburst to <strong>Your Aprilia RSV4</strong>. Born from the experience of the racing department on the circuits of the <strong>WSBK</strong> Championship, the silencer has a <strong>Titanium</strong> body with <strong>Carbon</strong> end cap with a special sound-absorbing material that resists high temperatures. To make it unique and unmistakable our <strong>Technicians</strong> have used the best production processes: brackets and fittings welded with <strong>T.I.G. </strong>technology, the insert bushings in <strong>titanium</strong> made in <strong>CNC </strong>and lasered<strong> Logo</strong>. From the high and powerful sound the <strong>S1</strong> silencer will make the <strong>Sound</strong> of <strong>Your Moto</strong> unique.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/818_A18A-LT41T-S1-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-LT41T_aprilia_rsv4_v4_2018_S1_titanium_sc-project_scarico_terminale_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-LT41T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 780,
        "popis": "<h2>Kit contents</h2>Slip-On muffler with SC-Project laser-marked logo<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  ",
        "popis2": "<h2>Description</h2><p>The <strong>S1 </strong>muffler represents for SC-Project the perfect combination of lightness and performance without compromise. Its conical shape with taut and essential lines make the <strong>S1</strong> silencer fascinating giving outburst to <strong>Your Aprilia RSV4</strong>. Born from the experience of the racing department on the circuits of the <strong>WSBK</strong> Championship, the silencer has a <strong>Titanium</strong> body with <strong>Carbon</strong> end cap with a special sound-absorbing material that resists high temperatures. To make it unique and unmistakable our <strong>Technicians</strong> have used the best production processes: brackets and fittings welded with <strong>T.I.G. </strong>technology, the insert bushings in <strong>titanium</strong> made in <strong>CNC </strong>and lasered<strong> Logo</strong>. From the high and powerful sound the <strong>S1</strong> silencer will make the <strong>Sound</strong> of <strong>Your Moto</strong> unique.</p> ;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/818_A18A-LT41T-S1-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-LT41T_aprilia_rsv4_v4_2018_S1_titanium_sc-project_scarico_terminale_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36C",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 680,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiber",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36CR",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 760,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiberDescription<br>CR-T Muffler, Carbon fiber, with mesh on exit pipe",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 680,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiberDescription<br>CR-T Muffler, Carbon fiber, with mesh on exit pipeDescription<br>CR-T Muffler, Titanium",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36TR",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 760,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiberDescription<br>CR-T Muffler, Carbon fiber, with mesh on exit pipeDescription<br>CR-T Muffler, TitaniumDescription<br>CR-T Muffler, Titanium, with mesh on exit pipe",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36C",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 680,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiber",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36CR",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 760,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiberDescription<br>CR-T Muffler, Carbon fiber, with mesh on exit pipe",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 680,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiberDescription<br>CR-T Muffler, Carbon fiber, with mesh on exit pipeDescription<br>CR-T Muffler, Titanium",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-HT36TR",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 760,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, Carbon fiberDescription<br>CR-T Muffler, Carbon fiber, with mesh on exit pipeDescription<br>CR-T Muffler, TitaniumDescription<br>CR-T Muffler, Titanium, with mesh on exit pipe",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in variants <strong>Titanium</strong> or <strong>Carbon </strong>with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> or <strong>Carbon</strong> fiber with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ;</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/819_SCP-A18A-HT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-HT36C_aprilia_rsv4_v4_2018_cr-t_carbon_titanium_sc-project_pot_silencieux_echappement_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-LT36T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 680,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, low position, Titanium",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in <strong>Titanium</strong> with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ; In the kit is included the carbon fiber clamp to install of the muffler.</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/1168_SCP-A18A-LT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-LT36_aprilia_rsv4_v4_2018_cr-t_titanium_sc-project_scarico_terminale_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-LT36TR",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 760,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, low position, TitaniumDescription<br>CR-T Muffler, low position, Titanium, with Titanium mesh on exit pipe",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in <strong>Titanium</strong> with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ; In the kit is included the carbon fiber clamp to install of the muffler.</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/1168_SCP-A18A-LT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-LT36_aprilia_rsv4_v4_2018_cr-t_titanium_sc-project_scarico_terminale_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-LT36T",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 680,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, low position, Titanium",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in <strong>Titanium</strong> with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ; In the kit is included the carbon fiber clamp to install of the muffler.</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/1168_SCP-A18A-LT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-LT36_aprilia_rsv4_v4_2018_cr-t_titanium_sc-project_scarico_terminale_scproject.jpg"
    },
    {
        "nazev": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "nazev_feed": "Výfukový systém SC PROJECT pro APRILIA - RSV4 (2018 - 2020) - RF - RR",
        "kod": "A18A-LT36TR",
        "kategorie": "SC PROJECT",
        "podkategorie": "APRILIA",
        "podkategorie2": "RSV4 (2018 - 2020) - RF - RR",
        "cena": 760,
        "popis": "<h2>Kit contents</h2>Slip-On muffler<br>Full titanium link pipe with variable taper <br>Springs and screws<br>Heat resistant stickers<br>24 months SC-Project official warranty<br> ;  Description<br>CR-T Muffler, low position, TitaniumDescription<br>CR-T Muffler, low position, Titanium, with Titanium mesh on exit pipe",
        "popis2": "<h2>Description</h2><p>The <strong>CR-T</strong> muffler is the the unmistakable signature of the <strong>Racing</strong> style of <strong>SC-Project</strong>. Multiple <strong>Moto2</strong> World Champion was created to satisfy the best Teams and Riders. Designed and developed to give a sporty and racing character to your <strong>Aprilia RSV4</strong> with a deep and dark <strong>Sound</strong> is unique in the aftermarket silencer panorama. The iconic muffler is available in <strong>Titanium</strong> with the possibility of the <strong>Titanium</strong> mesh stone guard on the exit pipe. To achieve the best performance the <strong>CR-T</strong> is built with materials derived from the aeronautical industry, such as <strong>Titanium</strong> with dedicated treatment to withstand the highest temperatures. Bracket welding and fitting with <strong>T.I.G.</strong> technology. The insert <strong>bushings</strong> are all in <strong>Titanium </strong>machined from solid by <strong>CNC</strong> machines, wich guarantee impeccable couplings. ; In the kit is included the carbon fiber clamp to install of the muffler.</p>&nbsp;  ",
        "vyrobce": "SC PROJECT",
        "url": "https://shop.sc-project.com/en-CZ/1168_SCP-A18A-LT36-CR-T-Muffler.htm",
        "img_url_1": "https://shop.sc-project.com/Images/Products/Zoom/A18-LT36_aprilia_rsv4_v4_2018_cr-t_titanium_sc-project_scarico_terminale_scproject.jpg"
    }
]
saving(config.username(), config.password(), "https://www.rutan.cz/", array, 5)
