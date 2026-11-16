(function () {
    'use strict';

    const LARGURA = 960, ALTURA = 540;
    const MUNDO_W = 3000, MUNDO_H = 1240;

    const CHAO = { L2: 360, L1: 760, L0: 1160 };
    const NIVEIS = [CHAO.L2, CHAO.L1, CHAO.L0];
    const TETO = { 360: 0, 760: 400, 1160: 800 };

    const TEMPO_TOTAL = 10 * 60;
    const BATERIA_DURACAO = 2 * 60;
    const ESTAMINA_DRENO = 1 / 25;
    const ESTAMINA_RECUPERA = 1 / 8;
    const MONSTRO_TEMPO_LUZ = 0.9;
    const MONSTRO_VEL_BASE = 85;
    const BATERIA_GANHO = 0.6;
    const MAX_ITENS = 3;
    const GRAVIDADE = 1900, VEL_ANDAR = 190, VEL_PULO = 640, VEL_ESCADA = 150;
    const CODIGO_COFRE = '0317';
    const TOTAL_PAPEIS = 7;

    const ITENS = {
        chaveLatao:   { nome: 'Chave de Latão',  dica: 'Tem o número 204 gravado.', cor: '#d4a72c' },
        chavePequena: { nome: 'Chave Pequena',   dica: 'Parece servir em um armário.', cor: '#9fb0b8' },
        chavePrata:   { nome: 'Chave Prateada',  dica: 'Tem o número 206 gravado.', cor: '#dfe4e7' },
        fusivel:      { nome: 'Fusível',         dica: 'Deve caber em algum quadro de força.', cor: '#e8e2c8' },
        peDeCabra:    { nome: 'Pé de Cabra',     dica: 'Bom para arrancar tábuas.', cor: '#8a9aa6' },
        chaveSaida:   { nome: 'Chave da Saída',  dica: 'Pesada, com a palavra SAÍDA gravada.', cor: '#d61111' },
        bateria:      { nome: 'Bateria',         dica: 'Selecione e aperte E para recarregar a lanterna.', cor: '#3fbf4f' }
    };

    const SECOES = {
        360: [
            { x1: 0, x2: 650, cor: '#5b3a30' },
            { x1: 650, x2: 1850, cor: '#4c4640' },
            { x1: 1850, x2: 3000, cor: '#563a36' }
        ],
        760: [
            { x1: 0, x2: 1100, cor: '#3e4a46' },
            { x1: 1100, x2: 2200, cor: '#4c403a' },
            { x1: 2200, x2: 3000, cor: '#5a3c36' }
        ],
        1160: [
            { x1: 0, x2: 1100, cor: '#563a32' },
            { x1: 1100, x2: 2100, cor: '#5c3a2c' },
            { x1: 2100, x2: 3000, cor: '#3c4046' }
        ]
    };

    const BORDAS = [
        { n: 360, x: 650 }, { n: 360, x: 1850 },
        { n: 760, x: 1100 }, { n: 760, x: 2200 },
        { n: 1160, x: 1100 }, { n: 1160, x: 2100 }
    ];

    const LADDERS = [
        { x: 1500, topo: CHAO.L2, base: CHAO.L1 },
        { x: 2000, topo: CHAO.L1, base: CHAO.L0 }
    ];

    const LAMPADAS = [
        { n: 360, x: 180, t: 'pisca' }, { n: 360, x: 900, t: 'fraca' },
        { n: 360, x: 1700, t: 'pisca' }, { n: 360, x: 2500, t: 'fraca' },
        { n: 760, x: 300, t: 'fraca' }, { n: 760, x: 1300, t: 'pisca' },
        { n: 760, x: 2300, t: 'fraca' }, { n: 760, x: 2750, t: 'pisca' },
        { n: 1160, x: 300, t: 'fraca' }, { n: 1160, x: 750, t: 'energia' },
        { n: 1160, x: 1300, t: 'energia' }, { n: 1160, x: 1750, t: 'energia' },
        { n: 1160, x: 2450, t: 'fraca' }
    ];

    const JANELAS = [
        { n: 360, x: 330 }, { n: 360, x: 1250 }, { n: 360, x: 2650 },
        { n: 760, x: 250 }, { n: 760, x: 1900 }, { n: 760, x: 2650 },
        { n: 1160, x: 700 }, { n: 1160, x: 1700 }, { n: 1160, x: 2500 }
    ];

    const QUADROS = [
        { n: 360, x: 480, w: 50, h: 70, dy: 225 }, { n: 360, x: 780, w: 56, h: 74, dy: 225 },
        { n: 360, x: 1650, w: 50, h: 70, dy: 225 }, { n: 360, x: 2100, w: 56, h: 74, dy: 225 },
        { n: 760, x: 700, w: 56, h: 74, dy: 240 }, { n: 760, x: 1250, w: 50, h: 70, dy: 225 },
        { n: 760, x: 1750, w: 56, h: 74, dy: 225 }, { n: 760, x: 2400, w: 50, h: 70, dy: 225 },
        { n: 1160, x: 300, w: 56, h: 74, dy: 225 }, { n: 1160, x: 1150, w: 50, h: 70, dy: 225 },
        { n: 1160, x: 1500, w: 56, h: 74, dy: 225 }, { n: 1160, x: 2200, w: 50, h: 70, dy: 225 }
    ];

    const PAPEIS = {
        p1: {
            titulo: 'Diário de Helena Duarte',
            texto: '14 de março de 1987\n\nCheguei ao Hotel Alvorada para escrever sobre os hóspedes que desaparecem sem deixar rastro. Três nomes em dois anos, e todos jantaram no restaurante na última noite.\n\nO gerente, Sr. Otávio Brandão, sorri demais. Pediram que eu ficasse no quarto 204. Ouvi passos no corredor às três da manhã, mas ninguém passou pela minha porta.'
        },
        p2: {
            titulo: 'Bilhete da camareira Cida',
            texto: 'O Sr. Brandão mandou lacrar o escritório e proibiu todo mundo de entrar lá.\n\nOs lençóis do quarto 105 voltam sempre manchados, e ele diz que é vinho. Vinho não tem esse cheiro.\n\nVou embora amanhã. Quem ficar, que reze.\n\n— Cida'
        },
        p3: {
            titulo: 'Carta não enviada (quarto 206)',
            texto: 'Querida Lúcia,\n\nO hotel é lindo, apesar de estranho. O gerente insistiu em me servir um vinho "da casa". Tinha um gosto amargo, mas não quis ser mal-educado. Já estou com muito sono...\n\nSe esta carta nunca chegar até você, é porque eu não consegui sair do quarto.\n\n— Armando'
        },
        p4: {
            titulo: 'Livro de registros (quarto 105)',
            texto: 'Catorze nomes riscados com caneta vermelha, entre 1985 e 1987.\n\nAo lado de cada um, a mesma anotação: "pago em dinheiro, bagagem retida".\n\nA última linha ainda está legível:\n"H. Duarte — quarto 204 — hóspede de honra".'
        },
        p5: {
            titulo: 'Anotação do Sr. Otávio Brandão',
            texto: 'O hotel estava afundado em dívidas. Hóspedes sem família eram dinheiro fácil, e ninguém jamais perguntava por eles.\n\nA jornalista descobriu tudo. À 03:17 da madrugada, resolvi o problema.\n\nCortei a energia e tranquei todas as portas. Se alguém ler isto: o hotel não deixa ninguém sair.'
        },
        p6: {
            titulo: 'Jornal da Serra — 18/03/1987',
            texto: 'HOTEL ALVORADA FECHA AS PORTAS\n\nA repórter Helena Duarte, hospedada no estabelecimento, não é vista desde a madrugada do dia 17. O gerente afirma que a jornalista partiu sem pagar a conta.\n\nA polícia não encontrou nenhum vestígio.'
        },
        p7: {
            titulo: 'Última página do diário de Helena',
            texto: 'Se você está lendo isto, ele ainda anda pelos corredores. Eu o ouvi arrastar a chave pelas paredes.\n\nNão confie nas luzes. Não confie no silêncio.\n\nEncontre a saída antes que o hotel termine de contar o tempo.\n\n— H.D.'
        }
    };

    const $ = (id) => document.getElementById(id);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const pad = (n) => (n < 10 ? '0' + n : '' + n);
    const fmt = (t) => { t = Math.max(0, Math.ceil(t)); return pad(Math.floor(t / 60)) + ':' + pad(t % 60); };
    const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
    function R(c, x, y, w, h, cor) { c.fillStyle = cor; c.fillRect(x, y, w, h); }

    const canvas = $('jogo');
    const ctx = canvas.getContext('2d');
    const csusto = $('canvas-susto').getContext('2d');
    const luzCanvas = document.createElement('canvas');
    luzCanvas.width = LARGURA; luzCanvas.height = ALTURA;
    const lctx = luzCanvas.getContext('2d');
    let fundo = null;

    const el = {
        hud: $('hud'), tempo: $('tempo'), bateria: $('bateria'),
        batNivel: $('bateria-nivel'), batPct: $('bateria-pct'),
        estamina: $('estamina'), estNivel: $('estamina-nivel'), estPct: $('estamina-pct'),
        gameoverTexto: $('gameover-texto'),
        papeis: $('papeis'), msg: $('mensagem'), dica: $('dica-interacao'),
        itemNome: $('item-nome'), vinheta: $('vinheta'),
        slots: Array.prototype.slice.call(document.querySelectorAll('.slot')),
        telaInicio: $('tela-inicio'), telaPausa: $('tela-pausa'), telaSusto: $('tela-susto'),
        telaGameover: $('tela-gameover'), telaParabens: $('tela-parabens'),
        telaTransicao: $('tela-transicao'), parabensTempo: $('parabens-tempo'),
        modalPapel: $('modal-papel'), papelTitulo: $('papel-titulo'), papelTexto: $('papel-texto'),
        modalCofre: $('modal-cofre'), visor: $('visor'), grade: $('grade-teclas'), cofreMsg: $('cofre-msg')
    };

    let actx = null, mestre = null, musica = null, efeitos = null, bufRuido = null;

    function iniciarAudio() {
        if (actx) { if (actx.state === 'suspended') actx.resume(); return; }
        try {
            actx = new (window.AudioContext || window.webkitAudioContext)();
            mestre = actx.createGain();
            musica = actx.createGain();
            efeitos = actx.createGain();

        mestre.gain.value = 1;
        musica.gain.value = (Number(localStorage.getItem("volumeMusica") || 70)) / 100;
        efeitos.gain.value = (Number(localStorage.getItem("volumeEfeitos") || 70)) / 100;

if (localStorage.getItem("audioAtivo") === "false") {
    musica.gain.value = 0;
    efeitos.gain.value = 0;
}

            mestre.connect(actx.destination);
            musica.connect(mestre);
            efeitos.connect(mestre);
            bufRuido = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
            const d = bufRuido.getChannelData(0);
            for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

            const g = actx.createGain(); g.gain.value = 0.05;
            const f = actx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 180;
            [55, 55.7, 82.4].forEach(function (fr) {
                const o = actx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = fr;
                o.connect(f); o.start();
            });
            f.connect(g); g.connect(musica);
            agendarRangidos();
        } catch (e) { actx = null; }
    }

    function tom(freq, dur, tipo, vol, fim, atraso) {
        if (!actx) return;
        const t0 = actx.currentTime + (atraso || 0);
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = tipo || 'sine';
        o.frequency.setValueAtTime(freq, t0);
        if (fim) o.frequency.exponentialRampToValueAtTime(fim, t0 + dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.03, dur / 3));
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(efeitos); o.start(t0); o.stop(t0 + dur + 0.05);
    }

    function ruido(dur, vol, freq, tipoFiltro, atraso) {
        if (!actx) return;
        const t0 = actx.currentTime + (atraso || 0);
        const s = actx.createBufferSource(); s.buffer = bufRuido; s.loop = true;
        const f = actx.createBiquadFilter(); f.type = tipoFiltro || 'lowpass'; f.frequency.value = freq || 800;
        const g = actx.createGain();
        g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        s.connect(f); f.connect(g); g.connect(efeitos); s.start(t0); s.stop(t0 + dur + 0.05);
    }

    const SOM = {
        passo: function () { ruido(0.07, 0.07, 260, 'lowpass'); },
        pegar: function () { tom(660, 0.08, 'square', 0.05); tom(990, 0.12, 'square', 0.05, null, 0.07); },
        bateria: function () { tom(300, 0.15, 'sawtooth', 0.05, 600); tom(600, 0.2, 'sine', 0.06, 900, 0.12); },
        porta: function () { tom(130, 0.7, 'sawtooth', 0.07, 55); ruido(0.5, 0.06, 600, 'bandpass'); },
        erro: function () { tom(110, 0.25, 'square', 0.08, 80); },
        clique: function () { tom(1200, 0.03, 'square', 0.04); },
        papel: function () { ruido(0.25, 0.08, 2500, 'highpass'); },
        rangido: function () { tom(160, 1.1, 'sawtooth', 0.035, 70); ruido(0.8, 0.03, 500, 'bandpass'); },
        sussurro: function () { ruido(1.4, 0.07, 1800, 'bandpass'); tom(220, 1.2, 'sine', 0.03, 150); },
        energia: function () { tom(60, 1.2, 'sawtooth', 0.1, 240); ruido(0.8, 0.08, 1200, 'lowpass'); tom(880, 0.15, 'square', 0.05, null, 1.1); },
        batida: function () { tom(55, 0.18, 'sine', 0.35, 40); tom(50, 0.2, 'sine', 0.3, 38, 0.22); },
        vitoria: function () { [523, 659, 784, 1047].forEach(function (f, i) { tom(f, 0.5, 'triangle', 0.08, null, i * 0.18); }); },
        susto: function () { ruido(2.0, 0.9, 2500, 'highpass'); tom(900, 2.0, 'sawtooth', 0.35, 180); tom(1400, 2.0, 'square', 0.18, 250); tom(60, 2.2, 'sawtooth', 0.4, 40); }
    };
    function som(nome) { try { if (actx && SOM[nome]) SOM[nome](); } catch (e) {} }

    function agendarRangidos() {
        setTimeout(function () {
            if (modo === 'jogando') som('rangido');
            agendarRangidos();
        }, 9000 + Math.random() * 14000);
    }

    let modo = 'inicio';
    let jogo = null;
    let plataformas = [];
    let tSusto = 0;
    let cofreAtual = null;
    let codigoDigitado = '';
    const cam = { x: 0, y: 0 };
    const mouse = { x: LARGURA * 0.75, y: ALTURA / 2, ativo: false };
    const teclas = {};

    function criarPlataformas() {
        const P = NIVEIS.map(function (y) { return { x1: 0, x2: MUNDO_W, y: y }; });
        P.push({ x1: 40, x2: 200, y: CHAO.L2 - 40 });
        P.push({ x1: 365, x2: 455, y: CHAO.L2 - 36 });
        P.push({ x1: 990, x2: 1040, y: CHAO.L2 - 50 });
        P.push({ x1: 1050, x2: 1170, y: CHAO.L2 - 125 });
        P.push({ x1: 1950, x2: 2040, y: CHAO.L2 - 36 });
        P.push({ x1: 2230, x2: 2400, y: CHAO.L2 - 40 });
        P.push({ x1: 2410, x2: 2530, y: CHAO.L2 - 130 });
        P.push({ x1: 600, x2: 760, y: CHAO.L1 - 40 });
        P.push({ x1: 2560, x2: 2640, y: CHAO.L1 - 36 });
        P.push({ x1: 450, x2: 650, y: CHAO.L0 - 60 });
        P.push({ x1: 1300, x2: 1400, y: CHAO.L0 - 40 });
        P.push({ x1: 1560, x2: 1660, y: CHAO.L0 - 40 });
        P.push({ x1: 1820, x2: 1920, y: CHAO.L0 - 40 });
        return P;
    }

    function criarObjetos() {
        const O = [];
        const add = function (o) { o.alc = o.alc || 55; O.push(o); return o; };
        const C2 = CHAO.L2, C1 = CHAO.L1, C0 = CHAO.L0;

        add({ tipo: 'inspecionar', x: 120, y: C2 - 40, rot: 'Examinar cama', texto: 'Os lençóis ainda estão quentes. Alguém dormiu aqui... há pouco tempo?' });
        add({ tipo: 'container', sub: 'gaveta', nome: 'a gaveta', x: 300, y: C2, da: ['chaveLatao'] });
        add({ tipo: 'papel', id: 'p1', x: 410, y: C2 - 36, alc: 60 });
        add({ tipo: 'container', sub: 'armario', nome: 'o armário', x: 540, y: C2, da: ['bateria'] });
        add({ tipo: 'porta', id: 'd1', x: 650, y: C2, req: 'chaveLatao', placa: '204',
              dica: 'A porta do quarto está trancada. A chave deve estar em algum lugar aqui dentro.' });
        add({ tipo: 'pegavel', item: 'fusivel', x: 1110, y: C2 - 125 });
        add({ tipo: 'papel', id: 'p2', x: 1330, y: C2, alc: 60 });
        add({ tipo: 'pegavel', item: 'bateria', x: 1650, y: C2 });
        add({ tipo: 'porta', id: 'd2', x: 1850, y: C2, req: 'chavePrata', placa: '206',
              dica: 'Quarto 206 trancado. Precisa de uma chave com esse número.' });
        add({ tipo: 'papel', id: 'p3', x: 1995, y: C2 - 36, alc: 60 });
        add({ tipo: 'pegavel', item: 'peDeCabra', x: 2470, y: C2 - 130 });
        add({ tipo: 'pegavel', item: 'bateria', x: 2700, y: C2 });

        add({ tipo: 'pegavel', item: 'bateria', x: 220, y: C1 });
        add({ tipo: 'cofre', x: 420, y: C1, alc: 60 });
        add({ tipo: 'papel', id: 'p5', x: 680, y: C1 - 40, alc: 60 });
        add({ tipo: 'tabuas', x: 1100, y: C1, req: 'peDeCabra',
              dica: 'Tábuas pregadas bloqueiam o escritório da gerência. Precisa de uma ferramenta para arrancá-las.' });
        add({ tipo: 'container', sub: 'gaveta', nome: 'a gaveta', x: 2420, y: C1, da: ['chavePequena'] });
        add({ tipo: 'papel', id: 'p4', x: 2600, y: C1 - 36, alc: 60 });
        add({ tipo: 'container', sub: 'armario', nome: 'o armário', x: 2800, y: C1, trancado: true, req: 'chavePequena',
              da: ['chavePrata', 'bateria'] });

        add({ tipo: 'quadroForca', x: 250, y: C0, alc: 60 });
        add({ tipo: 'papel', id: 'p6', x: 540, y: C0 - 60, alc: 60 });
        add({ tipo: 'inspecionar', x: 615, y: C0 - 60, rot: 'Examinar telefone', texto: 'O telefone da recepção está mudo. O fio foi arrancado da parede.' });
        add({ tipo: 'inspecionar', x: 900, y: C0, alc: 70, rot: 'Examinar relógio',
              texto: 'O relógio de parede está parado. Os ponteiros marcam 03:17.' });
        add({ tipo: 'papel', id: 'p7', x: 1350, y: C0 - 40, alc: 60 });
        add({ tipo: 'pegavel', item: 'bateria', x: 1480, y: C0 });
        add({ tipo: 'inspecionar', x: 2330, y: C0, alc: 60, rot: 'Examinar elevador', texto: 'O elevador está parado entre os andares. Das frestas vem um cheiro doce e azedo.' });
        add({ tipo: 'saida', x: 2900, y: C0, alc: 70 });
        return O;
    }

    function novoJogo() {
        plataformas = criarPlataformas();
        jogo = {
            p: { x: 235, y: CHAO.L2, vx: 0, vy: 0, dir: 1, noChao: true, coyote: 0, pulaBuf: 0,
                 escada: null, animT: 0, andando: false, passoT: 0 },
            inv: [null, null, null], sel: 0,
            tempo: TEMPO_TOTAL, bateria: 1, lanterna: true, energia: false, tEnergia: 0,
            estamina: 1, avisoEst: false,
            objetos: criarObjetos(), lidos: new Set(),
            alvo: null, aim: 0, flick: 1, flickT: 0,
            avisos: { 300: false, 120: false, 60: false }, batida: 0,
            monstro: null, tMonstro: 20, monstroVisto: false, tt: 0
        };
        atualizarCamera(0, true);
        atualizarInventario();
        atualizarHUD();
    }

    let msgTimer = null;
    function msg(txt, seg) {
        el.msg.textContent = txt;
        el.msg.classList.add('visivel');
        clearTimeout(msgTimer);
        msgTimer = setTimeout(function () { el.msg.classList.remove('visivel'); }, (seg || 3.4) * 1000);
    }

    function desenharIcone(c, id, x, y, s) {
        c.save(); c.translate(x, y); c.scale(s, s);
        const cor = ITENS[id].cor;
        if (id === 'bateria') {
            R(c, -6, -8, 12, 16, '#222'); R(c, -6, -8, 12, 5, cor); R(c, -2, -11, 4, 3, '#bbb');
            R(c, -1, 0, 2, 5, '#9a9');
        } else if (id.indexOf('chave') === 0) {
            c.strokeStyle = cor; c.lineWidth = 2.4;
            c.beginPath(); c.arc(-6, 0, 4.2, 0, Math.PI * 2); c.stroke();
            R(c, -2, -1.2, 15, 2.6, cor); R(c, 8, 1, 2.6, 5, cor); R(c, 12, 1, 2.2, 4, cor);
        } else if (id === 'fusivel') {
            R(c, -3.5, -9, 7, 18, 'rgba(225,225,200,0.9)');
            R(c, -4.5, -10, 9, 3, '#9a8a6a'); R(c, -4.5, 7, 9, 3, '#9a8a6a');
            c.strokeStyle = '#d6a030'; c.lineWidth = 1;
            c.beginPath(); c.moveTo(0, -7); c.lineTo(-2, -2); c.lineTo(2, 2); c.lineTo(0, 7); c.stroke();
        } else if (id === 'peDeCabra') {
            c.strokeStyle = cor; c.lineWidth = 3.2; c.lineCap = 'round';
            c.beginPath(); c.moveTo(-9, 9); c.lineTo(7, -7); c.quadraticCurveTo(11, -11, 6, -12); c.stroke();
            c.beginPath(); c.moveTo(-9, 9); c.lineTo(-12, 6); c.stroke();
        }
        c.restore();
    }

    function atualizarInventario() {
        el.slots.forEach(function (s, i) {
            const c = s.querySelector('canvas').getContext('2d');
            c.clearRect(0, 0, 44, 44);
            const id = jogo.inv[i];
            if (id) desenharIcone(c, id, 22, 22, 1.5);
            s.classList.toggle('ativo', i === jogo.sel);
        });
        const id = jogo.inv[jogo.sel];
        el.itemNome.textContent = id ? ITENS[id].nome : '';
    }

    function selecionar(i) {
        jogo.sel = clamp(i, 0, MAX_ITENS - 1);
        som('clique');
        atualizarInventario();
        const id = jogo.inv[jogo.sel];
        if (id && ITENS[id].dica) msg(ITENS[id].nome + ': ' + ITENS[id].dica, 2.6);
    }

    function adicionarItem(id) {
        const i = jogo.inv.indexOf(null);
        if (i < 0) return false;
        jogo.inv[i] = id;
        jogo.sel = i;
        atualizarInventario();
        return true;
    }

    function consumirSelecionado() {
        jogo.inv[jogo.sel] = null;
        atualizarInventario();
    }

    function soltarNoChao(id, x, y) {
        jogo.objetos.push({ tipo: 'pegavel', item: id, x: x, y: y, alc: 55 });
    }

    function soltarSelecionado() {
        const id = jogo.inv[jogo.sel];
        if (!id) { msg('Nenhum item selecionado.', 1.8); return; }
        consumirSelecionado();
        soltarNoChao(id, jogo.p.x, jogo.p.y);
        msg('Você soltou: ' + ITENS[id].nome + '.', 2);
    }

    function alvoUsaItem(o) {
        return o.tipo === 'porta' || o.tipo === 'tabuas' || o.tipo === 'quadroForca' ||
               o.tipo === 'saida' || (o.tipo === 'container' && o.trancado);
    }

    function usaBateriaAgora() {
        if (jogo.inv[jogo.sel] !== 'bateria') return false;
        const o = jogo.alvo;
        if (!o) return true;
        return alvoUsaItem(o) && jogo.bateria < 0.95;
    }

    function usarBateria() {
        if (jogo.bateria > 0.95) {
            som('erro');
            msg('A lanterna já está carregada. Guarde a bateria para depois.', 2.8);
            return;
        }
        consumirSelecionado();
        jogo.bateria = Math.min(1, jogo.bateria + BATERIA_GANHO);
        som('bateria');
        msg('Você trocou a bateria. A lanterna foi recarregada.', 3);
    }

    function rotulo(o) {
        switch (o.tipo) {
            case 'pegavel': return 'Pegar ' + (o.item === 'bateria' ? 'bateria' : ITENS[o.item].nome);
            case 'papel': return 'Ler papel';
            case 'container': return o.aberto ? null : (o.trancado ? 'Abrir ' + o.nome + ' (trancado)' : 'Abrir ' + o.nome);
            case 'porta': return o.aberta ? null : 'Porta trancada';
            case 'tabuas': return o.aberta ? null : 'Examinar tábuas';
            case 'cofre': return o.aberto ? null : 'Usar cofre';
            case 'quadroForca': return jogo.energia ? null : 'Examinar quadro de força';
            case 'saida': return 'Porta de saída';
            case 'inspecionar': return o.rot;
        }
        return null;
    }

    function atualizarAlvo() {
        const p = jogo.p;
        let melhor = null, md = 1e9;
        if (!p.escada) {
            for (let i = 0; i < jogo.objetos.length; i++) {
                const o = jogo.objetos[i];
                if (o.pego) continue;
                const dx = Math.abs(p.x - o.x);
                if (dx > o.alc) continue;
                if (Math.abs(p.y - o.y) > 75) continue;
                if (rotulo(o) === null) continue;
                if (dx < md) { md = dx; melhor = o; }
            }
        }
        jogo.alvo = melhor;
    }

    function interagir() {
        const o = jogo.alvo;
        if (usaBateriaAgora()) { usarBateria(); return; }
        if (!o) return;
        const sel = jogo.inv[jogo.sel];
        switch (o.tipo) {
            case 'pegavel':
                if (adicionarItem(o.item)) {
                    o.pego = true; som('pegar');
                    msg('Você pegou: ' + ITENS[o.item].nome + '. ' + ITENS[o.item].dica, 3.4);
                } else { som('erro'); msg('Inventário cheio (3/3). Solte um item com a tecla Q.', 3); }
                break;
            case 'papel': abrirPapel(o); break;
            case 'container': abrirContainer(o, sel); break;
            case 'porta': usarPorta(o, sel); break;
            case 'tabuas':
                if (sel === 'peDeCabra') {
                    o.aberta = true; som('porta');
                    msg('Você arranca as tábuas com o pé de cabra. O escritório da gerência está aberto.', 4);
                } else { som('erro'); msg(o.dica, 4); }
                break;
            case 'cofre': abrirCofre(o); break;
            case 'quadroForca':
                if (sel === 'fusivel') {
                    consumirSelecionado();
                    jogo.energia = true; jogo.tEnergia = 2;
                    som('energia');
                    msg('Energia restaurada! As luzes do térreo acendem e a fechadura eletrônica da saída volta a funcionar.', 5);
                } else {
                    som('erro');
                    msg('O quadro de força está com um encaixe vazio. Falta um fusível.', 3.6);
                }
                break;
            case 'saida':
                if (!jogo.energia) { som('erro'); msg('A fechadura eletrônica da saída está apagada. Sem energia, nada feito.', 3.8); }
                else if (sel === 'chaveSaida') { vitoria(); }
                else { som('erro'); msg('A saída está trancada. Falta a chave (selecione-a e aperte E).', 3.8); }
                break;
            case 'inspecionar': som('clique'); msg(o.texto, 4.5); break;
        }
    }

    function usarPorta(o, sel) {
        if (sel === o.req) {
            o.aberta = true; consumirSelecionado(); som('porta');
            msg('A chave gira na fechadura e a porta se abre rangendo.', 3.4);
        } else { som('erro'); msg(o.dica, 4); }
    }

    function abrirContainer(o, sel) {
        let prefixo = '';
        if (o.trancado) {
            if (sel === o.req) {
                o.trancado = false; consumirSelecionado();
                prefixo = 'Destrancado! ';
            } else {
                som('erro');
                msg('Está trancado. Precisa de uma chave (selecione o item no inventário e aperte E).', 3.8);
                return;
            }
        }
        o.aberto = true; som('porta');
        const ganhos = [];
        o.da.forEach(function (id, i) {
            if (adicionarItem(id)) ganhos.push(ITENS[id].nome);
            else { soltarNoChao(id, o.x + 22 + i * 18, o.y); ganhos.push(ITENS[id].nome + ' (caiu no chão: inventário cheio)'); }
        });
        msg(prefixo + 'Você encontrou: ' + ganhos.join(' e ') + '.', 4);
    }

    function abrirPapel(o) {
        jogo.lidos.add(o.id);
        som('papel');
        el.papelTitulo.textContent = PAPEIS[o.id].titulo;
        el.papelTexto.textContent = PAPEIS[o.id].texto;
        el.modalPapel.classList.add('ativa');
        modo = 'leitura';
    }

    function fecharPapel() {
        el.modalPapel.classList.remove('ativa');
        modo = 'jogando';
        if (jogo.lidos.size === TOTAL_PAPEIS) msg('Você leu todos os papéis. Agora entende o que aconteceu aqui...', 4);
    }

    function montarTeclado() {
        el.grade.innerHTML = '';
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].forEach(function (t) {
            const b = document.createElement('button');
            b.textContent = t;
            b.addEventListener('click', function () {
                if (modo !== 'cofre') return;
                if (t === 'C') { codigoDigitado = ''; atualizarVisor(); }
                else if (t === 'OK') confirmarCofre();
                else digitar(t);
                b.blur();
            });
            el.grade.appendChild(b);
        });
    }

    function atualizarVisor() {
        let s = codigoDigitado;
        while (s.length < 4) s += '-';
        el.visor.textContent = s;
    }

    function abrirCofre(o) {
        cofreAtual = o; codigoDigitado = '';
        atualizarVisor(); el.cofreMsg.textContent = '';
        el.modalCofre.classList.add('ativa');
        modo = 'cofre';
    }

    function fecharCofre() {
        el.modalCofre.classList.remove('ativa');
        modo = 'jogando';
    }

    function digitar(d) {
        if (codigoDigitado.length < 4) { codigoDigitado += d; som('clique'); atualizarVisor(); }
    }

    function confirmarCofre() {
        if (codigoDigitado === CODIGO_COFRE) {
            cofreAtual.aberto = true;
            fecharCofre();
            som('porta');
            if (adicionarItem('chaveSaida')) msg('O cofre se abre! Dentro há uma pesada chave com a palavra SAÍDA.', 4.5);
            else { soltarNoChao('chaveSaida', cofreAtual.x + 30, cofreAtual.y); msg('O cofre se abre! A Chave da Saída caiu no chão: seu inventário está cheio.', 4.5); }
        } else {
            som('erro');
            el.cofreMsg.textContent = 'CÓDIGO INCORRETO';
            el.visor.classList.remove('erro'); void el.visor.offsetWidth; el.visor.classList.add('erro');
            codigoDigitado = ''; atualizarVisor();
        }
    }

    function solidos() {
        const S = [];
        for (let i = 0; i < jogo.objetos.length; i++) {
            const o = jogo.objetos[i];
            if ((o.tipo === 'porta' || o.tipo === 'tabuas') && !o.aberta) S.push({ x1: o.x - 24, x2: o.x + 24, y1: o.y - 160, y2: o.y });
            if (o.tipo === 'saida') S.push({ x1: o.x - 34, x2: o.x + 34, y1: o.y - 170, y2: o.y });
        }
        return S;
    }

    function escadaProxima(p) {
        for (let i = 0; i < LADDERS.length; i++) {
            const l = LADDERS[i];
            if (Math.abs(p.x - l.x) < 18 && p.y >= l.topo - 0.5 && p.y <= l.base + 0.5) return l;
        }
        return null;
    }

    function atualizarJogador(dt) {
        const p = jogo.p;
        const esq = teclas.KeyA || teclas.ArrowLeft, dir = teclas.KeyD || teclas.ArrowRight;
        const cima = teclas.KeyW || teclas.ArrowUp, baixo = teclas.KeyS || teclas.ArrowDown;
        const mx = (dir ? 1 : 0) - (esq ? 1 : 0);

        const sx = p.x - cam.x, sy = p.y - 40 - cam.y;
        if (mouse.ativo) {
            if (Math.abs(mouse.x - sx) > 12) p.dir = mouse.x > sx ? 1 : -1;
            jogo.aim = Math.atan2(mouse.y - sy, mouse.x - sx);
        } else {
            if (mx) p.dir = mx;
            jogo.aim = p.dir === 1 ? 0.05 : Math.PI - 0.05;
        }

        p.pulaBuf = Math.max(0, p.pulaBuf - dt);

        if (p.escada) {
            const l = p.escada;
            p.vx = 0; p.vy = 0;
            p.x += (l.x - p.x) * Math.min(1, dt * 15);
            const mv = (baixo ? 1 : 0) - (cima ? 1 : 0);
            p.y += mv * VEL_ESCADA * dt;
            p.andando = mv !== 0;
            if (mv !== 0) p.animT += dt;
            if (p.y <= l.topo) { p.y = l.topo; p.escada = null; p.noChao = true; }
            else if (p.y >= l.base) { p.y = l.base; p.escada = null; p.noChao = true; }
            else if (p.pulaBuf > 0) { p.escada = null; p.vy = -380; p.vx = mx * VEL_ANDAR; p.pulaBuf = 0; p.noChao = false; }
            return;
        }

        const l = escadaProxima(p);
        if (l) {
            if (cima && p.y > l.topo + 0.5) p.escada = l;
            else if (baixo && p.y < l.base - 0.5) p.escada = l;
            if (p.escada) { p.noChao = false; return; }
        }

        p.andando = mx !== 0;
        p.vx = mx * VEL_ANDAR;
        let nx = clamp(p.x + p.vx * dt, 24, MUNDO_W - 24);
        const S = solidos();
        for (let i = 0; i < S.length; i++) {
            const s = S[i];
            if (p.y > s.y1 && p.y - 64 < s.y2 && nx + 13 > s.x1 && nx - 13 < s.x2) {
                nx = (p.x < (s.x1 + s.x2) / 2) ? s.x1 - 13 : s.x2 + 13;
            }
        }
        p.x = nx;

        if (p.noChao) p.coyote = 0.1; else p.coyote = Math.max(0, p.coyote - dt);
        if (p.pulaBuf > 0 && p.coyote > 0) {
            p.vy = -VEL_PULO; p.noChao = false; p.coyote = 0; p.pulaBuf = 0;
        }

        p.vy = Math.min(p.vy + GRAVIDADE * dt, 900);
        const ny = p.y + p.vy * dt;
        let pouso = null;
        if (p.vy >= 0) {
            for (let i = 0; i < plataformas.length; i++) {
                const pl = plataformas[i];
                if (p.x + 11 > pl.x1 && p.x - 11 < pl.x2 && p.y <= pl.y + 0.5 && ny >= pl.y) {
                    if (pouso === null || pl.y < pouso) pouso = pl.y;
                }
            }
        }
        if (pouso !== null) { p.y = pouso; p.vy = 0; p.noChao = true; }
        else { p.y = ny; p.noChao = false; }

        if (p.andando && p.noChao) {
            p.animT += dt;
            p.passoT += dt;
            if (p.passoT > 0.36) { p.passoT = 0; som('passo'); }
        }
    }

    function atualizarCamera(dt, instantaneo) {
        const p = jogo.p;
        const ax = clamp(p.x - LARGURA / 2, 0, MUNDO_W - LARGURA);
        const ay = clamp(p.y - ALTURA * 0.64, 0, MUNDO_H - ALTURA);
        if (instantaneo) { cam.x = ax; cam.y = ay; }
        else { const k = Math.min(1, dt * 5); cam.x += (ax - cam.x) * k; cam.y += (ay - cam.y) * k; }
    }

    function atualizarMonstro(dt) {
        const p = jogo.p, f = jogo.monstro;
        const luzOn = jogo.lanterna && jogo.bateria > 0;

        if (!f) {
            jogo.tMonstro -= dt;
            if (jogo.tMonstro > 0) return;
            if (!(p.noChao && !p.escada)) { jogo.tMonstro = 1; return; }
            let chao = null;
            for (let i = 0; i < NIVEIS.length; i++) if (Math.abs(p.y - NIVEIS[i]) < 2) chao = NIVEIS[i];
            if (chao === null) { jogo.tMonstro = 1; return; }
            const lado = Math.random() < 0.5 ? -1 : 1;
            let x = p.x + lado * (360 + Math.random() * 200);
            if (x < 80 || x > MUNDO_W - 80) x = p.x - lado * (360 + Math.random() * 200);
            x = clamp(x, 60, MUNDO_W - 60);
            jogo.monstro = { x: x, y: chao, lit: 0, idade: 0, sumindo: 0, fora: 0, somT: 0 };
            som('sussurro'); som('rangido');
            if (!jogo.monstroVisto) {
                jogo.monstroVisto = true;
                msg('Algo se move no escuro... Aponte a luz da lanterna para ele!', 4.5);
            } else {
                msg('Ele voltou! Mire a lanterna nele!', 3);
            }
            return;
        }

        f.idade += dt;

        if (f.sumindo > 0) {
            f.sumindo -= dt;
            if (f.sumindo <= 0) { jogo.monstro = null; jogo.tMonstro = 18 + Math.random() * 27; }
            return;
        }

        const mesmoAndar = Math.abs(p.y - f.y) < 150;
        if (mesmoAndar) f.fora = 0;
        else {
            f.fora += dt;
            if (f.fora > 4) { f.sumindo = 0.6; return; }
        }

        const ox = p.x + p.dir * 18, oy = p.y - 38;
        const dx = f.x - ox, dy = (f.y - 60) - oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let dif = Math.atan2(dy, dx) - jogo.aim;
        while (dif > Math.PI) dif -= Math.PI * 2;
        while (dif < -Math.PI) dif += Math.PI * 2;
        const iluminado = luzOn && mesmoAndar && dist < 420 && Math.abs(dif) < 0.5;
        if (iluminado) f.lit += dt; else f.lit = Math.max(0, f.lit - dt * 0.6);
        if (f.lit >= MONSTRO_TEMPO_LUZ) { f.sumindo = 0.6; som('sussurro'); return; }

        if (mesmoAndar) {
            const prog = 1 - jogo.tempo / TEMPO_TOTAL;
            const vel = (MONSTRO_VEL_BASE + 45 * prog) * (iluminado ? 0.2 : 1);
            f.x += Math.sign(p.x - f.x) * vel * dt;
        }

        if (mesmoAndar && Math.abs(p.x - f.x) < 26 && p.y > f.y - 55) { morrer('monstro'); return; }

        const prox = Math.abs(p.x - f.x);
        f.somT -= dt;
        if (mesmoAndar && prox < 450 && f.somT <= 0) { som('batida'); f.somT = 0.35 + (prox / 450) * 0.9; }
    }

    function atualizarEstamina(dt) {
        const luzOn = jogo.lanterna && jogo.bateria > 0;
        if (luzOn) jogo.estamina = Math.min(1, jogo.estamina + ESTAMINA_RECUPERA * dt);
        else jogo.estamina = Math.max(0, jogo.estamina - ESTAMINA_DRENO * dt);

        if (!luzOn && jogo.estamina < 0.4 && !jogo.avisoEst) {
            jogo.avisoEst = true;
            msg('Você está perdendo o ar no escuro... Acenda a lanterna!', 3.5);
            som('sussurro');
        }
        if (jogo.estamina > 0.7) jogo.avisoEst = false;
        if (jogo.estamina <= 0) morrer('escuro');
    }

    function atualizar(dt) {
        jogo.tempo -= dt;
        if (jogo.tempo <= 0) { jogo.tempo = 0; iniciarSusto(); return; }

        atualizarJogador(dt);

        if (jogo.lanterna && jogo.bateria > 0) {
            jogo.bateria = Math.max(0, jogo.bateria - dt / BATERIA_DURACAO);
            if (jogo.bateria === 0) { msg('A bateria acabou! Sem luz sua estamina cai. Use uma bateria (E) ou procure outra.', 4.5); som('erro'); }
        }
        jogo.flickT -= dt;
        if (jogo.flickT <= 0) {
            jogo.flickT = 0.05 + Math.random() * 0.08;
            jogo.flick = jogo.bateria < 0.15 ? (Math.random() < 0.25 ? 0.25 + Math.random() * 0.3 : 1)
                                              : (Math.random() < 0.02 ? 0.6 : 1);
        }
        if (jogo.tEnergia > 0) jogo.tEnergia -= dt;

        atualizarAlvo();
        atualizarEstamina(dt);
        if (modo !== 'jogando') return;
        atualizarMonstro(dt);
        if (modo !== 'jogando') return;

        if (!jogo.avisos[300] && jogo.tempo <= 300) { jogo.avisos[300] = true; msg('Restam 5 minutos. Algo se aproxima.', 3.5); som('sussurro'); }
        if (!jogo.avisos[120] && jogo.tempo <= 120) { jogo.avisos[120] = true; msg('Restam 2 minutos! O hotel está contando o tempo...', 3.5); som('rangido'); }
        if (!jogo.avisos[60] && jogo.tempo <= 60) { jogo.avisos[60] = true; msg('Falta 1 minuto! Ele está chegando!', 3.5); }
        if (jogo.tempo <= 60) {
            jogo.batida -= dt;
            if (jogo.batida <= 0) { som('batida'); jogo.batida = 0.8; }
        }
    }

    function atualizarHUD() {
        const t = fmt(jogo.tempo);
        if (el.tempo.textContent !== t) el.tempo.textContent = t;
        el.tempo.classList.toggle('urgente', jogo.tempo <= 120);

        const pct = Math.round(jogo.bateria * 100);
        el.batNivel.style.width = pct + '%';
        el.batPct.textContent = pct + '%';
        el.batNivel.className = pct <= 15 ? 'critica' : (pct <= 40 ? 'baixa' : '');
        el.bateria.classList.toggle('desligada', !jogo.lanterna);

        const luzOn = jogo.lanterna && jogo.bateria > 0;
        const ep = Math.round(jogo.estamina * 100);
        el.estNivel.style.width = ep + '%';
        el.estPct.textContent = ep + '%';
        el.estNivel.className = ep <= 20 ? 'critica' : (ep <= 45 ? 'baixa' : '');
        el.estamina.classList.toggle('drenando', !luzOn);

        el.papeis.textContent = 'Papéis ' + jogo.lidos.size + '/' + TOTAL_PAPEIS;

        let rot = (jogo.alvo && modo === 'jogando') ? rotulo(jogo.alvo) : null;
        if (modo === 'jogando' && usaBateriaAgora()) rot = 'Usar bateria';
        el.dica.textContent = rot ? '[E] ' + rot : '';
        el.dica.classList.toggle('visivel', !!rot);

        const press = jogo.tempo < 120 ? (1 - jogo.tempo / 120) : 0;
        const pressEst = jogo.estamina < 0.5 ? (0.5 - jogo.estamina) * 2 : 0;
        const m = jogo.monstro;
        const pressMon = (m && Math.abs(jogo.p.y - m.y) < 150) ? clamp(1 - Math.abs(jogo.p.x - m.x) / 450, 0, 1) : 0;
        const forca = Math.max(press * 0.55, pressEst * 0.8, pressMon * 0.6);
        const pulso = 0.5 + 0.5 * Math.sin(jogo.tt * (2 + Math.max(press, pressEst, pressMon) * 6));
        el.vinheta.style.opacity = (forca * (0.6 + 0.4 * pulso)).toFixed(3);
    }

    function paredes(c, s, topo, chao) {
        const w = s.x2 - s.x1, h = chao - topo;
        R(c, s.x1, topo, w, h, s.cor);
        c.fillStyle = 'rgba(0,0,0,0.16)';
        for (let x = s.x1 + 10; x < s.x2; x += 40) c.fillRect(x, topo + 17, 14, h - 17);
        R(c, s.x1, chao - 85, w, 85, 'rgba(28,11,6,0.88)');
        R(c, s.x1, chao - 88, w, 4, '#3b1f12');
        c.fillStyle = 'rgba(255,255,255,0.05)';
        for (let x = s.x1 + 8; x < s.x2 - 40; x += 60) c.fillRect(x, chao - 76, 48, 62);
        R(c, s.x1, chao - 10, w, 10, '#150a06');
        for (let i = 0; i < Math.floor(w / 120); i++) {
            const mx = s.x1 + 40 + hash(s.x1 + i * 7) * (w - 80);
            const my = topo + 20 + hash(s.x1 + i * 13) * (h - 160);
            const rr = 30 + hash(s.x1 + i * 3) * 60;
            const g = c.createRadialGradient(mx, my, 2, mx, my, rr);
            g.addColorStop(0, 'rgba(10,5,2,0.4)'); g.addColorStop(1, 'rgba(10,5,2,0)');
            c.fillStyle = g; c.fillRect(mx - rr, my - rr, rr * 2, rr * 2);
        }
    }

    function moldura(c, x, ch) {
        const topo = TETO[ch], h = ch - topo;
        R(c, x - 32, topo, 64, h - 164, '#150b08');
        R(c, x - 32, topo + h - 168, 64, 4, '#2f1a10');
        R(c, x - 32, ch - 164, 6, 164, '#150b08');
        R(c, x + 26, ch - 164, 6, 164, '#150b08');
    }

    function janela(c, x, ch) {
        const y = ch - 255;
        R(c, x - 34, y - 4, 68, 118, '#1a0d08');
        const g = c.createLinearGradient(0, y, 0, y + 110);
        g.addColorStop(0, '#32456a'); g.addColorStop(1, '#101826');
        c.fillStyle = g; c.fillRect(x - 30, y, 60, 110);
        R(c, x - 2, y, 4, 110, '#1a0d08'); R(c, x - 30, y + 52, 60, 4, '#1a0d08');
        c.fillStyle = 'rgba(220,230,255,0.55)'; c.beginPath(); c.arc(x + 14, y + 20, 7, 0, Math.PI * 2); c.fill();
        c.fillStyle = 'rgba(70,10,14,0.8)';
        c.beginPath(); c.moveTo(x - 30, y); c.lineTo(x - 12, y); c.lineTo(x - 20, y + 70); c.lineTo(x - 26, y + 55); c.lineTo(x - 30, y + 80); c.closePath(); c.fill();
    }

    function quadro(c, x, y, w, h) {
        R(c, x - w / 2 - 4, y - 4, w + 8, h + 8, '#2a1608');
        R(c, x - w / 2, y, w, h, '#15110f');
        c.fillStyle = '#4a4038';
        c.beginPath(); c.arc(x, y + h * 0.4, w * 0.2, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.ellipse(x, y + h * 0.98, w * 0.36, h * 0.3, 0, Math.PI, 0); c.fill();
        R(c, x - w * 0.11, y + h * 0.37, 4, 4, '#e8e0c0'); R(c, x + w * 0.05, y + h * 0.37, 4, 4, '#e8e0c0');
    }

    function tapete(c, ch, x, w) {
        R(c, x, ch - 6, w, 6, '#4a0f12');
        R(c, x, ch - 6, w, 1.5, '#b08a30'); R(c, x, ch - 1.5, w, 1.5, '#b08a30');
    }

    function desenharLampada(c, x, topo) {
        R(c, x - 1, topo + 14, 2, 16, '#222');
        c.fillStyle = '#3a2c20';
        c.beginPath(); c.moveTo(x - 13, topo + 46); c.lineTo(x + 13, topo + 46); c.lineTo(x + 6, topo + 30); c.lineTo(x - 6, topo + 30); c.closePath(); c.fill();
        R(c, x - 4, topo + 46, 8, 3, '#cfc08a');
    }

    function desenharCama(c, x, y, w) {
        R(c, x, y - 22, w, 22, '#2a140b');
        R(c, x + 4, y - 40, w - 8, 19, '#6d6a5c');
        R(c, x + 4, y - 40, w - 8, 3, '#8a8676');
        R(c, x + 8, y - 48, 36, 9, '#b5b09f');
        R(c, x, y - 66, 9, 66, '#1c0d07');
        R(c, x + w - 7, y - 36, 7, 36, '#1c0d07');
        c.fillStyle = 'rgba(60,0,0,0.5)';
        c.beginPath(); c.ellipse(x + w * 0.55, y - 30, 22, 6, 0, 0, Math.PI * 2); c.fill();
    }

    function desenharMesa(c, x, y, w, h) {
        R(c, x, y - h, w, 6, '#4d2b15');
        R(c, x + 5, y - h + 6, 6, h - 6, '#2f180c');
        R(c, x + w - 11, y - h + 6, 6, h - 6, '#2f180c');
        R(c, x + 10, y - h - 2, w - 20, 2, 'rgba(200,190,170,0.35)');
    }

    function desenharGuardaRoupa(c, x, y, w, h) {
        R(c, x, y - h, w, h, '#2b150c');
        R(c, x + 4, y - h + 8, w - 8, h - 12, '#3a1d10');
        R(c, x + w / 2 - 1, y - h + 8, 2, h - 12, '#170a05');
        R(c, x + w / 2 - 9, y - h * 0.5, 3, 10, '#b9962e'); R(c, x + w / 2 + 6, y - h * 0.5, 3, 10, '#b9962e');
        R(c, x - 3, y - h, w + 6, 5, '#1f0f08');
    }

    function desenharCaixa(c, x, y) {
        R(c, x, y - 50, 50, 50, '#5b3b1e');
        R(c, x + 4, y - 46, 42, 42, '#6a4524');
        c.strokeStyle = '#3a2410'; c.lineWidth = 3;
        c.beginPath(); c.moveTo(x + 4, y - 46); c.lineTo(x + 46, y - 4); c.moveTo(x + 46, y - 46); c.lineTo(x + 4, y - 4); c.stroke();
        R(c, x, y - 50, 50, 3, '#7a5430');
    }

    function desenharPrateleira(c, x, y, w) {
        R(c, x, y - 125, w, 6, '#4a2a14');
        R(c, x + 10, y - 119, 5, 14, '#2a1509'); R(c, x + w - 15, y - 119, 5, 14, '#2a1509');
        R(c, x + 10, y - 143, 9, 18, '#2e5a3a'); R(c, x + 12, y - 148, 5, 5, '#2e5a3a');
        R(c, x + w - 24, y - 140, 9, 15, '#5a3a2e'); R(c, x + w - 40, y - 134, 12, 9, '#3a3a50');
    }

    function desenharEstante(c, x, ch, w, h) {
        R(c, x, ch - h, w, h, '#24120a');
        for (let i = 0; i < 4; i++) {
            const y = ch - h + 20 + i * ((h - 30) / 4);
            R(c, x + 4, y + 22, w - 8, 3, '#3a1e10');
            for (let b = 0; b < Math.floor((w - 12) / 11); b++) {
                const bh = 14 + hash(x + i * 11 + b) * 10;
                R(c, x + 6 + b * 11, y + 22 - bh, 8, bh, ['#5a1a1a', '#1a3a4a', '#4a4a1a', '#3a2a4a'][Math.floor(hash(b + i * 5) * 4)]);
            }
        }
    }

    function desenharBalcao(c, x, y, w) {
        R(c, x, y - 60, w, 60, '#3a1b0e');
        R(c, x - 4, y - 66, w + 8, 8, '#5a2f19');
        c.fillStyle = 'rgba(0,0,0,0.3)';
        for (let i = x + 8; i < x + w - 20; i += 36) c.fillRect(i, y - 50, 28, 42);
        R(c, x + w - 40, y - 74, 14, 8, '#b9962e');
    }

    function desenharMesaRest(c, x, y, w) {
        desenharMesa(c, x, y, w, 40);
        R(c, x - 24, y - 26, 16, 4, '#2a140b'); R(c, x - 24, y - 26, 3, 26, '#2a140b'); R(c, x - 24, y - 50, 3, 24, '#2a140b');
        R(c, x + w + 8, y - 26, 16, 4, '#2a140b'); R(c, x + w + 21, y - 26, 3, 26, '#2a140b'); R(c, x + w + 21, y - 50, 3, 24, '#2a140b');
        R(c, x + w / 2 - 10, y - 48, 20, 3, '#d8d2c0');
    }

    function desenharRelogio(c, x, y) {
        c.fillStyle = '#2a1608'; c.beginPath(); c.arc(x, y, 33, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#cfc8b0'; c.beginPath(); c.arc(x, y, 27, 0, Math.PI * 2); c.fill();
        c.strokeStyle = '#222'; c.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
            const a = i * Math.PI / 6;
            c.beginPath(); c.moveTo(x + Math.cos(a) * 22, y + Math.sin(a) * 22); c.lineTo(x + Math.cos(a) * 26, y + Math.sin(a) * 26); c.stroke();
        }
        const am = (17 / 60) * Math.PI * 2 - Math.PI / 2;
        const ah = ((3 + 17 / 60) / 12) * Math.PI * 2 - Math.PI / 2;
        c.strokeStyle = '#111'; c.lineWidth = 3.5;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(ah) * 14, y + Math.sin(ah) * 14); c.stroke();
        c.lineWidth = 2.2;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(am) * 21, y + Math.sin(am) * 21); c.stroke();
        c.strokeStyle = 'rgba(0,0,0,0.5)'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(x + 8, y - 26); c.lineTo(x + 3, y - 10); c.lineTo(x + 12, y + 2); c.stroke();
    }

    function desenharElevador(c, x, ch) {
        R(c, x - 40, ch - 170, 80, 170, '#2a2c30');
        R(c, x - 34, ch - 160, 33, 160, '#4a4e54'); R(c, x + 1, ch - 160, 33, 160, '#42464c');
        R(c, x - 1, ch - 160, 2, 160, '#15171a');
        R(c, x - 22, ch - 190, 44, 16, '#101010');
        c.fillStyle = '#d61111'; c.font = '8px "Press Start 2P", monospace'; c.textAlign = 'center';
        c.fillText('PARADO', x, ch - 178); c.textAlign = 'left';
    }

    function desenharEscada(c, l) {
        R(c, l.x - 22, l.topo + 7, 44, 33, '#020101');
        const topo = l.topo - 38, base = l.base;
        R(c, l.x - 16, topo, 5, base - topo, '#4a2c18');
        R(c, l.x + 11, topo, 5, base - topo, '#4a2c18');
        for (let y = topo + 10; y < base - 4; y += 16) R(c, l.x - 12, y, 24, 4, '#6a4026');
    }

    function textoParede(c, txt, x, y, alfa) {
        c.fillStyle = 'rgba(140,10,10,' + alfa + ')';
        c.font = '10px "Press Start 2P", monospace'; c.textAlign = 'center';
        c.fillText(txt, x, y); c.textAlign = 'left';
    }

    function construirFundo() {
        if (!fundo) { fundo = document.createElement('canvas'); fundo.width = MUNDO_W; fundo.height = MUNDO_H; }
        const c = fundo.getContext('2d');
        c.clearRect(0, 0, MUNDO_W, MUNDO_H);
        R(c, 0, 0, MUNDO_W, MUNDO_H, '#030101');

        NIVEIS.forEach(function (ch) {
            const topo = TETO[ch];
            SECOES[ch].forEach(function (s) { paredes(c, s, topo, ch); });
            R(c, 0, topo, MUNDO_W, 14, '#120807'); R(c, 0, topo + 14, MUNDO_W, 3, '#2a1510');
            R(c, 0, topo, 14, ch - topo, '#0d0605'); R(c, MUNDO_W - 14, topo, 14, ch - topo, '#0d0605');
        });

        JANELAS.forEach(function (j) { janela(c, j.x, j.n); });
        QUADROS.forEach(function (q) { quadro(c, q.x, q.n - q.dy, q.w, q.h); });

        tapete(c, CHAO.L2, 700, 1100); tapete(c, CHAO.L1, 1150, 1000);
        tapete(c, CHAO.L0, 120, 900); tapete(c, CHAO.L0, 1150, 900);

        desenharCama(c, 40, CHAO.L2, 160);
        desenharMesa(c, 365, CHAO.L2, 90, 36);
        desenharCaixa(c, 990, CHAO.L2);
        desenharPrateleira(c, 1050, CHAO.L2, 120);
        desenharMesa(c, 1950, CHAO.L2, 90, 36);
        desenharCama(c, 2230, CHAO.L2, 170);
        desenharGuardaRoupa(c, 2410, CHAO.L2, 120, 130);
        textoParede(c, 'ELE ESTA AQUI', 1350, CHAO.L2 - 200, 0.55);

        desenharEstante(c, 80, CHAO.L1, 110, 200);
        desenharEstante(c, 860, CHAO.L1, 130, 200);
        desenharMesa(c, 600, CHAO.L1, 160, 40);
        desenharMesa(c, 2560, CHAO.L1, 80, 36);
        textoParede(c, 'NAO CONFIE NAS LUZES', 1700, CHAO.L1 - 200, 0.5);

        desenharBalcao(c, 450, CHAO.L0, 200);
        desenharMesaRest(c, 1300, CHAO.L0, 100);
        desenharMesaRest(c, 1560, CHAO.L0, 100);
        desenharMesaRest(c, 1820, CHAO.L0, 100);
        desenharRelogio(c, 900, CHAO.L0 - 195);
        desenharElevador(c, 2330, CHAO.L0);

        BORDAS.forEach(function (b) { moldura(c, b.x, b.n); });
        LAMPADAS.forEach(function (l) { desenharLampada(c, l.x, TETO[l.n]); });

        NIVEIS.forEach(function (ch) {
            R(c, 0, ch, MUNDO_W, 40, '#0c0605');
            R(c, 0, ch, MUNDO_W, 7, '#4e2d1a');
            for (let x = 0; x < MUNDO_W; x += 64) R(c, x, ch, 2, 7, '#1c0e07');
            R(c, 0, ch + 7, MUNDO_W, 2, '#1a0d08');
        });
        R(c, 0, CHAO.L0 + 40, MUNDO_W, MUNDO_H - CHAO.L0 - 40, '#040101');

        LADDERS.forEach(function (l) { desenharEscada(c, l); });
    }

    function placa(c, x, y, txt) {
        R(c, x - 20, y - 9, 40, 16, '#c9a227'); R(c, x - 18, y - 7, 36, 12, '#1a1206');
        c.fillStyle = '#d9b84a'; c.font = '8px "Press Start 2P", monospace'; c.textAlign = 'center';
        c.fillText(txt, x, y + 3); c.textAlign = 'left';
    }

    function desenharPorta(c, o) {
        const x = o.x, y = o.y;
        if (!o.aberta) {
            R(c, x - 24, y - 158, 48, 158, '#4a2a16');
            c.strokeStyle = '#26130a'; c.lineWidth = 3;
            c.strokeRect(x - 17, y - 148, 34, 56); c.strokeRect(x - 17, y - 84, 34, 64);
            c.fillStyle = '#b9962e'; c.beginPath(); c.arc(x + 15, y - 78, 3.5, 0, Math.PI * 2); c.fill();
            R(c, x + 11, y - 96, 8, 4, '#d61111');
        } else {
            R(c, x - 24, y - 158, 48, 158, '#020101');
            R(c, x - 24, y - 158, 9, 158, '#3a2012');
            R(c, x - 24, y - 158, 2, 158, '#1e0f08');
        }
        if (o.placa) placa(c, x, y - 176, o.placa);
    }

    function desenharTabuas(c, o) {
        const x = o.x, y = o.y;
        if (!o.aberta) {
            R(c, x - 26, y - 160, 52, 160, '#050202');
            [[y - 140, -0.18], [y - 102, 0.12], [y - 64, -0.1], [y - 26, 0.15]].forEach(function (pr) {
                c.save(); c.translate(x, pr[0]); c.rotate(pr[1]);
                R(c, -34, -8, 68, 16, '#5a3c22'); R(c, -34, -8, 68, 3, '#7a5430');
                R(c, -28, -2, 3, 3, '#999'); R(c, 24, -2, 3, 3, '#999');
                c.restore();
            });
        } else {
            R(c, x - 24, y - 158, 48, 158, '#020101');
            c.save(); c.translate(x - 14, y - 5); c.rotate(0.1); R(c, -26, -6, 52, 12, '#4a3018'); c.restore();
            c.save(); c.translate(x + 12, y - 4); c.rotate(-0.25); R(c, -20, -5, 40, 10, '#5a3c22'); c.restore();
        }
    }

    function desenharContainer(c, o) {
        const x = o.x, y = o.y;
        if (o.sub === 'gaveta') {
            R(c, x - 24, y - 50, 48, 50, '#3c1e0f'); R(c, x - 26, y - 52, 52, 5, '#55301a');
            R(c, x - 20, y - 42, 40, 16, '#2c160a'); R(c, x - 20, y - 24, 40, 18, '#2c160a');
            R(c, x - 3, y - 36, 6, 3, '#b9962e'); R(c, x - 3, y - 17, 6, 3, '#b9962e');
            if (o.aberto) { R(c, x - 20, y - 42, 40, 16, '#0d0603'); R(c, x - 22, y - 36, 44, 9, '#4a2810'); }
        } else {
            const w = 60, h = 110;
            R(c, x - 30, y - h, w, h, '#2d160c'); R(c, x - 27, y - h + 3, w - 6, h - 6, '#3b1e11');
            if (!o.aberto) {
                R(c, x - 1, y - h + 3, 2, h - 6, '#170a05');
                R(c, x - 9, y - 60, 3, 9, '#b9962e'); R(c, x + 6, y - 60, 3, 9, '#b9962e');
                if (o.trancado) {
                    R(c, x - 6, y - 54, 12, 9, '#8a8f94');
                    c.strokeStyle = '#8a8f94'; c.lineWidth = 2; c.beginPath(); c.arc(x, y - 55, 4, Math.PI, 0); c.stroke();
                }
            } else {
                R(c, x - 27, y - h + 3, w - 6, h - 6, '#0a0403');
                R(c, x - 27, y - 80, w - 6, 3, '#2d160c'); R(c, x - 27, y - 45, w - 6, 3, '#2d160c');
                R(c, x - 36, y - h, 6, h, '#2d160c'); R(c, x + 30, y - h, 6, h, '#2d160c');
            }
        }
    }

    function desenharCofre(c, o) {
        const x = o.x, y = o.y;
        R(c, x - 28, y - 72, 56, 72, '#34373d'); R(c, x - 24, y - 68, 48, 64, '#41454c');
        if (!o.aberto) {
            c.fillStyle = '#23262a'; c.beginPath(); c.arc(x - 6, y - 38, 12, 0, Math.PI * 2); c.fill();
            c.strokeStyle = '#8a8f96'; c.lineWidth = 2; c.beginPath(); c.arc(x - 6, y - 38, 9, 0, Math.PI * 2); c.stroke();
            R(c, x - 7, y - 47, 2, 6, '#d61111');
            R(c, x + 12, y - 52, 10, 14, '#15171a');
            R(c, x + 14, y - 49, 6, 2, '#ff3030'); R(c, x + 14, y - 45, 6, 2, '#666'); R(c, x + 14, y - 42, 6, 2, '#666');
        } else {
            R(c, x - 24, y - 68, 48, 64, '#0b0b0d');
            R(c, x + 28, y - 72, 10, 72, '#34373d');
        }
    }

    function desenharQuadroForca(c, o) {
        const x = o.x, y = o.y, tt = jogo.tt;
        R(c, x - 28, y - 175, 56, 78, '#3b3f43'); R(c, x - 24, y - 171, 48, 70, '#22262a');
        for (let i = 0; i < 4; i++) {
            const sx = x - 20 + i * 10;
            const vazio = !jogo.energia && i === 2;
            if (vazio) R(c, sx, y - 160, 8, 26, '#0a0a0c');
            else { R(c, sx, y - 160, 8, 26, '#d8d2b8'); R(c, sx, y - 160, 8, 4, '#9a8a6a'); }
        }
        if (jogo.energia) {
            R(c, x - 6, y - 120, 12, 6, '#28d142');
            c.fillStyle = 'rgba(40,210,66,0.3)'; c.beginPath(); c.arc(x, y - 117, 12, 0, Math.PI * 2); c.fill();
        } else {
            R(c, x - 6, y - 120, 12, 6, '#d61111');
            if (Math.sin(tt * 40) > 0.7) { R(c, x - 2, y - 150, 4, 12, '#6ab0ff'); R(c, x - 6, y - 146, 12, 3, '#6ab0ff'); }
        }
        R(c, x - 2, y - 97, 4, 97, '#111');
    }

    function desenharSaida(c, o, tt) {
        const x = o.x, y = o.y;
        R(c, x - 38, y - 172, 76, 172, '#15171a');
        R(c, x - 34, y - 170, 68, 170, '#2b2e33');
        c.strokeStyle = '#1a1c20'; c.lineWidth = 3; c.strokeRect(x - 28, y - 160, 56, 150);
        R(c, x - 22, y - 70, 44, 5, '#8a8f96');
        const lig = Math.sin(tt * 7) > -0.6 || Math.sin(tt * 31) > 0;
        R(c, x - 28, y - 200, 56, 22, '#1a0505');
        c.fillStyle = lig ? '#ff2a2a' : '#5a1010';
        c.font = '10px "Press Start 2P", monospace'; c.textAlign = 'center';
        c.fillText('SAIDA', x, y - 184); c.textAlign = 'left';
        R(c, x - 30, y - 100, 14, 26, '#0c0d0f');
        const ok = jogo.energia;
        R(c, x - 27, y - 96, 8, 6, ok ? '#28d142' : ((Math.floor(tt * 2) % 2) ? '#d61111' : '#3a0505'));
        R(c, x - 27, y - 86, 8, 3, '#555');
    }

    function desenharPapel(c, o) {
        const lido = jogo.lidos.has(o.id);
        c.save(); c.translate(o.x, o.y - 1); c.rotate(-0.12);
        R(c, -9, -13, 18, 13, lido ? '#8a8472' : '#e2dac2');
        c.fillStyle = lido ? '#5a5444' : '#6a5a40';
        c.fillRect(-6, -10, 12, 1.5); c.fillRect(-6, -7, 10, 1.5); c.fillRect(-6, -4, 11, 1.5);
        c.restore();
        if (!lido) {
            const a = 0.5 + 0.5 * Math.sin(jogo.tt * 4 + o.x);
            c.fillStyle = 'rgba(255,255,255,' + (0.35 + 0.4 * a) + ')';
            c.fillRect(o.x + 6, o.y - 16, 2, 2);
        }
    }

    function desenharPegavel(c, o) {
        const bob = Math.sin(jogo.tt * 3 + o.x) * 2;
        const g = c.createRadialGradient(o.x, o.y - 14, 2, o.x, o.y - 14, 26);
        g.addColorStop(0, 'rgba(255,230,150,0.4)'); g.addColorStop(1, 'rgba(255,230,150,0)');
        c.fillStyle = g; c.fillRect(o.x - 26, o.y - 40, 52, 52);
        desenharIcone(c, o.item, o.x, o.y - 14 + bob, 1.25);
    }

    function desenharObjeto(c, o) {
        switch (o.tipo) {
            case 'pegavel': if (!o.pego) desenharPegavel(c, o); break;
            case 'papel': desenharPapel(c, o); break;
            case 'container': desenharContainer(c, o); break;
            case 'porta': desenharPorta(c, o); break;
            case 'tabuas': desenharTabuas(c, o); break;
            case 'cofre': desenharCofre(c, o); break;
            case 'quadroForca': desenharQuadroForca(c, o); break;
            case 'saida': desenharSaida(c, o, jogo.tt); break;
        }
    }

    function desenharJogador(c, p) {
        c.save();
        c.translate(Math.round(p.x), Math.round(p.y));
        c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(0, 0, 14, 3, 0, 0, Math.PI * 2); c.fill();

        if (p.escada) {
            const sw = Math.sin(p.animT * 9);
            R(c, -8, -24 + (sw > 0 ? 3 : 0), 7, 24 - (sw > 0 ? 3 : 0), '#101018');
            R(c, 1, -24 + (sw > 0 ? 0 : 3), 7, 24 - (sw > 0 ? 0 : 3), '#16161f');
            R(c, -10, -46, 20, 24, '#1b1c26');
            R(c, -7, -62, 14, 16, '#2a1a10');
            R(c, -13, -62 + (sw > 0 ? 0 : 7), 4, 18, '#1b1c26');
            R(c, 9, -62 + (sw > 0 ? 7 : 0), 4, 18, '#1b1c26');
            c.restore();
            return;
        }

        c.scale(p.dir, 1);
        const anda = p.andando && p.noChao;
        const sw = anda ? Math.sin(p.animT * 11) : 0;
        const ar = !p.noChao;
        const luzOn = jogo.lanterna && jogo.bateria > 0;

        const lb = ar ? -4 : sw * 6, lf = ar ? 5 : -sw * 6;
        R(c, -8 + lb, -24, 7, 24, '#0e0e15'); R(c, -9 + lb, -4, 10, 4, '#050505');
        R(c, 1 + lf, -24, 7, 24, '#17171f'); R(c, 0 + lf, -4, 10, 4, '#050505');
        R(c, -12, -44 + (ar ? -6 : 0), 5, 20, '#14151d');
        R(c, -10, -46, 20, 24, '#1b1c26');
        R(c, -10, -46, 3, 24, '#14151d');
        c.fillStyle = '#e6e6e6';
        c.beginPath(); c.moveTo(-2, -46); c.lineTo(5, -46); c.lineTo(1.5, -34); c.closePath(); c.fill();
        R(c, 0, -44, 3, 13, '#a31212');
        R(c, 4, -30, 2, 2, '#444');
        R(c, -7, -62, 14, 16, '#d9b08c');
        R(c, -8, -65, 16, 7, '#2a1a10'); R(c, -8, -62, 4, 10, '#2a1a10');
        R(c, 2, -56, 3, 3, '#fff'); R(c, 3.5, -55.5, 1.6, 2.4, '#111');
        R(c, 2, -49, 4, 1.5, '#8a5a4a');
        const la = Math.atan2(Math.sin(jogo.aim), Math.cos(jogo.aim) * p.dir);
        c.save(); c.translate(4, -41); c.rotate(la);
        R(c, 0, -3, 13, 6, '#1b1c26');
        R(c, 12, -3, 4, 6, '#d9b08c');
        R(c, 14, -4, 11, 8, '#55585e');
        R(c, 25, -5, 4, 10, '#9a9da3');
        if (luzOn) R(c, 29, -4, 2, 8, '#fff3b0');
        c.restore();
        c.restore();
    }

    function alfaMonstro(f) {
        let a = Math.min(1, f.idade / 0.8);
        if (f.sumindo > 0) a *= f.sumindo / 0.6;
        return a;
    }

    function desenharMonstro(c) {
        const f = jogo.monstro;
        if (!f) return;
        const dir = jogo.p.x >= f.x ? 1 : -1;
        const bal = Math.sin(jogo.tt * 3 + f.x * 0.01);
        c.save();
        c.globalAlpha = alfaMonstro(f);
        c.translate(f.x, f.y);
        c.scale(dir, 1);

        c.fillStyle = '#1b1416';
        c.beginPath(); c.moveTo(-18, 0); c.quadraticCurveTo(-36, -60, -22, -104);
        c.quadraticCurveTo(-6, -128, 14, -110); c.quadraticCurveTo(32, -60, 20, 0); c.closePath(); c.fill();
        c.strokeStyle = '#3a2a2e'; c.lineWidth = 1.5; c.stroke();

        c.strokeStyle = '#1b1416'; c.lineWidth = 7; c.lineCap = 'round';
        c.beginPath(); c.moveTo(10, -96); c.quadraticCurveTo(40, -70 + bal * 4, 48, -26 + bal * 6); c.stroke();
        c.beginPath(); c.moveTo(-6, -96); c.quadraticCurveTo(26, -58, 36, -12 + bal * 5); c.stroke();
        c.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            c.beginPath(); c.moveTo(48, -26 + bal * 6); c.lineTo(54 + i * 3, -14 + bal * 6 + i * 5); c.stroke();
            c.beginPath(); c.moveTo(36, -12 + bal * 5); c.lineTo(42 + i * 3, 0 + i * 4); c.stroke();
        }

        c.fillStyle = '#241a1d';
        c.beginPath(); c.ellipse(8, -120, 15, 19, 0.15, 0, Math.PI * 2); c.fill();

        c.fillStyle = '#ff2020'; c.shadowColor = '#ff0000'; c.shadowBlur = 12;
        c.beginPath(); c.arc(5, -124, 2.6, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.arc(14, -124, 2.6, 0, Math.PI * 2); c.fill();
        c.shadowBlur = 0;
        c.fillStyle = '#050000';
        c.beginPath(); c.moveTo(0, -112); c.quadraticCurveTo(10, -98, 20, -112); c.quadraticCurveTo(10, -108, 0, -112); c.fill();
        c.fillStyle = '#d8d2b8';
        for (let i = 0; i < 5; i++) {
            c.beginPath(); c.moveTo(2 + i * 4, -111); c.lineTo(4 + i * 4, -111); c.lineTo(3 + i * 4, -106); c.closePath(); c.fill();
        }
        c.restore();
    }

    function desenharOlhosMonstro(cx, cy) {
        const f = jogo.monstro;
        if (!f) return;
        const dir = jogo.p.x >= f.x ? 1 : -1;
        const ey = f.y - 124 - cy;
        ctx.save();
        ctx.globalAlpha = alfaMonstro(f) * (0.7 + 0.3 * Math.sin(jogo.tt * 9));
        ctx.fillStyle = '#ff2020'; ctx.shadowColor = '#ff0000'; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(f.x + dir * 5 - cx, ey, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(f.x + dir * 14 - cx, ey, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    function cortar(L, x, y, r, a) {
        const g = L.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(0,0,0,' + a + ')'); g.addColorStop(1, 'rgba(0,0,0,0)');
        L.fillStyle = g; L.beginPath(); L.arc(x, y, r, 0, Math.PI * 2); L.fill();
    }

    function conico(L, x, y, ang, len, meia, alfa) {
        const g = L.createRadialGradient(x, y, 6, x, y, len);
        g.addColorStop(0, 'rgba(0,0,0,' + alfa + ')');
        g.addColorStop(0.55, 'rgba(0,0,0,' + (alfa * 0.7) + ')');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        L.fillStyle = g; L.beginPath(); L.moveTo(x, y); L.arc(x, y, len, ang - meia, ang + meia); L.closePath(); L.fill();
    }

    function brilhoLampada(x) {
        const s = Math.sin(jogo.tt * 31 + x) + Math.sin(jogo.tt * 17.3 + x * 2);
        return s > 1.25 ? 0.12 : (s > 0.9 ? 0.5 : 1);
    }

    function desenharLuz(cx, cy) {
        const L = lctx, p = jogo.p;
        const luzOn = jogo.lanterna && jogo.bateria > 0;
        const ox = p.x + p.dir * 18 - cx, oy = p.y - 38 - cy;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        if (luzOn) {
            const g = ctx.createRadialGradient(ox, oy, 6, ox, oy, 380);
            g.addColorStop(0, 'rgba(255,225,150,' + (0.11 * jogo.flick) + ')'); g.addColorStop(1, 'rgba(255,225,150,0)');
            ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(ox, oy);
            ctx.arc(ox, oy, 380, jogo.aim - 0.45, jogo.aim + 0.45); ctx.closePath(); ctx.fill();
        }
        const sx = 2880 - cx, sy = CHAO.L0 - 150 - cy;
        const g2 = ctx.createRadialGradient(sx, sy, 2, sx, sy, 150);
        g2.addColorStop(0, 'rgba(255,30,30,0.16)'); g2.addColorStop(1, 'rgba(255,30,30,0)');
        ctx.fillStyle = g2; ctx.fillRect(sx - 150, sy - 150, 300, 300);
        ctx.restore();

        L.globalCompositeOperation = 'source-over';
        L.clearRect(0, 0, LARGURA, ALTURA);
        L.fillStyle = 'rgba(0,0,0,0.955)';
        L.fillRect(0, 0, LARGURA, ALTURA);
        L.globalCompositeOperation = 'destination-out';

        for (let i = 0; i < LAMPADAS.length; i++) {
            const l = LAMPADAS[i];
            const wx = l.x, wy = TETO[l.n] + 46;
            if (wx < cx - 260 || wx > cx + LARGURA + 260 || wy < cy - 260 || wy > cy + ALTURA + 260) continue;
            let r = 0, a = 0;
            if (l.t === 'fraca') { r = 120; a = 0.32; }
            else if (l.t === 'pisca') { r = 150; a = 0.55 * brilhoLampada(l.x); }
            else if (l.t === 'energia') {
                if (!jogo.energia) continue;
                r = 210; a = 0.9 * (jogo.tEnergia > 0 ? (Math.random() < 0.5 ? 0.3 : 1) : 1);
            }
            cortar(L, wx - cx, wy - cy, r, a);
        }
        for (let i = 0; i < JANELAS.length; i++) {
            const j = JANELAS[i];
            cortar(L, j.x - cx, j.n - 200 - cy, 110, 0.3);
        }
        cortar(L, 2880 - cx, CHAO.L0 - 150 - cy, 120, 0.5 * (0.6 + 0.4 * Math.sin(jogo.tt * 5)));
        if (jogo.monstro) cortar(L, jogo.monstro.x - cx, jogo.monstro.y - 60 - cy, 60, 0.12);
        cortar(L, p.x - cx, p.y - 35 - cy, 85, 0.55);

        if (luzOn) {
            const k = jogo.flick;
            conico(L, ox, oy, jogo.aim, 400, 0.17, 0.5 * k);
            conico(L, ox, oy, jogo.aim, 390, 0.29, 0.35 * k);
            conico(L, ox, oy, jogo.aim, 360, 0.41, 0.25 * k);
            conico(L, ox, oy, jogo.aim, 320, 0.58, 0.15 * k);
        }
        ctx.drawImage(luzCanvas, 0, 0);
    }

    function desenhar() {
        const cx = Math.round(cam.x), cy = Math.round(cam.y);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.drawImage(fundo, cx, cy, LARGURA, ALTURA, 0, 0, LARGURA, ALTURA);
        ctx.save();
        ctx.translate(-cx, -cy);
        for (let i = 0; i < jogo.objetos.length; i++) desenharObjeto(ctx, jogo.objetos[i]);
        desenharMonstro(ctx);
        desenharJogador(ctx, jogo.p);
        ctx.restore();
        desenharLuz(cx, cy);
        desenharOlhosMonstro(cx, cy);
    }

    function iniciarSusto() {
        modo = 'susto';
        tSusto = 0;
        el.hud.classList.add('oculto');
        el.vinheta.style.opacity = 0;
        el.msg.classList.remove('visivel');
        el.telaSusto.classList.add('ativa');
        som('susto');
    }

    function desenharSusto(t) {
        const c = csusto, W = LARGURA, H = ALTURA;
        R(c, 0, 0, W, H, Math.floor(t * 18) % 2 === 0 ? '#1a0000' : '#000');
        const k = Math.min(1, t / 0.28);
        const sc = 0.35 + k * 1.05 + (t > 0.28 ? Math.sin(t * 50) * 0.015 : 0);
        const jx = (Math.random() - 0.5) * (10 + k * 14), jy = (Math.random() - 0.5) * (10 + k * 14);
        c.save();
        c.translate(W / 2 + jx, H / 2 + 30 + jy);
        c.scale(sc, sc);

        c.strokeStyle = '#050505'; c.lineWidth = 5;
        for (let i = 0; i < 46; i++) {
            const a = -Math.PI / 2 + (i / 45 - 0.5) * 2.6;
            const r2 = 270 + hash(i) * 120;
            c.beginPath(); c.moveTo(Math.cos(a) * 140, Math.sin(a) * 190);
            c.quadraticCurveTo(Math.cos(a + 0.3) * 210, Math.sin(a) * r2 * 0.8, Math.cos(a) * r2 * 0.9, Math.sin(a) * r2 * 1.1);
            c.stroke();
        }
        const g = c.createRadialGradient(0, -20, 40, 0, 0, 240);
        g.addColorStop(0, '#d7dccb'); g.addColorStop(1, '#59604f');
        c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 165, 225, 0, 0, Math.PI * 2); c.fill();
        c.strokeStyle = 'rgba(20,20,15,0.7)'; c.lineWidth = 2;
        for (let i = 0; i < 7; i++) {
            const x0 = (hash(i + 3) - 0.5) * 220, y0 = -190 + hash(i + 9) * 60;
            c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + (hash(i) - 0.5) * 60, y0 + 50); c.lineTo(x0 + (hash(i + 5) - 0.5) * 70, y0 + 110); c.stroke();
        }
        c.fillStyle = '#000';
        c.beginPath(); c.ellipse(-68, -55, 44, 58, -0.15, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.ellipse(68, -55, 44, 58, 0.15, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#ff1a1a'; c.shadowColor = '#ff0000'; c.shadowBlur = 25;
        c.beginPath(); c.arc(-68 + (Math.random() - 0.5) * 6, -48, 7, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.arc(68 + (Math.random() - 0.5) * 6, -48, 7, 0, Math.PI * 2); c.fill();
        c.shadowBlur = 0;
        c.fillStyle = '#111';
        c.beginPath(); c.ellipse(-9, 28, 5, 12, 0, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.ellipse(9, 28, 5, 12, 0, 0, Math.PI * 2); c.fill();
        const abre = 40 + k * 70 + Math.sin(t * 30) * 6;
        c.fillStyle = '#080000';
        c.beginPath(); c.moveTo(-120, 85); c.quadraticCurveTo(0, 85 + abre * 2.2, 120, 85); c.quadraticCurveTo(0, 60, -120, 85); c.fill();
        c.fillStyle = '#e6e2c4';
        for (let i = 0; i < 11; i++) {
            const x = -110 + i * 22;
            c.beginPath(); c.moveTo(x, 84); c.lineTo(x + 22, 84); c.lineTo(x + 11, 84 + 30 + hash(i) * 14); c.closePath(); c.fill();
        }
        for (let i = 0; i < 9; i++) {
            const x = -88 + i * 22;
            const yb = 85 + abre * 1.1 * (1 - Math.pow(x / 120, 2));
            c.beginPath(); c.moveTo(x, yb); c.lineTo(x + 22, yb); c.lineTo(x + 11, yb - 28 - hash(i + 20) * 10); c.closePath(); c.fill();
        }
        c.restore();

        for (let i = 0; i < 160; i++) {
            c.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.12) + ')';
            c.fillRect(Math.random() * W, Math.random() * H, Math.random() * 60 + 2, 2);
        }
        if (t < 0.15) { c.fillStyle = 'rgba(255,255,255,' + (0.8 - t * 5) + ')'; c.fillRect(0, 0, W, H); }
    }

    function gameOver(texto) {
        modo = 'gameover';
        el.telaSusto.classList.remove('ativa');
        el.gameoverTexto.textContent = texto ||
            'O tempo acabou. Ele te encontrou antes que você conseguisse sair do hotel...';
        el.telaGameover.classList.add('ativa');
    }

    function morrer(causa) {
        el.hud.classList.add('oculto');
        el.vinheta.style.opacity = 0;
        el.msg.classList.remove('visivel');
        if (causa === 'monstro') {
            som('susto');
            gameOver('A criatura saiu da escuridão e te alcançou. Mire a luz da lanterna nela antes que chegue perto...');
        } else {
            som('batida');
            gameOver('Sem luz, o medo tomou conta de você. Sua estamina acabou e você desabou na escuridão do hotel...');
        }
    }

    function vitoria() {
        modo = 'vitoria';
        som('vitoria');
        el.hud.classList.add('oculto');
        el.vinheta.style.opacity = 0;
        el.msg.classList.remove('visivel');
        el.parabensTempo.textContent = 'Tempo restante: ' + fmt(jogo.tempo) + '  |  Papéis lidos: ' + jogo.lidos.size + '/' + TOTAL_PAPEIS;
        el.telaParabens.classList.add('ativa');
        setTimeout(function () {
            el.telaParabens.classList.remove('ativa');
            el.telaTransicao.classList.add('ativa');
            setTimeout(function () { window.location.href = 'index.html'; }, 3600);
        }, 4800);
    }

    function comecar() {
        iniciarAudio();
        el.telaInicio.classList.remove('ativa');
        el.hud.classList.remove('oculto');
        modo = 'jogando';
        msg('Você acorda no quarto 204. A porta está trancada. Procure uma chave por aqui...', 5);
    }

    function reiniciar() {
        ['telaPausa', 'telaGameover', 'telaSusto', 'telaParabens', 'telaTransicao'].forEach(function (k) { el[k].classList.remove('ativa'); });
        el.modalPapel.classList.remove('ativa'); el.modalCofre.classList.remove('ativa');
        novoJogo();
        comecar();
    }

    function pausar() {
        if (modo !== 'jogando') return;
        modo = 'pausa';
        el.telaPausa.classList.add('ativa');
    }

    function retomar() {
        el.telaPausa.classList.remove('ativa');
        modo = 'jogando';
    }

    function onTecla(e) {
        const c = e.code;
        if (modo === 'inicio') { if (c === 'Enter' || c === 'Space') comecar(); return; }
        if (modo === 'leitura') { if (c === 'KeyE' || c === 'Escape' || c === 'Enter' || c === 'Space') fecharPapel(); return; }
        if (modo === 'cofre') {
            if (c === 'Escape') fecharCofre();
            else if (c === 'Enter' || c === 'NumpadEnter') confirmarCofre();
            else if (c === 'Backspace') { codigoDigitado = codigoDigitado.slice(0, -1); atualizarVisor(); }
            else if (/^Digit[0-9]$/.test(c)) digitar(c.slice(5));
            else if (/^Numpad[0-9]$/.test(c)) digitar(c.slice(6));
            return;
        }
        if (modo === 'pausa') { if (c === 'Escape' || c === 'KeyP') retomar(); return; }
        if (modo === 'gameover') { if (c === 'Enter') reiniciar(); return; }
        if (modo !== 'jogando') return;

        switch (c) {
            case 'Space': case 'KeyW': case 'ArrowUp':
                if (c === 'Space' || !escadaProxima(jogo.p)) jogo.p.pulaBuf = 0.12;
                break;
            case 'KeyE': interagir(); break;
            case 'KeyF': jogo.lanterna = !jogo.lanterna; som('clique'); break;
            case 'KeyQ': soltarSelecionado(); break;
            case 'Digit1': case 'Digit2': case 'Digit3': selecionar(parseInt(c.slice(5), 10) - 1); break;
            case 'Escape': case 'KeyP': pausar(); break;
        }
    }

    window.addEventListener('keydown', function (e) {
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) >= 0) e.preventDefault();
        if (!e.repeat) onTecla(e);
        teclas[e.code] = true;
    });
    window.addEventListener('keyup', function (e) { teclas[e.code] = false; });
    window.addEventListener('blur', function () {
        Object.keys(teclas).forEach(function (k) { teclas[k] = false; });
        if (modo === 'jogando') pausar();
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden && modo === 'jogando') pausar(); });

    $('jogo-wrap').addEventListener('mousemove', function (e) {
        const r = canvas.getBoundingClientRect();
        mouse.x = (e.clientX - r.left) * LARGURA / r.width;
        mouse.y = (e.clientY - r.top) * ALTURA / r.height;
        mouse.ativo = true;
    });

    el.slots.forEach(function (s) {
        s.addEventListener('click', function () { if (modo === 'jogando') selecionar(parseInt(s.dataset.i, 10)); });
    });

    $('btn-comecar').addEventListener('click', function () { this.blur(); comecar(); });
    $('btn-continuar').addEventListener('click', function () { this.blur(); retomar(); });
    $('btn-reiniciar-pausa').addEventListener('click', function () { this.blur(); reiniciar(); });
    $('btn-tentar').addEventListener('click', function () { this.blur(); reiniciar(); });

    let ultimo = 0;
    function loop(ts) {
        const dt = Math.min(0.05, (ts - ultimo) / 1000 || 0);
        ultimo = ts;
        jogo.tt += dt;
        if (modo === 'jogando') atualizar(dt);
        else if (modo === 'susto') {
            tSusto += dt;
            desenharSusto(tSusto);
            if (tSusto > 2.8) gameOver();
        }
        atualizarCamera(dt, false);
        desenhar();
        if (modo === 'jogando' || modo === 'leitura' || modo === 'cofre' || modo === 'pausa') atualizarHUD();
        requestAnimationFrame(loop);
    }

    montarTeclado();
    novoJogo();
    construirFundo();
    if (document.fonts && document.fonts.load) {
        Promise.all([document.fonts.load('10px "Press Start 2P"'), document.fonts.load('20px "Creepster"')])
            .then(construirFundo).catch(function () {});
    }
    requestAnimationFrame(loop);
})();