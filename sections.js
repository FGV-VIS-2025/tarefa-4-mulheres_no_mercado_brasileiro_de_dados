// // sections.js
// // É o coração da visualização interativa:
// // Lê os dados do CSV (data/recent-grads.csv).
// // Define escalas D3 (cores, tamanhos, eixos).
// // Cria e atualiza gráficos interativos:
// // Define funções draw1(), draw2(), etc. que são chamadas conforme o usuário rola.
// // clean() esconde elementos que não são necessários em cada estado.

// import scroller from './scroller.js'



let svg;
let dataset = [];

// Tamanho e margens
const margin = { top: 50, right: 50, bottom: 50, left: 80 };
const width = 950 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Escalas (serão preenchidas depois)
let x, y, radius, color;

// Carregar dados
d3.csv("grouped_income_gender.csv").then(data => {
    dataset1 = data.map(d => ({
        faixa_salarial: d.salario,
        Masculino: +d.Masculino,
        Feminino: +d.Feminino,
        Diff: +(d.Feminino - d.Masculino),
    }));
});

d3.csv("motivos_satisfacao.csv").then(data => {
    dataset8 = data.map(d => ({
        motivo: d.motivo,
        Prop_homem: +d.Prop_homem,
        Prop_mulher: +d.Prop_mulher,
        quantidade: +d.Quantidade,
    }));
});

d3.csv("motivo_homem.csv").then(data => {
    dataset9 = data.map(d => ({
        motivo: d.motivo,
        quantidade: +d.quantidade
    }));
});

d3.csv("motivo_mulher.csv").then(data => {
    dataset10 = data.map(d => ({
        motivo: d.motivo,
        quantidade: +d.quantidade
    }));
});

d3.csv("grouped_salario_prop.csv").then(data => {
    dataset2 = data.map(d => ({
        ensino: d.Ensino.trim(),
        Masculino: +d.Masculino,
        Feminino: +d.Feminino,
        Diff: +(d.Feminino - d.Masculino),
    }));
});

d3.csv("grouped_salario_abs.csv").then(data => {
    dataset3 = data.map(d => ({
        ensino: d.Ensino.trim(),
        Masculino: +d.Masculino,
        Feminino: +d.Feminino
    }));
});

d3.csv("income_gender_experience.csv").then(data => {
    dataset4 = data.map(d => ({
        experiencia: d.experiencia_anos,
        Masculino: +d.Masculino,
        Feminino: +d.Feminino,
        // Diff: +(d.Feminino - d.Masculino),
    }));
});

d3.csv("income_gender_experience_prop.csv").then(data => {
    dataset5 = data.map(d => ({
        experiencia: d.experiencia_anos,
        Masculino: +d.Masculino,
        Feminino: +d.Feminino,
        Diff: +(d.Feminino - d.Masculino),
    }));
});

d3.csv("gender_nivel_abs.csv").then(data => {
    dataset6 = data.map(d => ({
        nivel: d.Nivel,
        Masculino: +d.Masculino,
        Feminino: +d.Feminino,
        Diff: +(d.Feminino - d.Masculino),
    }));
});

d3.csv("gender_nivel_prop.csv").then(data => {
    dataset7 = data.map(d => ({
        nivel: d.Nivel,
        Masculino: +d.Masculino,
        Feminino: +d.Feminino,
        Diff: +(d.Feminino - d.Masculino),
    }));
});

