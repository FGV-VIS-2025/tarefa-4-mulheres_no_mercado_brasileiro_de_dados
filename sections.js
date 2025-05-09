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
d3.csv("data/grouped_income_gender.csv").then(data => {
    dataset1 = data.map(d => ({
        faixa_salarial: d.salario,
        Masculino: +d.Masculino,
        Feminino: +d.Feminino,
        Diff: +(d.Feminino - d.Masculino),
    }));
});

d3.csv("data/motivos_satisfacao.csv").then(data => {
    dataset8 = data.map(d => ({
        motivo: d.motivo,
        Prop_homem: +d.Prop_homem,
        Prop_mulher: +d.Prop_mulher,
        quantidade: +d.Quantidade,
    }));
});

d3.csv("data/motivo_homem.csv").then(data => {
    dataset9 = data.map(d => ({
        motivo: d.motivo,
        quantidade: +d.quantidade
    }));
});

d3.csv("data/motivo_mulher.csv").then(data => {
    dataset10 = data.map(d => ({
        motivo: d.motivo,
        quantidade: +d.quantidade
    }));
});

d3.csv("data/grouped_salario_prop.csv").then(data => {
    dataset2 = data.map(d => ({
        ensino: d.Ensino.trim(),
        Masculino: +d.Masculino,
        Feminino: +d.Feminino,
        Diff: +(d.Feminino - d.Masculino),
    }));
});

d3.csv("data/grouped_salario_abs.csv").then(data => {
    dataset3 = data.map(d => ({
        ensino: d.Ensino.trim(),
        Masculino: +d.Masculino,
        Feminino: +d.Feminino
    }));
});

d3.csv("data/income_gender_experience.csv").then(data => {
    dataset4 = data.map(d => ({
        experiencia: d.experiencia_anos,
        Masculino: +d.Masculino,
        Feminino: +d.Feminino,
        // Diff: +(d.Feminino - d.Masculino),
    }));
});

d3.csv("data/income_gender_experience_prop.csv").then(data => {
    dataset5 = data.map(d => ({
        experiencia: d.experiencia_anos,
        Masculino: +d.Masculino,
        Feminino: +d.Feminino,
        Diff: +(d.Feminino - d.Masculino),
    }));
});

d3.csv("data/gender_nivel_abs.csv").then(data => {
    dataset6 = data.map(d => ({
        nivel: d.Nivel,
        Masculino: +d.Masculino,
        Feminino: +d.Feminino,
        Diff: +(d.Feminino - d.Masculino),
    }));
});

d3.csv("data/gender_nivel_prop.csv").then(data => {
    dataset7 = data.map(d => ({
        nivel: d.Nivel,
        Masculino: +d.Masculino,
        Feminino: +d.Feminino,
        Diff: +(d.Feminino - d.Masculino),
    }));
});

