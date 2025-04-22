// sections.js
// É o coração da visualização interativa:
// Lê os dados do CSV (data/recent-grads.csv).
// Define escalas D3 (cores, tamanhos, eixos).
// Cria e atualiza gráficos interativos:
// Define funções draw1(), draw2(), etc. que são chamadas conforme o usuário rola.
// clean() esconde elementos que não são necessários em cada estado.


//Declaração de variáveis e dimensões
let svg;
let dataset = [];

const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Adiciona um parágrafo de teste dentro da <div id="vis">
d3.select("#vis").append("p").text("D3 está funcionando!");

// Leitura e transformação dos dados
d3.csv("data/data.csv").then(data => {
    dataset = data.map(d => ({
        category: d.Category,
        value: +d.Value
    }));

    initVis();
});

//Cria o elemento <svg> dentro da #vis
function initVis() {
    svg = d3.select("#vis")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Desenha gráfico de barras
    drawBar();
}

function drawBar() {
    let x = d3.scaleBand() // Usado para dados categ.
        .domain(dataset.map(d => d.category))
        .range([0, width])
        .padding(0.2);

    let y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.value)])
        .nice()
        .range([height, 0]);

    svg.append("g") // Eixo x
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g") // Eixo y
        .call(d3.axisLeft(y));

    svg.selectAll("rect") //Desenha as barras
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", d => x(d.category))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#66cccc")
        // Eventos interativos:
        // - MOstra tooltip
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`
                    <strong>Categoria:</strong> ${d.category}<br>
                    <strong>Valor:</strong> ${d.value}
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
            d3.select(this).attr("fill", "#66cccc");
        });
}