d3.csv("gender_pyramid.csv").then(data => {
    dataset = data.map(d => ({
        faixa_salarial: +d.salario,
        Feminino: -+d.Feminino,
        Masculino: +d.Masculino,
        min: d.min,
        max:d.max,
    }));

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
        .attr("height", height + margin.top + margin.bottom + 30)
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

function drawPyr() {
    // limpa os eixos
    clean();
    const categorias = dataset.map(d => d.faixa_salarial);

    // cálculo do salário médio
    const maxValue = d3.max(dataset, d => Math.max(Math.abs(d.Feminino), d.Masculino));
    let salarioMediaMulher = d3.sum(dataset, d => Math.abs(d.Feminino) * d.faixa_salarial)/d3.sum(dataset,  d=>Math.abs(d.Feminino)); 
    let salarioMedioHomem = d3.sum(dataset, d => d.Masculino * d.faixa_salarial)/d3.sum(dataset,  d=>Math.abs(d.Masculino));

    // mapeia os valores para o domínio da tela
    const x = d3.scaleLinear()
        .domain([-maxValue, maxValue])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(categorias)
        .range([height,0])
        .padding(0);

    // eixo x embaixo
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d => Math.abs(d)));
    
    // barra feminina a esquerda
    svg.selectAll(".bar-f")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar-f")
        .attr("x", x(0)) // começa do centro
        .attr("y", d => y(d.faixa_salarial))
        .attr("width", 0) // começa sem largura
        .attr("height", y.bandwidth())
        .attr("fill", "#ff69b4")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`
                    <strong>Salário entre :</strong> R$ ${d.min} e R$ ${d.max}<br>
                    <strong>Quantidade:</strong> ${-d.Feminino}
                `);
            d3.select(this)
                .attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("fill", "#ff69b4");
        })
        .transition()
        .duration(1000)
        .attr("x", d => x(d.Feminino))
        .attr("width", d => x(0) - x(d.Feminino));


        /// barra masculina a direita
        svg.selectAll(".bar-m")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar-m")
            .attr("x", x(0)) // começa do centro
            .attr("y", d => y(d.faixa_salarial))
            .attr("width", 0) // começa sem largura
            .attr("height", y.bandwidth())
            .attr("fill", "#1e90ff")
            .on("mouseover", function(event, d) {
                d3.select("#tooltip")
                    .style("display", "block")
                    .html(`
                        <strong>Salário entre :</strong> R$ ${d.min} e R$ ${d.max}<br>
                        <strong>Quantidade:</strong> ${d.Masculino}
                    `);
                d3.select(this)
                    .attr("fill", "#339999");
            })
            .on("mousemove", function(event) {
                d3.select("#tooltip")
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", function() {
                d3.select("#tooltip").style("display", "none");
                d3.select(this).attr("fill", "#1e90ff");
            })
            .transition()
            .duration(1000)
            .attr("width", d => x(d.Masculino) - x(0));

    
    // adiciona os textos 
    svg.append("text")
        .attr("x", width / 4)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .attr("fill", "#ff0080")
        .text("Mulheres");

    svg.append("text")
        .attr("x", (3 * width) / 4)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .attr("fill", "#007af2")
        .text("Homens");

    // Título do eixo X
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 65)
        .attr("font-size", "15px")
        .text("Quantidade de pessoas");

    // Título do eixo Y
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -10)
        .attr("font-size", "15px")
        .text("Média Salarial");
    
    // define escala y contínua para a linha de salário médio
    const maxSalario = d3.max(dataset, d => d.faixa_salarial);
    const minSalario = d3.min(dataset, d => d.faixa_salarial);
    const y1 = d3.scaleLinear()
    .domain([minSalario, maxSalario])
    .range([height, 0]);    
    // console.log(maxSalario);

    svg.append("g")
        .call(d3.axisRight(y1));
    
    
    // linha horizontal no salário médio feminino (esquerda)
    svg.append("line")
    .attr("x1", x(-maxValue))
    .attr("x2", x(0))
    .attr("y1", y1(salarioMediaMulher))
    .attr("y2", y1(salarioMediaMulher))
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    // pontilhado
    .attr("stroke-dasharray", "4,4")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0.5);

    // linha invisível, só para p tooltip
    svg.append("line")
    .attr("x1", x(0))
    .attr("x2", x(-maxValue))
    .attr("y1", y1(salarioMediaMulher))
    .attr("y2", y1(salarioMediaMulher))
    .attr("stroke", "black")
    // maior para facilitar hover
    .attr("stroke-width", 15) 
    // invisível
    .attr("stroke-opacity", 0) 
    .style("cursor", "pointer")
    .on("mouseover", function(event) {
        d3.select("#tooltip")
            .style("display", "block")
            .html(`
                <strong>Salário médio feminino:</strong> R$ ${Math.round(salarioMediaMulher * 10) / 10}
            `);
    })
    .on("mousemove", function(event) {
        d3.select("#tooltip")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", function() {
        d3.select("#tooltip").style("display", "none");
    });

    // linha horizontal no salário médio masculino (direita)
    svg.append("line")
    .attr("x1", x(0))
    .attr("x2", x(maxValue))
    .attr("y1", y1(salarioMedioHomem))
    .attr("y2", y1(salarioMedioHomem))
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    // pontilhado
    .attr("stroke-dasharray", "4,4")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0.5);

    // linha invisível, só parao tooltip
    svg.append("line")
    .attr("x1", x(0))
    .attr("x2", x(maxValue))
    .attr("y1", y1(salarioMedioHomem))
    .attr("y2", y1(salarioMedioHomem))
    .attr("stroke", "black")
    // maior para facilitar hover
    .attr("stroke-width", 15) 
    // invisível
    .attr("stroke-opacity", 0) 
    .style("cursor", "pointer")
    .on("mouseover", function(event) {
        d3.select("#tooltip")
            .style("display", "block")
            .html(`
                <strong>Salário médio masculino:</strong> R$ ${Math.round(salarioMedioHomem * 10) / 10}
            `);
    })
    .on("mousemove", function(event) {
        d3.select("#tooltip")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", function() {
        d3.select("#tooltip").style("display", "none");
    });

}