d3.csv("data/gender_pyramid.csv").then(data => {
    data_pyr = data.map(d => ({
        salario: +d.salario,
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

function initVis() {
    svg = d3.select("#vis")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto")
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
    // drawPyr();
}

//  Limpa tudo antes de cada desenho
function clean() {
    svg.selectAll("*").remove();
}


function expandSVG() {
    const newWidth = width * 2;
    const newHeight = height * 2;

    d3.select("#vis svg")
        .attr("viewBox", `0 0 ${newWidth-650} ${newHeight}`);
}

function resetSVG() {
    d3.select("#vis svg")
        // .transition()
        // .duration(500)
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom + 30);
        .attr("viewBox", `0 0 ${width+100} ${height+100}`);
}

function cleanSelect() {
    // Remove o select e seu contêiner, caso existam
    const selectContainer = d3.select("#cargoSelect");
    if (selectContainer.node()) {
        selectContainer.remove();
    }
}

function drawChart(dataset, media, cargo) {


    const categorias = dataset.map(d => d.salario);
    const maxValue = d3.max(data_pyr, d => Math.max(Math.abs(d.Feminino), d.Masculino));
    const salarioMediaMulher = +media.media_feminina;
    const salarioMedioHomem = +media.media_masculina;

    /// mapeia os valores para o domínio da tela
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
        .attr("class", "axis y-axis")
        .call(d3.axisBottom(x).ticks(5).tickFormat(d => Math.abs(d)));

    // adiciona os textos 
    svg.append("text")
        .attr("x", width / 4)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .attr("class", "axis y-axis")
        .attr("fill", "#ff0080")
        .text("Mulheres");

    svg.append("text")
        .attr("x", (3 * width) / 4)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .attr("class", "axis y-axis")
        .attr("fill", "#007af2")
        .text("Homens");

    

    // Título do eixo X
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 65)
        .attr("font-size", "15px")
        .attr("class", "axis y-axis")
        .text("Quantidade de pessoas");

    // Título do eixo Y
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -10)
        .attr("font-size", "16px")
        .attr("class", "axis y-axis")
        .text("Média Salarial")
        .style("opacity", 0.6);

    // define escala y contínua para a linha de salário médio
    const maxSalario = d3.max(data_pyr, d => d.salario);
    const minSalario = d3.min(data_pyr, d => d.salario);
    const y1 = d3.scaleLinear()
    .domain([minSalario, maxSalario])
    .range([height, 0]);    

    svg.append("g")
    .attr("class", "axis y-axis")
        .call(d3.axisRight(y1));
    
    
    // Seleciona o <b> que tem classe highlight-mean-salary e adiciona interação
    d3.selectAll(".highlight-mean-salary")
    .on("mouseover", function(event) {
    // Quando passar o mouse, destaca as linhas de salário médio
    svg.selectAll(".ref-mean-salary-line")
    .attr("stroke", "red")
        .attr("stroke-width", 4)
        .attr("stroke-opacity", 1); // aumenta a opacidade
    })
    .on("mouseout", function(event) {
        // Quando tirar o mouse, volta para o estilo normal
        svg.selectAll(".ref-mean-salary-line")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.5);
    });
    
    //////////////////////////////
    const categoriasBack = data_pyr.map(d => d.salario);
    
    const yB = d3.scaleBand()
    .domain(categoriasBack)
    .range([height,0])
    .padding(0);
    
    // Barras de referência ao fundo (data_pyr)
    svg.selectAll(".ref-bar-f")
    .data(data_pyr)
    .enter()
    .append("rect")
    .attr("class", "ref-bar-f")
    .attr("x", d => x(d.Feminino))
    .attr("y", d => yB(d.salario))
    .attr("width", d => x(0) - x(d.Feminino))
    .attr("height", yB.bandwidth())
    .attr("fill", "#ff69b4")
    .attr("opacity", 0.1);
    
    svg.selectAll(".ref-bar-m")
    .data(data_pyr)
    .enter()
    .append("rect")
    .attr("class", "ref-bar-m")
    .attr("x", x(0))
    .attr("y", d => yB(d.salario))
    .attr("width", d => x(d.Masculino) - x(0))
    .attr("height", yB.bandwidth())
    .attr("fill", "#1e90ff")
    .attr("opacity", 0.1);

     // barra feminina a esquerda
     svg.selectAll(".bar-f")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("class", "bar-f")
     .attr("x", x(0)) // começa do centro
     .attr("y", d => y(d.salario))
     .attr("width", 0) // começa sem largura
     .attr("height", y.bandwidth() + 0.5)
     .attr("fill", "#ff69b4")
     .on("mouseover", function(event, d) {
         d3.select("#tooltip")
             .style("display", "block")
             .html(`
                 <strong>Salário entre :</strong> R$ ${d.min} e R$ ${d.max}<br>
                 <strong>Quantidade:</strong> ${-d.Feminino}
             `);
        // Destaca todas as barras que possuem o mesmo intervalo de min e max
        d3.selectAll(".bar-f")
            .filter(function(e) { return e.min === d.min && e.max === d.max; }) // Filtra as barras com o mesmo intervalo
            .attr("fill", "#E1006D"); // #0040A6 Destaca essas barras // Destaca essas barras
        //  d3.select(this)
        //      .attr("fill", "#339999");
     })
     .on("mousemove", function(event) {
         d3.select("#tooltip")
             .style("left", (event.pageX + 10) + "px")
             .style("top", (event.pageY - 20) + "px");
     })
     .on("mouseout", function() {
         d3.select("#tooltip").style("display", "none");
        //  d3.select(this).attr("fill", "#ff69b4");
        d3.selectAll(".bar-f").attr("fill", "#ff69b4");
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
         .attr("y", d => y(d.salario))
         .attr("width", 0) // começa sem largura
         .attr("height", y.bandwidth() + 0.5)
         .attr("fill", "#1e90ff")
         .on("mouseover", function(event, d) {
             d3.select("#tooltip")
                 .style("display", "block")
                 .html(`
                     <strong>Salário entre :</strong> R$ ${d.min} e R$ ${d.max}<br>
                     <strong>Quantidade:</strong> ${d.Masculino}
                 `);
                 d3.selectAll(".bar-m")
                 .filter(function(e) { return e.min === d.min && e.max === d.max; }) // Filtra as barras com o mesmo intervalo
                 .attr("fill", "rgb(13, 99, 184)"); //
            //  d3.select(this)
            //      .attr("fill", "#339999");
         })
         .on("mousemove", function(event) {
             d3.select("#tooltip")
                 .style("left", (event.pageX + 10) + "px")
                 .style("top", (event.pageY - 20) + "px");
         })
         .on("mouseout", function() {
             d3.select("#tooltip").style("display", "none");
            //  d3.select(this).attr("fill", "#1e90ff");
            d3.selectAll(".bar-m").attr("fill", "#1e90ff"); //rgb(11, 73, 134)

         })
         .transition()
         .duration(1000)
         .attr("width", d => x(d.Masculino) - x(0));

        // linha horizontal no salário médio feminino (esquerda)
    svg.append("line")
    .attr("class", "mean-salary-line")
    .attr("x1", x(-maxValue))
    .attr("x2", x(0))
    .attr("y1", y1(salarioMediaMulher))
    .attr("y2", y1(salarioMediaMulher))
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    // pontilhado
    // .attr("stroke-dasharray", "4,4")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0.5);

    
    // linha horizontal no salário médio masculino (direita)
    svg.append("line")
    .attr("class", "mean-salary-line")
    .attr("x1", x(0))
    .attr("x2", x(maxValue))
    .attr("y1", y1(salarioMedioHomem))
    .attr("y2", y1(salarioMedioHomem))
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    // pontilhado
    // .attr("stroke-dasharray", "4,4")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0.5);


        
        // linha horizontal no salário médio masculino (direita)
        svg.append("line")
        .attr("class", "ref-mean-salary-line")
        .attr("x1", x(0))
        .attr("x2", x(maxValue))
        .attr("y1", y1(9732.58))
        .attr("y2", y1(9732.58))
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        // pontilhado
        .attr("stroke-dasharray", "4,4")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.5);
        
        // linha horizontal no salário médio feminino (esquerda)
        svg.append("line")
        .attr("class", "ref-mean-salary-line")
        .attr("x1", x(-maxValue))
        .attr("x2", x(0))
        .attr("y1", y1(8064.22))
        .attr("y2", y1(8064.22))
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    // pontilhado
    .attr("stroke-dasharray", "4,4")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0.5);
    
    // linha invisível, só para p tooltip para masculino do cargo 
    svg.append("line")
    .attr("x1", x(0))
    .attr("x2", x(-maxValue))
    .attr("y1", y1(8064.22))
    .attr("y2", y1(8064.22))
    .attr("class", "media-line")
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
                <strong>Salário médio feminino geral:</strong> R$ ${Math.round(8064.22 * 10) / 10}
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
    
    // linha invisível, só parao tooltip
    svg.append("line")
    .attr("x1", x(0))
    .attr("x2", x(maxValue))
    .attr("y1", y1(9732.58))
    .attr("y2", y1(9732.58))
    .attr("stroke", "black")
    // maior para facilitar hover
    .attr("stroke-width", 15) 
    .attr("class", "media-line")
    // invisível
    .attr("stroke-opacity", 0) 
    .style("cursor", "pointer")
    .on("mouseover", function(event) {
        d3.select("#tooltip")
        .style("display", "block")
        .html(`
            <strong>Salário médio masculino geral:</strong> R$ ${Math.round(9732.58 * 10) / 10}
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

        
        
        // linha invisível, só para p tooltip feminina do cargo 
        svg.append("line")
        .attr("x1", x(0))
        .attr("x2", x(-maxValue))
        .attr("y1", y1(salarioMediaMulher))
        .attr("y2", y1(salarioMediaMulher))
        .attr("class", "media-line")
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
                    <strong>${cargo}</strong><br>
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
        // linha invisível, só parao tooltip
        svg.append("line")
        .attr("x1", x(0))
        .attr("x2", x(maxValue))
        .attr("y1", y1(salarioMedioHomem))
        .attr("y2", y1(salarioMedioHomem))
        .attr("stroke", "black")
        // maior para facilitar hover
        .attr("stroke-width", 15) 
        .attr("class", "media-line")
        // invisível
        .attr("stroke-opacity", 0) 
        .style("cursor", "pointer")
        .on("mouseover", function(event) {
            d3.select("#tooltip")
            .style("display", "block")
            .html(`
                    <strong>${cargo}</strong><br>
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

              // Legenda para as linhas de salário médio
              svg.append("line")
              .attr("class", "media-line")
              .attr("x1", width - 200) // Posição horizontal
              .attr("x2", width - 185) // Posição horizontal
              .attr("y1", height - 500) // Posição vertical
              .attr("y2", height - 500) // Posição vertical
              .attr("stroke", "black")
              .attr("stroke-width", 3)
              .attr("stroke-dasharray", "4,4"); // Linha pontilhada para o salário médio geral
      
              svg.append("text")
              .attr("class", "media-line")
              .attr("x", width - 180) // Posição horizontal para o texto
              .attr("y", height - 500) // Posição vertical para o texto
              .attr("text-anchor", "start")
              .attr("font-size", "12px")
              .text("Salário médio geral")
              .attr("alignment-baseline", "middle");
      
              // Linha pontilhada para o salário médio do cargo
              svg.append("line")
              .attr("class", "media-line")
              .attr("x1", width - 200)
              .attr("x2", width - 185)
              .attr("y1", height - 480)
              .attr("y2", height - 480)
              .attr("stroke", "black")
              .attr("stroke-width", 3); // Linha pontilhada para o salário médio do cargo
      
              svg.append("text")
              .attr("class", "media-line")
              .attr("x", width - 180)
              .attr("y", height - 480)
              .attr("text-anchor", "start")
              .attr("font-size", "12px")
              .text(`Salário médio ${cargo}`)
              .attr("alignment-baseline", "middle");
        
    }
    
function cleanChart() {
    svg.selectAll(".bar-f").remove();
    svg.selectAll(".bar-m").remove();
    svg.selectAll(".media-line").remove();
    svg.selectAll(".axis").remove();
    svg.selectAll(".mean-salary-line").remove();
    svg.selectAll(".ref-bar-f").remove();
    svg.selectAll(".ref-bar-m").remove();
    svg.selectAll(".ref-mean-salary-line").remove();
}

function loadAndDraw(cargo) {
    cleanChart();
    
    const path = `analise_exploratoria/profs/${cargo}.csv`;
    
    Promise.all([
        d3.csv(path, d => ({
            salario: d.salario,
            Feminino: -+d.Feminino, // negativo para pirâmide
            Masculino: +d.Masculino,
            min: d.min,
            max: d.max
        })),
        d3.csv("analise_exploratoria/profs/media.csv")
    ]).then(([dataset, medias]) => {
        const media = medias.find(m => m.profissao === cargo);
        if (!media) {
            console.warn("Média não encontrada para:", cargo);
            return;
        }
        drawChart(dataset, media, cargo);
    }).catch(err => {
        console.error("Erro ao carregar arquivos:", err);
    });
}

function drawPyr() {
    clean();
    resetSVG();

    d3.select("#cargoSelect").remove(); // <-- remove o select antigo, se existir

    let cargos = [];

    d3.csv("analise_exploratoria/cargos.csv").then(function(data) {
        cargos = [...new Set(data.map(d => d.cargo))];

        const selectContainer = svg.append("g")
            .attr("transform", "translate(0, -50)");

        const select = selectContainer.append("foreignObject")
            .attr("width", 250)
            .attr("height", 200)
            .append("xhtml:div")
            .append("select")
            .attr("id", "cargoSelect")
            .style("width", "100%")
            .style("height", "100%")
            .style("font-size", "15px");

        select.selectAll("option")
            .data(cargos)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d);

        select.on("change", function(event) {
            const selectedCargo = event.target.value;
            loadAndDraw(selectedCargo);
        });

        // Desenha o gráfico do primeiro cargo
        loadAndDraw(cargos[0]);

    }).catch(function(error) {
        console.error("Erro ao carregar o arquivo CSV:", error);
    });
}

function salarioGenderProp() {
    clean();
    cleanSelect();
    resetSVG();

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
        .range([height, 130]);

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

    // Títulos
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("font-size", "15px")
        .text("Faixa Salarial")
        .style("opacity", 0.6);

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
        .attr("pointer-events", "stroke")
        .on("mouseover", function(event) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Homens:</strong> Passe o mouse sobre os pontos.`);
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
        .datum(dataset1)
        .attr("d", lineFeminino)
        .attr("stroke", "#ff69b4")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("pointer-events", "stroke")
        .on("mouseover", function(event) {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Mulheres:</strong> Passe o mouse sobre os pontos.`);
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

    // Pontos masculino
    svg.selectAll(".circle-male")
        .data(dataset1)
        .enter()
        .append("circle")
        .attr("class", "circle-male")
        .attr("cx", d => xLine(d.faixa_salarial.trim()))
        .attr("cy", d => yLine(d.Masculino))
        .attr("r", 0)
        .attr("fill", "#1e90ff")
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("r", 4);

    // Pontos feminino
    svg.selectAll(".circle-female")
        .data(dataset1)
        .enter()
        .append("circle")
        .attr("class", "circle-female")
        .attr("cx", d => xLine(d.faixa_salarial.trim()))
        .attr("cy", d => yLine(d.Feminino))
        .attr("r", 0)
        .attr("fill", "#ff69b4")
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("r", 4);

    // Interação pontos - masculino
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

    // Interação pontos - feminino
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

    svg.append("g")
    .style("opacity", 0)
    .call(d3.axisLeft(yDiff).ticks(3))
    .transition()
    .duration(800)
    .style("opacity", 1);

    // // Grid horizontal cinza com transparência
    // svg.append("g")
    //     .attr("class", "grid")
    //     .attr("opacity", 0.1)
    //     .call(d3.axisLeft(yLine)
    //         .tickSize(-width)
    //         .tickFormat("")
    //     )
    //     .selectAll("line")
    //     .attr("stroke", "gray");

    // // Grid horizontal para o gráfico de diferenças (barras)
    // svg.append("g")
    //     .attr("class", "grid-diff")
    //     .attr("opacity", 0.1)
    //     .call(d3.axisLeft(yDiff)
    //         .tickValues([0, -2, -4])  // define os valores dos ticks
    //         .tickSize(-width)        // desenha as linhas horizontais atravessando todo o gráfico
    //         .tickFormat("")          // não mostra os rótulos dos ticks
    //     )
    //     .selectAll("line")
    //     .attr("stroke", "gray");




     // Título do eixo Y
     svg.append("text")
     .attr("text-anchor", "middle")
     .attr("transform", "rotate(-90)")
     .attr("x", -40)
     .attr("y", -50)
     .attr("font-size", "14px")
     .text("Diferença(%)")
     .style("opacity", 0.6);
    // Barras de diferença
    svg.selectAll(".diff-bar")
        .data(dataset1)
        .enter()
        .append("rect")
        .attr("class", "diff-bar")
        .attr("x", d => x(d.faixa_salarial.trim()))
        .attr("y", yDiff(0))
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"))
        .attr("opacity", 0.5)
        .transition()
        .duration(1000)
        .ease(d3.easeQuadIn)
        .attr("y", d => d.Feminino - d.Masculino >= 0 ? yDiff(d.Feminino - d.Masculino) : yDiff(0))
        .attr("height", d => Math.abs(yDiff(d.Feminino - d.Masculino) - yDiff(0)));


    // Interação barras
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
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"));
        });



    // const backgroundHighlight = svg.append("g").attr("class", "background-highlight");

    // // Função auxiliar para converter coordenadas SVG para tela
    // function getScreenCoords(svgElement, x, y) {
    //     const point = svgElement.node().createSVGPoint();
    //     point.x = x;
    //     point.y = y;
    //     const screenPoint = point.matrixTransform(svgElement.node().getScreenCTM());
    //     return screenPoint;
    // }

    // // Destacar ponto mulher
    // d3.selectAll(".highlight-salary-women")
    //     .on("mouseover", function() {
    //         const targetSalary = parseFloat(d3.select(this).attr("data-min-salary"));
    //         const circle = svg.selectAll(".circle-female")
    //             .filter(d => parseFloat(d.faixa_salarial) === targetSalary);

    //         if (!circle.empty()) {
    //             circle.transition().duration(200).attr("r", 12).attr("fill", "#ee4298");

    //             const cx = +circle.attr("cx");
    //             const cy = +circle.attr("cy");
    //             const screenCoords = getScreenCoords(svg, cx, cy);

    //             d3.select("#tooltip")
    //                 .style("display", "block")
    //                 .style("left", (screenCoords.x + 10) + "px")
    //                 .style("top", (screenCoords.y - 30) + "px")
    //                 .html(`<strong>Mulheres:</strong> ${Math.round(circle.datum().Feminino * 10) / 10}%`);
    //         }
    //     })
    //     .on("mouseout", function() {
    //         d3.select("#tooltip").style("display", "none");
    //         svg.selectAll(".circle-female")
    //             .transition().duration(200)
    //             .attr("r", 4)
    //             .attr("fill", "#ff69b4");
    //     });

    // // Destacar ponto homem
    // d3.selectAll(".highlight-salary-men")
    //     .on("mouseover", function() {
    //         const targetSalary = parseFloat(d3.select(this).attr("data-min-salary"));
    //         const circle = svg.selectAll(".circle-male")
    //             .filter(d => parseFloat(d.faixa_salarial) === targetSalary);

    //         if (!circle.empty()) {
    //             circle.transition().duration(200).attr("r", 12).attr("fill", "#338ce4");

    //             const cx = +circle.attr("cx");
    //             const cy = +circle.attr("cy");
    //             const screenCoords = getScreenCoords(svg, cx, cy);

    //             d3.select("#tooltip")
    //                 .style("display", "block")
    //                 .style("left", (screenCoords.x + 10) + "px")
    //                 .style("top", (screenCoords.y - 30) + "px")
    //                 .html(`<strong>Homens:</strong> ${Math.round(circle.datum().Masculino * 10) / 10}%`);
    //         }
    //     })
    //     .on("mouseout", function() {
    //         d3.select("#tooltip").style("display", "none");
    //         svg.selectAll(".circle-male")
    //             .transition().duration(200)
    //             .attr("r", 4)
    //             .attr("fill", "#1e90ff");
    //     });

    const backgroundHighlight = svg.append("g").attr("class", "background-highlight");

    // Interação geral (faixa salarial toda)
    d3.selectAll(".highlight-salary")
        .on("mouseover", function(event) {
            const minFaixa = parseFloat(d3.select(this).attr("data-min-salary"));
            const maxFaixa = parseFloat(d3.select(this).attr("data-max-salary"));

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
        })
        .on("mouseout", function() {
            backgroundHighlight.selectAll("rect").remove();
        });

    // Interação mulher (ponto específico)
    d3.selectAll(".highlight-salary-women")
        .on("mouseover", function(event) {
            const targetSalary = parseFloat(d3.select(this).attr("data-min-salary"));
            const data = dataset1.find(d => parseFloat(d.faixa_salarial) === targetSalary);

            if (!data) return;

            svg.selectAll(".circle-female")
                .filter(d => parseFloat(d.faixa_salarial) === targetSalary)
                .transition()
                .duration(200)
                .attr("r", 12)
                .attr("fill", "#ee4298")
                .on("end", function(_, d) {
                    const cx = d3.select(this).attr("cx");
                    const cy = d3.select(this).attr("cy");
                    d3.select("#tooltip")
                        .style("display", "block")
                        .html(`<strong>Mulheres:</strong> ${Math.round(data.Feminino * 10) / 10}%`)
                        .style("left", `${+cx + 100}px`)
                        .style("top", `${+cy + 100}px`);
                });
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            svg.selectAll(".circle-female")
                .transition().duration(200)
                .attr("r", 4)
                .attr("fill", "#ff69b4");
        });

    // Interação homem (ponto específico)
    d3.selectAll(".highlight-salary-men")
        .on("mouseover", function(event) {
            const targetSalary = parseFloat(d3.select(this).attr("data-min-salary"));
            const data = dataset1.find(d => parseFloat(d.faixa_salarial) === targetSalary);

            if (!data) return;

            svg.selectAll(".circle-male")
                .filter(d => parseFloat(d.faixa_salarial) === targetSalary)
                .transition()
                .duration(200)
                .attr("r", 12)
                .attr("fill", "#338ce4")
                .on("end", function(_, d) {
                    const cx = d3.select(this).attr("cx");
                    const cy = d3.select(this).attr("cy");
                    d3.select("#tooltip")
                        .style("display", "block")
                        .html(`<strong>Homens:</strong> ${Math.round(data.Masculino * 10) / 10}%`)
                        .style("left", `${+cx + 100}px`)
                        .style("top", `${+cy + 100}px`);
                });
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
            svg.selectAll(".circle-male")
                .transition().duration(200)
                .attr("r", 4)
                .attr("fill", "#1e90ff");
        });
}

function ensinoGenderProp() {
    clean(); // Limpa o SVG
    resetSVG();

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
        .range([height, 130]);

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
        .style("font-size", "11.7px")
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
        .attr("font-size", "15px")
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
        .attr("pointer-events", "stroke")
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

    svg.append("g")
    .style("opacity", 0)
    .call(d3.axisLeft(yDiff).ticks(3))
    .transition()
    .duration(800)
    .style("opacity", 1);

    // Título do eixo Y
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -40)
        .attr("y", -50)
        .attr("font-size", "14px")
        .text("Diferença(%)")
        .style("opacity", 0.6);

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




        // Camada para destacar background
    const backgroundHighlight = svg.append("g").attr("class", "background-highlight");

    // Interação no texto destacado
    d3.selectAll(".highlight-education")
        .on("mouseover", function(event) {
            const educations = d3.select(this).attr("data-education").split(",");

            const faixasNoIntervalo = dataset2.filter(d => 
                educations.includes(d.ensino.trim())
            );

            if (faixasNoIntervalo.length === 0) return;

            const primeiraFaixa = faixasNoIntervalo[0].ensino.trim();
            const ultimaFaixa = faixasNoIntervalo[faixasNoIntervalo.length - 1].ensino.trim();

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

            // svg.selectAll("rect.diff-bar")
            //     .filter(d => educations.includes(d.ensino.trim()))
            //     .attr("fill", "#c8c8c8");

            svg.selectAll("circle")
                .filter(d => educations.includes(d.ensino.trim()))
                .transition()
                .duration(200)
                .attr("r", 8);
        })
        .on("mouseout", function(event) {
            backgroundHighlight.selectAll("rect").remove();

            svg.selectAll("rect.diff-bar")
                .attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"))
                .attr("opacity", 0.5);

            svg.selectAll("circle")
                .transition()
                .duration(200)
                .attr("r", 4);
        });
}

