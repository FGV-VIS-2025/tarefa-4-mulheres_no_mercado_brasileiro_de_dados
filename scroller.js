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
        let pos = window.pageYOffset;
        let sectionIndex = 0;


        // Usa getBoundingClientRect().top para ver a distância do topo da seção até o topo da tela.Quando essa distância for menor que metade da altura da tela (window.innerHeight * 0.5), considera que essa é a seção "ativa".
        sections.each(function(d, i) {
            let top = this.getBoundingClientRect().top;
            if (top < window.innerHeight * 0.5) {
                sectionIndex = i;
            }
        });


        //se o usuário entrou em uma nova seção, Atualiza o `currentIndex`, Dispara o evento active informando qual seção ficou ativa
        if (sectionIndex !== currentIndex) {
            currentIndex = sectionIndex;
            sections.classed("active", (d, i) => i === currentIndex);
            dispatch.call("active", this, currentIndex);
        }
    }

    // Permite que o usuário do scroller() defina funções que devem ser chamadas quando eventos forem disparados (como active).
    scroll.on = function(event, callback) {
        dispatch.on(event, callback);
    };

    return scroll;
}

//scroll() ativa o sistema de scroll, associando o comportamento ao window
let scroll = scroller().on("active", function(index) {
    console.log("Scrolled to section:", index);
});
scroll();


//Com isso podemos associar diferentes draw functions ao índice da seção