function salarioGenderProp() {
    // Limpa o SVG
    clean(); 

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
        .range([height, 110]);

    const yDiff = d3.scaleLinear()
        .domain([
            d3.min(dataset1, d => d.Feminino - d.Masculino),
            d3.max(dataset1, d => d.Feminino - d.Masculino)
        ])
        .nice()
        .range([height-400, 0]);

    // Eixos (agora com transição de opacidade)
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("opacity", 0)
        .call(d3.axisBottom(x))
        .transition()
        .duration(1000)
        .style("opacity", 1);

    svg.append("g")
        .style("opacity", 0)
        .call(d3.axisLeft(yLine))
        .transition()
        .duration(1000)
        .style("opacity", 1);

    // Título do eixo X
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("font-size", "14px")
        .text("Faixa Salarial")
        .style("opacity", 0.6);

    // Título do eixo Y
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("font-size", "14px")
        .text("Proporção (%)")
        .style("opacity", 0.6);

    // Linhas
    const lineMasculino = d3.line()
        .x(d => xLine(d.faixa_salarial.trim()))
        .y(d => yLine(d.Masculino));

    const lineFeminino = d3.line()
        .x(d => xLine(d.faixa_salarial.trim()))
        .y(d => yLine(d.Feminino));

    // Linha masculino
    svg.append("path")
        .datum(dataset1)
        .attr("d", lineMasculino)
        .attr("stroke", "#1e90ff")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", function() { return this.getTotalLength(); })
        .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
        .transition()
        .duration(1000)
        .attr("stroke-dashoffset", 0);

    // Linha feminino
    svg.append("path")
        .datum(dataset1)
        .attr("d", lineFeminino)
        .attr("stroke", "#ff69b4")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", function() { return this.getTotalLength(); })
        .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
        .transition()
        .duration(1000)
        .attr("stroke-dashoffset", 0);

    // Pontos nas linhas (masculino)
    svg.selectAll(".circle-male")
        .data(dataset1)
        .enter()
        .append("circle")
        .attr("cx", d => xLine(d.faixa_salarial.trim()))
        .attr("cy", d => yLine(d.Masculino))
        .attr("r", 0) // começa raio 0
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
        })
        .transition()
        .duration(800)
        .attr("r", 4);

    // Pontos nas linhas (feminino)
    svg.selectAll(".circle-female")
        .data(dataset1)
        .enter()
        .append("circle")
        .attr("cx", d => xLine(d.faixa_salarial.trim()))
        .attr("cy", d => yLine(d.Feminino))
        .attr("r", 0) // começa raio 0
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
        })
        .transition()
        .duration(800)
        .attr("r", 4);

    // Barras de diferença (Feminino - Masculino)
    svg.selectAll("rect")
        .data(dataset1)
        .enter()
        .append("rect")
        .attr("x", d => x(d.faixa_salarial.trim()))
        .attr("y", yDiff(0)) // começa no meio
        .attr("width", x.bandwidth())
        .attr("height", 0) // altura inicial 0
        .attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"))
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
            d3.select(this).attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"));
        })
        .transition()
        .duration(1000)
        .attr("y", d => d.Feminino - d.Masculino >= 0
            ? yDiff(d.Feminino - d.Masculino)
            : yDiff(0))
        .attr("height", d => Math.abs(yDiff(d.Feminino - d.Masculino) - yDiff(0)));

    // Camada para destacar background
    const backgroundHighlight = svg.append("g").attr("class", "background-highlight");

    // Seleciona o <b> do texto e adiciona interação
    d3.selectAll(".highlight-salary")
        .on("mouseover", function(event) {
            const minFaixa = parseFloat(d3.select(this).attr("data-min-salary"));
            const maxFaixa = parseFloat(d3.select(this).attr("data-max-salary"));

            // Calcula intervalo real
            const faixasNoIntervalo = dataset1.filter(d => {
                const salario = parseFloat(d.faixa_salarial);
                return salario >= minFaixa && salario <= maxFaixa;
            });

            if (faixasNoIntervalo.length === 0) return;

            const primeiraFaixa = faixasNoIntervalo[0].faixa_salarial.trim();
            const ultimaFaixa = faixasNoIntervalo[faixasNoIntervalo.length - 1].faixa_salarial.trim();

            const xInicio = x(primeiraFaixa);
            const xFim = x(ultimaFaixa) + x.bandwidth();

            backgroundHighlight.selectAll("rect").remove();

            backgroundHighlight.append("rect")
                .attr("x", xInicio)
                .attr("y", 0)
                .attr("width", xFim - xInicio)
                .attr("height", height)
                .attr("fill", "#e0e0e0")
                .attr("opacity", 0.4);

            svg.selectAll("rect")
                .filter(d => {
                    const salario = parseFloat(d.faixa_salarial);
                    return salario >= minFaixa && salario <= maxFaixa;
                })
                .attr("fill", "#c8c8c8");

            svg.selectAll("circle")
                .filter(d => {
                    const salario = parseFloat(d.faixa_salarial);
                    return salario >= minFaixa && salario <= maxFaixa;
                })
                .transition()
                .duration(200)
                .attr("r", 10);
                // .attr("fill", "#1f039f");
        })
        .on("mouseout", function(event) {
            backgroundHighlight.selectAll("rect").remove();

            svg.selectAll("rect")
                .attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"))
                .attr("opacity", 0.5);

            svg.selectAll("circle")
                .transition()
                .duration(200)
                .attr("r", 4);
                // .attr("fill", d => "#1e90ff");
        });
}


