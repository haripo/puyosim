import { Canvas, CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';

import { Theme } from "../../src/shared/selectors/themeSelectors";
import { StackForRendering } from "../../src/types";
import { connectionImages, puyoImages } from "../../src/shared/assets/puyoImages";

const cross = require('../../assets/cross.png');

const fieldRows = 13;
const fieldCols = 6;

let assetCache = {};

async function loadImageWithCache(asset: any) {
  if (!(asset in assetCache)) {
    assetCache[asset] = await loadImage(asset);
  }
  return assetCache[asset];
}

export default class CanvasRenderer {
  puyoSize = 16;
  margin = 3;

  puyoSkin: string;
  theme: Theme;

  canvas: Canvas;
  context: CanvasRenderingContext2D;

  constructor(theme: Theme, puyoSkin: string) {
    this.theme = theme;
    this.puyoSkin = puyoSkin;

    const fieldWidth = this.puyoSize * 6;
    const fieldHeight = this.puyoSize * 13;

    this.canvas = createCanvas(
      fieldWidth + this.margin * 2,
      fieldHeight + this.margin * 2);

    this.context = this.canvas.getContext('2d');
    if (this.context === null) {
      throw new Error('Failed to get canvas context');
    }
  }

  get asPngBuffer() {
    return this.canvas.toBuffer('image/png');
  }

  async render(stack: StackForRendering) {
    const fieldWidth = this.puyoSize * 6;
    const fieldHeight = this.puyoSize * 13;

    this.context.fillStyle = this.theme.themeColor;
    this.context.fillRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height);

    this.context.fillStyle = this.theme.themeLightColor;
    this.context.fillRect(
      this.margin,
      this.margin,
      fieldWidth,
      fieldHeight);

    // draw cross
    {
      const img = await loadImageWithCache(cross);
      this.context.drawImage(img,
        this.margin + this.puyoSize * 2,
        this.margin + this.puyoSize,
        this.puyoSize, this.puyoSize);
    }

    for (let i = 0; i < fieldRows; i++) {
      for (let j = 0; j < fieldCols; j++) {
        const resource = puyoImages[this.puyoSkin][stack[i][j].color];
        if (resource !== null) {
          const img = await loadImageWithCache(resource);
          this.context.drawImage(
            img,
            this.margin + this.puyoSize * j,
            this.margin + this.puyoSize * i,
            this.puyoSize,
            this.puyoSize);
        }
      }
    }

    for (let i = 0; i < fieldRows; i++) {
      for (let j = 0; j < fieldCols; j++) {
        const connection = stack[i][j].connections;
        if (connection.bottom) {
          const resource = connectionImages[this.puyoSkin][stack[i][j].color - 1].vertical;
          const img = await loadImageWithCache(resource);
          this.context.drawImage(
            img,
            this.margin + this.puyoSize * j,
            this.margin + this.puyoSize * i + this.puyoSize / 2,
            this.puyoSize,
            this.puyoSize);
        }

        if (stack[i][j].connections.right) {
          const resource = connectionImages[this.puyoSkin][stack[i][j].color - 1].horizontal;
          const img = await loadImageWithCache(resource);
          this.context.drawImage(
            img,
            this.margin + this.puyoSize * j + this.puyoSize / 2,
            this.margin + this.puyoSize * i,
            this.puyoSize,
            this.puyoSize);
        }
      }
    }

    {
      this.context.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.context.fillRect(this.margin, this.margin, this.puyoSize * 6, this.puyoSize)
    }
  }
}