import { ArchivedPlay, loadArchivedPlays } from "../utils/StorageService.native";
import {
  DELETE_ARCHIVE_FINISHED, EDIT_ARCHIVE_FINISHED,
  LOAD_ARCHIVES_LIST_FIRST_PAGE,
  LOAD_ARCHIVES_LIST_NEXT_PAGE
} from "../actions/actions";

export type ArchiveState = {
  plays: { [id: string]: ArchivedPlay },
  sortedIds: string[];
}

export const initialState: ArchiveState = {
  plays: {},
  sortedIds: []
};

const pageSize = 20;

function loadArchivesListFirstPage(state: ArchiveState, action): ArchiveState {
  const items = loadArchivedPlays(0, pageSize);
  for (let item of items) {
    state.plays[item.id] = item;
  }
  state.sortedIds = items.map(item => item.id);
  return state;
}

function loadArchivesListNextPage(state: ArchiveState, action): ArchiveState {
  const items = loadArchivedPlays(state.sortedIds.length, pageSize);
  for (let item of items) {
    state.plays[item.id] = item;
  }
  state.sortedIds.push(...items.map(item => item.id));
  return state;
}

function deleteArchiveFinished(state: ArchiveState, action): ArchiveState {
  const { id } = action;

  delete state.plays[id];

  const index = state.sortedIds.findIndex( item => item === id);
  state.sortedIds.splice(index, 1);

  return state;
}

function editArchiveFinished(state: ArchiveState, action): ArchiveState {
  const { play } = action;

  state.plays[play.id] = play;

  return state;
}

export const reducer = (state: ArchiveState, action): ArchiveState => {
  switch (action.type) {
    case LOAD_ARCHIVES_LIST_FIRST_PAGE:
      return loadArchivesListFirstPage(state, action);
    case LOAD_ARCHIVES_LIST_NEXT_PAGE:
      return loadArchivesListNextPage(state, action);
    case EDIT_ARCHIVE_FINISHED:
      return editArchiveFinished(state, action);
    case DELETE_ARCHIVE_FINISHED:
      return deleteArchiveFinished(state, action);
    default:
      return state;
  }
};