function ensinoGenderProp() {
    clean(); // Limpa o SVG

    // Escalas
    const x = d3.scaleBand()
        .domain(dataset2.map(d => d.ensino.trim()))
        .range([0, width])
        .padding(0.2);

    const xLine = d3.scalePoint()
        .domain(dataset2.map(d => d.ensino.trim()))
        .range([0, width])
        .padding(0.5);

    const yLine = d3.scaleLinear()
        .domain([0, d3.max(dataset2, d => Math.max(d.Masculino, d.Feminino))])
        .nice()
        .range([height, 110]);

    const yDiff = d3.scaleLinear()
        .domain([
            d3.min(dataset2, d => d.Feminino - d.Masculino),
            d3.max(dataset2, d => d.Feminino - d.Masculino)
        ])
        .nice()
        .range([height-400, 0]);

    // Eixos
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("opacity", 0)
        .call(d3.axisBottom(x))
        .transition()
        .duration(800)
        .style("opacity", 1);

    svg.append("g")
        .style("opacity", 0)
        .call(d3.axisLeft(yLine))
        .transition()
        .duration(800)
        .style("opacity", 1);

    // Título do eixo X
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("font-size", "14px")
        .text("Formação")
        .style("opacity", 0.6);

    // Título do eixo Y
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("font-size", "14px")
        .text("Proporção (%)")
        .style("opacity", 0.6);

    // Linhas
    const lineMasculino = d3.line()
        .x(d => xLine(d.ensino.trim()))
        .y(d => yLine(d.Masculino));

    const lineFeminino = d3.line()
        .x(d => xLine(d.ensino.trim()))
        .y(d => yLine(d.Feminino));

    // Linha masculino
    svg.append("path")
        .datum(dataset2)
        .attr("d", lineMasculino)
        .attr("stroke", "#1e90ff")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("pointer-events", "stroke") // << ADICIONADO
        .on("mouseover", function(event) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Homens:</strong> Passe o mouse sobre os pontos para ver o valor.`);
            d3.select(this).attr("stroke-width", 4);
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("stroke-width", 2);
        })
        .attr("stroke-dasharray", function() { return this.getTotalLength(); })
        .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("stroke-dashoffset", 0);

    // Linha feminino
    svg.append("path")
        .datum(dataset2)
        .attr("d", lineFeminino)
        .attr("stroke", "#ff69b4")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("pointer-events", "stroke") // << ADICIONADO
        .on("mouseover", function(event) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Mulheres:</strong> Passe o mouse sobre os pontos para ver o valor.`);
            d3.select(this).attr("stroke-width", 4);
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("stroke-width", 2);
        })
        .attr("stroke-dasharray", function() { return this.getTotalLength(); })
        .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("stroke-dashoffset", 0);

    // Pontos masculinos
    svg.selectAll(".circle-male")
        .data(dataset2)
        .enter()
        .append("circle")
        .attr("class", "circle-male")
        .attr("cx", d => xLine(d.ensino.trim()))
        .attr("cy", d => yLine(d.Masculino))
        .attr("r", 0)
        .attr("fill", "#1e90ff")
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("r", 4);

    // Pontos femininos
    svg.selectAll(".circle-female")
        .data(dataset2)
        .enter()
        .append("circle")
        .attr("class", "circle-female")
        .attr("cx", d => xLine(d.ensino.trim()))
        .attr("cy", d => yLine(d.Feminino))
        .attr("r", 0)
        .attr("fill", "#ff69b4")
        .transition()
        .duration(800)
        .attr("r", 4);

    // Interação nos pontos - masculino
    svg.selectAll(".circle-male")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Proporção (Homens):</strong> ${Math.round(d.Masculino * 10) / 10}%`);
            d3.select(this).transition().duration(100).attr("r", 8).attr("fill", "#339999");
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

    // Interação nos pontos - feminino
    svg.selectAll(".circle-female")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Proporção (Mulheres):</strong> ${Math.round(d.Feminino * 10) / 10}%`);
            d3.select(this).transition().duration(100).attr("r", 8).attr("fill", "#339999");
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

    // Barras de diferença
    svg.selectAll(".diff-bar")
        .data(dataset2)
        .enter()
        .append("rect")
        .attr("class", "diff-bar")
        .attr("x", d => x(d.ensino.trim()))
        .attr("y", yDiff(0))
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"))
        .attr("opacity", 0.5)
        .transition()
        .duration(1000)
        .attr("y", d => d.Feminino - d.Masculino >= 0 ? yDiff(d.Feminino - d.Masculino) : yDiff(0))
        .attr("height", d => Math.abs(yDiff(d.Feminino - d.Masculino) - yDiff(0)));

    // Interação nas barras
    svg.selectAll(".diff-bar")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Diferença:</strong> ${Math.round((d.Feminino - d.Masculino) * 10) / 10}%`);
            d3.select(this).attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function(event, d) {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"));
        });
}

function ensinoGenderAbsBar() {

    const subgroups = ["Masculino", "Feminino"];
    const groups = dataset3.map(d => d.ensino);

    

    clean(); // Limpa o SVG

    // Escala x para os grupos (categorias de ensino)
    var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2]);

    // Criação do eixo X com animação
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("opacity", 0)
      .call(d3.axisBottom(x).tickSize(0))
      .transition()
      .duration(800)
      .style("opacity", 1);

      

    // Escala Y
    var y = d3.scaleLinear()
      .domain([0, d3.max(dataset3, d => Math.max(d.Masculino, d.Feminino))])
      .nice()
      .range([height, 0]);

    // Criação do eixo Y com animação
    svg.append("g")
      .style("opacity", 0)
      .call(d3.axisLeft(y))
      .transition()
      .duration(800)
      .style("opacity", 1);

    

    // Título do eixo X
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("font-size", "14px")
        .text("Formação")
        .style("opacity", 0.6);

    // Título do eixo Y
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("font-size", "14px")
        .text("Média salarial")
        .style("opacity", 0.6);

    // Escala interna para subgrupos (masculino/feminino dentro de cada grupo de ensino)
    var xSubgroup = d3.scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05]);

    // Cores
    const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(["#1e90ff", "#ff69b4"]);

    // Barras
    svg.append("g")
    .selectAll("g")
    // Enter na data = loop grupo por grupo
    .data(dataset3)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.ensino) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", y(0)) // começa do eixo x (para animar)
      .attr("width", xSubgroup.bandwidth())
      .attr("height", 0) // começa com altura 0
      .attr("fill", function(d) { return color(d.key); })
      .transition()
      .duration(1000)
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

    // Interação nas barras
    svg.selectAll("g")
      .selectAll("rect")
      .on("mouseover", function(event, d) {
        d3.select("#tooltip")
            .style("display", "block")
            .html(`<strong>Salário médio:</strong> R$ ${(Math.round((d.value) * 10) / 10)},00`);
        d3.select(this).attr("fill", "#339999");
      })
      .on("mousemove", function(event) {
        d3.select("#tooltip")
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select("#tooltip").style("display", "none");
        d3.select(this).attr("fill", function(d) { return color(d.key); });
      });
}


function experienciaGenderAbsBar() {

    const subgroups = ["Masculino", "Feminino"];
    const groups = dataset4.map(d => d.experiencia);
    // console.log(groups);

    clean(); // Limpa o SVG

    // Escala x para os grupos (categorias de experiência)
    var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2]);

    // Criação do eixo X com animação
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("opacity", 0)
      .call(d3.axisBottom(x).tickSize(0))
      .transition()
      .duration(800)
      .style("opacity", 1);

    // Escala Y
    var y = d3.scaleLinear()
      .domain([0, d3.max(dataset4, d => Math.max(d.Masculino, d.Feminino))])
      .nice()
      .range([height, 0]);

    // Criação do eixo Y com animação
    svg.append("g")
      .style("opacity", 0)
      .call(d3.axisLeft(y))
      .transition()
      .duration(800)
      .style("opacity", 1);


    // Título do eixo X
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("font-size", "14px")
        .text("Tempo de experiência (anos)")
        .style("opacity", 0.6);

    // Título do eixo Y
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("font-size", "14px")
        .text("Média salarial")
        .style("opacity", 0.6);
    

    // Escala interna para subgrupos (masculino/feminino dentro de cada grupo de experiência)
    var xSubgroup = d3.scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05]);

    // Cores
    const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(["#1e90ff", "#ff69b4"]);

    // Criação das barras
    const barGroups = svg.append("g")
      .selectAll("g")
      // Enter na data = loop grupo por grupo
      .data(dataset4)
      .enter()
      .append("g")
        .attr("transform", function(d) { return "translate(" + x(d.experiencia) + ",0)"; });

    barGroups.selectAll("rect")
      .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter()
      .append("rect")
        .attr("x", function(d) { return xSubgroup(d.key); })
        .attr("y", y(0)) // começa no chão para animar
        .attr("width", xSubgroup.bandwidth())
        .attr("height", 0) // altura inicial 0
        .attr("fill", function(d) { return color(d.key); })
      .transition()
      .duration(1000)
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });

    // Interação nas barras
    barGroups.selectAll("rect")
      .on("mouseover", function(event, d) {
          d3.select("#tooltip")
              .style("display", "block")
              .html(`<strong>Salário médio:</strong> R$ ${(Math.round((d.value) * 10) / 10)},00`);
          d3.select(this)
              .attr("fill", "#339999");
      })
      .on("mousemove", function(event) {
          d3.select("#tooltip")
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", function(event, d) {
          d3.select("#tooltip").style("display", "none");
          d3.select(this)
              .attr("fill", function(d) { return color(d.key); });
      });
}
function experienciaGenderProp() {
    clean(); 

    const x = d3.scaleBand()
        .domain(dataset5.map(d => d.experiencia))
        .range([0, width])
        .padding(0.2);

    const xLine = d3.scalePoint()
        .domain(dataset5.map(d => d.experiencia))
        .range([0, width])
        .padding(0.5);

    const yLine = d3.scaleLinear()
        .domain([0, d3.max(dataset5, d => Math.max(d.Masculino, d.Feminino))])
        .nice()
        .range([height, 110]);

    const yDiff = d3.scaleLinear()
        .domain([
            d3.min(dataset5, d => d.Feminino - d.Masculino),
            d3.max(dataset5, d => d.Feminino - d.Masculino)
        ])
        .nice()
        .range([height-400, 0]);

    // Eixos
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("opacity", 0)
        .call(d3.axisBottom(x))
        .transition()
        .duration(800)
        .style("opacity", 1);

    svg.append("g")
        .style("opacity", 0)
        .call(d3.axisLeft(yLine))
        .transition()
        .duration(800)
        .style("opacity", 1);

    // Título do eixo X
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("font-size", "14px")
        .text("Tempo de experiência (anos)")
        .style("opacity", 0.6);

    // Título do eixo Y
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("font-size", "14px")
        .text("Proporção (%)")
        .style("opacity", 0.6);

    // Linhas
    const lineMasculino = d3.line()
        .x(d => xLine(d.experiencia))
        .y(d => yLine(d.Masculino));

    const lineFeminino = d3.line()
        .x(d => xLine(d.experiencia))
        .y(d => yLine(d.Feminino));

    // Linha Masculino
    svg.append("path")
        .datum(dataset5)
        .attr("d", lineMasculino)
        .attr("stroke", "#1e90ff")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("pointer-events", "stroke") // <- para capturar o mouse na linha
        .on("mouseover", function(event) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Homens:</strong> Passe o mouse sobre os pontos para ver as proporções.`);
            d3.select(this).attr("stroke-width", 4);
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("stroke-width", 2);
        })
        .attr("stroke-dasharray", function() { return this.getTotalLength(); })
        .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("stroke-dashoffset", 0);

    // Linha Feminino
    svg.append("path")
        .datum(dataset5)
        .attr("d", lineFeminino)
        .attr("stroke", "#ff69b4")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("pointer-events", "stroke")
        .on("mouseover", function(event) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Mulheres:</strong> Passe o mouse sobre os pontos para ver as proporções.`);
            d3.select(this).attr("stroke-width", 4);
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("stroke-width", 2);
        })
        .attr("stroke-dasharray", function() { return this.getTotalLength(); })
        .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("stroke-dashoffset", 0);

    // Pontos nas linhas - masculino
    svg.selectAll(".circle-male")
        .data(dataset5)
        .enter()
        .append("circle")
        .attr("class", "circle-male")
        .attr("cx", d => xLine(d.experiencia))
        .attr("cy", d => yLine(d.Masculino))
        .attr("r", 0)
        .attr("fill", "#1e90ff")
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("r", 4);

    // Pontos nas linhas - feminino
    svg.selectAll(".circle-female")
        .data(dataset5)
        .enter()
        .append("circle")
        .attr("class", "circle-female")
        .attr("cx", d => xLine(d.experiencia))
        .attr("cy", d => yLine(d.Feminino))
        .attr("r", 0)
        .attr("fill", "#ff69b4")
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("r", 4);

    // Tooltip dos pontos - masculino
    svg.selectAll(".circle-male")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Proporção (Homens):</strong> ${Math.round(d.Masculino * 10) / 10}%`);
            d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 8)
                .attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 4)
                .attr("fill", "#1e90ff");
        });

    // Tooltip dos pontos - feminino
    svg.selectAll(".circle-female")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Proporção (Mulheres):</strong> ${Math.round(d.Feminino * 10) / 10}%`);
            d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 8)
                .attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 4)
                .attr("fill", "#ff69b4");
        });

    // Barras de diferença (Feminino - Masculino)
    svg.selectAll(".diff-bar")
        .data(dataset5)
        .enter()
        .append("rect")
        .attr("class", "diff-bar")
        .attr("x", d => x(d.experiencia))
        .attr("y", yDiff(0))
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"))
        .attr("opacity", 0.5)
        .transition()
        .duration(1000)
        .attr("y", d => d.Feminino - d.Masculino >= 0
            ? yDiff(d.Feminino - d.Masculino)
            : yDiff(0))
        .attr("height", d => Math.abs(yDiff(d.Feminino - d.Masculino) - yDiff(0)));

    // Tooltip nas barras de diferença
    svg.selectAll(".diff-bar")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Diferença:</strong> ${(Math.round((d.Feminino - d.Masculino) * 10) / 10)}%`);
            d3.select(this)
                .attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function(event, d) {
            d3.select("#tooltip").style("display", "none");
            d3.select(this)
                .attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"));
        });
}




