// Canvas
var canvas = document.querySelector("canvas");
canvas.width = 400;
canvas.height = 500;
var ctx = canvas.getContext("2d");

// Variáveis

var teclas = {
    espaco: 0,
    esquerda: 0,
    cima: 0,
    direita: 0,
    baixo: 0
}

var mensagem = function (y, text, color) {
    this.x = 0;
    this.y = y;
    this.text = text;
    this.visible = true;
    this.font = "bold 20px arial";
    this.color = color;
    this.baseline = "top";
}

var mensages = [];

var cena1 = new Scene({ ctx: ctx, w: canvas.width, h: canvas.height });
var pc = new Sprite({ x: canvas.width / 2 - 15, y: canvas.height - 55, comportar: porTeclasDirecionais(teclas), props: { tipo: "pc" } }); //
var fundo = new Sprite({ origemX: 0, origemY: 56, w: canvas.width, h: canvas.height, x: 0, y: 0 })
cena1.carregaImagem(img);
cena1.adicionar(fundo);
cena1.adicionar(pc);


var mensageInicio = new mensagem(cena1.h / 2, "ENTER INICIAR", "red");
var mensagePausa = new mensagem(cena1.h / 2, "PAUSA", "red");
mensagePausa.visible = false;
mensages.push(mensageInicio);
mensages.push(mensagePausa);
var mensagePlacar = new mensagem(14, "", "white");
mensagePlacar.font = "bold 15px arial";
mensages.push(mensagePlacar);


cena1.adicionar(new Sprite({
    origemX: 31, origemY: 0, x: 150, y: -50, w: 50, h: 50, va: 30, vm: 100,
    comportar: persegue2(pc), props: { tipo: "npc", Spawn: 10 }
}));


var navFreq = 100;
var navTime = 0;
var navVida = 50;
var contaTiros = 0;
var contaAcertos = 0;
var percentAcertos = 0;
var objetivo = 70;

//Funções

function validaNav() {
    navTime++;
    if (navTime === navFreq && navVida >= 0) {
        criaNav();
        navTime = 0;
        navVida--;
        if (navFreq > 10) {
            navFreq--;

        }
    }
}

function criaNav() {
    cena1.adicionar(new Sprite({
        origemX: 31,
        x: (Math.floor(Math.random() * 8)) * 50,
        y: -60,
        w: 50,
        h: 50,
        va: 4 * Math.random(),
        vm: 200 * Math.random(),
        vy: 500,
        comportar: persegue2(pc),
        props: { tipo: "npc" }
    }));
}



function persegue(alvo) {
    return function () {
        this.vx = 50 * Math.sign(alvo.x - this.x);
        this.vy = 50 * Math.sign(alvo.y - this.y);
    }
}

function persegue2(alvo) {
    return function () {
        var dx = alvo.x - this.x;
        var dy = alvo.y - this.y;
        var adj = 1.5;
        var da = Math.sqrt(dx * dx + dy * dy);
        var prod = (dx / da) * Math.cos(this.a + adj) + (dy / da) * Math.sin(this.a + adj)

        this.va = 30 * (prod - 0);
        this.vy = 30;

        if (this.cooldown <= 0) {
            var tiroInimigo = new Sprite({
                origemX: 136, origemY: 12, x: this.x + 20, y: this.y + 32, a: this.a - 0.1 + 0 * Math.random(), img: "imagens/tiroi.png",
                w: 8, h: 13, comportar: vtiro(), props: { tipo: "npc" }, vy: +100, vx: 0
            });
            this.Scene.adicionar(tiroInimigo);
            this.cooldown = 0.9;
            // this.Scene.tiroSom();
        }

    }
}

function persegueSpawn(alvo) {
    return function () {
        var dx = alvo.x - this.x;
        var dy = alvo.y - this.y;
        var da = Math.sqrt(dx * dx + dy * dy);
        var adj = 1.5;
        var prod = (dx / da) * Math.cos(this.a + adj) +
            (dy / da) * Math.sin(this.a + adj);
        this.va = 2 * (prod - 0);
        this.props.spawn -= (1 / 60);
        if (this.props.spawn <= 0) {
            this.props.spawn = 2;
            var novo = new Sprite({
                x: this.x, y: this.y,
                vm: 100 * Math.random(),
                props: { tipo: "npc" },
                desenhar: desenhaNPC2,
                comportar: persegue2(alvo)
            });
            this.scene.adicionar(novo);
        }
        //this.vm = 30;
    }
}



function porTeclasDirecionais(teclas) {
    return function () {
        if (teclas.esquerda && !teclas.direita) {
            this.vx = -400;
        }
        if (teclas.direita && !teclas.esquerda) {
            this.vx = +400;
        }
        if (!teclas.direita && !teclas.esquerda) {
            this.vx = 0;
        }

        this.x = Math.max(this.w / 2, Math.min(cena1.w - this.w, this.x + this.va));

        if (teclas.espaco && this.cooldown <= 0) {
            var tiro = new Sprite({
                origemX: 136, origemY: 12, x: this.x + 11, y: this.y, a: this.a - 0.1 + 0 * Math.random(),
                w: 8, h: 13, comportar: vtiro(), props: { tipo: "tiro" }, vy: -1000, vx: 0, 
                rotate: (this.a + Math.PI / 2)

            });
            this.Scene.adicionar(tiro);
            this.cooldown = 0.1;
            this.Scene.tiroSom();

            contaTiros++;
        }
    }
}

function vtiro() {

    this.y = this.y + this.vy * dt;
}



function passo(t) {
    dt = (t - anterior) / 1000;
    cena1.prePasso(dt);
    anterior = t;
    validaNav();
    requestAnimationFrame(passo);
}
var dt, anterior = 0;

requestAnimationFrame(passo);

//Configura controles
addEventListener("keydown", function (e) {

    switch (e.keyCode) {
        case 37:
            teclas.esquerda = 1;
            break;
        case 39:
            teclas.direita = 1;
            break;
        case 32:
            teclas.espaco = 1;
            break;
        default:
            break;
    }
});

addEventListener("keyup", function (e) {
    switch (e.keyCode) {

        case 37:
            teclas.esquerda = 0;
            break;
        case 39:
            teclas.direita = 0;
            break;
        case 32:
            teclas.espaco = 0;
            break;
        case 13: //enter
            if (cena1.estado !== cena1.inicio) {
                cena1.estado = cena1.inicio;
                mensagePausa.visible = false;
                mensageInicio.visible = false;


            } else {
                cena1.estado = cena1.pausa;
                mensagePausa.visible = true;

            }

        default:
            break;
    }

});