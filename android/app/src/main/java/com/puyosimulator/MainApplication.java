package com.puyosimulator;

import android.content.Context;
import android.support.multidex.MultiDex;

import com.apsl.versionnumber.RNVersionNumberPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import java.util.Arrays;
import java.util.List;

import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.realm.react.RealmReactPackage;
import io.sentry.RNSentryPackage;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.google.android.gms.ads.MobileAds;


public class MainApplication extends NavigationApplication implements ShareApplication /*, ReactApplication */ {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNLanguagesPackage(),
                    //new SplashScreenReactPackage(),
                    new RNViewShotPackage(),
                    new RNSharePackage(),
                    new RNFirebasePackage(),
                    new RNFirebaseFirestorePackage(),
                    new RNFirebaseAuthPackage(),
                    new RNFirebaseAdMobPackage(),
                    new RealmReactPackage(),
                    new RNVersionNumberPackage(),
                    new VectorIconsPackage(),
                    new SvgPackage(),
                    new RNSentryPackage()
                    //new NavigationReactPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    // @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        MobileAds.initialize(this, "ca-app-pub-1876795357833764~3946633388");
    }

    // @Override
    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return BuildConfig.DEBUG;
    }

    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
                // new SplashScreenReactPackage(),
                new RNLanguagesPackage(),
                new RNFirebasePackage(),
                new RNFirebaseFirestorePackage(),
                new RNFirebaseLinksPackage(),
                new RNFirebaseAuthPackage(),
                new RNFirebaseAdMobPackage(),
                new RealmReactPackage(),
                new RNSharePackage(),
                new RNVersionNumberPackage(),
                new RNViewShotPackage(),
                new VectorIconsPackage(),
                new SvgPackage(),
                new RNSentryPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }

    // @Override
    public String getJSMainModuleName() {
        return "index";
    }

    @Override
    public String getFileProviderAuthority() {
        return "com.puyosimulator.provider";
    }

    // enable multidex
    // https://developer.android.com/studio/build/multidex
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
}
