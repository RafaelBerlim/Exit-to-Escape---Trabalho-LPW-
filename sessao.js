(function () {
    'use strict';
    let logado = false;
    try { logado = !!sessionStorage.getItem('usuarioAtual'); } catch (e) {}
    if (!logado) window.location.replace('login.html');
})();