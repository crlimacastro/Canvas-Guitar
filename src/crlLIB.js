(function() {
    "use strict";

    let CrlLib = {
        CtxUtil: {
            clear(ctx) {
                ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
            },

            fillBackground(ctx, color) {
                ctx.save();
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
                ctx.restore();
            },

            fadeTo(ctx, r, g, b, fadeFactor = 1) {
                let imgData = ctx.getImageData(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
                fadeFactor = Math.floor(fadeFactor);
                for (let i = 0; i < imgData.data.length; i += 4) {
                    let oldR = imgData.data[i];
                    let oldG = imgData.data[i + 1];
                    let oldB = imgData.data[i + 2];
                    if (oldR > r) {
                        while (oldR - fadeFactor < r)
                            fadeFactor--;
                        oldR -= fadeFactor;
                    } else if (oldR < r) {
                        while (oldR + fadeFactor > r)
                            fadeFactor++;
                        oldR += fadeFactor;
                    }
                    imgData.data[i] = oldR;

                    if (oldG > g) {
                        while (oldG - fadeFactor < g)
                            fadeFactor--;
                        oldG -= fadeFactor;
                    } else if (oldG < g) {
                        while (oldG + fadeFactor > g)
                            fadeFactor--;
                        oldG += fadeFactor;
                    }
                    imgData.data[i + 1] = oldG;

                    if (oldB > b) {
                        while (oldB - fadeFactor < b)
                            fadeFactor--;
                        oldB -= fadeFactor;
                    } else if (oldB < b) {
                        while (oldB + fadeFactor > b)
                            fadeFactor--;
                        oldB += fadeFactor;
                    }
                    imgData.data[i + 2] = b;
                }
                ctx.putImageData(imgData, 0, 0);
            },

            // ************************ Canvas Transformations ************************

            rotateAbout(ctx, x, y, angle) {
                ctx.translate(x, y);
                ctx.rotate(-angle);
                ctx.translate(-x, -y);
            },

            scaleAbout(ctx, x, y, scaleX, scaleY) {
                ctx.translate(x, y);
                ctx.scale(scaleX, scaleY);
                ctx.translate(-x, -y);
            },

            // ************************************************************************

            // ******** Shapes ********
            fillRectangle(ctx, x, y, w, h, color = "black", angle = 0) {
                ctx.save();
                this.rotateAbout(ctx, (x + w * .5), (y + h * .5), angle);
                ctx.beginPath();
                ctx.rect(x, y, w, h);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
                ctx.restore();
            },

            strokeRectangle(ctx, x, y, w, h, color = "black", angle = 0, strokeWidth = 1, lineDash = [], lineJoin = "miter") {
                ctx.save();
                this.rotateAbout(ctx, (x + w * .5), (y + h * .5), angle);
                ctx.beginPath();
                ctx.rect(x, y, w, h);
                ctx.closePath();
                ctx.lineWidth = strokeWidth;
                ctx.setLineDash(lineDash);
                ctx.lineJoin = lineJoin;
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.restore();
            },

            fillCircle(ctx, x, y, r, color = "black") {
                ctx.save();
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
                ctx.restore();
            },

            strokeCircle(ctx, x, y, r, color = "black", strokeWidth = 1, lineDash = [], lineJoin = "miter") {
                ctx.save()
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.lineWidth = strokeWidth;
                ctx.setLineDash(lineDash);
                ctx.lineJoin = lineJoin;
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.restore();
            },

            fillTriangle(ctx, x, y, b, h, color = "black", angle = 0) {
                ctx.save();
                this.rotateAbout(ctx, (x + b * .5), (y + h * .5), angle);
                ctx.beginPath();
                ctx.moveTo(x - b * .5, y + h * .5);
                ctx.lineTo(x, y - h * .5);
                ctx.lineTo(x + b * .5, y + h * .5);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
                ctx.restore();
            },

            strokeTriangle(ctx, x, y, b, h, color = "black", angle = 0, strokeWidth = 1, lineDash = [], lineJoin = "miter") {
                ctx.save();
                this.rotateAbout(ctx, (x + b * .5), (y + h * .5), angle);
                ctx.beginPath();
                ctx.moveTo(x - b * .5, y + h * .5);
                ctx.lineTo(x, y - h * .5);
                ctx.lineTo(x + b * .5, y + h * .5);
                ctx.closePath();
                ctx.lineWidth = strokeWidth;
                ctx.setLineDash(lineDash);
                ctx.lineJoin = lineJoin;
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.restore();
            },

            fillRightTriangle(ctx, x, y, b, h, color = "black", angle = 0) {
                ctx.save();
                this.rotateAbout(ctx, x, y, angle);
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + h);
                ctx.lineTo(x + b, y + h);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
                ctx.restore();
            },

            strokeRightTriangle(ctx, x, y, b, h, color = "black", angle = 0, strokeWidth = 1, lineDash = [], lineJoin = "miter") {
                ctx.save();
                this.rotateAbout(ctx, x, y, angle);
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + h);
                ctx.lineTo(x + b, y + h);
                ctx.closePath();
                ctx.lineWidth = strokeWidth;
                ctx.setLineDash(lineDash);
                ctx.lineJoin = lineJoin;
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.restore();
            },

            fillArc(ctx, x, y, r, startTheta, endTheta, invert = false, color = "black", angle = 0) {
                ctx.save();
                this.rotateAbout(ctx, x, y, angle);
                ctx.beginPath();
                if (endTheta > startTheta)
                    ctx.arc(x, y, r, startTheta, -endTheta, !invert);
                else
                    ctx.arc(x, y, r, startTheta, -endTheta, invert);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
                ctx.restore();
            },

            strokeArc(ctx, x, y, r, startTheta, endTheta, invert = false, color = "black", angle = 0, strokeWidth = 1, lineDash = [], lineJoin = "miter") {
                ctx.save();
                this.rotateAbout(ctx, x, y, angle);
                ctx.beginPath();
                if (endTheta > startTheta)
                    ctx.arc(x, y, r, startTheta, -endTheta, !invert);
                else
                    ctx.arc(x, y, r, startTheta, -endTheta, invert);
                ctx.closePath();
                ctx.lineWidth = strokeWidth;
                ctx.setLineDash(lineDash);
                ctx.lineJoin = lineJoin;
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.restore();
            },

            fillRing(ctx, x, y, r1, r2, color = "black") {
                ctx.save();
                ctx.beginPath();
                ctx.arc(x, y, r1, 0, Math.PI * 2);
                ctx.arc(x, y, r2, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
                ctx.restore();
            },

            strokeRing(ctx, x, y, r1, r2, color = "black", strokeWidth = 1, lineDash = [], lineJoin = "miter") {
                ctx.save()
                ctx.lineWidth = strokeWidth;
                ctx.setLineDash(lineDash);
                ctx.lineJoin = lineJoin;
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, r1, 0, Math.PI * 2);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(x, y, r2, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            },

            fillPolygon(ctx, points, color = "black", angle = 0) {
                if (points.length < 3) throw TypeError("'points' array does not contain at least 3 points");

                ctx.save();
                let minX = Number.MAX_VALUE;
                let minY = Number.MAX_VALUE;
                let maxX = Number.MIN_VALUE;
                let maxY = Number.MIN_VALUE;
                for (let i = 0; i < points.length; i++) {
                    if (points[i].x < minX)
                        minX = points[i].x;
                    else if (points[i].x > maxX)
                        maxX = points[i].x;

                    if (points[i].y < minY)
                        minY = points[i].y;
                    else if (points[i].y > maxY)
                        maxY = points[i].y;
                }
                const w = maxX - minX;
                let h = maxY - minY;
                this.rotateAbout(ctx, minX + w * .5, minY + h * .5, angle);

                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++)
                    ctx.lineTo(points[i].x, points[i].y);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
                ctx.restore();
            },

            strokePolygon(ctx, points, color = "black", angle = 0, strokeWidth = 1, lineDash = [], lineJoin = "miter") {
                if (points.length < 3) throw TypeError("'points' array does not contain at least 3 points");

                ctx.save();
                let minX = Number.MAX_VALUE;
                let minY = Number.MAX_VALUE;
                let maxX = Number.MIN_VALUE;
                let maxY = Number.MIN_VALUE;
                for (let i = 0; i < points.length; i++) {
                    if (points[i].x < minX)
                        minX = points[i].x;
                    else if (points[i].x > maxX)
                        maxX = points[i].x;

                    if (points[i].y < minY)
                        minY = points[i].y;
                    else if (points[i].y > maxY)
                        maxY = points[i].y;
                }
                const w = maxX - minX;
                let h = maxY - minY;

                this.rotateAbout(ctx, minX + w * .5, minY + h * .5, angle);

                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++)
                    ctx.lineTo(points[i].x, points[i].y);
                ctx.closePath();
                ctx.lineWidth = strokeWidth;
                ctx.setLineDash(lineDash);
                ctx.lineJoin = lineJoin;
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.restore();
            },

            strokeLine(ctx, x1, y1, x2, y2, color = "black", strokeWidth = 1, lineDash = []) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.closePath();
                ctx.lineWidth = strokeWidth;
                ctx.setLineDash(lineDash);
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.restore();
            },

            strokeLines(ctx, points, color = "black", strokeWidth = 1, lineDash = [], lineJoin = "miter") {
                if (points.length < 2) throw TypeError("'points' array does not contain at least 2 points");

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++)
                    ctx.lineTo(points[i].x, points[i].y);
                ctx.lineWidth = strokeWidth;
                ctx.setLineDash(lineDash);
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.restore();
            },

            strokeSin(ctx, x, y, amplitude, periodLength, endTheta, color = "black", strokeWidth = 1, lineDash = [], lineJoin = "miter") {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, y);
                for (let theta = Math.PI / 2, i = 0; theta < endTheta; theta += Math.PI, i++) {
                    // X coord in the current period
                    let iX = x + i * (periodLength / 2);
                    // Y coord of sin theta in the current period 
                    let iY = amplitude * Math.sin(theta);
                    ctx.quadraticCurveTo(iX + (periodLength / 4), y - iY,
                        iX + (periodLength / 2), y);
                }
                ctx.lineWidth = strokeWidth;
                ctx.setLineDash(lineDash);
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.restore();
            }

            // ************************
        },
        RandUtil: {
            getRandom(min, max) {
                return Math.random() * (max - min) + min;
            },

            getRandomInt(min, max) {
                min = Math.floor(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },

            getRandomUnsignedByte() {
                return this.getRandomInt(0, 255);
            },

            getRandomColor() {
                return `rgb(${this.getRandomUnsignedByte()}, ${this.getRandomUnsignedByte()}, ${this.getRandomUnsignedByte()})`;
            },

            getRandomColorA(alpha = undefined) {
                if (alpha == undefined)
                    return `rgba(${this.getRandomUnsignedByte()}, ${this.getRandomUnsignedByte()}, ${this.getRandomUnsignedByte()}, ${this.getRandom(0, 1)})`;
                else
                    return `rgba(${this.getRandomUnsignedByte()}, ${this.getRandomUnsignedByte()}, ${this.getRandomUnsignedByte()}, ${alpha})`;
            }
        },
        CanvasMouseUtil: {
            getMouseFor: canvas => {
                let getMouseCanvasCoord = e => {
                    let rect = e.target.getBoundingClientRect();
                    let mouseX = e.clientX - rect.x;
                    let mouseY = e.clientY - rect.y;
                    return { x: mouseX, y: mouseY };
                };
                let mouse = {
                    pos: { x: 0, y: 0 },
                    mouseDown: false,
                };
                canvas.addEventListener("mousemove", e => {
                    mouse.pos = getMouseCanvasCoord(e);
                });
                canvas.addEventListener("mousedown", e => {
                    mouse.mouseDown = true;
                });
                canvas.addEventListener("mouseup", e => {
                    mouse.mouseDown = false;
                });
                canvas.addEventListener("mouseleave", e => {
                    mouse.mouseDown = false;
                });

                return mouse;
            }
        },
        Vec2dUtil: {
            Vector2d: class {
                constructor(x = 0, y = 0) {
                    this.x = x;
                    this.y = y;
                }
                magnitude() {
                    return Math.sqrt(this.x * this.x + this.y * this.y);
                }
                static getMagnitude(v) {
                    return Math.sqrt(v.x * v.x + v.y * v.y);
                }
                normalize() {
                    const magnitude = this.magnitude();
                    this.x = this.x / magnitude;
                    this.y = this.y / magnitude;
                }
                static getNormalized(v) {
                    const magnitude = Vector2d.getMagnitude(v);
                    return new Vector2d(v.x / magnitude, v.y / magnitude);
                }
                scale(scalar) {
                    this.x = this.x * scalar;
                    this.y = this.y * scalar;
                }
                static getScaled(v, scalar) {
                    return new Vector2d(v.x * scalar, v.y * scalar);
                }
                setMagnitude(magnitude) {
                    this.normalize();
                    this.scale(magnitude);
                }
                static getSetMagnitude(v, magnitude) {
                    const normalized = Vector2d.getNormalized(v);
                    const scaled = Vector2d.getScaled(normalized, magnitude);
                    return new Vector2d(scaled.x, scaled.y);
                }
                rotate(angle) {
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);
                    const rotX = this.x * cos - this.y * sin;
                    const rotY = this.x * sin + this.y * cos;
                    this.x = rotX;
                    this.y = rotY;
                }
                static getRotated(v, angle) {
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);
                    return new Vector2d(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
                }
                static getPerpendicular(v, counterClockwise = true) {
                    if (counterClockwise)
                        return new Vector2d(-v.y, v.x);
                    else
                        return new Vector2d(v.y, -v.x);
                }
                static dot(v1, v2) {
                    return v1.x * v2.x + v1.y * v2.y;
                }
                static wedge(v1, v2) {
                    return v1.x * v2.y - v2.x * v1.y;
                }
                static areParallel(v1, v2) {
                    return Vector2d.getMagnitude(v1) == 0 || Vector2d.getMagnitude(v2) == 0 ? false : Vector2d.wedge(v1, v2) == 0;
                }
                static component(v1, v2) {
                    return Vector2d.dot(v1, v2) / Vector2d.getMagnitude(v2);
                }
                project(v) {
                    const component = Vector2d.component(this, v);
                    const normalized = Vector2d.getNormalized(v);
                    this.x = normalized.x * component;
                    this.y = normalized.y * component;
                }
                static getProjected(v1, v2) {
                    const component = Vector2d.component(v1, v2);
                    const normalized = Vector2d.getNormalized(v2);
                    return new Vector2d(normalized.x * component, normalized.y * component);
                }
                add(v) {
                    this.x += v.x;
                    this.y += v.y;
                }
                static add(v1, v2) {
                    return new Vector2d(v1.x + v2.x, v1.y + v2.y);
                }
                subtract(v) {
                    this.x -= v.x;
                    this.y -= v.y;
                }
                static subtract(v1, v2) {
                    return new Vector2d(v1.x - v2.x, v1.y - v2.y);
                }
                static getMidpoint(v1, v2) {
                    return Vector2d.getScaled(Vector2d.add(v1, v2), .5);
                }
                static angleBetween(v1, v2) {
                    return Math.acos(Vector2d.dot(v1, v2) / (Vector2d.getMagnitude(v1) * Vector2d.getMagnitude(v2)));
                }
                static getRandomUnit() {
                    return new Vector2d(Math.random(), Math.random()).normalize();
                }
                drawAt(ctx, x = 0, y = 0, color = "red", strokeWidth = 1) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + this.x, y - this.y);
                    ctx.closePath();
                    ctx.lineWidth = strokeWidth;
                    ctx.strokeStyle = color;
                    ctx.stroke();
                    ctx.restore();
                }
            },

            Ray2d: class {
                constructor(pos, dir) {
                    this.pos = new Vector2d(pos.x, pos.y);
                    this.dir = new Vector2d(dir.x, dir.y);
                }
                draw(ctx, color = "red", strokeWidth = 1) {
                    this.dir.drawAt(ctx, this.pos.x, this.pos.y, color, strokeWidth);
                }
            },

            radToDeg(radians) {
                return radians * 180 / Math.PI;
            },

            degToRad(degrees) {
                return degrees * Math.PI / 180;
            }
        },
        // Function for remapping a value from one range of numbers to another
        // Like the function in Processing
        // https://stackoverflow.com/questions/5649803/remap-or-map-function-in-javascript
        map_range(value, min1, max1, min2, max2) {
            return min2 + (max2 - min2) * (value - min1) / (max1 - min1);
        },
        // Linear interpolation
        lerp(a, b, t) {
            return a * (1 - t) + b * t;
        }
    }

    if (window) {
        window["CrlLib"] = CrlLib;
        window["CtxUtil"] = CrlLib.CtxUtil;
        window["RandUtil"] = CrlLib.RandUtil;
        window["CanvasMouseUtil"] = CrlLib.CanvasMouseUtil;
        window["Vec2dUtil"] = CrlLib.Vec2dUtil;
        window["Vector2d"] = CrlLib.Vec2dUtil.Vector2d;
        window["Ray2d"] = CrlLib.Vec2dUtil.Ray2d;
    } else
        throw "'window is not defined'";
})();