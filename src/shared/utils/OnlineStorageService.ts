// Firebase

import firebase from 'react-native-firebase';
import { ArchivedPlay } from "./StorageService.native";

const collectionReference = firebase.firestore().collection('test-history');

export async function loadArchiveList(startAt: Date | null, size: number, uid: string) {
  startAt = startAt ? startAt : new Date();

  startAt.setSeconds(startAt.getSeconds() - 1);

  const querySnapshot = await collectionReference
    //.where('uid', '==', uid)
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
    uid
  });
  return play;
}

export async function deleteArchive(id: string) {
  return await collectionReference.doc(id).delete();
}