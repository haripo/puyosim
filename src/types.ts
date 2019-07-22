
export type Stack = number[][];
export type Color = 0 | 1 | 2 | 3 | 4 | 5;
export type Position = { row: number, col: number };
export type Pair = number[]; // use Color[]

export type PendingPairPuyo = {
  row: number,
  col: number,
  color: Color
}
export type PendingPair = PendingPairPuyo[];

export type PuyoConnection = {
  top: boolean,
  left: boolean,
  bottom: boolean,
  right: boolean
}

export type PuyoForRendering = {
  row: number,
  col: number,
  color: Color,
  connections: PuyoConnection
  isDropping: boolean
}

export type StackForRendering = PuyoForRendering[][];

export type Rotation = 'top' | 'right' | 'bottom' | 'left';

export type Move = {
  col: number,
  rotation: Rotation,
};

export type ArchivePlay = {
  id: string,
  queue: number[],
  stack: number[],
  maxChain: number,
  score: number,
  history: string,
  historyIndex: number,
  createdAt: Date,
  updatedAt: Date,
};

export type ArchiveRequestPayload = {
  play: ArchivePlay,
  title: string
}

export type Archive = {
  uid: string,
  play: ArchivePlay,
  title: string,
  version: {
    schema: number,
    app: string,
    build: string,
  }
}