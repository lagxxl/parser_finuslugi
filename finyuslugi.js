const run = async () => {
    //создание объекта из массива компаний и регионов
    const companiesResponse = await fetch('https://agents.finuslugi.ru/data/Root.json')
    const compregion = await companiesResponse.json()

    //создание объекта из списка страховых компаний
    //const skResponse = await fetch('https://agents.finuslugi.ru/backend/agents/comissions/sk')
    //const sk = await skResponse.json()

    //создание объекта из массива процентных ставок по одной СК
    const osagoBResponse = await fetch('https://agents.finuslugi.ru/backend/agents/comissions/info?sk_id=5')
    const osagoB = await osagoBResponse.json()

    const headers = ["Location", "Percent", "Prolongation Percent", "Green Corridor Percent"].join(",")
    const data = osagoB.map(source => [
        // locationId берём из osagoB
        // compregion.companies.find(c => c.id === source.INDIVIDUAL.companyId).name,
        compregion.regions.find(l => l.id.toString() === source.INDIVIDUAL.region_id).name,
        //new Date(source.dateFrom).toLocaleDateString(),
        source.price,
        source.pr_price,
        source.gr_price
    ].join(",")
    )

    const csvContent = `data:text/csv;charset=utf-8,${headers}\r\n${data.join("\r\n")}`
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
}

run()
