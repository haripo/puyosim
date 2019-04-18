import {
  DELETE_ARCHIVE_FINISHED,
  EDIT_ARCHIVE_FINISHED, LOAD_ARCHIVE, LOAD_ARCHIVE_LIST_FIRST_PAGE,
  LOAD_ARCHIVE_LIST_FIRST_PAGE_FINISHED,
  LOAD_ARCHIVE_LIST_NEXT_PAGE_FINISHED
} from "../actions/actions";

// @ts-ignore
import { Archive } from "../utils/OnlineStorageService";

export type ArchiveState = {
  archives: { [id: string]: Archive },
  sortedIds: string[],
  isLoading: boolean
}

export const initialState: ArchiveState = {
  archives: {},
  sortedIds: [],
  isLoading: false
};

function loadArchiveListFirstPage(state: ArchiveState): ArchiveState {
  state.isLoading = true;
  return state;
}

function loadArchiveListFirstPageFinished(state: ArchiveState, { archives }): ArchiveState {
  for (let item of archives) {
    state.archives[item.play.id] = item;
  }
  state.sortedIds = archives.map(item => item.play.id);
  state.isLoading = false;
  return state;
}

function loadArchivesListNextPageFinished(state: ArchiveState, { archives }): ArchiveState {
  for (let item of archives) {
    state.archives[item.play.id] = item;
  }
  state.sortedIds.push(...archives.map(item => item.play.id));
  return state;
}

function deleteArchiveFinished(state: ArchiveState, action): ArchiveState {
  const { id } = action;

  delete state.archives[id];

  const index = state.sortedIds.findIndex( item => item === id);
  state.sortedIds.splice(index, 1);

  return state;
}

function editArchiveFinished(state: ArchiveState, action): ArchiveState {
  const { archive } = action;

  state.archives[archive.play.id] = archive;

  return state;
}

export const reducer = (state: ArchiveState, action): ArchiveState => {
  switch (action.type) {
    case LOAD_ARCHIVE_LIST_FIRST_PAGE:
      return loadArchiveListFirstPage(state);
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
