package com.puyosimulator;

import android.app.Application;

import com.facebook.react.ReactApplication;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import cl.json.RNSharePackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.realm.react.RealmReactPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import io.sentry.RNSentryPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import cl.json.ShareApplication;

import java.util.Arrays;
import java.util.List;


public class MainApplication extends NavigationApplication implements ShareApplication /*, ReactApplication */{

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNViewShotPackage(),
            new RNSharePackage(),
            new RNFirebasePackage(),
            new RNFirebaseFirestorePackage(),
            new RealmReactPackage(),
            new RNVersionNumberPackage(),
            new VectorIconsPackage(),
            new SvgPackage(),
            new RNSentryPackage(),
            //new NavigationReactPackage(),
            new RNI18nPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  //@Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  //@Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

//  @Override
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    // Add additional packages you require here
    // No need to add RnnPackage and MainReactPackage
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new RNFirebasePackage(),
      new RNFirebaseFirestorePackage(),
      new RealmReactPackage(),
      new RNSharePackage(),
      new RNVersionNumberPackage(),
      new RNViewShotPackage(),
      new VectorIconsPackage(),
      new SvgPackage(),
      new RNSentryPackage(),
      new RNI18nPackage()
    );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

//  @Override
  public String getJSMainModuleName() {
    return "index";
  }

   @Override
   public String getFileProviderAuthority() {
          return "com.puyosimulator.provider";
   }
}