function nivelGenderAbsBar() {

    const subgroups = ["Masculino", "Feminino"];
    const groups = dataset6.map(d => d.nivel);
    // console.log(groups);

    clean(); // Limpa o SVG

    // Escala x para os grupos (categorias de ensino)
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);

    // Escala y para os valores
    var y = d3.scaleLinear()
        .domain([0, d3.max(dataset6, d => Math.max(d.Masculino, d.Feminino))])
        .nice()
        .range([height, 0]);

    // Escala interna para subgrupos (Masculino/Feminino dentro de cada grupo)
    var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05]);

    // Cores
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#1e90ff", "#ff69b4"]);

    // Eixo X com animação de opacidade
    const xAxis = svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("opacity", 0);

    xAxis.transition()
        .duration(800)
        .style("opacity", 1)
        .call(d3.axisBottom(x).tickSize(0))
        .attr("font-size", "13.5px");

    // Eixo Y com animação de opacidade
    const yAxis = svg.append("g")
        .style("opacity", 0);

    yAxis.transition()
        .duration(800)
        .style("opacity", 1)
        .call(d3.axisLeft(y));

    // Criação das barras
    svg.append("g")
        .selectAll("g")
        .data(dataset6)
        .enter()
        .append("g")
            .attr("transform", d => `translate(${x(d.nivel)},0)`)
        .selectAll("rect")
        .data(d => subgroups.map(key => ({ key: key, value: d[key] })))
        .enter()
        .append("rect")
            .attr("x", d => xSubgroup(d.key))
            .attr("y", y(0)) // começa do chão
            .attr("width", xSubgroup.bandwidth())
            .attr("height", 0) // altura inicial 0
            .attr("fill", d => color(d.key))
            .transition()
            .duration(800)
            .ease(d3.easeQuadIn)
            .attr("y", d => y(d.value))
            .attr("height", d => height - y(d.value));

    // Título do eixo X
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("font-size", "14px")
        .text("Nível de Senioridade")
        .style("opacity", 0.6);

    // Título do eixo Y
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("font-size", "14px")
        .text("Média salarial")
        .style("opacity", 0.6);

    // Interação nas barras
    svg.selectAll("g")
        .selectAll("rect")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Salário médio:</strong> R$ ${(Math.round((d.value) * 10) / 10)},00`);
            d3.select(this)
                .attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function(event, d) {
            d3.select("#tooltip").style("display", "none");
            d3.select(this)
                .attr("fill", d => color(d.key));
        });
}

function nivelGenderProp() {
    // Limpa o SVG
    clean(); 

    // Escalas para os dois gráficos
    const x = d3.scaleBand()
        .domain(dataset7.map(d => d.nivel))
        .range([0, width])
        .padding(0.2);

    const xLine = d3.scalePoint()
        .domain(dataset7.map(d => d.nivel))
        .range([0, width])
        .padding(0.5);

    const yLine = d3.scaleLinear()
        .domain([0, d3.max(dataset7, d => Math.max(d.Masculino, d.Feminino))])
        .nice()
        .range([height, 110]);

    const yDiff = d3.scaleLinear()
        .domain([
            d3.min(dataset7, d => d.Feminino - d.Masculino),
            d3.max(dataset7, d => d.Feminino - d.Masculino)
        ])
        .nice()
        .range([height-400, 0]);

    // Eixos com animação de opacidade
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("opacity", 0)
        .call(d3.axisBottom(x))
        .transition()
        .duration(800)
        .style("opacity", 1)
        .attr("font-size", "14px");

    svg.append("g")
        .style("opacity", 0)
        .call(d3.axisLeft(yLine))
        .transition()
        .duration(800)
        .style("opacity", 1);

    // Título do eixo X
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .attr("font-size", "14px")
        .text("Nível de Senioridade")
        .style("opacity", 0.6);

    // Título do eixo Y
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -35)
        .attr("font-size", "14px")
        .text("Proporção (%)")
        .style("opacity", 0.6);

    // Linhas com animação de desenhar
    const lineMasculino = d3.line()
        .x(d => xLine(d.nivel))
        .y(d => yLine(d.Masculino));

    const lineFeminino = d3.line()
        .x(d => xLine(d.nivel))
        .y(d => yLine(d.Feminino));

    svg.append("path")
        .datum(dataset7)
        .attr("d", lineMasculino)
        .attr("stroke", "#1e90ff")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", function() { return this.getTotalLength(); })
        .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("stroke-dashoffset", 0);

    svg.append("path")
        .datum(dataset7)
        .attr("d", lineFeminino)
        .attr("stroke", "#ff69b4")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", function() { return this.getTotalLength(); })
        .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("stroke-dashoffset", 0);

    // Pontos nas linhas - masculino
    svg.selectAll(".circle-male")
        .data(dataset7)
        .enter()
        .append("circle")
        .attr("class", "circle-male")
        .attr("cx", d => xLine(d.nivel))
        .attr("cy", d => yLine(d.Masculino))
        .attr("r", 0) // começa com raio 0
        .attr("fill", "#1e90ff")
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("r", 4);

    // Pontos nas linhas - feminino
    svg.selectAll(".circle-female")
        .data(dataset7)
        .enter()
        .append("circle")
        .attr("class", "circle-female")
        .attr("cx", d => xLine(d.nivel))
        .attr("cy", d => yLine(d.Feminino))
        .attr("r", 0) // começa com raio 0
        .attr("fill", "#ff69b4")
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("r", 4);

    // Interações dos pontos - masculino
    svg.selectAll(".circle-male")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Proporção:</strong> ${Math.round(d.Masculino * 10) / 10}%`);
            d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 8)
                .attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 4)
                .attr("fill", "#1e90ff");
        });

    // Interações dos pontos - feminino
    svg.selectAll(".circle-female")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Proporção:</strong> ${Math.round(d.Feminino * 10) / 10}%`);
            d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 8)
                .attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 4)
                .attr("fill", "#ff69b4");
        });

    // Barras de diferença (Feminino - Masculino) com animação
    svg.selectAll(".diff-bar")
        .data(dataset7)
        .enter()
        .append("rect")
        .attr("class", "diff-bar")
        .attr("x", d => x(d.nivel))
        .attr("y", yDiff(0)) // começa no meio
        .attr("width", x.bandwidth())
        .attr("height", 0) // altura inicial 0
        .attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"))
        .attr("opacity", 0.5)
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("y", d => d.Feminino - d.Masculino >= 0
            ? yDiff(d.Feminino - d.Masculino)
            : yDiff(0))
        .attr("height", d => Math.abs(yDiff(d.Feminino - d.Masculino) - yDiff(0)));

    // Interação nas barras de diferença
    svg.selectAll(".diff-bar")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Diferença:</strong> ${(Math.round((d.Feminino - d.Masculino) * 10) / 10)}%`);
            d3.select(this)
                .attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function(event, d) {
            d3.select("#tooltip").style("display", "none");
            d3.select(this)
                .attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"));
        });
}

