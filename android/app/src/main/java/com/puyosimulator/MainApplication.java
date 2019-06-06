package com.puyosimulator;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import io.sentry.RNSentryPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication, ShareApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AsyncStoragePackage(),
            new SplashScreenReactPackage(),
            new RNSharePackage(),
            new RNLanguagesPackage(),
            new SnackbarPackage(),
            new RNSentryPackage(),
            new RNGestureHandlerPackage(),
            new RNVersionNumberPackage(),
            new VectorIconsPackage(),
            new SvgPackage(),

            new RNFirebasePackage(),
            new RNFirebaseFirestorePackage(),
            new RNFirebaseLinksPackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseAdMobPackage(),
            new RNFirebaseRemoteConfigPackage(),
            new RNFirebaseAnalyticsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

  // react-native-share
  @Override
  public String getFileProviderAuthority() {
        return BuildConfig.APPLICATION_ID + ".provider";
  }
}
