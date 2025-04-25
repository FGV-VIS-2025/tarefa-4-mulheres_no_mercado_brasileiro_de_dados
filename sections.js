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
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
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
        Masculino: +d.Masculino
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


// function drawPyr() {
//     // limpa os eixos
//     clean();
//     const categorias = dataset.map(d => d.faixa_salarial);

//     // cálculo do salário médio
//     const maxValue = d3.max(dataset, d => Math.max(Math.abs(d.Feminino), d.Masculino));
//     let salarioMediaMulher = d3.sum(dataset, d => Math.abs(d.Feminino) * d.faixa_salarial)/d3.sum(dataset,  d=>Math.abs(d.Feminino)); 
//     let salarioMedioHomem = d3.sum(dataset, d => d.Masculino * d.faixa_salarial)/d3.sum(dataset,  d=>Math.abs(d.Masculino));

//     // mapeia os valores para o domínio da tela
//     const x = d3.scaleLinear()
//         .domain([-maxValue, maxValue])
//         .range([0, width]);

//     const y = d3.scaleBand()
//         .domain(categorias)
//         .range([height,0])
//         .padding(0.1);

//     // eixo x embaixo
//     svg.append("g")
//         .attr("transform", `translate(0, ${height})`)
//         .call(d3.axisBottom(x).ticks(5).tickFormat(d => Math.abs(d)));

//     // eixo y a esquerda
//     svg.append("g")
//         .call(d3.axisLeft(y));
    
//     // barra feminina a esquerda
//     svg.selectAll(".bar-f")
//         .data(dataset)
//         .enter()
//         .append("rect")
//         .attr("class", "bar-f")
//         .attr("x", d => x(d.Feminino))
//         .attr("y", d => y(d.faixa_salarial))
//         .attr("width", d => x(0) - x(d.Feminino))
//         .attr("height", y.bandwidth())
//         .attr("fill", "#ff69b4")
//         .on("mouseover", function(event, d) {
//             d3.select("#tooltip")
//                 .style("display", "block")
//                 .html(`
//                     <strong>Salário:</strong> R$ ${d.faixa_salarial},00<br>
//                     <strong>Quantidade:</strong> ${ - d.Feminino   }
//                 `);
//             d3.select(this)
//                 .attr("fill", "#339999");
//         })
//         // - MOve tooltip com o mouse
//         .on("mousemove", function(event) {
//             d3.select("#tooltip")
//                 .style("left", (event.pageX + 10) + "px")
//                 .style("top", (event.pageY - 20) + "px");
//         })
//         // - Retira tooltip quando o mouse sai
//         .on("mouseout", function() {
//             d3.select("#tooltip").style("display", "none");
//             d3.select(this).attr("fill", "#ff69b4");
//         });

//         // barra masculina a direita
//         svg.selectAll(".bar-m")
//         .data(dataset)
//         .enter()
//         .append("rect")
//         .attr("class", "bar-m")
//         .attr("x", x(0))
//         .attr("y", d => y(d.faixa_salarial))
//         .attr("width", d => x(d.Masculino) - x(0))
//         .attr("height", y.bandwidth())
//         .attr("fill", "#1e90ff")
//         .on("mouseover", function(event, d) {
//             d3.select("#tooltip")
//             .style("display", "block")
//                 .html(`
//                     <strong>Salário:</strong> R$ ${d.faixa_salarial},00<br>
//                     <strong>Quantidade:</strong> ${d.Masculino}
//                 `);
//             d3.select(this)
//             .attr("fill", "#339999");
//         })
//         // - MOve tooltip com o mouse
//         .on("mousemove", function(event) {
//             d3.select("#tooltip")
//             .style("left", (event.pageX + 10) + "px")
//                 .style("top", (event.pageY - 20) + "px");
//         })
//         // - Retira tooltip quando o mouse sai
//         .on("mouseout", function() {
//             d3.select("#tooltip").style("display", "none");
//             d3.select(this).attr("fill", "#1e90ff");
//         });
    
//     // adiciona os textos 
//     svg.append("text")
//         .attr("x", width / 4)
//         .attr("y", height + 40)
//         .attr("text-anchor", "middle")
//         .text("Feminino");

//     svg.append("text")
//         .attr("x", (3 * width) / 4)
//         .attr("y", height + 40)
//         .attr("text-anchor", "middle")
//         .text("Masculino");
    
