import * as fs from "fs";
import tempfile from 'tempfile';
import { spawn } from "child-process-promise";
import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';

import { Theme } from "../../src/shared/selectors/themeSelectors";
import { Stack, StackForRendering } from "../../src/types";
import { connectionImages, puyoImages } from "../../src/shared/assets/puyoImages";
import { HistoryRecord } from "../../src/shared/models/history";
import { getStackForRendering } from "../../src/shared/models/stack";
import { getDropPlan, getVanishPlan } from "../../src/shared/models/chainPlanner";

const cross = require('../../assets/cross.png');
import { performance } from 'perf_hooks';

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

  puyoSize = 16;
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

    const context = canvas.getContext('2d');

    if (context === null) {
      throw new Error('Failed to get canvas context');
    }

    let files: string[] = [];
    const renderAndSave = async (stack: Stack) => {
      const renderingStack = getStackForRendering(stack, []);
      await this.renderField(context, renderingStack, this.margin, this.margin);
      const f = tempfile('.png');
      fs.writeFileSync(f, canvas.toBuffer('image/png'));
      files.push(f);
    };

    const time1 = performance.now();

    for (const record of history) {
      const stack = record.stack;
      await renderAndSave(stack);

      // run chains
      while (true) {
        const dropPlans = getDropPlan(stack, fieldRows, fieldCols);
        if (dropPlans.length > 0) {
          await renderAndSave(stack);
        }

        const vanishPlans = getVanishPlan(stack, fieldRows, fieldCols);
        if (vanishPlans.length > 0) {
          await renderAndSave(stack);
        } else {
          break;
        }
      }
    }

    const time2 = performance.now();

    const outputFile = tempfile('.gif');
    await spawn(
      'convert',
      ['-loop', '0', '-delay', '60', ...files, '-treedepth', '2', '-layers', 'optimize', '-sample', '200%', outputFile]);

    const time3 = performance.now();

    console.info("Tick", time2 - time1, time3 - time2);

    return fs.readFileSync(outputFile).toString('base64');
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
      const img = await loadImageWithCache(cross);
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
