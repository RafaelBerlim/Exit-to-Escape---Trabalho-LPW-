const lanterna = document.getElementById("lanterna");
const objetivo = document.getElementById("objetivoTexto");
const status = document.getElementById("statusObjetivo");

lanterna.addEventListener("click", function() {

    objetivo.textContent = "Lanterna encontrada!";
    status.textContent = "Missão concluída";

    lanterna.style.display = "none";

});
