import * as PIXI from 'pixi.js'

export module ColorFilter {
    export var active = new PIXI.filters.ColorMatrixFilter();
    active.matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1];

    export var point = new PIXI.filters.ColorMatrixFilter();
    point.matrix = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1];

    export var disable = new PIXI.filters.ColorMatrixFilter();
    disable.matrix = [
        0.5, 0, 0, 0, 0,
        0, 0.5, 0, 0, 0,
        0, 0, 0.5, 0, 0, 1];
}

export module Color {
    export var complete = 0xF50057;
}
