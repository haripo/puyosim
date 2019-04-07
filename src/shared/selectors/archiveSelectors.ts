import { ArchiveState } from "../reducers/archive";
import { Archive } from "../utils/OnlineStorageService";

export function getArchives(state: ArchiveState): Archive[] {
  return state.sortedIds.map(id => state.archives[id]);
}