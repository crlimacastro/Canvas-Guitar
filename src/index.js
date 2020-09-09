"use strict";

const width = 600, height = 400;

let canvas;
let ctx;

window.onload = init;

function init() {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
}