//     // define escala y contínua para a linha de salário médio
//     const maxSalario = d3.max(dataset, d => d.faixa_salarial);
//     const y1 = d3.scaleLinear()
//     .domain([0, maxSalario])
//     .range([height, 0]);    
    
//     // linha horizontal no salário médio feminino (esquerda)
//     svg.append("line")
//     .attr("x1", x(-maxValue))
//     .attr("x2", x(0))
//     .attr("y1", y1(salarioMediaMulher))
//     .attr("y2", y1(salarioMediaMulher))
//     .attr("stroke", "black")
//     .attr("stroke-width", 3)
//     // pontilhado
//     .attr("stroke-dasharray", "4,4");

//     // linha invisível, só para p tooltip
//     svg.append("line")
//     .attr("x1", x(0))
//     .attr("x2", x(-maxValue))
//     .attr("y1", y1(salarioMediaMulher))
//     .attr("y2", y1(salarioMediaMulher))
//     .attr("stroke", "black")
//     // maior para facilitar hover
//     .attr("stroke-width", 15) 
//     // invisível
//     .attr("stroke-opacity", 0) 
//     .style("cursor", "pointer")
//     .on("mouseover", function(event) {
//         d3.select("#tooltip")
//             .style("display", "block")
//             .html(`
//                 <strong>Salário médio feminino:</strong> R$ ${Math.round(salarioMediaMulher * 10) / 10}
//             `);
//     })
//     .on("mousemove", function(event) {
//         d3.select("#tooltip")
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 20) + "px");
//     })
//     .on("mouseout", function() {
//         d3.select("#tooltip").style("display", "none");
//     });

//     // linha horizontal no salário médio masculino (direita)
//     svg.append("line")
//     .attr("x1", x(0))
//     .attr("x2", x(maxValue))
//     .attr("y1", y1(salarioMedioHomem))
//     .attr("y2", y1(salarioMedioHomem))
//     .attr("stroke", "black")
//     .attr("stroke-width", 3)
//     // pontilhado
//     .attr("stroke-dasharray", "4,4");

//     // linha invisível, só parao tooltip
//     svg.append("line")
//     .attr("x1", x(0))
//     .attr("x2", x(maxValue))
//     .attr("y1", y1(salarioMedioHomem))
//     .attr("y2", y1(salarioMedioHomem))
//     .attr("stroke", "black")
//     // maior para facilitar hover
//     .attr("stroke-width", 15) 
//     // invisível
//     .attr("stroke-opacity", 0) 
//     .style("cursor", "pointer")
//     .on("mouseover", function(event) {
//         d3.select("#tooltip")
//             .style("display", "block")
//             .html(`
//                 <strong>Salário médio masculino:</strong> R$ ${Math.round(salarioMedioHomem * 10) / 10}
//             `);
//     })
//     .on("mousemove", function(event) {
//         d3.select("#tooltip")
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 20) + "px");
//     })
//     .on("mouseout", function() {
//         d3.select("#tooltip").style("display", "none");
//     });

