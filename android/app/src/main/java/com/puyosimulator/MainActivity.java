package com.puyosimulator;

//import com.facebook.react.ReactActivity;
import com.reactnativenavigation.controllers.SplashActivity;
import org.devio.rn.splashscreen.SplashScreen;
import android.widget.LinearLayout;

public class MainActivity extends SplashActivity {

  @Override
  public int getSplashLayout() {
    return R.layout.launch_screen;
  }

//  @Override
//  public LinearLayout createSplashLayout() {
//    return findViewById(R.id.launch_screen);
//  }
}

// public class MainActivity extends ReactActivity {
//
//     /**
//      * Returns the name of the main component registered from JavaScript.
//      * This is used to schedule rendering of the component.
//      */
//     @Override
//     protected String getMainComponentName() {
//         return "PuyoSimulator";
//     }
// }
