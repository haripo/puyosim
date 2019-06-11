import { Theme } from "../../src/shared/selectors/themeSelectors";
import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import { StackForRendering } from "../../src/types";
import { connectionImages, puyoImages } from "../../src/shared/assets/puyoImages";
import { HistoryRecord } from "../../src/shared/models/history";
import { getStackForRendering } from "../../src/shared/models/stack";
import { getDropPlan, getVanishPlan } from "../../src/shared/models/chainPlanner";
import * as fs from "fs";
import { spawn } from "child_process";
import tempfile = require("tempfile");

const GIFEncoder = require('gifencoder');

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

export default class FieldImageRenderer {

  puyoSize = 32;
  margin = 3;

  puyoSkin: string;
  theme: Theme;

  constructor(theme: Theme, puyoSkin: string) {
    this.theme = theme;
    this.puyoSkin = puyoSkin;
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
    let buf;
    let files: string[] = [];

    for (let record of history) {
      const stack = record.stack;

      await this.renderField(context, getStackForRendering(stack, []), this.margin, this.margin);
      // encoder.addFrame(context);
      buf = context.getImageData(0, 0, canvas.width, canvas.height).data;

      {
        let f = tempfile('.png');
        fs.writeFileSync(f, canvas.toBuffer('image/png'));
        files.push(f);
      }

      while (true) {
        const dropPlans = getDropPlan(stack, fieldRows, fieldCols);
        // console.log("DROP", JSON.stringify(dropPlans));
        if (dropPlans.length > 0) {
          // console.log(JSON.stringify(stack));
          await this.renderField(context, getStackForRendering(stack, []), this.margin, this.margin);
          {
            let f = tempfile('.png');
            fs.writeFileSync(f, canvas.toBuffer('image/png'));
            files.push(f);
            console.warn(f);
          }
          // encoder.addFrame(context);
        }

        const vanishPlans = getVanishPlan(stack, fieldRows, fieldCols);
        // console.log("VANI", JSON.stringify(vanishPlans));
        if (vanishPlans.length > 0) {
          // console.log(JSON.stringify(stack));
          await this.renderField(context, getStackForRendering(stack, []), this.margin, this.margin);
          {
            let f = tempfile('.png');
            fs.writeFileSync(f, canvas.toBuffer('image/png'));
            files.push(f);
            console.warn(f);
          }
          // encoder.addFrame(context);
        } else {
          break;
        }
      }
    }

    await spawn(
      'convert',
      ['-layers', 'optimize', '-loop', '0', '-delay', '20', ...files, 'movei.gif'],
      // {capture: ['stdout', 'stderr']}
      );

    return fs.readFileSync('movei.gif').toString('base64');

  }

  async renderField(
    context: CanvasRenderingContext2D,
    stack: StackForRendering,
    x: number, y: number) {

    // console.log("STACK", JSON.stringify(stack));

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
      let img = await loadImageWithCache(cross);
      context.drawImage(img, x + this.puyoSize * 2, y, this.puyoSize, this.puyoSize);
    }

    for (let i = 0; i < fieldRows; i++) {
      for (let j = 0; j < fieldCols; j++) {
        const resource = puyoImages[this.puyoSkin][stack[i][j].color];
        if (resource !== null) {
          const img = await loadImageWithCache(resource);
          context.drawImage(
            img,
            x + this.puyoSize * j,
            y + this.puyoSize * i,
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
          context.drawImage(
            img,
            x + this.puyoSize * j,
            y + this.puyoSize * i + this.puyoSize / 2,
            this.puyoSize,
            this.puyoSize);
        }

        if (stack[i][j].connections.right) {
          const resource = connectionImages[this.puyoSkin][stack[i][j].color - 1].horizontal;
          const img = await loadImageWithCache(resource);
          context.drawImage(
            img,
            x + this.puyoSize * j + this.puyoSize / 2,
            y + this.puyoSize * i,
            this.puyoSize,
            this.puyoSize);
        }
      }
    }
  }
}