// }
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
        .padding(0.1);

    // eixo x embaixo
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d => Math.abs(d)));

    // eixo y a esquerda
    svg.append("g")
        .call(d3.axisLeft(y));
    
    // barra feminina a esquerda
    svg.selectAll(".bar-f")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar-f")
        .attr("x", x(0)) // começa no centro
        .attr("y", d => y(d.faixa_salarial))
        .attr("width", 0) // largura inicial 0
        .attr("height", y.bandwidth())
        .attr("fill", "#ff69b4")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`
                    <strong>Salário:</strong> R$ ${d.faixa_salarial},00<br>
                    <strong>Quantidade:</strong> ${ - d.Feminino }
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
        .attr("x", d => x(d.Feminino)) // move para a esquerda
        .attr("width", d => x(0) - x(d.Feminino)); // largura da barra

    // barra masculina a direita
    svg.selectAll(".bar-m")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar-m")
        .attr("x", x(0)) // começa no centro
        .attr("y", d => y(d.faixa_salarial))
        .attr("width", 0) // largura inicial 0
        .attr("height", y.bandwidth())
        .attr("fill", "#1e90ff")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`
                    <strong>Salário:</strong> R$ ${d.faixa_salarial},00<br>
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
        .attr("width", d => x(d.Masculino) - x(0)); // largura da barra
    
    // adiciona os textos 
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
    
    // define escala y contínua para a linha de salário médio
    const maxSalario = d3.max(dataset, d => d.faixa_salarial);
    const y1 = d3.scaleLinear()
        .domain([0, maxSalario])
        .range([height, 0]);    
    
    // linha horizontal no salário médio feminino (esquerda)
    svg.append("line")
        .attr("x1", x(-maxValue))
        .attr("x2", x(0))
        .attr("y1", y1(salarioMediaMulher))
        .attr("y2", y1(salarioMediaMulher))
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "4,4")
        .attr("stroke-dashoffset", 200)
        .attr("stroke-opacity", 0.5) 
        .transition()
        .duration(1000)
        .attr("stroke-dashoffset", 0);

    // linha invisível, só para p tooltip
    svg.append("line")
        .attr("x1", x(0))
        .attr("x2", x(-maxValue))
        .attr("y1", y1(salarioMediaMulher))
        .attr("y2", y1(salarioMediaMulher))
        .attr("stroke", "black")
        .attr("stroke-width", 15)
        .attr("stroke-opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", function(event) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Salário médio feminino:</strong> R$ ${Math.round(salarioMediaMulher * 10) / 10}`);
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
        .attr("stroke-dasharray", "4,4")
        .attr("stroke-dashoffset", 200)
        .attr("stroke-opacity", 0.5) 
        .transition()
        .duration(1000)
        .attr("stroke-dashoffset", 0);

    // linha invisível, só para o tooltip
    svg.append("line")
        .attr("x1", x(0))
        .attr("x2", x(maxValue))
        .attr("y1", y1(salarioMedioHomem))
        .attr("y2", y1(salarioMedioHomem))
        .attr("stroke", "black")
        .attr("stroke-width", 15)
        .attr("stroke-opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", function(event) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Salário médio masculino:</strong> R$ ${Math.round(salarioMedioHomem * 10) / 10}`);
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
}


function ensinoGenderProp() {
    clean(); // Limpa o SVG

    // Escalas para os dois gráficos
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
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(yLine));

    // Linhas
    const lineMasculino = d3.line()
        .x(d => xLine(d.ensino.trim()))
        .y(d => yLine(d.Masculino));

    const lineFeminino = d3.line()
        .x(d => xLine(d.ensino.trim()))
        .y(d => yLine(d.Feminino));

    svg.append("path")
        .datum(dataset2)
        .attr("d", lineMasculino)
        .attr("stroke", "#1e90ff")
        .attr("fill", "none")
        .attr("stroke-width", 2);

    svg.append("path")
        .datum(dataset2)
        .attr("d", lineFeminino)
        .attr("stroke", "#ff69b4")
        .attr("fill", "none")
        .attr("stroke-width", 2);

    // Pontos nas linhas
    svg.selectAll(".circle-male")
        .data(dataset2)
        .enter()
        .append("circle")
        .attr("cx", d => xLine(d.ensino.trim()))
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
        .data(dataset2)
        .enter()
        .append("circle")
        .attr("cx", d => xLine(d.ensino.trim()))
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
        .data(dataset2)
        .enter()
        .append("rect")
        .attr("x", d => x(d.ensino.trim()))
        .attr("y", d => d.Feminino - d.Masculino >= 0
            ? yDiff(d.Feminino - d.Masculino)
            : yDiff(0))
        .attr("width", x.bandwidth())
        .attr("height", d => Math.abs(yDiff(d.Feminino - d.Masculino) - yDiff(0)))
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
        });
}

function ensinoGenderAbsBar() {

    const subgroups = ["Masculino", "Feminino"];
    const groups = dataset3.map(d => d.ensino);

    clean();
    // Escala x para os grupos (categorias de ensino)
    var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));
    
    var y = d3.scaleLinear()
      .domain([0, d3.max(dataset3, d => Math.max(d.Masculino, d.Feminino))])
      .nice()
      .range([height, 0]);

    //   console.log(d3.max(dataset, d => Math.max(d.Masculino, d.Feminino)));

      svg.append("g")
      .call(d3.axisLeft(y));

      var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

    // Cores
    const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(["#1e90ff", "#ff69b4"]);

    // Eixo X
    svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(dataset3)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.ensino) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });
 
  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(dataset3)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.ensino) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); })
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
    console.log(groups);

    clean();
    // Escala x para os grupos (categorias de ensino)
    var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));
    
    var y = d3.scaleLinear()
      .domain([0, d3.max(dataset4, d => Math.max(d.Masculino, d.Feminino))])
      .nice()
      .range([height, 0]);

    //   console.log(d3.max(dataset, d => Math.max(d.Masculino, d.Feminino)));

      svg.append("g")
      .call(d3.axisLeft(y));

      var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

    // Cores
    const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(["#1e90ff", "#ff69b4"]);

    // Eixo X
    svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(dataset4)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.experiencia) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });
 
  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(dataset4)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.experiencia) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); })
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

