// // sections.js
// // É o coração da visualização interativa:
// // Lê os dados do CSV (data/recent-grads.csv).
// // Define escalas D3 (cores, tamanhos, eixos).
// // Cria e atualiza gráficos interativos:
// // Define funções draw1(), draw2(), etc. que são chamadas conforme o usuário rola.
// // clean() esconde elementos que não são necessários em cada estado.



let svg;
let dataset = [];

// Tamanho e margens
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Escalas (serão preenchidas depois)
let x, y, radius, color;

// Carrega dados
d3.csv("grouped_income_gender.csv").then(data => {
    dataset1 = data.map(d => ({
        faixa_salarial: d.faixa_salarial.trim(),
        Masculino: +d.Masculino,
        Feminino: +d.Feminino,
        Diff: +(d.Feminino - d.Masculino),
    }));
});

d3.csv("gender_pyramid.csv").then(data => {
    dataset = data.map(d => ({
        faixa_salarial: d.faixa_salarial.trim(),
        Feminino: -+d.Feminino,
        Masculino: +d.Masculino
    }));

    // console.log("dataset carregado:", dataset); 

    // Chama initVis() para começar a visualização.
    initVis();

    // Com o SVG pronto, podemos ativar o scroll
    let scrollInstance = scroller();
    scrollInstance.on("active", function(index) {
        console.log("Scrolled to section:", index);

        if (window.activationFunctions && window.activationFunctions[index]) {
            window.activationFunctions[index]();
        }
    });
    scrollInstance();

});

d3.csv("gender_pyramid.csv").then(data => {
    dataset = data.map(d => ({
        faixa_salarial: d.faixa_salarial.trim(),
        Feminino: -+d.Feminino,
        Masculino: +d.Masculino
    }));});


// Cria o SVG
function initVis() {
    svg = d3.select("#vis")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Define escalas compartilhadas
    x = d3.scaleBand()
        .domain(dataset.map(d => d.category))
        .range([0, width])
        .padding(0.2);

    y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.value)])
        .nice()
        .range([height, 0]);

    radius = d3.scaleSqrt()
        .domain(d3.extent(dataset, d => d.value))
        .range([5, 30]);

    color = d3.scaleOrdinal(d3.schemeTableau10);

    // Inicia com a visualização 1
    drawPyr();
}

//  Limpa tudo antes de cada desenho
function clean() {
    svg.selectAll("*").remove();
}

//  Visualização 1: gráfico de barras
function draw1() {
    clean();

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", d => x(d.category))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#66cccc")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Categoria:</strong> ${d.category}<br><strong>Valor:</strong> ${d.value}`);
            d3.select(this).attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("fill", "#66cccc");
        });
}



//  Visualização 2: bolhas com radius proporcional ao valor
function draw2() {
    clean();

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => (i % 5) * 150 + 50)  // Layout em grade
        .attr("cy", (d, i) => Math.floor(i / 5) * 120 + 50)
        .attr("r", d => radius(d.value))
        .attr("fill", d => color(d.category))
        .attr("opacity", 0.8)
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Categoria:</strong> ${d.category}<br><strong>Valor:</strong> ${d.value}`);
            d3.select(this).attr("stroke", "#000").attr("stroke-width", 2);
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("stroke", "none");
        });
}

function drawPyr() {
    clean();
    const categorias = dataset.map(d => d.faixa_salarial);

    const maxValue = d3.max(dataset, d => Math.max(Math.abs(d.Feminino), d.Masculino));
    console.log(maxValue)

    const x = d3.scaleLinear()
        .domain([-maxValue, maxValue])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(categorias)
        .range([height,0])
        .padding(0.1);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d => Math.abs(d)));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll(".bar-f")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar-f")
        .attr("x", d => x(d.Feminino)+13)
        .attr("y", d => y(d.faixa_salarial))
        .attr("width", d => x(0) - x(d.Feminino))
        .attr("height", y.bandwidth())
        .attr("fill", "#ff69b4")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`
                    <strong>Salário:</strong> ${d.faixa_salarial}<br>
                    <strong>Quantidade:</strong> ${ - d.Feminino   }
                `);
            d3.select(this)
                .attr("fill", "#339999");
        })
        // - MOve tooltip com o mouse
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        // - Retira tooltip quando o mouse sai
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("fill", "#ff69b4");
        });

    svg.selectAll(".bar-m")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar-m")
        .attr("x", x(0))
        .attr("y", d => y(d.faixa_salarial))
        .attr("width", d => x(d.Masculino) - x(0))
        .attr("height", y.bandwidth())
        .attr("fill", "#1e90ff")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`
                    <strong>Salário:</strong> ${d.faixa_salarial}<br>
                    <strong>Quantidade:</strong> ${d.Masculino}
                `);
            d3.select(this)
                .attr("fill", "#339999");
        })
        // - MOve tooltip com o mouse
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        // - Retira tooltip quando o mouse sai
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("fill", "#1e90ff");
        });

    svg.append("text")
        .attr("x", width / 4)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Feminino");

    svg.append("text")
        .attr("x", (3 * width) / 4)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Masculino");
}


