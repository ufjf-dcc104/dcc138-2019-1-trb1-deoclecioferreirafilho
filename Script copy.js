(function () {
    // Canvas
    var canvas = document.querySelector("canvas");
    canvas.width = 400;
    canvas.height = 500;
    var ctx = canvas.getContext("2d");

    // Variáveis
    /* var anterior = 0;
     var dt = 0;
     var pc = new Sprite({va:10 });
     var npc = [];
     var NNPC = 3;
     var tiros = [];
     var pontos = 1000;*/
    var teclas = {
        espaco: 0,
        esquerda: 0,
        cima: 0,
        direita: 0,
        baixo: 0
    }

    var jogo = {
        carregando: 0,
        //estado: carregando,
        inicio: 1,
        pausa: 2,
        fim: 3

    }
    var cena1 = new Scene({ ctx: ctx, w: canvas.width, h: canvas.height });

    var pc = new Sprite({ x: canvas.width / 2 - 15, y: canvas.height - 30, comportar: porTeclasDirecionais(teclas), props: { tipo: "pc" } });
    cena1.adicionar(pc);

    cena1.adicionar(new Sprite({
        x: 150, y: 50, w: 90, va: 4, vm: 70, color: "red",
        comportar: persegue2(pc), props: { tipo: "npc", Spawn: 10 }
    }));
    cena1.adicionar(new Sprite({
        x: 180, y: 50, h: 30, va: 4, vm: 80, color: "yellow",
        comportar: persegue2(pc), props: { tipo: "npc" }
    }));
    cena1.adicionar(new Sprite({
        x: canvas.width / 3-25, y: 20, h: 10, w: 50, vm: 80, color: "blue",
        comportar: persegue(pc), props: { tipo: "npc" }
    }));

    //Funções

    for (var k = 0; k < 3; k++) {
        cena1.adicionar(new Sprite({
            x: canvas.width * Math.random(),
            y: 10 * Math.random(),
            h: 20,
            va: 4 * Math.random(),
            vm: 200 * Math.random(),
            color: "green", comportar: persegue2(pc),
            props: { tipo: "npc" }
        }));
    }

    function persegue(alvo) {
        return function () {
          //  this.vx = 50 * Math.sign(alvo.x - this.x);
            this.vy = 50 * Math.sign(alvo.y - this.y);
        }
    }

    function persegue2(alvo) {
        return function () {
            var dx = alvo.x - this.x;
            var dy = alvo.y - this.y;
            var adj = 1.5;
            var da = Math.sqrt(dx * dx + dy * dy);
            var prod = (dx / da) * Math.cos(this.a + adj) +
                (dy / da) * Math.sin(this.a + adj)

            this.va = 10 * (prod - 0);
            this.vm = 30;
        }
    }

    function persegueSpawn(alvo) {
        return function () {
            var dx = alvo.x - this.x;
            var dy = alvo.y - this.y;
            var adj = 1.5;
            var da = Math.sqrt(dx * dx + dy * dy);
            var prod = (dx / da) * Math.cos(this.a + adj) +
                (dy / da) * Math.sin(this.a + adj)
            this.va = 2 * (prod - 0);
            this.props.Spawn -= (1 / 60);
            if (this.props.Spawn <= 0) {
                this.props.Spawn = 3;
                var novo = new Sprite({
                    x: this.x, y: this.y,
                    vm: 100 * Math.random(),
                    props: { tipo: "npc" },
                    comportar: persegue2(alvo)
                });
                this.Scene.adicionar(novo);
            }
            //this.vm = 30;
        }
    }
    function porTeclasDirecionais(teclas) {
        return function () {
            if (teclas.esquerda) { this.vm = -200; }
            if (teclas.direita) { this.vm = +200; }
            if (teclas.esquerda === teclas.direita) { this.vm = 0; }

            //if (teclas.cima) { this.vm = +120; }
            // if (teclas.baixo) { this.vm = -120; }
            // if (teclas.cima === teclas.baixo) { this.vm = 0; }

            if (teclas.espaco && this.cooldown <= 0) {
                var tiro = new Sprite({
                    x: this.x, y: this.y, a: this.a - 0.1 + 0.2 * Math.random(),
                    vm: 240, color: "red", w: 7, h: 15, props: { tipo: "tiro" }
                });
                this.Scene.adicionar(tiro);
                this.cooldown = 0.2;
            }
        }
    }

    function passo(t) {
        dt = (t - anterior) / 1000;
        cena1.passo(dt);
        anterior = t;
        requestAnimationFrame(passo);
    }
    var dt, anterior = 0;

    requestAnimationFrame(passo);

    //Configura controles
    addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 32:
                teclas.espaco = 1;
                break;
            case 37:
                teclas.esquerda = 1;
                break;
            case 38:
                teclas.cima = 1;
                break;
            case 39:
                teclas.direita = 1;
                break;
            case 40:
                teclas.baixo = 1;
                break;
            default:
                break;
        }
    });

    addEventListener("keyup", function (e) {
        switch (e.keyCode) {

            case 32:
                teclas.espaco = 0;
                break;
            case 37:
                teclas.esquerda = 0;
                break;
            case 38:
                teclas.cima = 0;
                break;
            case 39:
                teclas.direita = 0;
                break;
            case 40:
                teclas.baixo = 0;
                break;
            case ENTER:
                if (jogo.estado !== jogo.inicio)
                    jogo.estado = inicio;
                else
                    jogo.estado = jogo.pausa;
            default:
                break;
        }

    });

}());