function ensinoGenderAbsBar() {
    let barsAnimated = false;
    let highlightLocked = false;
    let currentHighlight = null;

    const subgroups = ["Masculino", "Feminino"];
    const groups = dataset3.map(d => d.ensino);

    clean(); // Limpa o SVG
    resetSVG();

    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("opacity", 0)
        .style("font-size", "12.1px")
        .call(d3.axisBottom(x).tickSize(0))
        .transition()
        .duration(800)
        .style("opacity", 1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataset3, d => Math.max(d.Masculino, d.Feminino))])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .style("opacity", 0)
        .call(d3.axisLeft(y))
        .transition()
        .duration(800)
        .style("opacity", 1);

    svg.append("g")
        .attr("class", "grid")
        .attr("opacity", 0.2)
        .call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("font-size", "15px")
        .text("Formação")
        .style("opacity", 0.6);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("font-size", "14px")
        .text("Média salarial")
        .style("opacity", 0.6);

    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05]);

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#1e90ff", "#ff69b4"]);

    const barGroups = svg.append("g")
        .selectAll("g")
        .data(dataset3)
        .enter()
        .append("g")
        .attr("transform", function(d) { return "translate(" + x(d.ensino) + ",0)"; });

    barGroups.selectAll("rect")
        .data(function(d) {
            return subgroups.map(function(key) {
                return { key: key, value: d[key] };
            });
        })
        .enter()
        .append("rect")
        .attr("x", d => xSubgroup(d.key))
        .attr("y", y(0))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", 0)
        .attr("fill", d => color(d.key))
        .transition()
        .duration(1000)
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value))
        .on("end", function(_, i, nodes) {
            if (i === nodes.length - 1) {
                barsAnimated = true;
            }
        });

    svg.selectAll("g")
        .selectAll("rect")
        .on("mouseover", function(event, d) {
            if (!barsAnimated || highlightLocked) return;
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Salário médio:</strong> R$ ${(Math.round((d.value) * 10) / 10)},00`);
            d3.select(this).attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            if (!barsAnimated || highlightLocked) return;
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function(event, d) {
            if (!barsAnimated || highlightLocked) return;
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("fill", d => color(d.key));
        });

    d3.selectAll(".highlight-education")
        .on("mouseover", function(event) {
            if (!barsAnimated || highlightLocked) return;
            const educations = d3.select(this).attr("data-education").split(",");
            currentHighlight = educations;
            applyHighlight(educations);
        })
        .on("mouseout", function(event) {
            if (!barsAnimated || highlightLocked) return;
            removeHighlight();
        })
        .on("click", function(event) {
            if (!barsAnimated) return;
            const educations = d3.select(this).attr("data-education").split(",");

            if (highlightLocked && JSON.stringify(currentHighlight) === JSON.stringify(educations)) {
                highlightLocked = false;
                currentHighlight = null;
                removeHighlight();
            } else {
                highlightLocked = true;
                currentHighlight = educations;
                applyHighlight(educations);
            }
        });

    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(50, 20)");

    legend.append("rect")
        .attr("x", -8)
        .attr("y", -8)
        .attr("width", 16)
        .attr("height", 16)
        .attr("fill", "#ff69b4");

    legend.append("text")
        .attr("class", "highlight-legend")
        .attr("x", 40)
        .attr("y", 2)
        .style("font-size", "13px")
        .text("Mulheres");

    legend.append("rect")
        .attr("x", -8)
        .attr("y", 22)
        .attr("width", 16)
        .attr("height", 16)
        .attr("fill", "#1e90ff");

    legend.append("text")
        .attr("class", "highlight-legend")
        .attr("x", 40)
        .attr("y", 30)
        .style("font-size", "13px")
        .text("Homens");

    function applyHighlight(educations) {
        svg.selectAll("g")
            .selectAll("rect")
            .filter(function(d) {
                return d && d.key && this.parentNode.__data__ && educations.includes(this.parentNode.__data__.ensino.trim());
            })
            .transition()
            .duration(200)
            .attr("opacity", 1)
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        svg.selectAll("g")
            .selectAll("rect")
            .filter(function(d) {
                return d && d.key && this.parentNode.__data__ && !educations.includes(this.parentNode.__data__.ensino.trim());
            })
            .transition()
            .duration(200)
            .attr("opacity", 0.2)
            .attr("fill", "#d3d3d3")
            .attr("stroke", "none")
            .attr("stroke-width", 0);
    }

    function removeHighlight() {
        svg.selectAll("g")
            .selectAll("rect")
            .transition()
            .duration(200)
            .attr("opacity", 1)
            .attr("stroke", "none")
            .attr("stroke-width", 0)
            .attr("fill", function(d) {
                return d && d.key ? color(d.key) : d3.select(this).attr("fill");
            });
    }
}

function experienciaGenderAbsBar() {
    const subgroups = ["Masculino", "Feminino"];
    const groups = dataset4.map(d => d.experiencia);

    clean(); // Limpa o SVG
    resetSVG();

    let animationDone = false;
    let finishedTransitions = 0;
    const totalTransitions = dataset4.length * subgroups.length;
    let highlightLocked = false;
    let currentHighlight = null;

    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("opacity", 0)
        .call(d3.axisBottom(x).tickSize(0))
        .transition()
        .duration(800)
        .style("opacity", 1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataset4, d => Math.max(d.Masculino, d.Feminino))])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .style("opacity", 0)
        .call(d3.axisLeft(y))
        .transition()
        .duration(800)
        .style("opacity", 1);

    svg.append("g")
        .attr("class", "grid")
        .attr("opacity", 0.15)
        .call(d3.axisLeft(y).tickSize(-width).tickFormat(""))
        .selectAll("line")
        .attr("stroke", "gray");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("font-size", "14px")
        .text("Tempo de experiência (anos)")
        .style("opacity", 0.6);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("font-size", "14px")
        .text("Média salarial")
        .style("opacity", 0.6);

    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05]);

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#1e90ff", "#ff69b4"]);

    const barGroups = svg.append("g")
        .selectAll("g")
        .data(dataset4)
        .enter()
        .append("g")
        .attr("transform", d => "translate(" + x(d.experiencia) + ",0)");

    barGroups.selectAll("rect")
        .data(d => subgroups.map(key => ({ key: key, value: d[key] })))
        .enter()
        .append("rect")
        .attr("x", d => xSubgroup(d.key))
        .attr("y", y(0))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", 0)
        .attr("fill", d => color(d.key))
        .transition()
        .duration(1000)
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value))
        .on("end", () => {
            finishedTransitions++;
            if (finishedTransitions === totalTransitions) {
                animationDone = true;
            }
        });

    barGroups.selectAll("rect")
        .on("mouseover", function(event, d) {
            if (!animationDone || highlightLocked) return;
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Salário médio:</strong> R$ ${(Math.round(d.value * 10) / 10)},00`);
            d3.select(this).attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            if (!animationDone || highlightLocked) return;
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function(event, d) {
            if (!animationDone || highlightLocked) return;
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("fill", d => color(d.key));
        });

    d3.selectAll(".highlight-experience")
        .on("mouseover", function(event) {
            if (!animationDone || highlightLocked) return;
            const experiences = d3.select(this).attr("data-experience")
                .split(",").map(Number);
            currentHighlight = experiences;
            applyHighlight(experiences);
        })
        .on("mouseout", function(event) {
            if (!animationDone || highlightLocked) return;
            removeHighlight();
        })
        .on("click", function(event) {
            if (!animationDone) return;
            const experiences = d3.select(this).attr("data-experience")
                .split(",").map(Number);
            if (highlightLocked && JSON.stringify(currentHighlight) === JSON.stringify(experiences)) {
                highlightLocked = false;
                currentHighlight = null;
                removeHighlight();
            } else {
                highlightLocked = true;
                currentHighlight = experiences;
                applyHighlight(experiences);
            }
        });

    function applyHighlight(experiences) {
        svg.selectAll("g")
            .selectAll("rect")
            .filter(function(d) {
                return d && d.key && this.parentNode.__data__ && experiences.includes(Number(this.parentNode.__data__.experiencia));
            })
            .transition()
            .duration(200)
            .attr("opacity", 1)
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        svg.selectAll("g")
            .selectAll("rect")
            .filter(function(d) {
                return d && d.key && this.parentNode.__data__ && !experiences.includes(Number(this.parentNode.__data__.experiencia));
            })
            .transition()
            .duration(200)
            .attr("opacity", 0.2)
            .attr("fill", "#d3d3d3")
            .attr("stroke", "none")
            .attr("stroke-width", 0);
    }

    function removeHighlight() {
        svg.selectAll("g")
            .selectAll("rect")
            .transition()
            .duration(200)
            .attr("opacity", 1)
            .attr("stroke", "none")
            .attr("stroke-width", 0)
            .attr("fill", function(d) {
                return d && d.key ? color(d.key) : d3.select(this).attr("fill");
            });
    }

    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(50, 20)");

    legend.append("rect")
        .attr("x", -8)
        .attr("y", -8)
        .attr("width", 16)
        .attr("height", 16)
        .attr("fill", "#ff69b4");

    legend.append("text")
        .attr("class", "highlight-legend")
        .attr("x", 40)
        .attr("y", 2)
        .style("font-size", "13px")
        .text("Mulheres");

    legend.append("rect")
        .attr("x", -8)
        .attr("y", 22)
        .attr("width", 16)
        .attr("height", 16)
        .attr("fill", "#1e90ff");

    legend.append("text")
        .attr("class", "highlight-legend")
        .attr("x", 40)
        .attr("y", 30)
        .style("font-size", "13px")
        .text("Homens");
}

