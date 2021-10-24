const puppeteer = require('puppeteer');
const fs = require("fs");
const { Parser } = require("json2csv");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://shop.sc-project.com/en-CZ/');

    // Dostane všechny motorky
    let bikes = await page.evaluate(() => {
        let elements = Array.from(document.querySelectorAll("#Center_bike_divBikeShower .text-center")).map(e => {
            let name = e.innerText
            let url = e.getElementsByTagName("a")[0].href
            return { name, url }
        })
        return elements
    })

    let products = []

    //Zjednodušení pro testování
    bikes = bikes.slice(2, 3)

    //Dostane všechny odkazy z každé motorky na produkty
    for await (let bike of bikes) {
        await page.goto(bike.url)
        products.push(await page.evaluate(() => {
            return Array.from(document.querySelectorAll("#Center_channelcontent_div_channelContent .col-md-8 a")).map(e => e.href)
            //return Array.from(document.querySelectorAll("#Center_channelcontent_div_channelContent .col-md-8 a")).map(e => e.href)
        }))
        console.log(products)
    }
    let array = []
    //array.push("nazev", "nazev_feed", "kod", "kod2", "kategorie", "podkategorie", "podkategorie2", "cena", "popis", "popis2", "vyrobce", "url", "img_url_1")
    let i = 0
    for await (let productArrs of products) {
        for await (let product of productArrs) {
            await page.goto(product)
            console.log(product)
            array.push(await page.evaluate(() => {
                let typeSplit = new RegExp(String.fromCharCode(160), "g")
                const type = document.querySelector("h1.text-center.bike").innerText.split(typeSplit)[0]
                const model = document.querySelector("h1.text-center.bike").innerText.split(typeSplit)[1]
                const tables = document.querySelectorAll("table > tbody")

                let nazev = `Výfukový systém SC PROJECT pro ${type} - ${model}`
                let nazev_feed = nazev
                let kod
                let kod2
                let kategorie = "SC PROJECT"
                let podkategorie = type
                let podkategorie2 = model
                let cena
                let popis = `${document.querySelector(".col-md-7 .col-sm-6:nth-of-type(2), .col-md-7 .col-md-6:nth-of-type(2)").innerHTML.replace("&nbsp", " ")}`
                let popis2 = `${document.querySelector(".col-md-7 .col-sm-6, .col-md-7 .col-md-6").innerHTML.replace("&nbsp", " ")}`
                let vyrobce = "SC PROJECT"
                let url = document.URL
                let img_url_1

                img_url_1 = document.querySelector(".img-thumbnail > a").href

                //Najde kolik je možností prodktů
                //Jeden produkt
                if (document.querySelector(".btn.btn-primary.btn-lg") != undefined) {
                    //return "Jeden produkt"
                    kod = document.querySelector(" div.col-md-4 > p > strong").innerText
                    cena = parseInt(document.querySelector("#pricezone > div:nth-child(1) > span:nth-child(3)").innerText.match("(?<=€ )(.+?)(?=,)")[0])
                    return [returnSelected()]
                }
                //Více produktů
                if (document.querySelectorAll(".btn.btn-primary.btn-sm") != undefined) {
                    let confign = tables[1]
                    let out = []

                    for (let i = 0; i < confign.getElementsByTagName("tr").length - 1; i++) {
                        const lineInTable = confign.getElementsByTagName("tr")[i + 1];
                        kod = lineInTable.getElementsByTagName("td")[0].innerText
                        popis += "Description<br>" + lineInTable.getElementsByTagName("td")[1].innerText.split("\n")[0].replace("&nbsp", " ")
                        cena = parseInt(lineInTable.getElementsByTagName("td")[2].innerText.match("(?<=€ )(.+?)(?=,)")[0])
                        out.push(returnSelected())
                    }
                    return out
                }
                function returnSelected() {
                    calcPrice(cena)
                    popis = cleanHTML(popis)
                    popis2 = cleanHTML(popis2)
                    return { nazev, nazev_feed, kod, kod2, kategorie, podkategorie, podkategorie2, cena, popis, popis2, vyrobce, url, img_url_1 }
                }
                function calcPrice(price) {
                    //Přepočítá cenu na CZK
                    let euro = 26
                    let addPrice = 750
                    return price * euro + addPrice
                }

                function cleanHTML(html) {
                    let div = document.createElement('div');
                    div.innerHTML = html;
                    const elements = div.querySelectorAll("*");
                    for (let i = 0; i < elements.length; i++) {
                        const element = elements[i];
                        element.attributes.length
                        for (let x = 0; x < element.attributes.length; x++) {
                            const attribute = element.attributes[x].name;
                            element.removeAttribute(attribute)
                        }
                    }
                    return div.innerHTML;
                }
            }))
            console.log(array[array.length - 1])
            //[nazev, nazev_feed, kod, kod2, kategorie, podkategorie, podkategorie2, cena, popis, popis2, vyrobce, url, img_url_1]
        }
    }
    let productList = []
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        for (let x = 0; x < element.length; x++) {
            const product = element[x];
            productList.push(product)
        }
    }
    console.log(productList)

    //Vytvoří CSV

    const json2csv = new Parser()
    const productListCSV = json2csv.parse(productList)

    //Uloží ho lokálně

    fs.appendFile("./exports/export.csv", productListCSV, err => {
        if (err)
            throw err
        console.log("Uloženo")
    })

    console.log('Bikes:', bikes);

    await browser.close();
})();
