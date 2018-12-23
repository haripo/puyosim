import { ArchivedPlay, loadArchivedPlays } from "../utils/StorageService.native";
import {
  DELETE_ARCHIVE_FINISHED,
  EDIT_ARCHIVE_FINISHED,
  LOAD_ARCHIVE_LIST_FIRST_PAGE_FINISHED,
  LOAD_ARCHIVE_LIST_NEXT_PAGE_FINISHED
} from "../actions/actions";

export type ArchiveState = {
  plays: { [id: string]: ArchivedPlay },
  sortedIds: string[];
}

export const initialState: ArchiveState = {
  plays: {},
  sortedIds: []
};

function loadArchiveListFirstPageFinished(state: ArchiveState, { plays }): ArchiveState {
  for (let item of plays) {
    state.plays[item.id] = item;
  }
  state.sortedIds = plays.map(item => item.id);
  return state;
}

function loadArchivesListNextPageFinished(state: ArchiveState, { plays }): ArchiveState {
  for (let item of plays) {
    state.plays[item.id] = item;
  }
  state.sortedIds.push(...plays.map(item => item.id));
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
    case LOAD_ARCHIVE_LIST_FIRST_PAGE_FINISHED:
      return loadArchiveListFirstPageFinished(state, action);
    case LOAD_ARCHIVE_LIST_NEXT_PAGE_FINISHED:
      return loadArchivesListNextPageFinished(state, action);
    case EDIT_ARCHIVE_FINISHED:
      return editArchiveFinished(state, action);
    case DELETE_ARCHIVE_FINISHED:
      return deleteArchiveFinished(state, action);
    default:
      return state;
  }
};
