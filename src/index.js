"use strict";

(function () {
    const width = 600, height = 400;
    const fps = 12;
    const dt = 1000 / fps;

    let canvas;
    let ctx;
    let mouse;

    window.addEventListener("load", init);

    function init() {
        canvas = document.querySelector("canvas");
        ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        mouse = CanvasMouseUtil.getMouseFor(canvas);

        let fixedUpdateInterval = setInterval(fixedUpdate, dt);

        drawGuitar();
    }

    function update() {
        requestAnimationFrame(update);


    }

    function fixedUpdate() {

    }

    function drawGuitar() {
        CtxUtil.fillRing(ctx, width / 2, height / 2, 150, 1000, "black");
    }
})();