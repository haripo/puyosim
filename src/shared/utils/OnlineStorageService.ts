// Firebase

import firebase from 'react-native-firebase';
import { ArchivedPlay } from "./StorageService.native";

const collectionReference = firebase.firestore().collection('test-history');

export async function loadArchiveList(startAt: Date | null, size: number) {
  startAt = startAt ? startAt : new Date();

  // 1 秒引くと最後にとった Archive と同じものが返ってくる
  startAt.setSeconds(startAt.getSeconds() - 1);

  const querySnapshot = await collectionReference
    .orderBy('updatedAt', 'desc')
    .startAt(startAt)
    .limit(20)
    .get();
  return querySnapshot.docs.map(d => d.data());
}

export async function saveArchive(play: ArchivedPlay) {
  await collectionReference.doc(play.id).set(play);
  return play;
}

export async function deleteArchive(id: string) {
  return await collectionReference.doc(id).delete();
}