function Image(params) {
    var exemplo = {
        scene: undefined,
        scr: "",
        cargaImg: 0
    }
    Object.assign(this, exemplo, params);
}

Image.prototype = new Image({});
Image.prototype.construtor = Image;