function experienciaGenderProp() {
    // Limpa o SVG
    clean(); 

    // Escalas para os dois gráficos
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
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(yLine));

    // Linhas
    const lineMasculino = d3.line()
        .x(d => xLine(d.experiencia))
        .y(d => yLine(d.Masculino));

    const lineFeminino = d3.line()
        .x(d => xLine(d.experiencia))
        .y(d => yLine(d.Feminino));

    svg.append("path")
        .datum(dataset5)
        .attr("d", lineMasculino)
        .attr("stroke", "#1e90ff")
        .attr("fill", "none")
        .attr("stroke-width", 2);

    svg.append("path")
        .datum(dataset5)
        .attr("d", lineFeminino)
        .attr("stroke", "#ff69b4")
        .attr("fill", "none")
        .attr("stroke-width", 2);

    // Pontos nas linhas
    svg.selectAll(".circle-male")
        .data(dataset5)
        .enter()
        .append("circle")
        .attr("cx", d => xLine(d.experiencia))
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
        .data(dataset5)
        .enter()
        .append("circle")
        .attr("cx", d => xLine(d.experiencia))
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
        .data(dataset5)
        .enter()
        .append("rect")
        .attr("x", d => x(d.experiencia))
        .attr("y", d => d.Feminino - d.Masculino >= 0
            ? yDiff(d.Feminino - d.Masculino)
            : yDiff(0))
        .attr("width", x.bandwidth())
        .attr("height", d => Math.abs(yDiff(d.Feminino - d.Masculino) - yDiff(0)))
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
        });
}


function nivelGenderAbsBar() {

    const subgroups = ["Masculino", "Feminino"];
    const groups = dataset6.map(d => d.nivel);
    console.log(groups);

    clean();
    // Escala x para os grupos (categorias de ensino)
    var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));
    
    var y = d3.scaleLinear()
      .domain([0, d3.max(dataset6, d => Math.max(d.Masculino, d.Feminino))])
      .nice()
      .range([height, 0]);

    //   console.log(d3.max(dataset, d => Math.max(d.Masculino, d.Feminino)));

      svg.append("g")
      .call(d3.axisLeft(y));

      var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

    // Cores
    const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(["#1e90ff", "#ff69b4"]);

    // Eixo X
    svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(dataset6)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.nivel)+ ",0)" })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });
 
  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(dataset6)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.nivel) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); })
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

    // Eixos
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(yLine));

    // Linhas
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
        .attr("stroke-width", 2);

    svg.append("path")
        .datum(dataset7)
        .attr("d", lineFeminino)
        .attr("stroke", "#ff69b4")
        .attr("fill", "none")
        .attr("stroke-width", 2);

    // Pontos nas linhas
    svg.selectAll(".circle-male")
        .data(dataset7)
        .enter()
        .append("circle")
        .attr("cx", d => xLine(d.nivel))
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
        .data(dataset7)
        .enter()
        .append("circle")
        .attr("cx", d => xLine(d.nivel))
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
        .data(dataset7)
        .enter()
        .append("rect")
        .attr("x", d => x(d.nivel))
        .attr("y", d => d.Feminino - d.Masculino >= 0
            ? yDiff(d.Feminino - d.Masculino)
            : yDiff(0))
        .attr("width", x.bandwidth())
        .attr("height", d => Math.abs(yDiff(d.Feminino - d.Masculino) - yDiff(0)))
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
        });
}

window.drawPyr = drawPyr;
window.salarioGenderProp = salarioGenderProp;
window.activationFunctions = [
    drawPyr, // index 0
    salarioGenderProp, // index 1
    ensinoGenderProp, // index 2 — ou outra, se quiser criar um draw3()
    ensinoGenderAbsBar, // index 3
    experienciaGenderProp,
    experienciaGenderAbsBar,
    nivelGenderAbsBar, // index 4
    nivelGenderProp  // index 4
];



