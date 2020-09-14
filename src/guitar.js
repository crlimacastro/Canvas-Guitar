(function () {
    const STRING_COUNT = 6;
    const STRING_START_X = 10;
    const STRING_LENGTH = 500;
    const STRING_START_Y = 100;
    const STRING_SPACING = 40;

    const STRING_WIDTH = 2;

    const stringState = {
        RESTING: 0,
        PLUCKING: 1,
        WAVING: 2
    }

    class String {
        constructor(startPos, endPos) {
            this.startPos = startPos;
            this.pluckPos = null;
            this.endPos = endPos;
            this.state = stringState.RESTING;
        }
        draw(ctx) {
            switch (this.state) {
                case stringState.RESTING:
                    CtxUtil.strokeLine(ctx, this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y, "black", STRING_WIDTH);
                    break;
                case stringState.PLUCKING:
                    break;
                case stringState.WAVING:
                    break;
            }
        }
    }

    class Guitar {
        constructor() {
            this.strings = [];

            // Create Strings
            for (let i = 0; i < STRING_COUNT; i++) {
                this.strings.push(new String(
                    new Vector2d(STRING_START_X, STRING_START_Y + STRING_SPACING * i),
                    new Vector2d(STRING_START_X + STRING_LENGTH, STRING_START_Y + STRING_SPACING * i)));
            }
        }
        draw(ctx) {
            CtxUtil.fillRing(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2, 150, 1000, "black");
            for (const string of this.strings)
                string.draw(ctx);
        }
    }

    if (window) {
        window["String"] = String;
        window["Guitar"] = Guitar;
    }
    else
        throw "'window is not defined'";
})();