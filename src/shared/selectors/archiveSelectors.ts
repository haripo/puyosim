import { ArchivedPlay } from "../utils/StorageService.native";
import { ArchiveState } from "../reducers/archive";
import _ from 'lodash';

export function getArchivedPlays(state: ArchiveState): ArchivedPlay[] {
  return state.sortedIds.map(id => state.plays[id]);
}