function experienciaGenderProp() {
    clean(); 
    resetSVG();

    // Adicionando uma classe única para este gráfico
    const chartGroup = svg.append("g").attr("class", "experiencia-gender-chart");

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
        .range([height, 130]);

    const yDiff = d3.scaleLinear()
        .domain([d3.min(dataset5, d => d.Feminino - d.Masculino), d3.max(dataset5, d => d.Feminino - d.Masculino)])
        .nice()
        .range([height - 400, 0]);

    // Eixos
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("opacity", 0)
        .call(d3.axisBottom(x))
        .transition()
        .duration(800)
        .style("opacity", 1);

    

    chartGroup.append("g")
        .style("opacity", 0)
        .call(d3.axisLeft(yLine))
        .transition()
        .duration(800)
        .style("opacity", 1);

    // Títulos
    chartGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("font-size", "14px")
        .text("Tempo de experiência (anos)")
        .style("opacity", 0.6);

    chartGroup.append("text")
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
    chartGroup.append("path")
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
    chartGroup.append("path")
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
    chartGroup.selectAll(".circle-male")
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
    chartGroup.selectAll(".circle-female")
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
    chartGroup.selectAll(".circle-male")
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
    chartGroup.selectAll(".circle-female")
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

    chartGroup.append("g")
        .style("opacity", 0)
        .call(d3.axisLeft(yDiff).ticks(3))
        .transition()
        .duration(800)
        .style("opacity", 1);

    // Título do eixo Y
    chartGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -40)
        .attr("y", -50)
        .attr("font-size", "14px")
        .text("Diferença(%)")
        .style("opacity", 0.6);

    // Barras de diferença (Feminino - Masculino)
    chartGroup.selectAll(".diff-bar")
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
    chartGroup.selectAll(".diff-bar")
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

    // Adiciona camada de fundo para destaque antes das barras
    const backgroundHighlight = chartGroup.append("g").attr("class", "background-highlight");

    // Interação no texto destacado
    d3.selectAll(".highlight-experience")
        .on("mouseover", function(event) {
            const experiences = d3.select(this).attr("data-experience").split(",").map(Number);

            const gruposSelecionados = dataset4.filter(d => 
                experiences.includes(Number(d.experiencia))
            );

            if (gruposSelecionados.length === 0) return;

            const primeiraFaixa = gruposSelecionados[0].experiencia;
            const ultimaFaixa = gruposSelecionados[gruposSelecionados.length - 1].experiencia;

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

            chartGroup.selectAll("g")
                .selectAll("rect")
                .filter(function(d) {
                    return d && d.key && this.parentNode.__data__ && experiences.includes(Number(this.parentNode.__data__.experiencia));
                })
                .transition()
                .duration(200)
                .attr("fill", "#c8c8c8");
        })
        .on("mouseout", function(event) {
            backgroundHighlight.selectAll("rect").remove();

            chartGroup.selectAll("g")
                .selectAll("rect")
                .transition()
                .duration(200)
                .attr("fill", d => d ? color(d.key) : null);
        });
}

