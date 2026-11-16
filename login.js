(function () {
    'use strict';

    // "Banco de dados": lista de contas em localStorage. Sessão atual: sessionStorage.
    const CHAVE_CONTAS = 'contas';
    const CHAVE_SESSAO = 'usuarioAtual';
    const REGEX_USUARIO = /^[A-Za-z0-9_]{3,16}$/;
    const SENHA_MIN = 4;

    const $ = function (id) { return document.getElementById(id); };
    const el = {
        form: $('form-conta'), usuario: $('usuario'), senha: $('senha'),
        confirma: $('confirma'), campoConfirma: $('campo-confirma'),
        mostrar: $('mostrar'), mensagem: $('mensagem'), enviar: $('btn-enviar'),
        abas: Array.prototype.slice.call(document.querySelectorAll('.aba')),
        transicao: $('transicao'), transicaoNome: $('transicao-nome')
    };

    let modo = 'entrar';
    let ocupado = false;

    function lerContas() {
        try {
            const c = JSON.parse(localStorage.getItem(CHAVE_CONTAS));
            return Array.isArray(c) ? c : [];
        } catch (e) { return []; }
    }

    function salvarContas(contas) {
        try {
            localStorage.setItem(CHAVE_CONTAS, JSON.stringify(contas));
            return true;
        } catch (e) { return false; }
    }

    function chaveUsuario(nome) { return nome.trim().toLowerCase(); }

    function acharConta(contas, nome) {
        const k = chaveUsuario(nome);
        for (let i = 0; i < contas.length; i++) if (contas[i].chave === k) return contas[i];
        return null;
    }

    function novoSal() {
        const a = new Uint8Array(12);
        if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a);
        else for (let i = 0; i < a.length; i++) a[i] = Math.floor(Math.random() * 256);
        return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    }

    function hashSenha(senha, sal) {
        const txt = sal + ':' + senha;
        if (window.crypto && crypto.subtle && window.TextEncoder) {
            return crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt)).then(function (buf) {
                return Array.prototype.map.call(new Uint8Array(buf), function (b) {
                    return ('0' + b.toString(16)).slice(-2);
                }).join('');
            });
        }
        let h = 5381;
        for (let i = 0; i < txt.length; i++) h = ((h << 5) + h + txt.charCodeAt(i)) | 0;
        return Promise.resolve('f' + (h >>> 0).toString(16));
    }

    function mostrarMsg(txt, ok) {
        el.mensagem.textContent = txt;
        el.mensagem.className = ok ? 'ok' : '';
        if (txt && !ok) {
            void el.mensagem.offsetWidth;
            el.mensagem.classList.add('tremer');
        }
    }

    function trocarAba(novo) {
        modo = novo;
        el.abas.forEach(function (a) { a.classList.toggle('ativa', a.dataset.aba === novo); });
        el.campoConfirma.hidden = novo !== 'criar';
        el.enviar.textContent = novo === 'criar' ? 'Criar conta' : 'Entrar';
        el.senha.value = '';
        el.confirma.value = '';
        mostrarMsg('');
    }

    function criarConta() {
        const nome = el.usuario.value.trim();
        const senha = el.senha.value;

        if (!REGEX_USUARIO.test(nome)) {
            mostrarMsg('Usuário: 3 a 16 caracteres, só letras, números e _ (sem espaços).');
            return Promise.resolve();
        }
        if (senha.length < SENHA_MIN) {
            mostrarMsg('A senha precisa ter pelo menos ' + SENHA_MIN + ' caracteres.');
            return Promise.resolve();
        }
        if (senha !== el.confirma.value) {
            mostrarMsg('As senhas não são iguais.');
            return Promise.resolve();
        }
        if (acharConta(lerContas(), nome)) {
            mostrarMsg('Esse nome de usuário já existe. Escolha outro.');
            return Promise.resolve();
        }

        const sal = novoSal();
        return hashSenha(senha, sal).then(function (hash) {
            // relê o "banco" para não sobrescrever uma conta criada em outra aba
            const contas = lerContas();
            if (acharConta(contas, nome)) {
                mostrarMsg('Esse nome de usuário já existe. Escolha outro.');
                return;
            }
            contas.push({ chave: chaveUsuario(nome), nome: nome, sal: sal, hash: hash, criado: Date.now() });
            if (!salvarContas(contas)) {
                mostrarMsg('Não foi possível salvar a conta (armazenamento do navegador bloqueado).');
                return;
            }
            trocarAba('entrar');
            mostrarMsg('Conta criada! Agora entre com a sua senha.', true);
            el.senha.focus();
        });
    }

    function entrar() {
        const nome = el.usuario.value.trim();
        const senha = el.senha.value;

        if (!nome || !senha) {
            mostrarMsg('Digite o usuário e a senha.');
            return Promise.resolve();
        }
        const conta = acharConta(lerContas(), nome);
        if (!conta) {
            mostrarMsg('Usuário não encontrado. Crie uma conta primeiro.');
            return Promise.resolve();
        }
        return hashSenha(senha, conta.sal).then(function (hash) {
            if (hash !== conta.hash) { mostrarMsg('Senha incorreta.'); return; }
            mostrarMsg('');
            try { sessionStorage.setItem(CHAVE_SESSAO, conta.nome); } catch (e) {}
            mostrarTransicao(conta.nome);
        });
    }

    function mostrarTransicao(nome) {
        el.transicaoNome.textContent = nome;
        el.transicao.classList.add('ativa');
        setTimeout(function () { window.location.href = 'index.html'; }, 3200);
    }

    el.abas.forEach(function (a) {
        a.addEventListener('click', function () { if (!ocupado) trocarAba(a.dataset.aba); });
    });

    el.mostrar.addEventListener('change', function () {
        const tipo = el.mostrar.checked ? 'text' : 'password';
        el.senha.type = tipo;
        el.confirma.type = tipo;
    });

    el.form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (ocupado) return;
        ocupado = true;
        el.enviar.disabled = true;
        const p = modo === 'criar' ? criarConta() : entrar();
        p.then(function () {}, function () { mostrarMsg('Algo deu errado. Tente novamente.'); })
         .then(function () { ocupado = false; el.enviar.disabled = false; });
    });

    el.usuario.focus();
})();