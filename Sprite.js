function Sprite(params = {}) {
    var exemplo = {
        x: 0,
        y: 0,
        w: 30,
        h: 50,
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,
        a: 0,
        vm: 0,
        props: {},
        cooldown: 0,
        va: 0,
        color: "orange",
        imune: 0,
        atirando: 0,
        image: "",
        scene: undefined,
        comportar: undefined,
        limite: undefined,
        origemX: 0,
        origemY: 0,
        normal: 1,
        contaVida: 0,
        explosao: 2,
        zigzag: 3,
        estado: this.normal,
        mvestado: this.normal,
        imune:0

    }
    Object.assign(this, exemplo, params);
}

Sprite.prototype = new Sprite({});
Sprite.prototype.constructor = Sprite;

var img = new Image();
img.src = "imagens/img.png";
var tiroI = new Image();
tiroI.src = "imagens/tiroi.png";

Sprite.prototype.desenhar = function (ctx) {

    ctx.drawImage(img, this.origemX, this.origemY, this.w, this.h,
        Math.floor(this.x), Math.floor(this.y), this.w, this.h);
};



Sprite.prototype.explodir = function () {
    this.origemX = 80;
    this.w = this.h = 56;
}

Sprite.prototype.mover = function (dt) {
    this.a = this.a + this.va * dt;
    /*
    this.vx = this.vm * Math.cos(this.a);
    this.vy = this.vm * Math.sin(this.a);
    */
    this.x = this.x + this.vx * dt;
    this.y = this.y + this.vy * dt;

    this.cooldown = this.cooldown - dt;
}
Sprite.prototype.colidiuCom = function (alvo) {
    if (alvo.x + alvo.w / 2 < this.x - this.w / 2) return false;
    if (alvo.x - alvo.w / 2 > this.x + this.w / 2) return false;

    if (alvo.y + alvo.h / 2 < this.y - this.h / 2) return false;
    if (alvo.y - alvo.h / 2 > this.y + this.h / 2) return false;

    return true;
}

Sprite.prototype.centroX = function () {
    return this.x + (this.w / 2);
}
Sprite.prototype.centroY = function () {
    return this.y + (this.h / 2);
}
Sprite.prototype.meioW = function () {
    return this.w / 2;
}
Sprite.prototype.meioH = function () {
    return this.h / 2;
}