function nivelGenderAbsBar() {
    let barsAnimated = false;
    let selectedNivel = null;

    const subgroups = ["Masculino", "Feminino"];
    const groups = dataset6.map(d => d.nivel);

    clean(); // Limpa o SVG
    resetSVG();

    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataset6, d => Math.max(d.Masculino, d.Feminino))])
        .nice()
        .range([height, 0]);

    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05]);

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#1e90ff", "#ff69b4"]);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("opacity", 0);

    xAxis.transition()
        .duration(800)
        .style("opacity", 1)
        .call(d3.axisBottom(x).tickSize(0))
        .attr("font-size", "13.5px");

    const yAxis = svg.append("g")
        .style("opacity", 0);

    yAxis.transition()
        .duration(800)
        .style("opacity", 1)
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("class", "grid")
        .attr("opacity", 0.15)
        .call(
            d3.axisLeft(y)
                .tickSize(-width)
                .tickFormat("")
        )
        .selectAll("line")
        .attr("stroke", "gray");

    let barsEnded = 0;
    const totalBars = dataset6.length * subgroups.length;

    svg.append("g")
        .selectAll("g")
        .data(dataset6)
        .enter()
        .append("g")
            .attr("transform", d => `translate(${x(d.nivel)},0)`)
            .each(function(d) {
                const nivelAtual = d.nivel;
                d3.select(this)
                    .selectAll("rect")
                    .data(subgroups.map(key => ({ key: key, value: d[key], nivel: nivelAtual })))
                    .enter()
                    .append("rect")
                        .attr("x", d => xSubgroup(d.key))
                        .attr("y", y(0))
                        .attr("width", xSubgroup.bandwidth())
                        .attr("height", 0)
                        .attr("fill", d => color(d.key))
                        .attr("data-nivel", d => d.nivel)
                        .transition()
                        .duration(800)
                        .ease(d3.easeQuadIn)
                        .attr("y", d => y(d.value))
                        .attr("height", d => height - y(d.value))
                        .on("end", () => {
                            barsEnded++;
                            if (barsEnded === totalBars) {
                                barsAnimated = true;
                            }
                        });
            });

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("font-size", "14px")
        .text("Nível de Senioridade")
        .style("opacity", 0.6);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("font-size", "14px")
        .text("Média salarial")
        .style("opacity", 0.6);

    svg.selectAll("g")
        .selectAll("rect")
        .on("mouseover", function(event, d) {
            if (!barsAnimated || selectedNivel !== null) return;
            d3.select("#tooltip")
                .style("display", "block")
                .html(`<strong>Salário médio:</strong> R$ ${(Math.round((d.value) * 10) / 10)},00`);
            d3.select(this)
                .attr("fill", "#339999");
        })
        .on("mousemove", function(event) {
            if (!barsAnimated || selectedNivel !== null) return;
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function(event, d) {
            if (!barsAnimated || selectedNivel !== null) return;
            d3.select("#tooltip").style("display", "none");
            d3.select(this)
                .attr("fill", d => color(d.key));
        });

    // Botões de destaque com clique
    d3.selectAll(".highlight-income-jp")
        .on("mouseover", function(event) {
            if (!barsAnimated || selectedNivel !== null) return;
            highlightNiveis(["Júnior", "Pleno"]);
        })
        .on("mouseout", function(event) {
            if (!barsAnimated || selectedNivel !== null) return;
            resetHighlights();
        })
        .on("click", function() {
            if (!barsAnimated) return;
            if (selectedNivel === "jp") {
                selectedNivel = null;
                resetHighlights();
            } else {
                selectedNivel = "jp";
                highlightNiveis(["Júnior", "Pleno"]);
            }
        });

    d3.selectAll(".highlight-income-senior")
        .on("mouseover", function(event) {
            if (!barsAnimated || selectedNivel !== null) return;
            highlightNiveis(["Sênior"]);
        })
        .on("mouseout", function(event) {
            if (!barsAnimated || selectedNivel !== null) return;
            resetHighlights();
        })
        .on("click", function() {
            if (!barsAnimated) return;
            if (selectedNivel === "senior") {
                selectedNivel = null;
                resetHighlights();
            } else {
                selectedNivel = "senior";
                highlightNiveis(["Sênior"]);
            }
        });

    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(50, 20)");

    legend.append("rect")
        .attr("x", -8)
        .attr("y", -8)
        .attr("width", 16)
        .attr("height", 16)
        .attr("fill", "#ff69b4");

    legend.append("text")
        .attr("class", "highlight-legend")
        .attr("x", 40)
        .attr("y", 2)
        .style("font-size", "13px")
        .text("Mulheres");

    legend.append("rect")
        .attr("x", -8)
        .attr("y", 22)
        .attr("width", 16)
        .attr("height", 16)
        .attr("fill", "#1e90ff");

    legend.append("text")
        .attr("class", "highlight-legend")
        .attr("x", 40)
        .attr("y", 30)
        .style("font-size", "13px")
        .text("Homens");

    // Funções auxiliares
    function highlightNiveis(niveis) {
        svg.selectAll("rect")
            .transition()
            .duration(200)
            .attr("opacity", function() {
                const nivel = this.getAttribute("data-nivel");
                return niveis.includes(nivel) ? 1 : 0.2;
            })
            .attr("stroke", function() {
                const nivel = this.getAttribute("data-nivel");
                return niveis.includes(nivel) ? "black" : "none";
            })
            .attr("stroke-width", function() {
                const nivel = this.getAttribute("data-nivel");
                return niveis.includes(nivel) ? 2 : 0;
            });
    }

    function resetHighlights() {
        svg.selectAll("rect")
            .transition()
            .duration(200)
            .attr("opacity", 1)
            .attr("stroke", "none")
            .attr("stroke-width", 0);
    }
}

