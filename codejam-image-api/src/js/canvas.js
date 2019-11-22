import rgbaToHex from './util/helper';

export default class Canvas {
  constructor() {
    // this.colorInput = document.getElementById('colorInput');
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    // Initial canvas must be 128 by 128 while 512px by 512px in width and height respectibvly, so one canvas element will be 512/4 = 128 times larger
    this.scale = 4;
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
    // To restrict user from filling canvas when clicking with mouse if pencil tool or pick color tool is selected
    this.cantFill = true;

    // draw the initial canvas on page load
    this.draw512();

    document.getElementById('128by128').addEventListener('click', () => {
      this.draw128();
    });
    document.getElementById('256by256').addEventListener('click', () => {
      this.draw256();
    });
    document.getElementById('512by512').addEventListener('click', () => {
      this.draw512();
    });
    document.getElementById('clear').addEventListener('click', () => {
      this.ctx.clearRect(0, 0, 512, 512);
    });
    const pencil = document.getElementById('pencil');
    pencil.classList.add('active');
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
      this.cantFill = true;
    });
    fillTool.addEventListener('click', () => {
      pencil.classList.remove('active');
      fillTool.classList.add('active');
      colorInput.classList.remove('active');

      this.fill();
    });

    this.canvas.addEventListener('click', (event) => {
      if (!this.cantDraw) {
        const col = Math.floor(event.offsetX / this.scale / this.scale);
        const row = Math.floor(event.offsetY / this.scale / this.scale);
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
        pencil.classList.remove('active');
        fillTool.classList.remove('active');
        colorInput.classList.add('active');

        this.colorPicker();
      } else if (event.key === 'p') {
        pencil.classList.add('active');
        fillTool.classList.remove('active');
        colorInput.classList.remove('active');

        this.cantDraw = false;
      } else if (event.key === 'b') {
        pencil.classList.remove('active');
        fillTool.classList.add('active');
        colorInput.classList.remove('active');

        this.fill();
      }
    });

    document.getElementById('grayscale').addEventListener('click', () => {
      this.grayscale();
    });

    window.onbeforeunload = () => {
      this.saveCanvas();
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
          col: Math.floor(event.offsetX / (this.scale ** 2)),
          row: Math.floor(event.offsetY / (this.scale ** 2)),
        };
      }
    });

    document.getElementById('canvas').addEventListener('mousemove', (event) => {
      if (!this.cantDraw) {
        if (this.down) {
          const col = Math.floor(event.offsetX / (this.scale ** 2));
          const row = Math.floor(event.offsetY / (this.scale ** 2));
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
    this.cantFill = false;
    document.getElementById('canvas').addEventListener('click', (event) => {
      if (this.cantDraw && !this.cantFill) {
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

  grayscale() {
    const imgData = this.ctx.getImageData(0, 0, 512, 512);
    const pixels = imgData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const lightness = parseInt(
        pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114,
        10,
      );

      pixels[i] = lightness;
      pixels[i + 1] = lightness;
      pixels[i + 2] = lightness;
    }

    this.ctx.putImageData(imgData, 0, 0);
  }

  drawOnePixel(col, row) {
    this.ctx.fillStyle = this.currentColor;
    this.ctx.fillRect(col * this.scale, row * this.scale, this.scale, this.scale);
  }

  drawImageFromUrl(url) {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    this.canvas.height = 512 / this.scale;
    this.canvas.width = this.canvas.height;
    image.onload = () => {
      if (image.width === image.height) {
        this.ctx.drawImage(image, 0, 0, image.width, image.height);
      } else if (image.width < image.height) {
        this.ctx.drawImage(image, (512 - (image.width * 512) / image.height) / 2,
          0, (image.width * 512) / image.height, 512);
      } else if (image.width > image.height) {
        this.ctx.drawImage(image, 0, (512 - (image.height * 512) / image.width) / 2,
          512, (image.height * 512) / image.width);
      }

      this.saveCanvas();
    };
    image.src = url;
  }

  draw128() {
    this.scale = 4;
    this.saveCanvas();
    this.ctx.clearRect(0, 0, 512, 512);
    this.canvas.width = 128;
    this.canvas.height = 128;
    this.loadCanvas();
  }

  draw256() {
    this.scale = 2;
    this.saveCanvas();
    this.ctx.clearRect(0, 0, 512, 512);
    this.canvas.width = 256;
    this.canvas.height = 256;
    this.loadCanvas();
  }

  draw512() {
    this.loadCanvas();
    this.scale = 1;
    this.saveCanvas();
    this.ctx.clearRect(0, 0, 512, 512);
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.loadCanvas();
  }

  colorPicker() {
    this.cantFill = true;
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

  saveCanvas() {
    localStorage.setItem('canvas', this.canvas.toDataURL());
  }

  loadCanvas() {
    if (localStorage.getItem('canvas')) {
      const dataURL = localStorage.getItem('canvas');
      this.drawImageFromUrl(dataURL);
      return true;
    }
    return false;
  }
}
