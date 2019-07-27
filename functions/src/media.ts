import * as fs from "fs";
import tempfile from 'tempfile';
import { spawn } from "child-process-promise";

import { Theme } from "../../src/shared/selectors/themeSelectors";
import { Stack } from "../../src/types";
import { HistoryRecord } from "../../src/shared/models/history";
import { getStackForRendering } from "../../src/shared/models/stack";
import { getDropPlan, getVanishPlan } from "../../src/shared/models/chainPlanner";

import ffmpeg from 'ffmpeg-static';
import CanvasRenderer from './canvasRenderer';
import { calcChainStepScore } from '../../src/shared/models/score';

const fieldRows = 13;
const fieldCols = 6;

export async function createVideo(history: HistoryRecord[], queue: number[][], theme: Theme, puyoSkin: string) {
  const canvasRenderer = new CanvasRenderer(theme, puyoSkin);

  let filePrefix = tempfile();
  let fileCount = 0;
  const renderAndSave = async (stack: Stack, record: HistoryRecord, score: number, chain: number, chainScore: number) => {
    const renderingStack = getStackForRendering(stack, []);
    await canvasRenderer.render(
      renderingStack,
      queue.slice(record.numHands, record.numHands + 2),
      score,
      chainScore,
      chain);
    const f = filePrefix + String(fileCount++).padStart(5, '0') + '.png';
    fs.writeFileSync(f, canvasRenderer.asPngBuffer);
  };

  let totalScore = 0;
  for (const record of history) {
    const stack = record.stack;
    let chain = 0;
    let chainScore = 0;
    await renderAndSave(stack, record, totalScore, chain, chainScore);

    // run chains
    while (true) {
      const dropPlans = getDropPlan(stack, fieldRows, fieldCols);
      if (dropPlans.length > 0) {
        await renderAndSave(stack, record, totalScore, chain, chainScore);
      }

      const vanishPlans = getVanishPlan(stack, fieldRows, fieldCols);
      if (vanishPlans.length > 0) {
        chain++;
        const stepScore = calcChainStepScore(chain, vanishPlans);
        chainScore += stepScore;
        totalScore += stepScore;
        await renderAndSave(stack, record, totalScore, chain, chainScore);
      } else {
        break;
      }
    }
  }

  const outputFile = tempfile('.mp4');
  const spawnResponse = spawn(
    ffmpeg.path,
    ['-framerate', '3', '-i', filePrefix + '%05d.png', '-vcodec', 'libx264', '-pix_fmt', 'yuv420p', '-sws_flags', 'neighbor'/*, '-vf', '"scale=408:-1"'*/, outputFile],
    { shell: true });

  let ffmpegOutput = '';
  spawnResponse.childProcess.stdout.on('data', data => {
    ffmpegOutput += '[spawn] stdout: ' + data.toString() + '\n';
  });
  spawnResponse.childProcess.stderr.on('data', data => {
    ffmpegOutput += '[spawn] stderr: ' + data.toString() + '\n';
  });

  await spawnResponse;

  console.info("Ffmpeg finished: \n" + ffmpegOutput);
  return fs.readFileSync(outputFile);
}

export async function createImage(stack: Stack, theme: Theme, puyoSkin: string) {
  const canvasRenderer = new CanvasRenderer(theme, puyoSkin);

  const renderingStack = getStackForRendering(stack, []);
  await canvasRenderer.render(renderingStack);

  const f = tempfile('.gif');
  fs.writeFileSync(f, canvasRenderer.asPngBuffer);

  await spawn(
    'convert',
    ['-sample', '200%', f, f]);

  return fs.readFileSync(f);
}