function wordCloud() {
    clean();

    const sizeScale = d3.scaleLinear()
        .domain(d3.extent(dataset8, d => d.quantidade))
        .range([10, 45]);

    const words = dataset8.map(d => ({
        text: d.motivo,
        size: sizeScale(d.quantidade),
        Quantidade: +d.quantidade,
        Prop_homem: +d.Prop_homem,
        Prop_mulher: +d.Prop_mulher
        }));
    
    svg//.append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("font-family", "sans-serif")
    .style("text-anchor", "middle")

    const g = svg.append("g")
                .attr("transform", `translate(${width/2},${height/2})`);

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(5)
        .rotate(() => 0)
        .font("sans-serif")
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    // Tooltip (garante que só tenha um)
    let tooltip = d3.select("#tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0,0,0,0.8)")
        .style("color", "white")
        .style("padding", "6px 10px")
        .style("border-radius", "4px")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .style("display", "none");
    }

    function draw(words) 
        {
            g.selectAll("text")
            .data(words)
            .join("text")
            .attr("font-size", d => d.size)
            .attr("fill", d => (d.Prop_mulher - d.Prop_homem >= 0 ? "#ff69b4" : "#1e90ff"))
            .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .text(d => d.text)
        .on("mouseover", function (event, d) {
        tooltip.style("display", "block")
            .html(`
            Citado por ${(Math.round((d.Prop_homem) * 10) / 10)}% dos homens 👨<br>
            Citado por ${(Math.round((d.Prop_mulher) * 10) / 10)}% das mulheres 👩
            `);
        
        d3.select(this).style("fill", "#339999");
        })
        .on("mousemove", function (event) {
        tooltip
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function (event, d) {
        tooltip.style("display", "none");
        d3.select(this).style("fill", d => (d.Prop_mulher - d.Prop_homem >= 0 ? "#ff69b4" : "#1e90ff"));
        });
    }

    const legend = svg.append("g")
        .attr("class", "legend-buttons")
        .attr("transform", `translate(${width - 150}, 20)`); // posição no canto superior direito

    // Botão para Homens
    legend.append("rect")
        .attr("x", 0)
        .attr("y", -70)
        .attr("width", 130)
        .attr("height", 30)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "#1e90ff")
        .style("cursor", "pointer")
        .on("click", function() {
            clean();
            wordCloudMan();
        });

    legend.append("text")
        .attr("x", 65)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .text("Homens");

    // Botão para Mulheres
    legend.append("rect")
        .attr("x", 0)
        .attr("y", -30)
        .attr("width", 130)
        .attr("height", 30)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "#ff69b4")
        .style("cursor", "pointer")
        .on("click", function() {
            clean();
            wordCloudWoman();
        });

    legend.append("text")
        .attr("x", 65)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .text("Mulheres");

    // Botão para Mulheres
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 10)
        .attr("width", 130)
        .attr("height", 30)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "#339999")
        .style("cursor", "pointer")
        .on("click", function() {
            clean();
            wordCloud();
        });

    legend.append("text")
        .attr("x", 65)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .text("Geral");

}

