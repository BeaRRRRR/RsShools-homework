import pixelCanvas32 from '../data/32x32.json';
import pixelCanvas4 from '../data/4x4.json';
import rgbaToHex from './util/helper';

export default class Canvas {
  constructor() {
    // this.colorInput = document.getElementById('colorInput');
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    // Initial canvas must be 4 by 4 while 512px by 512px in width and height respectibvly, so one canvas element will be 512/4 = 128 times larger
    this.scale = 128;
    this.currentColor = '#C4C4C4';
    this.currentColorElement = document.getElementById('currentColor');
    this.prevColor = '#41F795';
    this.prevColorElement = document.getElementById('prevColor');
    // Coordinates of the canvas rectangle that was clicked for drawing line with bresenham's algorithm
    this.cords;
    // mouse down
    this.down = false;
    // To restrict drawing pixel when clicking on canvas while using color-picker or bucket tool
    this.cantDraw = false;

    // draw the initial canvas on page load
    this.draw4();

    document.getElementById('4by4').addEventListener('click', () => {
      this.draw4();
    });
    document.getElementById('32by32').addEventListener('click', () => {
      this.draw32();
    });
    document.getElementById('256by256').addEventListener('click', () => {
      this.draw256();
    });

    const pencil = document.getElementById('pencil');
    const fillTool = document.getElementById('fill');
    const colorInput = document.getElementById('colorInput');

    colorInput.addEventListener('click', () => {
      pencil.classList.remove('active');
      fillTool.classList.remove('active');
      colorInput.classList.add('active');

      this.colorPicker();
    });
    pencil.addEventListener('click', () => {
      pencil.classList.add('active');
      fillTool.classList.remove('active');
      colorInput.classList.remove('active');

      this.cantDraw = false;
    });
    fillTool.addEventListener('click', () => {
      pencil.classList.remove('active');
      fillTool.classList.add('active');
      colorInput.classList.remove('active');

      this.fill();
    });

    this.canvas.addEventListener('click', (event) => {
      if (!this.cantDraw) {
        const col = Math.floor(event.offsetX / this.scale);
        const row = Math.floor(event.offsetY / this.scale);
        this.drawOnePixel(col, row);
      }
    });

    this.prevColorElement.addEventListener('click', () => {
      this.changeColors(this.prevColor, this.currentColor);
    });

    const red = document.getElementById('red');
    red.addEventListener('click', () => {
      this.changeColors('#F74141', this.currentColor);
    });

    const blue = document.getElementById('blue');
    blue.addEventListener('click', () => {
      this.changeColors('#41B6F7', this.currentColor);
    });

    // Handle drawing lines when mouse moves fast with bresenham's algorithm
    this.handeDrawingLines();

    document.addEventListener('keypress', (event) => {
      if (event.key === 'c') {
        this.colorPicker();
      } else if (event.key === 'p') {
        this.cantDraw = false;
      } else if (event.key === 'b') {
        this.fill();
      }
    });

    window.onbeforeunload = () => {
      localStorage.setItem(`canvas${512 / this.scale}`, this.canvas.toDataURL());
    };
  }

  handeDrawingLines() {
    // Draws a line between two points
    const line = (x0, y0, x1, y1) => {
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = (x0 < x1) ? 1 : -1;
      const sy = (y0 < y1) ? 1 : -1;
      let err = dx - dy;

      while (true) {
        this.ctx.fillRect(x0 * this.scale, y0 * this.scale, this.scale, this.scale);
        this.ctx.fillStyle = this.currentColor;

        if ((x0 === x1) && (y0 === y1)) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x0 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y0 += sy;
        }
      }
    };

    document.getElementById('canvas').addEventListener('mousedown', (event) => {
      if (!this.cantDraw) {
        this.down = true;
        this.cords = {
          col: Math.floor(event.offsetX / this.scale),
          row: Math.floor(event.offsetY / this.scale),
        };
      }
    });

    document.getElementById('canvas').addEventListener('mousemove', (event) => {
      if (!this.cantDraw) {
        if (this.down) {
          const col = Math.floor(event.offsetX / this.scale);
          const row = Math.floor(event.offsetY / this.scale);
          line(this.cords.col, this.cords.row, col, row);
          this.cords.col = col;
          this.cords.row = row;
        }
      }
    });

