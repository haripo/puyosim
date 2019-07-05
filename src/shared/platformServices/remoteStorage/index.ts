// @ts-ignore
import * as platform from './platform';
import { Archive, ArchiveRequestPayload } from "../../../types";

export const loadArchiveList: (startAt: Date | null, size: number, uid: string) => Promise<any> = platform.loadArchiveList
export const saveArchive: (payload: ArchiveRequestPayload, uid: string) => Promise<Archive> = platform.saveArchive;
export const deleteArchive: (id: string) => Promise<void> = platform.deleteArchive;
export const requestLogin: () => Promise<any> = platform.requestLogin;