import VersionNumber from "react-native-version-number";

type ArchivePlay = {
  id: string,
  queue: number[],
  stack: number[],
  maxChain: number,
  score: number,
  history: string,
  historyIndex: number,
  createdAt: any,
  updatedAt: any,
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
export async function loadArchiveList(startAt: Date | null, size: number, uid: string) {
}

export async function saveArchive(payload: ArchiveRequestPayload, uid: string) {
}

export async function deleteArchive(id: string) {
}

// @ts-ignore
export function requestLogin(): Promise<any> {
}