function drawBar() {
    clean();
    let x = d3.scaleBand() // Usado para dados categ.
        .domain(dataset1.map(d => d.faixa_salarial.trim()))
        .range([0, width])
        .padding(0.2);

    let y = d3.scaleLinear()
        .domain([d3.min(dataset1, d =>d.Feminino - d.Masculino), d3.max(dataset1, d => d.Feminino - d.Masculino)])
        .nice()
        .range([100, 0])

    // svg.append("g") // Eixo x
    //     .attr("transform", `translate(0, ${height})`)
    //     .call(d3.axisBottom(x));

    // svg.append("g") // Eixo y
    //     .call(d3.axisLeft(y));

    svg.selectAll("rect") //Desenha as barras
        .data(dataset1)
        .enter()
        .append("rect")
        .attr("x", d => x(d.faixa_salarial.trim()))
        .attr("y", d => d.Feminino - d.Masculino >= 0
            ? y(d.Feminino - d.Masculino)
            : y(0))
        .attr("width", x.bandwidth())
        .attr("height", d => Math.abs(y(d.Feminino - d.Masculino) - y(0)))
        .attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#1e90ff" : "#ff69b4"))
        // Eventos interativos:
        // - MOstra tooltip
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`
                    <strong>Diferença:</strong> ${Math.round(d.Feminino - d.Masculino * 10) / 10}%<br>
                `);
            d3.select(this)
                .attr("fill", "#339999");
        })
        // - MOve tooltip com o mouse
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        // - Retira tooltip quando o mouse sai
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#1e90ff" : "#ff69b4"));
        });
}

function drawLine() {
    clean(); // Limpa o SVG

    // Escalas para os dois gráficos
    const x = d3.scaleBand()
        .domain(dataset1.map(d => d.faixa_salarial.trim()))
        .range([0, width])
        .padding(0.2);

    const xLine = d3.scalePoint()
        .domain(dataset1.map(d => d.faixa_salarial.trim()))
        .range([0, width])
        .padding(0.5);

    const yLine = d3.scaleLinear()
        .domain([0, d3.max(dataset1, d => Math.max(d.Masculino, d.Feminino))])
        .nice()
        .range([height, d3.min(dataset1, d => d.Feminino - d.Masculino)]);

    const yDiff = d3.scaleLinear()
        .domain([
            d3.min(dataset1, d => d.Feminino - d.Masculino),
            d3.max(dataset1, d => d.Feminino - d.Masculino)
        ])
        .nice()
        .range([height, 0]);

    // Eixos
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(yLine));

    // Linhas
    const lineMasculino = d3.line()
        .x(d => xLine(d.faixa_salarial.trim()))
        .y(d => yLine(d.Masculino));

    const lineFeminino = d3.line()
        .x(d => xLine(d.faixa_salarial.trim()))
        .y(d => yLine(d.Feminino));

    svg.append("path")
        .datum(dataset1)
        .attr("d", lineMasculino)
        .attr("stroke", "#1e90ff")
        .attr("fill", "none")
        .attr("stroke-width", 2);

    svg.append("path")
        .datum(dataset1)
        .attr("d", lineFeminino)
        .attr("stroke", "#ff69b4")
        .attr("fill", "none")
        .attr("stroke-width", 2);

    // Pontos nas linhas
    svg.selectAll(".circle-male")
        .data(dataset1)
        .enter()
        .append("circle")
        .attr("cx", d => xLine(d.faixa_salarial.trim()))
        .attr("cy", d => yLine(d.Masculino))
        .attr("r", 4)
        .attr("fill", "#1e90ff")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Proporção:</strong> ${Math.round(d.Masculino * 10) / 10}%`);
            d3.select(this).transition().duration(80).attr("r", 8).attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).transition().duration(200).attr("r", 4).attr("fill", "#1e90ff");
        });

    svg.selectAll(".circle-female")
        .data(dataset1)
        .enter()
        .append("circle")
        .attr("cx", d => xLine(d.faixa_salarial.trim()))
        .attr("cy", d => yLine(d.Feminino))
        .attr("r", 4)
        .attr("fill", "#ff69b4")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Proporção:</strong> ${Math.round(d.Feminino * 10) / 10}%`);
            d3.select(this).transition().duration(80).attr("r", 8).attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).transition().duration(200).attr("r", 4).attr("fill", "#ff69b4");
        });

    // Barras de diferença (Feminino - Masculino)
    svg.selectAll("rect")
        .data(dataset1)
        .enter()
        .append("rect")
        .attr("x", d => x(d.faixa_salarial.trim()))
        .attr("y", d => d.Feminino - d.Masculino >= 0
            ? yDiff(d.Feminino - d.Masculino)
            : yDiff(0))
        .attr("width", x.bandwidth())
        .attr("height", d => Math.abs(yDiff(d.Feminino - d.Masculino) - yDiff(0)))
        .attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#1e90ff" : "#ff69b4"))
        .attr("opacity", 0.5)
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Diferença:</strong> ${(Math.round((d.Feminino - d.Masculino) * 10) / 10)}%`);
            d3.select(this).attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function(event, d) {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#1e90ff" : "#ff69b4"));
        });
}


window.drawPyr = drawPyr;
window.drawLine = drawLine;
window.activationFunctions = [
    drawPyr, // index 0
    drawLine, // index 1
    drawPyr, // index 2 — ou outra, se quiser criar um draw3()
    drawLine, // index 3
    drawPyr  // index 4
];