function nivelGenderProp() {
    // Limpa o SVG
    clean(); 
    resetSVG();

    // Escalas
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
        .range([height, 130]);

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

    // Título dos eixos
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .attr("font-size", "14px")
        .text("Nível de Senioridade")
        .style("opacity", 0.6);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -35)
        .attr("font-size", "14px")
        .text("Proporção (%)")
        .style("opacity", 0.6);

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

    // Pontos
    svg.selectAll(".circle-male")
        .data(dataset7)
        .enter()
        .append("circle")
        .attr("class", "circle-male")
        .attr("cx", d => xLine(d.nivel))
        .attr("cy", d => yLine(d.Masculino))
        .attr("r", 0)
        .attr("fill", "#1e90ff")
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("r", 4);

    svg.selectAll(".circle-female")
        .data(dataset7)
        .enter()
        .append("circle")
        .attr("class", "circle-female")
        .attr("cx", d => xLine(d.nivel))
        .attr("cy", d => yLine(d.Feminino))
        .attr("r", 0)
        .attr("fill", "#ff69b4")
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("r", 4);

    // Tooltips
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

    svg.append("g")
        .style("opacity", 0)
        .call(d3.axisLeft(yDiff).ticks(4))
        .transition()
        .duration(800)
        .style("opacity", 1);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -40)
        .attr("y", -50)
        .attr("font-size", "14px")
        .text("Diferença(%)")
        .style("opacity", 0.6);

    // 🔧 MODIFICAÇÃO 1: Desativa interação durante a animação
    d3.selectAll(".highlight-senior1")
        .style("pointer-events", "none");

    // Barras de diferença com transição e sincronização
    svg.selectAll(".diff-bar")
        .data(dataset7)
        .enter()
        .append("rect")
        .attr("class", "diff-bar")
        .attr("x", d => x(d.nivel))
        .attr("y", yDiff(0))
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"))
        .attr("opacity", 0.5)
        .transition()
        .duration(800)
        .ease(d3.easeQuadIn)
        .attr("y", d => d.Feminino - d.Masculino >= 0
            ? yDiff(d.Feminino - d.Masculino)
            : yDiff(0))
        .attr("height", d => Math.abs(yDiff(d.Feminino - d.Masculino) - yDiff(0)))
        // 🔧 MODIFICAÇÃO 2: Reativa interação após a última barra
        .on("end", function(_, i, nodes) {
            if (i === nodes.length - 1) {
                d3.selectAll(".highlight-senior1")
                    .style("pointer-events", "all");
            }
        });

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

        // Camada para fundo de destaque (antes das linhas e barras)
        const backgroundHighlight = svg.append("g").attr("class", "background-highlight");
        
        // Interação no texto destacado
        d3.selectAll(".highlight-senior1")
            .on("mouseover", function(event) {
                const niveis = d3.select(this).attr("data-experience").split(",");
    
                const gruposSelecionados = dataset7.filter(d =>
                    niveis.includes(d.nivel)
                );
    
                if (gruposSelecionados.length === 0) return;
    
                const primeiroNivel = gruposSelecionados[0].nivel;
                const ultimoNivel = gruposSelecionados[gruposSelecionados.length - 1].nivel;
    
                const xInicio = x(primeiroNivel);
                const xFim = x(ultimoNivel) + x.bandwidth();
    
                backgroundHighlight.selectAll("rect").remove();
    
                backgroundHighlight.append("rect")
                    .attr("x", xInicio)
                    .attr("y", 0)
                    .attr("width", xFim - xInicio)
                    .attr("height", height)
                    .attr("fill", "#e0e0e0")
                    .attr("opacity", 0.4);
    
                // Destacar círculos (pontos) relacionados
                svg.selectAll(".circle-male, .circle-female")
                    .each(function(d) {
                        if (niveis.includes(d.nivel)) {
                            d3.select(this)
                                .transition()
                                .duration(200)
                                .attr("r", 10);
                        }
                    });
    
                // Clarear barras de diferença
                svg.selectAll(".diff-bar")
                    .each(function(d) {
                        if (niveis.includes(d.nivel)) {
                            d3.select(this)
                                .transition()
                                .duration(200)
                                // .attr("fill", "#c8c8c8");
                        }
                    });
            })
            .on("mouseout", function() {
                backgroundHighlight.selectAll("rect").remove();
    
                svg.selectAll(".circle-male, .circle-female")
                    .transition()
                    .duration(200)
                    .attr("r", 4);
    
                svg.selectAll(".diff-bar")
                    .transition()
                    .duration(200)
                    .attr("fill", d => (d.Feminino - d.Masculino >= 0 ? "#ff69b4" : "#1e90ff"))
                    .attr("opacity", 0.5);
            });
}

function wordCloud() {
    clean();
    resetSVG();

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

    svg
        .attr("width", width)
        .attr("height", height)
        .style("font-family", "sans-serif")
        .style("text-anchor", "middle");

    const g = svg.append("g")
        .attr("transform", `translate(${width/2},${height/2 +120})`);

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(5)
        .rotate(() => 0)
        .font("sans-serif")
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    // Inicialize o tooltip aqui para garantir que não ocorra erro de escopo
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

    function draw(words) {
        const wordElements = g.selectAll("text")
            .data(words)
            .join("text")
            .attr("font-size", d => d.size)
            .attr("fill", "#339999")
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
                d3.select(this).style("fill", "#339999");
            });

        // Interação com o texto HTML usando a classe "income"
        d3.selectAll(".income")
            .on("mouseover", function() {
                wordElements.filter(d => d.text === "Remuneração")
                    .transition()
                    .duration(500)
                    .style("font-size", "50px")  // Aumenta o tamanho da palavra
                    .style("font-weight", "bold");
            })
            .on("mouseout", function() {
                wordElements.filter(d => d.text === "Remuneração")
                    .transition()
                    .duration(500)
                    .style("font-size", d => d.size + "px")  // Retorna ao tamanho original
                    .style("font-weight", "normal");
            });
    }

    const legend = svg.append("g")
        .attr("class", "legend-buttons")
        .attr("transform", `translate(${width - 150}, 100)`); // posição no canto superior direito

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

    // Botão para Geral
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
    resetSVG();

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
                .attr("transform", `translate(${width/2},${height/2+120})`);

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
            const wordElements = g.selectAll("text")
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

        // Interação com o texto HTML usando a classe "income"
        d3.selectAll(".income")
            .on("mouseover", function() {
                wordElements.filter(d => d.text === "Remuneração")
                    .transition()
                    .duration(500)
                    .style("font-size", "50px")  // Aumenta o tamanho da palavra
                    .style("font-weight", "bold");
            })
            .on("mouseout", function() {
                wordElements.filter(d => d.text === "Remuneração")
                    .transition()
                    .duration(500)
                    .style("font-size", d => d.size + "px")  // Retorna ao tamanho original
                    .style("font-weight", "normal");
                    tooltip.style("display", "none");
            });
    }

    const legend = svg.append("g")
        .attr("class", "legend-buttons")
        .attr("transform", `translate(${width - 150}, 100)`); // posição no canto superior direito

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
    resetSVG();

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
                .attr("transform", `translate(${width/2},${height/2 +120})`);

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
            const wordElements = g.selectAll("text")
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

        // Interação com o texto HTML usando a classe "income"
        d3.selectAll(".income")
            .on("mouseover", function() {
                wordElements.filter(d => d.text === "Remuneração")
                    .transition()
                    .duration(500)
                    .style("font-size", "50px")  // Aumenta o tamanho da palavra
                    .style("font-weight", "bold");
            })
            .on("mouseout", function() {
                wordElements.filter(d => d.text === "Remuneração")
                    .transition()
                    .duration(500)
                    .style("font-size", d => d.size + "px")  // Retorna ao tamanho original
                    .style("font-weight", "normal");
                    tooltip.style("display", "none");
            });
    }

    const legend = svg.append("g")
        .attr("class", "legend-buttons")
        .attr("transform", `translate(${width - 150}, 100)`); // posição no canto superior direito

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


