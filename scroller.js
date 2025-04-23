// scroller.js
// Controla o efeito de scroll interativo:
// Detecta em qual “passo” da rolagem o usuário está (.step).
// Emite eventos active e progress, usados para acionar funções que atualizam os gráficos dinamicamente.


function scroller() {

    //Dispara o evento chamado active (quando o usuário entrar em uma nova seção)
    let dispatch = d3.dispatch("active"); 

    // Seleciona todas as seções com a classe .step (blocos de texto que o usuario rola) e depois armazena o indice da seção atual
    let sections = d3.selectAll(".step");
    let currentIndex = -1;

    // Associa a função position() ao evento de scroll da janela.
    function scroll() {
        d3.select(window)
            .on("scroll.scroller", position);

        position();
    }

    //função que detecta em qual seção da tela o usuário está agora
    function position() {
        let pos = window.pageYOffset; // distância do topo da janela atual até o topo do documento.
        let sectionIndex = 0;  // seção ativa no momento
        let minDist = Infinity;  //usado para comparar qual seção está mais próxima do centro da tela

        //Se o usuário está no topo da página, força o sectionIndex para 0.
        if (pos === 0) {
            sectionIndex = 0;
        }   
        // Para cada step, calcula sua posição relativa à tela. Quando o top da seção fica acima de 50% da altura da tela, ela é considerada "ativa".  Isso é o que sincroniza a rolagem com os gráficos.
            else {
            sections.each(function(d, i) {
                let top = this.getBoundingClientRect().top;
                if (top < window.innerHeight * 0.5) {
                    sectionIndex = i;
                }
            });
        }

        // se o usuário entrou em uma nova seção, Atualiza o `currentIndex`, Dispara o evento active informando qual seção ficou ativa
        if (sectionIndex !== currentIndex) {
            currentIndex = sectionIndex;
            sections.classed("active", (d, i) => i === currentIndex);
            dispatch.call("active", this, currentIndex);
        }
    }

    // Permite chamar scroll.on('active', callback) para definir o que deve acontecer quando uma nova seção fica ativa.
    scroll.on = function(event, callback) {
        dispatch.on(event, callback);
        return scroll;
    };

    scroll.container = function(value) {
        if (!arguments.length) return container;
        container = value;
        return scroll;
    };

    return scroll;
}



// Cria uma instância do scroller.
let scroll = scroller().container(d3.select('#graphic'));
//Chama scroll() para ativar o sistema.
scroll();


//Guarda o índice anterior e atual, para saber se rolou para frente ou para trás.
let lastIndex = -1;
let activeIndex = 0;


// Quando uma nova seção fica ativa:
scroll.on('active', function(index) {

    //   - Atualiza a opacidade das seções para destacar a atual.
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', (d, i) => i === index ? 1 : 0.1);

    //   - Ativa as funções de visualização correspondentes
    activeIndex = index;
    let sign = activeIndex - lastIndex < 0 ? -1 : 1;
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    });

    lastIndex = activeIndex;
});


//Com isso podemos associar diferentes draw functions ao índice da seção