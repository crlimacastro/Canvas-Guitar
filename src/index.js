(function() {
    "use strict";

    const width = 600,
        height = 400;
    const fps = 60;

    let canvas;
    let ctx;
    let mouse;
    let guitar;

    let previousTime = 0;

    window.addEventListener("load", init);

    function init() {
        // Set globals
        canvas = document.querySelector("canvas");
        ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        mouse = CanvasMouseUtil.getMouseFor(canvas);
        guitar = new Guitar();

        // Start update
        update();
    }

    function update() {
        requestAnimationFrame(_ => { update(dt); });

        let currentTime = Date.now();
        let dt = (currentTime - previousTime) / 1000;
        previousTime = currentTime;

        CtxUtil.clear(ctx);
        Ambience.update(dt)
        Ambience.draw(ctx);
        guitar.updateStrings(mouse);
        guitar.draw(ctx);
    }
})();