function drawBubbleChart() {
    expandSVG();
    clean(); // limpa o svg
    cleanSelect();
  
    /* ---------- 0. Dados ---------- */
    const bubbleData = [
        { cargo: "Analista Administrativo", genero: "Feminino", salario_medio: 4333.33, salario_min: 2500.0, salario_max: 10000.0, num_mulheres: 6, num_homens: 12 },
        { cargo: "Analista Administrativo", genero: "Masculino", salario_medio: 2458.33, salario_min: 1500.0, salario_max: 5000.0, num_mulheres: 6, num_homens: 12 },
        { cargo: "Analista de BI", genero: "Feminino", salario_medio: 5738.81, salario_min: 1500.0, salario_max: 18000.0, num_mulheres: 67, num_homens: 271 },
        { cargo: "Analista de BI", genero: "Masculino", salario_medio: 6426.20, salario_min: 500.0, salario_max: 35000.0, num_mulheres: 67, num_homens: 271 },
        { cargo: "Analista de Dados", genero: "Feminino", salario_medio: 7204.82, salario_min: 500.0, salario_max: 35000.0, num_mulheres: 83, num_homens: 241 },
        { cargo: "Analista de Dados", genero: "Masculino", salario_medio: 6620.33, salario_min: 500.0, salario_max: 27500.0, num_mulheres: 83, num_homens: 241 },
        { cargo: "Analista de Inteligência de Mercado", genero: "Feminino", salario_medio: 9600.0, salario_min: 3500.0, salario_max: 22500.0, num_mulheres: 5, num_homens: 13 },
        { cargo: "Analista de Inteligência de Mercado", genero: "Masculino", salario_medio: 5769.23, salario_min: 1500.0, salario_max: 14000.0, num_mulheres: 5, num_homens: 13 },
        { cargo: "Analista de Marketing", genero: "Feminino", salario_medio: 4166.67, salario_min: 2500.0, salario_max: 5000.0, num_mulheres: 3, num_homens: 10 },
        { cargo: "Analista de Marketing", genero: "Masculino", salario_medio: 4750.0, salario_min: 1500.0, salario_max: 10000.0, num_mulheres: 3, num_homens: 10 },
        { cargo: "Analista de Negócios", genero: "Feminino", salario_medio: 5740.0, salario_min: 2500.0, salario_max: 10000.0, num_mulheres: 25, num_homens: 71 },
        { cargo: "Analista de Negócios", genero: "Masculino", salario_medio: 7535.21, salario_min: 1500.0, salario_max: 27500.0, num_mulheres: 25, num_homens: 71 },
        { cargo: "Analista de Sistemas", genero: "Feminino", salario_medio: 5000.0, salario_min: 5000.0, salario_max: 5000.0, num_mulheres: 1, num_homens: 13 },
        { cargo: "Analista de Sistemas", genero: "Masculino", salario_medio: 4884.62, salario_min: 1500.0, salario_max: 10000.0, num_mulheres: 1, num_homens: 13 },
        { cargo: "Arquiteto de Dados", genero: "Masculino", salario_medio: 22000.0, salario_min: 10000.0, salario_max: 45000.0, num_mulheres: 0, num_homens: 7 },
        { cargo: "Arquiteto de dados", genero: "Masculino", salario_medio: 12000.0, salario_min: 10000.0, salario_max: 14000.0, num_mulheres: 0, num_homens: 2 },
        { cargo: "Cientista de Dados", genero: "Feminino", salario_medio: 7786.76, salario_min: 1500.0, salario_max: 18000.0, num_mulheres: 68, num_homens: 289 },
        { cargo: "Cientista de Dados", genero: "Masculino", salario_medio: 9411.76, salario_min: 500.0, salario_max: 45000.0, num_mulheres: 68, num_homens: 289 },
        { cargo: "Administrador de Banco de Dados", genero: "Feminino", salario_medio: 5000.0, salario_min: 5000.0, salario_max: 5000.0, num_mulheres: 1, num_homens: 13 },
        { cargo: "Administrador de Banco de Dados", genero: "Masculino", salario_medio: 6923.08, salario_min: 500.0, salario_max: 14000.0, num_mulheres: 1, num_homens: 13 },
        { cargo: "Engenheiro de Software", genero: "Feminino", salario_medio: 8884.62, salario_min: 1500.0, salario_max: 45000.0, num_mulheres: 13, num_homens: 77 },
        { cargo: "Engenheiro de Software", genero: "Masculino", salario_medio: 8454.55, salario_min: 500.0, salario_max: 45000.0, num_mulheres: 13, num_homens: 77 },
        { cargo: "Engenheiro de Dados", genero: "Feminino", salario_medio: 7650.0, salario_min: 1500.0, salario_max: 35000.0, num_mulheres: 40, num_homens: 259 },
        { cargo: "Engenheiro de Dados", genero: "Masculino", salario_medio: 10480.69, salario_min: 500.0, salario_max: 45000.0, num_mulheres: 40, num_homens: 259 },
        { cargo: "Engenheiro de Machine Learning", genero: "Feminino", salario_medio: 7611.11, salario_min: 500.0, salario_max: 14000.0, num_mulheres: 9, num_homens: 39 },
        { cargo: "Engenheiro de Machine Learning", genero: "Masculino", salario_medio: 10705.13, salario_min: 500.0, salario_max: 45000.0, num_mulheres: 9, num_homens: 39 },
        { cargo: "Estatístico", genero: "Feminino", salario_medio: 8055.56, salario_min: 1500.0, salario_max: 18000.0, num_mulheres: 9, num_homens: 16 },
        { cargo: "Estatístico", genero: "Masculino", salario_medio: 10718.75, salario_min: 500.0, salario_max: 27500.0, num_mulheres: 9, num_homens: 16 },
        { cargo: "Outras Engenharias (não inclui dev)", genero: "Feminino", salario_medio: 6500.0, salario_min: 2500.0, salario_max: 10000.0, num_mulheres: 3, num_homens: 29 },
        { cargo: "Outras Engenharias (não inclui dev)", genero: "Masculino", salario_medio: 6793.10, salario_min: 1500.0, salario_max: 27500.0, num_mulheres: 3, num_homens: 29 },
        { cargo: "Outro", genero: "Feminino", salario_medio: 6760.87, salario_min: 500.0, salario_max: 18000.0, num_mulheres: 23, num_homens: 90 },
        { cargo: "Outro", genero: "Masculino", salario_medio: 6838.89, salario_min: 500.0, salario_max: 45000.0, num_mulheres: 23, num_homens: 90 },
        { cargo: "Product Manager", genero: "Feminino", salario_medio: 15333.33, salario_min: 14000.0, salario_max: 18000.0, num_mulheres: 3, num_homens: 3 },
        { cargo: "Product Manager", genero: "Masculino", salario_medio: 10166.67, salario_min: 2500.0, salario_max: 18000.0, num_mulheres: 3, num_homens: 3 },
        { cargo: "Professor", genero: "Feminino", salario_medio: 6000.0, salario_min: 1500.0, salario_max: 14000.0, num_mulheres: 4, num_homens: 8 },
        { cargo: "Professor", genero: "Masculino", salario_medio: 6937.5, salario_min: 1500.0, salario_max: 18000.0, num_mulheres: 4, num_homens: 8 },
        { cargo: "Suporte Técnico", genero: "Feminino", salario_medio: 2500.0, salario_min: 500.0, salario_max: 3500.0, num_mulheres: 4, num_homens: 9 },
        { cargo: "Suporte Técnico", genero: "Masculino", salario_medio: 2611.11, salario_min: 500.0, salario_max: 5000.0, num_mulheres: 4, num_homens: 9 },
        { cargo: "Técnico", genero: "Feminino", salario_medio: 5000.0, salario_min: 5000.0, salario_max: 5000.0, num_mulheres: 2, num_homens: 11 },
        { cargo: "Técnico", genero: "Masculino", salario_medio: 4272.73, salario_min: 2500.0, salario_max: 7000.0, num_mulheres: 2, num_homens: 11 }
      ];
      
  
    /* ---------- 1. Hierarquia ---------- */
    const nestedData = {
      name: "root",
      children: Array.from(
        d3.group(bubbleData, d => d.cargo),
        ([cargo, values]) => ({
          name: cargo,
          children: values.map(d => ({
            cargo: d.cargo,
            genero: d.genero,
            name: d.genero,
            salario_medio: d.salario_medio,
            salario_min: d.salario_min,
            salario_max: d.salario_max,
            num_pessoas: d.genero === "Feminino" ? d.num_mulheres : d.num_homens,
            value: d.genero === "Feminino" ? d.num_mulheres : d.num_homens
          }))
        })
      )
    };
  
    /* ---------- 2. Pack Layout ---------- */
    const root = d3.pack()
        .size([width*2, height*2])
        .padding(6)
      (d3.hierarchy(nestedData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value));

    
  
    /* ---------- 3. Grupo Base ---------- */
    const chartArea = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top } )`);
  
    const g = chartArea.append("g")
      .attr("transform", `translate(300,400)`); // posição original

    // Adiciona legenda
    const legend = svg.append("g")
        .attr("class", "legend-group")
        .attr("transform", `translate(${width - 150}, ${margin.top})`); // Posição da legenda

    // Rosa - Mulheres
    legend.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 8)
        .attr("fill", "#F2A0CD"); // mesma cor usada para mulheres
    legend.append("text")
        .attr("class", "highlight-legend")
        .attr("x", 40)
        .attr("y", 2)
        .style("font-size", "13px")
        .text("Mulheres");
    // Azul - Homens
    legend.append("circle")
        .attr("cx", 0)
        .attr("cy", 30)
        .attr("r", 8)
        .attr("fill", "lightblue"); // mesma cor usada para homens
    legend.append("text")
        .attr("class", "highlight-legend")
        .attr("x", 38)
        .attr("y", 31)
        .style("font-size", "13px")
        .text("Homens");


    // Escala de tamanho da bolha para a legenda
    const sizeScale = d3.scaleSqrt()
        .domain([1, 600]) // número mínimo e máximo de pessoas que você tem no dataset
        .range([5, 80]);  // raio mínimo e máximo na legenda

    const sizeLegend = svg.append("g")
        .attr("class", "legend-group")
        .attr("transform", `translate(${width - 5}, ${margin.top + 100})`);

    // Exemplo de 3 bolhas de tamanhos diferentes
    const sizeValues = [10, 100, 250]; // Escolha valores representativos

    sizeLegend.selectAll("circle")
        .data(sizeValues)
        .join("circle")
        .attr("cy", d => -sizeScale(d))
        .attr("r", d => sizeScale(d))
        .attr("fill", "none")
        .attr("stroke", "black");

    sizeLegend.selectAll("text")
        .data(sizeValues)
        .join("text")
        .attr("y", d => -2 * sizeScale(d))
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .text(d => d + "");

    // Título da legenda de tamanho
    sizeLegend.append("text")
        .attr("y", -2 * sizeScale(d3.max(sizeValues)) - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .style("font-weight", "bold")
        .text("Nº de pessoas");


  
    let focus = root;
    let view;
    let currentFocusDepth = 0;

  
    /* ---------- 4. Cria Bolhas ---------- */
    const node = g.selectAll("circle")
      .data(root.descendants())
      .join("circle")
        .attr("fill", d => d.children ? "#F2F1F0" : d.data.genero === "Feminino" ? "#F2A0CD" : "lightBlue") // #63B0F2
        .attr("stroke", "#666")
        .each(function(d) {
            d.originalFill = d3.select(this).style("fill");  // Salva a cor original
        })
        // .on("mouseover", function() { d3.select(this).attr("stroke", "#000").attr("stroke-width", 2); })
        .on("mouseover", function(event, d) {
            d3.select(this)
              .attr("stroke", "#000")
              .attr("stroke-width", 2);
          
            d3.select(".label-" + d.data.name.replace(/\s+/g, "-"))
              .style("font-weight", "bold");
            d3.select("#tooltip")
              .style("display", currentFocusDepth < 1 && d.depth === 2 ? "block" : "none")
              .html(() => {
                // Filtra irmãos com o mesmo cargo (mesmo pai)
                const siblings = d.parent.children;
                const totalPessoasNoCargo = d3.sum(siblings, s => s.data.num_pessoas);
                const proporcao = ((d.data.num_pessoas / totalPessoasNoCargo) * 100).toFixed(1);
            
                return `
                  <strong>Cargo:</strong> ${d.data.cargo}<br>
                  <strong>Gênero:</strong> ${d.data.genero}<br>
                  <strong>Salário médio:</strong> R$ ${d.data.salario_medio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}<br>
                  <strong>Intervalo:</strong> R$ ${d.data.salario_min.toLocaleString("pt-BR")} - R$ ${d.data.salario_max.toLocaleString("pt-BR")}<br>
                  <strong>Qtd. pessoas:</strong> ${d.data.num_pessoas}<br>
                  <strong>Proporção no cargo:</strong> ${proporcao}%
                `;
              });
            
          })

        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
          
        // .on("mouseout", function() { d3.select(this).attr("stroke", "#666").attr("stroke-width", 1); })
        .on("mouseout", function(event, d) {
            d3.select(this)
              .attr("stroke", "#666")
              .attr("stroke-width", 1);
          
            d3.select(".label-" + d.data.name.replace(/\s+/g, "-"))
              .style("font-weight", "normal");
            d3.select("#tooltip").style("display", "none");
          })
          
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()))
            .attr("stroke-width", 1)

        .on("click", (event, d) => {
            if (focus !== d) {
                zoom(event, d);
                event.stopPropagation();
            }
            });

    

    // // Adiciona número de pessoas dentro das bolhas de nível 2 (cargo + gênero)
    // // Adiciona número de pessoas nas bolhas de gênero (depth === 1)
    // const textInBubbles = g.append("g")
    //     .attr("class", "bubble-numbers")
    //     .attr("pointer-events", "none")
    //     .selectAll("text")
    //     .data(root.descendants().filter(d => d.depth === 1))
    //     .join("text")
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "16px")
    //     .style("font-weight", "bold")
    //     .style("fill", d => d.data.genero === "Feminino" ? "#C71585" : "#1E90FF")
    //     .text(d => d.data.num_pessoas);


    /* ---------- 5. Rótulos iniciais ---------- */
    const label = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("font", "15.5px Helvetica")
    //   .style("font-weight", "bold")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .attr("class", d => "label-" + d.data.name.replace(/\s+/g, "-"))
       .style("fill-opacity", d => d.parent === root ? 1 : 0)
       .style("display", d => d.parent === root ? "inline" : "none")
       .text(d => d.data.name);
  
    /* ---------- 6. Zoom In/Out ---------- */
    svg.on("click", e => zoom(e, root));
  
    zoomTo([root.x, root.y, root.r * 2]);

    
  
    function zoomTo(v) {
      const k = width / v[2];
      view = v;

    //   textInBubbles
    //   .attr("transform", d => `translate(${(d.x - v[0]) * k}, ${(d.y - v[1]) * k})`)
    //   .style("display", d => (focus.depth === 1 && d.depth === 1) ? "block" : "none");
    


      
      label.attr("transform", d => `translate(${(d.x - v[0]) * k}, ${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k}, ${(d.y - v[1]) * k})`)
          .attr("r", d => d.r * k);

    }
  

    function zoom(event, d) {
      focus = d;
      currentFocusDepth = d.depth; // <- Atualiza a profundidade atual

      if (d === root) {
        d3.selectAll(".legend-group")
          .transition()
          .duration(500)
          .style("opacity", 1); // Volta a legenda
      } else {
        d3.selectAll(".legend-group")
          .transition()
          .duration(500)
          .style("opacity", 0); // Some a legenda
      }
      
  
      g.selectAll(".bubble-text").remove(); // remove textos anteriores
  
      const t = svg.transition()
        .duration(event.altKey ? 3500 : 750)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return k => zoomTo(i(k));
        });
  
       label
            .filter(function(e) { return e.parent === focus || this.style.display === "inline"; })
            .transition(t)
            .style("fill-opacity", e => e.parent === focus ? 1 : 0)
            .style("font", e => {
            return focus === root ? "12.5px Helvetica" : "20px Helvetica";  // <<<<< ajuste aqui
            })
            
            // .on("start", function(e) { if (e.parent === focus) this.style.display = "inline"; })
            // .on("end", function(e) { if (e.parent !== focus) this.style.display = "none"; });
  

    //   /* Adiciona informações dentro da bolha ao final do zoom */
    //   t.on("end", () => {
    //     if (!focus.children) {
    //       const info = [
    //         `${focus.data.cargo}`,
    //         `${focus.data.genero}`,
    //         `Número de pessoas: ${focus.data.num_pessoas}`,
    //         `Média salarial: R$${focus.data.salario_medio.toFixed(2)}`,
    //         `Salário Mínimo: R$${focus.data.salario_min.toFixed(2)}`,
    //         `Salário Máximo: R$${focus.data.salario_max.toFixed(2)}`
    //       ];
  
    //       g.append("g")
    //         .attr("class", "bubble-text")
    //         .attr("transform", `translate(${(focus.x - view[0]) * (width/view[2])}, ${(focus.y - view[1]) * (width/view[2])})`)
    //         .selectAll("text")
            
    //         .data(info)
    //         .join("text")
    //         .attr("y", (d, i) => (i - info.length/2) * 50)
    //         .attr("text-anchor", "middle")
    //         .style("font-weight", "bold")
    //         .style("font-size", "21px")
    //         .style("fill", "black")
    //         .text(d => d);

        
    //     }
    //   });

    t.on("end", () => {
        g.selectAll(".bubble-text").remove(); // Remove textos anteriores
      
        


        if (!focus.children) {
          // Folha (nível 2)
          const info = [
            `${focus.data.cargo}`,
            `${focus.data.genero}`,
            `Número de pessoas: ${focus.data.num_pessoas}`,
            `Média salarial: R$${focus.data.salario_medio.toFixed(2)}`,
            `Salário Mínimo: R$${focus.data.salario_min.toFixed(2)}`,
            `Salário Máximo: R$${focus.data.salario_max.toFixed(2)}`
          ];
      
          g.append("g")
            .attr("class", "bubble-text")
            .attr("transform", `translate(${(focus.x - view[0]) * (width/view[2])}, ${(focus.y - view[1]) * (width/view[2])})`)
            .selectAll("text")
            .data(info)
            .join("text")
            .attr("y", (d, i) => (i - info.length/2) * 50)
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", "21px")
            .style("fill", "black")
            .text(d => d);
      
        } else if (focus.depth === 1) {
            // Mostrar informações específicas dentro de cada bolha de gênero
          
            const total = d3.sum(focus.children, d => d.data.num_pessoas); // Total de pessoas no cargo
            
            const textGroup = g.append("g").attr("class", "bubble-text");
          
            const linesPerBubble = focus.children.flatMap(d => {
              const proporcao = ((d.data.num_pessoas / total) * 100).toFixed(1);
              return [
                { ...d, line: d.data.cargo, offset: -30 },  // Cargo (primeira linha, acima)
                { ...d, line: d.data.genero, offset: 0},
                { ...d, line: `${d.data.num_pessoas} pessoas`, offset: 20 },  // Número de pessoas
                { ...d, line: `${proporcao}% do total `, offset: 40 },  // Proporção do gênero
              ];
            });
          
            textGroup.selectAll("text")
              .data(linesPerBubble)
              .join("text")
                .attr("transform", d => {
                  const k = width / view[2];
                  return `translate(${(d.x - view[0]) * k}, ${(d.y - view[1]) * k + d.offset})`;
                })
                .attr("text-anchor", "middle")
                .style("font-weight", "bold")
                .style("font-size", "16px")
                // .style("fill", d => d.data.genero === "Feminino" ? "#C71585" : "#1E90FF")  // Rosa para feminino, azul para masculino
                .style("fill", "black")
                .text(d => d.line);
          }
          
          
      });
    }


    // 4. Interação entre texto e gráfico
    d3.selectAll(".highlight-area_men")
        .on("mouseover", function() {
            const area = d3.select(this).attr("data-area");
            
            // Destacar apenas os círculos daquela área
            g.selectAll("circle")
                .transition()
                .duration(300)
                .style("opacity", d => d.data && d.data.genero === area ? 3 : 0.5)
                .attr("stroke", d => d.data && d.data.genero === area ? "black" : "gray")
                .attr("stroke-width", d => d.data && d.data.genero === area ? 2 : 1)
                .attr("fill", d => d.data && d.data.genero === area
                    ? "#66b3ff" // Escurece o tom de azul para os círculos da área
                    :d.originalFill   // Mantém a cor original para os outros círculos
                )
                d3.select(".label-" + d.data.name.replace(/\s+/g, "-")).style("font-weight", "bold");
        })
        .on("mouseout", function() {
            // Restaurar a opacidade normal
            g.selectAll("circle")
                .transition()
                .duration(200)
                .style("opacity", 1)
                .attr("stroke", "#666")
                .attr("stroke-width", 1)
                .attr("fill", function(d) {
                    return d.originalFill ;  // Mantém a cor original ao sair
                });;
        });


        // 4. Interação entre texto e gráfico
    d3.selectAll(".highlight-area_women")
    .on("mouseover", function() {
        const area = d3.select(this).attr("data-area");
        
        // Destacar apenas os círculos daquela área
        g.selectAll("circle")
            .transition()
            .duration(300)
            .style("opacity", d => d.data && d.data.genero === area ? 3 : 0.5)
            .attr("stroke", d => d.data && d.data.genero === area ? "black" : "gray")
            .attr("stroke-width", d => d.data && d.data.genero === area ? 2 : 1)
            .attr("fill", d => d.data && d.data.genero === area
                ? "#ff73b9" // Escurece o tom de azul para os círculos da área
                :d.originalFill   // Mantém a cor original para os outros círculos
            );
    })
    .on("mouseout", function() {
        // Restaurar a opacidade normal
        g.selectAll("circle")
            .transition()
            .duration(200)
            .style("opacity", 1)
            .attr("stroke", "#666")
            .attr("stroke-width", 1)
            .attr("fill", function(d) {
                return d.originalFill ;  // Mantém a cor original ao sair
            });;
    });



  }
  

function vazio(){
    clean();
}
  

window.drawPyr = drawPyr;
window.salarioGenderProp = salarioGenderProp;
window.activationFunctions = [
    drawBubbleChart, // index 0
    drawPyr,
    salarioGenderProp, // index 1
    ensinoGenderProp, // index 2 — ou outra, se quiser criar um draw3()
    ensinoGenderAbsBar, // index 3
    experienciaGenderProp,
    experienciaGenderAbsBar,
    nivelGenderProp, 
    nivelGenderAbsBar, // index 4
    wordCloud, 
    vazio
];






