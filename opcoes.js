
let volumeMusica = document.getElementById("volumeMusica");
let volumeEfeitos = document.getElementById("volumeEfeitos");
let efeitos = document.getElementById("efeitos");

volumeMusica.value = localStorage.getItem("volumeMusica") || 70;
volumeEfeitos.value = localStorage.getItem("volumeEfeitos") || 70;

efeitos.checked = localStorage.getItem("audioAtivo") !== "false";

volumeMusica.addEventListener("input", function() {
    localStorage.setItem("volumeMusica", volumeMusica.value);
});

volumeEfeitos.addEventListener("input", function() {
    localStorage.setItem("volumeEfeitos", volumeEfeitos.value);
});

efeitos.addEventListener("change", function() {
    localStorage.setItem("audioAtivo", efeitos.checked);
});
