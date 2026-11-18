let participantes = {
    rafael: {
        nome: "Rafael Berlim Silva Melo",
        descricao: "Responsável pela maior parte do desenvolvimento da primeira fase do jogo, incluindo a criação dos objetos, elementos gráficos, efeitos sonoros, características do jogador e mecânicas de jogabilidade. Também desenvolveu o sistema de autenticação, com as funcionalidades de criação de contas e login dos jogadores, além de ter feito a seleção de personagens."
    },

    victor: {
        nome: "Victor Oliveira",
        descricao: "Responsável pelo desenvolvimento da página de opções e pela implementação da lógica de configuração dos recursos sonoros do jogo. Também desenvolveu a página de ranking, a página informativa (About), a jogabilidade mobile e a página de créditos dos participantes."
    },

    vitugo: {
        nome: "Victor Hugo",
        descricao: "Responsável pela elaboração da proposta narrativa e pela documentação conceitual do jogo, incluindo a história, os personagens, as mecânicas previstas e a estrutura dos capítulos. Também desenvolveu a seção de apresentação do projeto, com carregamento dinâmico de informações por meio de AJAX."
    }
};

let botoes = document.querySelectorAll(".nome-participante");
let modal = document.getElementById("modal-participante");
let nomeModal = document.getElementById("nome-modal");
let descricaoModal = document.getElementById("descricao-modal");
let fecharModal = document.getElementById("fechar-modal");

botoes.forEach(function(botao) {
    botao.addEventListener("click", function() {
        let participante = participantes[botao.dataset.participante];

        nomeModal.textContent = participante.nome;
        descricaoModal.textContent = participante.descricao;

        modal.showModal();
    });
});

fecharModal.addEventListener("click", function() {
    modal.close();
});