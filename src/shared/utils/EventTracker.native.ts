import firebase from "react-native-firebase";

export function sendEvent(type: string, params: any): void {
  firebase.analytics().logEvent(type, params);
}

export function setUserId(id: string): void {
  firebase.analytics().setUserId(id);
}