function wordCloudWoman() {
    clean();

    const sizeScale = d3.scaleLinear()
        .domain(d3.extent(dataset10, d => d.quantidade))
        .range([10, 45]);

    const words = dataset10.map(d => ({
        text: d.motivo,
        size: sizeScale(d.quantidade),
        quantidade: +d.quantidade,
        }));
    
    svg//.append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("font-family", "sans-serif")
    .style("text-anchor", "middle")

    const g = svg.append("g")
                .attr("transform", `translate(${width/2},${height/2})`);

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(5)
        .rotate(() => 0)
        .font("sans-serif")
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    // Tooltip (garante que só tenha um)
    let tooltip = d3.select("#tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0,0,0,0.8)")
        .style("color", "white")
        .style("padding", "6px 10px")
        .style("border-radius", "4px")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .style("display", "none");
    }

    function draw(words) 
        {
            g.selectAll("text")
            .data(words)
            .join("text")
            .attr("font-size", d => d.size)
            .attr("fill", d =>  "#ff69b4")
            .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .text(d => d.text)
        .on("mouseover", function (event, d) {
        tooltip.style("display", "block")
            .html(`
            Citado ${d.quantidade} vezes por mulheres 👩
            `);
        
        d3.select(this).style("fill", "#339999");
        })
        .on("mousemove", function (event) {
        tooltip
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function (event, d) {
        tooltip.style("display", "none");
        d3.select(this).style("fill", "#ff69b4");
        });
    }

    const legend = svg.append("g")
        .attr("class", "legend-buttons")
        .attr("transform", `translate(${width - 150}, 20)`); // posição no canto superior direito

    // Botão para Homens
    legend.append("rect")
        .attr("x", 0)
        .attr("y", -70)
        .attr("width", 130)
        .attr("height", 30)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "#1e90ff")
        .style("cursor", "pointer")
        .on("click", function() {
            clean();
            wordCloudMan();
        });

    legend.append("text")
        .attr("x", 65)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .text("Homens");

    // Botão para Mulheres
    legend.append("rect")
        .attr("x", 0)
        .attr("y", -30)
        .attr("width", 130)
        .attr("height", 30)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "#ff69b4")
        .style("cursor", "pointer")
        .on("click", function() {
            clean();
            wordCloudWoman();
        });

    legend.append("text")
        .attr("x", 65)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .text("Mulheres");

    // Botão para Mulheres
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 10)
        .attr("width", 130)
        .attr("height", 30)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "#339999")
        .style("cursor", "pointer")
        .on("click", function() {
            clean();
            wordCloud();
        });

    legend.append("text")
        .attr("x", 65)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .text("Geral");
}