    document.getElementById('canvas').addEventListener('mouseup', () => {
      if (!this.cantDraw) {
        this.down = false;
      }
    });
  }

  fill() {
    // Flood filling algorigth for filling closed areas https://en.wikipedia.org/wiki/Flood_fill
    const floodFill = (elem, targetColor) => {
      const getColor = (col, row) => {
        const imageData = this.ctx.getImageData(col * this.scale, row * this.scale, 1, 1).data;
        const elemColor = rgbaToHex(imageData[0], imageData[1], imageData[2], imageData[3]);
        return elemColor;
      };

      // eslint-disable-next-line max-len
      if (getColor(elem.col, elem.row) !== targetColor || elem.col < 0 || elem.col > 512 / this.scale || elem.row < 0 || elem.row > 512 / this.scale) {
        return;
      }

      this.ctx.fillStyle = this.currentColor;
      this.ctx.fillRect(elem.col * this.scale, elem.row * this.scale, this.scale, this.scale);

      const q = [];
      q.push(elem);
      while (q.length > 0) {
        const n = q.shift();
        if (n.col < 0 || n.col > 512 / this.scale || n.row < 0 || n.row > 512 / this.scale) break;
        if (getColor(n.col - 1, n.row) == targetColor) {
          this.ctx.fillRect((n.col - 1) * this.scale, n.row * this.scale, this.scale, this.scale);
          q.push({ col: n.col - 1, row: n.row });
        }
        if (getColor(n.col + 1, n.row) == targetColor) {
          this.ctx.fillRect((n.col + 1) * this.scale, n.row * this.scale, this.scale, this.scale);
          q.push({ col: n.col + 1, row: n.row });
        }
        if (getColor(n.col, n.row - 1) == targetColor) {
          this.ctx.fillRect(n.col * this.scale, (n.row - 1) * this.scale, this.scale, this.scale);
          q.push({ col: n.col, row: n.row - 1 });
        }
        if (getColor(n.col, n.row + 1) == targetColor) {
          this.ctx.fillRect(n.col * this.scale, (n.row + 1) * this.scale, this.scale, this.scale);
          q.push({ col: n.col, row: n.row + 1 });
        }
      }
    };


    this.cantDraw = true;
    document.getElementById('canvas').addEventListener('click', (event) => {
      if (this.cantDraw) {
        const col = Math.floor(event.offsetX / this.scale);
        const row = Math.floor(event.offsetY / this.scale);
        const imageData = this.ctx.getImageData(col * this.scale, row * this.scale, 1, 1).data;
        const targetColor = rgbaToHex(imageData[0], imageData[1], imageData[2], imageData[3]);
        if (targetColor != this.currentColor) {
          floodFill({ col, row }, targetColor);
        }
      }
    });
  }

  drawOnePixel(col, row) {
    this.ctx.fillStyle = this.currentColor;
    this.ctx.fillRect(col * this.scale, row * this.scale, this.scale, this.scale);
  }

  drawImageFromUrl(url) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, 512, 512);
    };
  }

  draw4() {
    if (this.scale === 16) {
      localStorage.setItem('canvas32', this.canvas.toDataURL());
    } else if (this.scale === 2) {
      localStorage.setItem('canvas256', this.canvas.toDataURL());
    }
    this.ctx.clearRect(0, 0, 512, 512);
    this.scale = 128;
    if (localStorage.getItem('canvas4')) {
      const dataURL = localStorage.getItem('canvas4');
      this.drawImageFromUrl(dataURL);
    } else {
      const width = pixelCanvas4[0].length;
      const height = pixelCanvas4.length;

      this.canvas.width = width * this.scale;
      this.canvas.height = height * this.scale;


      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          this.ctx.fillStyle = pixelCanvas4[row][col];
          this.ctx.fillRect(col * this.scale, row * this.scale, this.scale, this.scale);
        }
      }
    }
  }

  draw32() {
    if (this.scale === 128) {
      localStorage.setItem('canvas4', this.canvas.toDataURL());
    } else if (this.scale === 2) {
      localStorage.setItem('canvas256', this.canvas.toDataURL());
    }
    this.ctx.clearRect(0, 0, 512, 512);
    this.scale = 16;

    if (localStorage.getItem('canvas32')) {
      const dataURL = localStorage.getItem('canvas32');
      this.drawImageFromUrl(dataURL);
    } else {
      const width = pixelCanvas32[0].length;
      const height = pixelCanvas32.length;
      this.scale = 16;

      this.canvas.width = width * this.scale;
      this.canvas.height = height * this.scale;

      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          // eslint-disable-next-line max-len
          this.ctx.fillStyle = rgbaToHex(pixelCanvas32[row][col][0], pixelCanvas32[row][col][1], pixelCanvas32[row][col][2], pixelCanvas32[row][col][3]);
          this.ctx.fillRect(col * this.scale, row * this.scale, this.scale, this.scale);
        }
      }
    }
  }

  draw256() {
    if (this.scale === 16) {
      localStorage.setItem('canvas32', this.canvas.toDataURL());
    } else if (this.scale === 128) {
      localStorage.setItem('canvas4', this.canvas.toDataURL());
    }

    this.ctx.clearRect(0, 0, 512, 512);
    this.scale = 2;
    if (localStorage.getItem('canvas256')) {
      this.drawImageFromUrl(localStorage.getItem('canvas256'));
    }
  }

  colorPicker() {
    this.cantDraw = true;
    this.canvas.addEventListener('click', (event) => {
      event.stopImmediatePropagation(); // One for some reason generates two events
      const col = Math.floor(event.offsetX / this.scale);
      const row = Math.floor(event.offsetY / this.scale);
      const imageData = this.ctx.getImageData(col * this.scale, row * this.scale, 1, 1).data;
      const color = `rgba(${imageData[0]},${imageData[1]},${imageData[2]},${imageData[3]}`;
      this.changeColors(color, this.currentColor);
    });
  }

  changeColors(currentColor, previousColor) {
    [this.currentColor, this.prevColor] = [currentColor, previousColor];
    this.prevColorElement.firstElementChild.style.backgroundColor = this.prevColor;
    this.currentColorElement.firstElementChild.style.backgroundColor = this.currentColor;
  }
}
