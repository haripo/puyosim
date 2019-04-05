import firebase from "react-native-firebase";
import { Sentry } from "react-native-sentry";

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

    const snapshot = await firebase.config().getValue('minimumSupportVersion');
    return snapshot.val();
  } catch (e) {
    Sentry.captureException(e);
    console.error(e);
  }
}