function wordCloudMan() {
    clean();

    const sizeScale = d3.scaleLinear()
        .domain(d3.extent(dataset9, d => d.quantidade))
        .range([10, 45]);

    const words = dataset9.map(d => ({
        text: d.motivo,
        size: sizeScale(d.quantidade),
        quantidade: +d.quantidade,
        }));
    
    svg//.append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("font-family", "sans-serif")
    .style("text-anchor", "middle")

    const g = svg.append("g")
                .attr("transform", `translate(${width/2},${height/2})`);

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(5)
        .rotate(() => 0)
        .font("sans-serif")
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    // Tooltip (garante que só tenha um)
    let tooltip = d3.select("#tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0,0,0,0.8)")
        .style("color", "white")
        .style("padding", "6px 10px")
        .style("border-radius", "4px")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .style("display", "none");
    }

    function draw(words) 
        {
            g.selectAll("text")
            .data(words)
            .join("text")
            .attr("font-size", d => d.size)
            .attr("fill", d =>  "#1e90ff")
            .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .text(d => d.text)
        .on("mouseover", function (event, d) {
        tooltip.style("display", "block")
            .html(`
            Citado ${d.quantidade} vezes por homens 👨
            `);
        
        d3.select(this).style("fill", "#339999");
        })
        .on("mousemove", function (event) {
        tooltip
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function (event, d) {
        tooltip.style("display", "none");
        d3.select(this).style("fill", "#1e90ff");
        });
    }

    const legend = svg.append("g")
        .attr("class", "legend-buttons")
        .attr("transform", `translate(${width - 150}, 20)`); // posição no canto superior direito

    // Botão para Homens
    legend.append("rect")
        .attr("x", 0)
        .attr("y", -70)
        .attr("width", 130)
        .attr("height", 30)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "#1e90ff")
        .style("cursor", "pointer")
        .on("click", function() {
            clean();
            wordCloudMan();
        });

    legend.append("text")
        .attr("x", 65)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .text("Homens");

    // Botão para Mulheres
    legend.append("rect")
        .attr("x", 0)
        .attr("y", -30)
        .attr("width", 130)
        .attr("height", 30)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "#ff69b4")
        .style("cursor", "pointer")
        .on("click", function() {
            clean();
            wordCloudWoman();
        });

    legend.append("text")
        .attr("x", 65)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .text("Mulheres");

    // Botão para Mulheres
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 10)
        .attr("width", 130)
        .attr("height", 30)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "#339999")
        .style("cursor", "pointer")
        .on("click", function() {
            clean();
            wordCloud();
        });

    legend.append("text")
        .attr("x", 65)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .text("Geral");
}



window.drawPyr = drawPyr;
window.salarioGenderProp = salarioGenderProp;
window.activationFunctions = [
    drawPyr, // index 0
    drawPyr,
    salarioGenderProp, // index 1
    ensinoGenderProp, // index 2 — ou outra, se quiser criar um draw3()
    ensinoGenderAbsBar, // index 3
    experienciaGenderProp,
    experienciaGenderAbsBar,
    nivelGenderAbsBar, // index 4
    nivelGenderProp,  // index 4
    wordCloud
];



