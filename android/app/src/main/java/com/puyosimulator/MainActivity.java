package com.puyosimulator;

import com.facebook.react.ReactActivity;
import com.reactnativenavigation.controllers.SplashActivity;
import com.bugsnag.BugsnagReactNative;
import android.os.Bundle;

public class MainActivity extends SplashActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    BugsnagReactNative.start(this);
  }
}