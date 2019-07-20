import VersionNumber from "react-native-version-number";
import { Archive, ArchiveRequestPayload } from "../../../types";


export async function loadArchiveList(startAt: Date | null, size: number, uid: string): Promise<any> {
  return new Promise(() => {});
}

export async function saveArchive(payload: ArchiveRequestPayload, uid: string): Promise<Archive> {
  return new Promise(() => null);
}

export async function deleteArchive(id: string): Promise<void> {
}

// @ts-ignore
export function requestLogin(): Promise<any> {
}