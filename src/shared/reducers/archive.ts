import { ArchivedPlay, loadArchivedPlays } from "../utils/StorageService.native";
import { LOAD_ARCHIVES_LIST } from "../actions/actions";

export type ArchiveState = {
  plays: { [id: string]: ArchivedPlay },
  sortedIds: string[];
}

export const initialState: ArchiveState = {
  plays: {},
  sortedIds: []
};

function loadArchivesList(state: ArchiveState, { start, count }): ArchiveState {
  const items = loadArchivedPlays(start, count);
  for (let item of items) {
    state.plays[item.id] = item;
  }
  state.sortedIds = items.map(item => item.id);
  return state;
}

export const reducer = (state: ArchiveState, action): ArchiveState => {
  switch (action.type) {
    case LOAD_ARCHIVES_LIST:
      return loadArchivesList(state, action);
    default:
      return state;
  }
};
