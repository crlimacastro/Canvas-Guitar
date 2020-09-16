(function () {
    "use strict";

    const width = 600, height = 400;
    const fps = 60;
    const dt = 1000 / fps;

    let canvas;
    let ctx;
    let mouse;
    let guitar;

    window.addEventListener("load", init);
    function init() {
        // Set globals
        canvas = document.querySelector("canvas");
        ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        mouse = CanvasMouseUtil.getMouseFor(canvas);
        guitar = new Guitar();


        // Start updates
        let fixedUpdateInterval = setInterval(fixedUpdate, dt);
        update();
    }

    function update() {
        requestAnimationFrame(update);
        CtxUtil.clear(ctx);
        Ambience.draw(ctx);
        guitar.updateStrings(mouse);
        guitar.draw(ctx);
    }

    function fixedUpdate() {

    }
})();