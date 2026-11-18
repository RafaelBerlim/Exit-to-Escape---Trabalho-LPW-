
let ranking = [];

try {
    ranking = JSON.parse(localStorage.getItem("ranking")) || [];
} catch (e) {
    ranking = [];
}

let lista = document.getElementById("lista-ranking");
let mensagem = document.getElementById("sem-resultados");

if (ranking.length === 0) {
    mensagem.textContent = "Ainda não existem pontuações. Seja o primeiro a escapar!";
} else {
    ranking.forEach(function(jogador, i) {
        let linha = document.createElement("tr");

        let posicao = document.createElement("td");
        let nome = document.createElement("td");
        let personagem = document.createElement("td");
        let pontos = document.createElement("td");

        posicao.textContent = i + 1;
        nome.textContent = jogador.usuario;
        personagem.textContent = jogador.personagem;
        pontos.textContent = jogador.pontuacao;

        linha.appendChild(posicao);
        linha.appendChild(nome);
        linha.appendChild(personagem);
        linha.appendChild(pontos);

        lista.appendChild(linha);
    });
}
