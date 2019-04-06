// Firebase

import firebase from 'react-native-firebase';
import VersionNumber from 'react-native-version-number';

import { ArchivedPlay } from "./StorageService.native";
import { FIRESTORE_ARCHIVE_COLLECTION, FIRESTORE_ARCHIVE_COLLECTION_DEBUG } from 'react-native-dotenv';

const collection_name = __DEV__ ? FIRESTORE_ARCHIVE_COLLECTION_DEBUG : FIRESTORE_ARCHIVE_COLLECTION;
const collectionReference = firebase.firestore().collection(collection_name);

export async function loadArchiveList(startAt: Date | null, size: number, uid: string) {
  startAt = startAt ? startAt : new Date();

  startAt.setSeconds(startAt.getSeconds() - 1);

  const querySnapshot = await collectionReference
    .where('uid', '==', uid)
    .orderBy('play.updatedAt', 'desc')
    .startAt(startAt)
    .limit(size)
    .get();

  return querySnapshot.docs
    .map(d => d.data())
    .map(d => d['play']);
}

export async function saveArchive(play: ArchivedPlay, uid: string) {
  await collectionReference.doc(play.id).set({
    play,
    uid,
    schema_version: 1,
    app_version: VersionNumber.appVersion,
    build_version: VersionNumber.buildVersion
  });
  return play;
}

export async function deleteArchive(id: string) {
  return await collectionReference.doc(id).delete();
}