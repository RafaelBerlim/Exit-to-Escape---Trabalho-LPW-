
let modal = document.getElementById("modal-sobre");
let abrir = document.getElementById("abrir-sobre");
let fechar = document.getElementById("fechar-sobre");

abrir.addEventListener("click", function() {
    modal.showModal();
});

fechar.addEventListener("click", function() {
    modal.close();
});
