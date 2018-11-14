import { ArchivedPlay } from "../utils/StorageService.native";
import { ArchiveState } from "../reducers/archive";
import _ from 'lodash';

export function getArchivedPlays(state: ArchiveState): ArchivedPlay[] {
  return _.sortBy(state.plays, p => p.createdAt);
}