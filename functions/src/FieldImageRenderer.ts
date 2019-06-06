import { Theme } from "../../src/shared/selectors/themeSelectors";
import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import { StackForRendering } from "../../src/types";
import { connectionImages, puyoImages } from "../../src/shared/assets/puyoImages";
import { HistoryRecord } from "../../src/shared/models/history";
import { getStackForRendering } from "../../src/shared/models/stack";

const GIFEncoder = require('gifencoder');

const cross = require('../../assets/cross.png');

const fieldCols = 13;
const fieldRows = 6;

export default class FieldImageRenderer {

  puyoSize = 64;
  margin = 3;

  puyoSkin: string;
  theme: Theme;

  constructor(theme: Theme, puyoSkin: string) {
    this.theme = theme;
    this.puyoSkin = puyoSkin;
  }

  async render(stack: StackForRendering) {
    const fieldWidth = this.puyoSize * 6;
    const fieldHeight = this.puyoSize * 13;

    const canvas = createCanvas(
      fieldWidth + this.margin * 2,
      fieldHeight + this.margin * 2);

    const encoder = new GIFEncoder(canvas.width, canvas.height);
    encoder.setRepeat(0);
    encoder.setDelay(500);
    encoder.setQuality(10);

    const context = canvas.getContext('2d');

    if (context === null) {
      throw new Error('Failed to get canvas context');
    }

    encoder.start();

    for (let i = 0; i < 10; i++) {
      await this.renderField(context, stack, this.margin, this.margin);
      encoder.addFrame(context);
    }

    encoder.finish();

    return encoder.out.getData().toString('base64');
  }

  async renderVideo(history: HistoryRecord[]) {
    const fieldWidth = this.puyoSize * 6;
    const fieldHeight = this.puyoSize * 13;

    const canvas = createCanvas(
      fieldWidth + this.margin * 2,
      fieldHeight + this.margin * 2);

    const encoder = new GIFEncoder(canvas.width, canvas.height);

    encoder.setRepeat(0);
    encoder.setDelay(500);
    encoder.setQuality(10);

    const context = canvas.getContext('2d');

    if (context === null) {
      throw new Error('Failed to get canvas context');
    }

    encoder.start();

    for (let record of history) {
      await this.renderField(context, getStackForRendering(record.stack, []), this.margin, this.margin);
      encoder.addFrame(context);
    }

    encoder.finish();

    return encoder.out.getData().toString('base64');
  }

  async renderField(
    context: CanvasRenderingContext2D,
    stack: StackForRendering,
    x: number, y: number) {

    const fieldWidth = this.puyoSize * 6;
    const fieldHeight = this.puyoSize * 13;

    context.fillStyle = this.theme.themeColor;
    context.fillRect(
      0,
      0,
      context.canvas.width,
      context.canvas.height);

    context.fillStyle = this.theme.themeLightColor;
    context.fillRect(
      x,
      y,
      fieldWidth,
      fieldHeight);

    {
      let img = await loadImage(cross);
      context.drawImage(img, x + this.puyoSize * 2, y, this.puyoSize, this.puyoSize);
    }

    for (let i = 0; i < fieldRows; i++) {
      for (let j = 0; j < fieldCols; j++) {
        const resource = puyoImages[this.puyoSkin][stack[j][i].color];
        if (resource !== null) {
          const img = await loadImage(resource);
          context.drawImage(
            img,
            x + this.puyoSize * i,
            y + this.puyoSize * j,
            this.puyoSize,
            this.puyoSize);
        }
      }
    }

    for (let i = 0; i < fieldRows; i++) {
      for (let j = 0; j < fieldCols; j++) {
        const connection = stack[j][i].connections;
        if (connection.bottom) {
          const resource = connectionImages[this.puyoSkin][stack[j][i].color - 1].vertical;
          const img = await loadImage(resource);
          context.drawImage(
            img,
            x + this.puyoSize * i,
            y + this.puyoSize * j + this.puyoSize / 2,
            this.puyoSize,
            this.puyoSize);
        }

        if (stack[j][i].connections.right) {
          const resource = connectionImages[this.puyoSkin][stack[j][i].color - 1].horizontal;
          const img = await loadImage(resource);
          context.drawImage(
            img,
            x + this.puyoSize * i + this.puyoSize / 2,
            y + this.puyoSize * j,
            this.puyoSize,
            this.puyoSize);
        }
      }
    }
  }
}
