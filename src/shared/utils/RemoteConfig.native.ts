import firebase from "react-native-firebase";
import { Sentry } from "react-native-sentry";

// @ts-ignore
import { captureException } from "./Sentry";

export async function getMinimumSupportedAppVersion() {
  try {
    if (__DEV__) {
      firebase.config().enableDeveloperMode();
    }

    // Set default values
    firebase.config().setDefaults({
      minimumSupportVersion: "0.0",
    });

    await firebase.config().fetch();
    const activated = await firebase.config().activateFetched();

    if (!activated) {
      console.info('Fetched data not activated');
    }

    const key = 'minimumSupportVersion' + (__DEV__ ? 'Debug' : '');

    const snapshot = await firebase.config().getValue(key);
    return snapshot.val();
  } catch (e) {
    captureException(e);
    console.error(e);
  }
}