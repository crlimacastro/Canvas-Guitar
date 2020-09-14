(function () {
    const STRING_COUNT = 6;
    const STRING_SPACING = 40;

    const STRING_START_X = 10;
    const STRING_START_Y = 100;
    const STRING_LENGTH = 500;
    const STRING_WIDTH = 2;

    const PLUCK_START_DISTANCE = 3;
    const MAX_PLUCK_DISTANCE = 20;

    const SINE_WAVE_DETAIL = 100;
    const MAX_WAVE_AMPLITUDE = 10;
    const MAX_WAVE_DURATION = 1000;

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
        updateState(mouse) {
            let mouseOver = mouse => Math.abs(mouse.pos.y - this.startPos.y) < PLUCK_START_DISTANCE;
            let maxDistanceReached = mouse => Math.abs(this.pluckPos.y - this.startPos.y) > MAX_PLUCK_DISTANCE;

            if (mouse.mouseDown && mouseOver(mouse))
                this.state = stringState.PLUCKING;
            if (!mouse.mouseDown)
                this.state = stringState.RESTING;

            if (this.state == stringState.PLUCKING) {
                this.pluckPos = mouse.pos;

                if (maxDistanceReached(mouse))
                    this.state = stringState.RESTING;
            }
        }
        pluck(distance) {
            this.state = stringState.PLUCKING;
            const amplitude = CrlLib.map_range(distance, 0, MAX_PLUCK_DISTANCE, 0, MAX_WAVE_AMPLITUDE);
            const duration =  CrlLib.map_range(distance, 0, MAX_PLUCK_DISTANCE, 0, MAX_WAVE_DURATION);
            setTimeout(_ => {this.state = stringState.RESTING}, duration);
            // TODO
        }
        draw(ctx) {
            switch (this.state) {
                case stringState.RESTING:
                    CtxUtil.strokeLine(ctx, this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y, "black", STRING_WIDTH);
                    break;
                case stringState.PLUCKING:
                    CtxUtil.strokeLine(ctx, this.startPos.x, this.startPos.y, this.pluckPos.x, this.pluckPos.y, "black", STRING_WIDTH);
                    CtxUtil.strokeLine(ctx, this.pluckPos.x, this.pluckPos.y, this.endPos.x, this.endPos.y, "black", STRING_WIDTH);
                    break;
                case stringState.WAVING:
                    // Draw rolling shutter effect
                    // ctx.save();
                    // for (let i = 0; i < array.length; i++) {
                    //     const element = array[i];
                        
                    // }
                    // ctx.restore();
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
        updateStrings(mouse) {
            for (const string of this.strings)
                string.updateState(mouse);
        }
        draw(ctx) {
            CtxUtil.fillRing(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2, 150, 1000, "black");
            for (const string of this.strings)
                string.draw(ctx);
        }
    }

    if (window) {
        window["Guitar"] = Guitar;
    }
    else
        throw "'window is not defined'";
})();