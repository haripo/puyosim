import firebase, { RNFirebase } from 'react-native-firebase';
import VersionNumber from 'react-native-version-number';

import { FIRESTORE_ARCHIVE_COLLECTION, FIRESTORE_ARCHIVE_COLLECTION_DEBUG } from 'react-native-dotenv';
import { Archive, ArchiveRequestPayload } from "../../../types";

const collection_name = __DEV__ ? FIRESTORE_ARCHIVE_COLLECTION_DEBUG : FIRESTORE_ARCHIVE_COLLECTION;
const collectionReference = firebase.firestore().collection(collection_name);


export async function loadArchiveList(startAt: Date | null, size: number, uid: string) {
  startAt = startAt ? startAt : new Date();

  startAt.setSeconds(startAt.getSeconds() - 1);

  const querySnapshot = await collectionReference
    .where('uid', '==', uid)
    .orderBy('play.updatedAt', 'desc')
    .startAt(firebase.firestore.Timestamp.fromDate(startAt))
    .limit(size)
    .get();

  return querySnapshot.docs
    .map(d => d.data())
    .map(d => {
      // convert RNFirebase.firestore.Timestamp to Date
      d['play']['createdAt'] = new Date(d['play']['createdAt'].seconds * 1000);
      d['play']['updatedAt'] = new Date(d['play']['updatedAt'].seconds * 1000);
      return d;
    });
}

export async function saveArchive(payload: ArchiveRequestPayload, uid: string): Promise<Archive> {
  const request: Archive = {
    title: payload.title,
    play: {
      ...payload.play,
    },
    uid,
    version: {
      schema: 2,
      app: VersionNumber.appVersion,
      build: VersionNumber.buildVersion
    }
  };

  const dateConvertedRequest: any = request;
  dateConvertedRequest.play.createdAt = firebase.firestore.Timestamp.fromDate(payload.play.createdAt);
  dateConvertedRequest.play.updatedAt = firebase.firestore.Timestamp.fromDate(payload.play.updatedAt);

  await collectionReference.doc(payload.play.id).set(dateConvertedRequest);
  return request;
}

export async function deleteArchive(id: string) {
  return await collectionReference.doc(id).delete();
}

export async function requestLogin(): Promise<any> {
  const credential = await firebase.auth().signInAnonymously();
  console.info('uid: ', credential.user.uid);
  return credential;
}