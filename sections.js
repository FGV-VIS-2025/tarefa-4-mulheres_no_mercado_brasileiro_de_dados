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
d3.csv("data/data.csv").then(data => {
    dataset = data.map(d => ({
        category: d.Category,
        value: +d.Value
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
    draw1();
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



window.draw1 = draw1;
window.draw2 = draw2;
window.activationFunctions = [
    draw1, // index 0
    draw2, // index 1
    draw1, // index 2 — ou outra, se quiser criar um draw3()
    draw2, // index 3
    draw1  // index 4
];



