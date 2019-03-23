import firebase from "react-native-firebase";
import { ADMOB_APP_ID_IOS, ADMOB_APP_ID_ANDROID } from 'react-native-dotenv';
import { Platform } from "react-native";

abstract class Ad {
  abstract show(): void;
}

class InterstitialAd extends Ad {
  private readonly ad;
  private readonly unitId;

  constructor(unitId: string) {
    super();

    this.unitId = unitId;
    this.ad = firebase.admob().interstitial(this.unitId);
    this.load();
  }

  load() {
    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();
    this.ad.loadAd(request.build());
  }

  show() {
    if (this.ad && this.ad.isLoaded()) {
      this.ad.show();
    }
    setTimeout(() => {
      this.load();
    }, 5000);
  }
}

class NoopAd extends Ad {
  show() {
  }
}


function getReloadAd() {
  switch (Platform.OS) {
    case 'android':
      return new InterstitialAd(ADMOB_APP_ID_ANDROID);
    case 'ios':
      return new InterstitialAd(ADMOB_APP_ID_IOS);
    default:
      return new NoopAd();
  }
}

export const reloadAd = getReloadAd();