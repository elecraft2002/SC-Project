const puppeteer = require('puppeteer');

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
    bikes = bikes.slice(0, 1)

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
    let i = 0
    for await (let productArrs of products) {
        for await (let product of productArrs) {
            await page.goto(product)
            array.push(await page.evaluate(() => {
                let typeSplit = new RegExp(String.fromCharCode(160), "g")
                const type = document.querySelector("h1.text-center.bike").innerText.split(typeSplit)[0]
                const model = document.querySelector("h1.text-center.bike").innerText.split(typeSplit)[1]
                const tables = document.querySelectorAll("table > tbody")

                let nazev = `Výfukový systém SC PROJECT ${type} pro ${model}`
                let nazev_feed = nazev
                let kod
                let kod2
                let kategorie
                let podkategorie
                let podkategorie2
                let cena
                let popis
                let popis2
                let vyrobce
                let url
                let img_url_1

                img_url_1 = document.querySelector(".img-thumbnail > a").href

                //Najde kolik je možností prodktů
                let options
                if (document.querySelector(".btn.btn-primary.btn-lg") != null) {

                }

                if (document.querySelectorAll(".btn.btn-primary.btn-sm") != null) {
                    let confign = tables[1]
                    for (let i = 0; i < confign.getElementsByTagName("tr").length - 1; i++) {
                        const lineInTable = confign.getElementsByTagName("tr")[i + 1];
                        kod = lineInTable[0].innerText
                        
                    }
                    returnSelected()
                }
                function returnSelected() {
                    return [nazev, nazev_feed, kod, kod2, kategorie, podkategorie, podkategorie2, cena, popis, popis2, vyrobce, url, img_url_1]
                }
            }))
            console.log(array)
            //[nazev, nazev_feed, kod, kod2, kategorie, podkategorie, podkategorie2, cena, popis, popis2, vyrobce, url, img_url_1]
        }
    }

    console.log('Bikes:', bikes);

    await browser.close();
})();