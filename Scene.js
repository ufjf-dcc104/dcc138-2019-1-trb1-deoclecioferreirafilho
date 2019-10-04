function Scene(params) {
    var exemplo = {
        sprites: [],
        toRemove: [],
        image: [],
        cargaDeImage: [],
        mensages:[],
        ctx: null,
        w: 0,
        h: 0,
        cargaImg: 0,
        carregando: 0,
        estado: this.carregando,
        inicio: 1,
        pausa: 2,
        fim: 3

    }
    Object.assign(this, exemplo, params);
}
Scene.prototype = new Scene();
Scene.prototype.constructor = Scene;



Scene.prototype.carregaImagem = function () {

    this.cargaImg++;
    if (this.cargaImg === this.adicionarImg.length) {
        removeEventListener('load', this.carregaImagem, false);
        this.estado = this.pausa;
    }
    console.log(this.estado + " pausa");
}

Scene.prototype.adicionarMens = function(){
   this.mensagem.push(mensagem);
  this.mensagem = this;
}


Scene.prototype.adicionar = function (sprite) {
    this.sprites.push(sprite);
    sprite.Scene = this;

}

Scene.prototype.adicionarImg = function (image) {
    this.image.push(image);
    image.Scene = this;
}


Scene.prototype.desenhar = function () {
    for (var i = 0; i < this.sprites.length; i++){
        this.sprites[i].desenhar(this.ctx);
      
    }
}

Scene.prototype.atualizar = function () {
    if (mensages.length !==0) 
    for (var i = 0; i < mensages.length; i++) {
        var mensagens = mensages[i];
        if(mensagens.visible){
            this.ctx.font = mensagens.font;
            this.ctx.fillStyle = mensagens.color;
            this.ctx.texBaseline = mensagens.baseline;
            mensagens.x = (this.w - ctx.measureText(mensagens.text).width)/2;
            this.ctx.fillText(mensagens.text, mensagens.x, mensagens.y);

        }
    }
   
}

Scene.prototype.atualizaPlacar = function(){
    mensagePlacar.text = "PONTOS: " + contaAcertos + "   -   PERC DE TIROS: " + percentAcertos + " %"
}

Scene.prototype.mover = function (dt) {
    for (var i = 0; i < this.sprites.length; i++)
        this.sprites[i].mover(dt);

}



Scene.prototype.comportar = function (dt) {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].comportar) {
            this.sprites[i].comportar();
        }
    }
}

Scene.prototype.limpar = function () {
    this.ctx.clearRect(0, 0, this.w, this.h);
}

Scene.prototype.checaColisao = function (dt) {
    for (var i = 0; i < this.sprites.length; i++) {
        for (var j = i + 1; j < this.sprites.length; j++) {
            if (this.sprites[i].colidiuCom(this.sprites[j])) {
                if (this.sprites[i].props.tipo === "pc" && this.sprites[j].props.tipo === "npc") {
                    this.toRemove.push(this.sprites[j]);
                }
                else
                    if (this.sprites[i].props.tipo === "npc" && this.sprites[j].props.tipo === "tiro") {
                        if (this.sprites[i].props.tipo === "npc") {
                            this.sprites[i].props.tipo = "expc"
                            this.sprites[i].origemX = 80;
                            this.sprites[i].w = 56;
                            this.sprites[i].h = 56;
                            this.explosaoSom();
                            contaAcertos++;

                        }
                        this.toRemove.push(this.sprites[j]);
                    }
            }
        }
    }

    setTimeout(() => {
        this.excluiExp();
    }, 1000);

}

Scene.prototype.explosaoSom = function () {
    var som = document.createElement("audio");
    som.src = "sons/explosion.ogg";
    som.addEventListener("canplaythrough", function () {
        som.play();
    })
}

Scene.prototype.tiroSom = function () {
    var som = document.createElement("audio");
    som.src = "sons/tiro.mp3";
    som.addEventListener("canplaythrough", function () {
        som.play();
    })
}

Scene.prototype.excluiExp = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].props.tipo === "expc") {
            this.toRemove.push(this.sprites[i]);
        }
    }

}

/*
Scene.prototype.mensagem = function (y, text, color) {
    this.x = 0;
    this.y = y;
    this.text = text;
    this.visible = true;
    this.font = "30px Verdana bold";
    this.color = color;
    this.baseline = "top";
}
*/





Scene.prototype.removeSprites = function () {
    for (var i = 0; i < this.toRemove.length; i++) {
        var idx = this.sprites.indexOf(this.toRemove[i]);
        if (idx >= 0) {
            this.sprites.splice(idx, 1);
        }
    }
    this.toRemove = [];
}

Scene.prototype.prePasso = function (dt) {
    this.limpar();
    this.desenhar();
    this.atualizar();
    this.atualizaPlacar();
  

    switch (this.estado) {
        case this.carregando:
            console.log(this.estado + ' Carregando...');
            break;
        case this.inicio:

            this.passo(dt);
            break;
        default:
            break;
    }
}

Scene.prototype.passo = function (dt) {

    this.comportar();
    this.mover(dt);
    this.checaColisao(dt);
    this.removeSprites();
    
}


function newFunction() {
    return "fillStyle = #dfe";
}
