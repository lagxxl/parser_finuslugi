const run = async () => {
    console.log("ну чо, поехали...")
    //создание объекта из массива компаний и регионов
    const rootResponse = await fetch('https://agents.finuslugi.ru/data/Root.json')
    const root = await rootResponse.json()

    //создание объекта из списка страховых компаний
    const skResponse = await fetch('https://agents.finuslugi.ru/backend/agents/comissions/sk')
    const sk = await skResponse.json()

    const data = []
    
    for (const idx in sk) {
        const skId = sk[idx]
        const name = root.companies.find(c => c.id === skId).name
        console.log(`${parseInt(idx) + 1}/${sk.length} ${name}...`)
        const infoResponse = await fetch(`https://agents.finuslugi.ru/backend/agents/comissions/info?sk_id=${skId}`)
        const info = await infoResponse.json()

        for (const skInfo of info.INDIVIDUAL) {
            const region = root.regions.find(r => r.id === skInfo.region_id)

            data.push([
                name,
                region ? region.name : null,
                skInfo.pr_price,
                skInfo.price
            ].join(","))  
        }
   
    }

    console.log("я сделаль")

    const headers = ["Company", "Location", "pr price", "price"].join(",")
    const csvContent = `data:text/csv;charset=utf-8,${headers}\r\n${data.join("\r\n")}`
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
}

run()
