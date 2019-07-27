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
  puyoSize = 32;
  margin = 6;
  fieldWidth: number;
  fieldHeight: number;

  puyoSkin: string;
  theme: Theme;

  canvas: Canvas;
  context: CanvasRenderingContext2D;

  constructor(theme: Theme, puyoSkin: string) {
    this.theme = theme;
    this.puyoSkin = puyoSkin;

    this.fieldWidth = this.puyoSize * 6;
    this.fieldHeight = this.puyoSize * 13;

    this.canvas = createCanvas(
      this.fieldWidth * 2 + this.margin * 3,
      this.fieldHeight + this.margin * 2);

    this.context = this.canvas.getContext('2d');
    if (this.context === null) {
      throw new Error('Failed to get canvas context');
    }
  }

  get asPngBuffer() {
    return this.canvas.toBuffer('image/png');
  }

  async renderBackground() {
    this.context.fillStyle = 'white';
    this.context.fillRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height);
  }

  async renderStack(stack: StackForRendering) {
    this.context.fillStyle = this.theme.cardBackgroundColor;
    this.context.fillRect(
      this.margin,
      this.margin,
      this.fieldWidth,
      this.fieldHeight);

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
  }

  async renderNexts(nexts: number[][]) {
    const x = this.puyoSize * 6 + this.margin * 3;
    const y = this.margin;

    this.context.fillStyle = this.theme.cardBackgroundColor;
    this.context.fillRect(
      this.fieldWidth + this.margin * 2,
      this.margin,
      this.fieldWidth,
      this.puyoSize * 2 + this.margin);

    for (let i = 0; i < nexts.length; i++) {
      for (let j = 0; j < nexts[i].length; j++) {
        const resource = puyoImages[this.puyoSkin][nexts[i][j]];
        if (resource !== null) {
          const img = await loadImageWithCache(resource);
          this.context.drawImage(
            img,
            x + i * (this.puyoSize + this.margin),
            y + j * this.puyoSize,
            this.puyoSize,
            this.puyoSize);
        }
      }
    }
  }

  async renderMetrics(score: number, chain: number) {
    const height = 24;
    let x = this.fieldWidth + this.margin * 2;
    let y = this.puyoSize * 2 + this.margin * 3;

    const values = [
      { title: 'score', value: score },
      { title: 'chain', value: chain },
    ];

    for (let i = 0; i < values.length; i++) {
      this.context.fillStyle = 'black';
      this.context.font = '12px Arial';
      this.context.textBaseline = 'middle';
      this.context.textAlign = 'left';
      this.context.fillText(
        values[i].title,
        x,
        y + height / 2,
        this.fieldWidth);

      this.context.fillStyle = this.theme.cardBackgroundColor;
      this.context.fillRect(
        x + this.fieldWidth / 3,
        y,
        this.fieldWidth - this.fieldWidth / 3,
        height);

      this.context.fillStyle = 'black';
      this.context.font = '12px Arial';
      this.context.textBaseline = 'middle';
      this.context.textAlign = 'right';
      this.context.fillText(
        values[i].value.toString(),
        x + this.fieldWidth - this.margin,
        y + height / 2,
        this.fieldWidth);

      y += height + this.margin;
    }
  }

  async renderCross() {
    const img = await loadImageWithCache(cross);
    this.context.drawImage(img,
      this.margin + this.puyoSize * 2,
      this.margin + this.puyoSize,
      this.puyoSize, this.puyoSize);
  }

  async renderShadow() {
    this.context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.context.fillRect(this.margin, this.margin, this.puyoSize * 6, this.puyoSize)
  }

  async render(stack: StackForRendering, nexts?: number[][], score?: number, chain?: number) {
    if (nexts === undefined
      && score === undefined
      && chain === undefined) {
      this.canvas.width = this.fieldWidth + this.margin * 2;
    }

    await this.renderBackground();
    await this.renderStack(stack);
    await this.renderCross();
    if (nexts !== undefined) {
      await this.renderNexts(nexts);
    }
    if (score !== undefined && chain !== undefined) {
      await this.renderMetrics(score, chain);
    }
    await this.renderShadow();
  }
}