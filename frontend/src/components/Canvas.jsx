import React, { useEffect, useRef } from "react";

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const charsRef = useRef([]);
  const wwRef = useRef(0);
  const whRef = useRef(0);
  const cameraRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const CHARS = charsRef.current;
    const MAX_CHARS = 200;
    const SEPARATION = 1;

    class Vector {
      constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
      }

      rotate(dir, ang) {
        const X = this.x;
        const Y = this.y;
        const Z = this.z;

        const SIN = Math.sin(ang);
        const COS = Math.cos(ang);

        if (dir === "x") {
          this.y = Y * COS - Z * SIN;
          this.z = Y * SIN + Z * COS;
        } else if (dir === "y") {
          this.x = X * COS - Z * SIN;
          this.z = X * SIN + Z * COS;
        }
      }

      project() {
        const ZP = this.z + cameraRef.current.z;
        const DIV = ZP / whRef.current;
        const XP = (this.x + cameraRef.current.x) / DIV;
        const YP = (this.y + cameraRef.current.y) / DIV;
        const CENTER = getCenter();
        return [XP + CENTER[0], YP + CENTER[1], ZP];
      }
    }

    class Char {
      constructor(letter, pos) {
        this.letter = letter;
        this.pos = pos;
        this.color = getRandomColor()
      }

      rotate(dir, ang) {
        this.pos.rotate(dir, ang);
      }

      render() {
        const PIXEL = this.pos.project();
        const XP = PIXEL[0];
        const YP = PIXEL[1];
        const MAX_SIZE = 50;
        const SIZE = (1 / PIXEL[2] * MAX_SIZE) | 0;
        const BRIGHTNESS = SIZE / MAX_SIZE;
        // const COL = `rgba(255, 255, ${100 * BRIGHTNESS | 0 + 150}, ${BRIGHTNESS})`;
        const COL = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${BRIGHTNESS})`;

        ctx.beginPath();
        ctx.fillStyle = COL;
        ctx.font = SIZE + "px monospace";
        ctx.fillText(this.letter, XP, YP);
        ctx.fill();
        ctx.closePath();
      }
      
    }

    function getRandomColor() {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        return [red, green, blue];
      }
      
    
    function getCenter() {
      return [wwRef.current / 2, whRef.current / 2];
    }

    function signedRandom() {
      return Math.random() - Math.random();
    }

    function render() {
      for (let i = 0; i < CHARS.length; i++) {
        CHARS[i].render();
      }
    }

    function update() {
      ctx.clearRect(0, 0, wwRef.current, whRef.current);
      for (let i = 0; i < CHARS.length; i++) {
        const DX = 0.005 * Math.sin(timeRef.current * 0.001);
        const DY = 0.005 * Math.cos(timeRef.current * 0.001);
        CHARS[i].rotate("x", DX);
        CHARS[i].rotate("y", DY);
      }
      ++timeRef.current;
    }

    function loop() {
      window.requestAnimationFrame(loop);
      update();
      render();
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createChars() {
      for (let i = 0; i < MAX_CHARS; i++) {
        const CHARACTER = String.fromCharCode((Math.random() * 93 + 34) | 0);
        const X = signedRandom() * SEPARATION;
        const Y = signedRandom() * SEPARATION;
        const Z = signedRandom() * SEPARATION;
        const POS = new Vector(X, Y, Z);
        const CHAR = new Char(CHARACTER, POS);
        CHARS.push(CHAR);
      }
    }

    function setDim() {
      wwRef.current = window.innerWidth;
      whRef.current = window.innerHeight;
      canvas.width = wwRef.current * window.devicePixelRatio | 0;
      canvas.height = whRef.current * window.devicePixelRatio | 0;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function initCamera() {
      cameraRef.current = new Vector(0, 0, SEPARATION + 1);
    }

    window.addEventListener("resize", setDim);

    setDim();
    initCamera();
    createChars();
    loop();

    return () => {
      window.removeEventListener("resize", setDim);
    };
  }, []);

  return (<div className="canvas-wrapper">
            <canvas className="canvas" ref={canvasRef}></canvas>
        </div>)
};

export default CanvasComponent;
