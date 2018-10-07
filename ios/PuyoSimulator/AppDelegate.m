/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import "RCCManager.h"

#import <Firebase.h>
#import "RNFirebaseLinks.h"
#import "RNSplashScreen.h"

#import <React/RCTRootView.h>
#if __has_include(<React/RNSentry.h>)
#import <React/RNSentry.h> // This is used for versions of react >= 0.40
#else
#import "RNSentry.h" // This is used for versions of react < 0.40
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIROptions defaultOptions].deepLinkURLScheme = @"com.haripo.puyosim";
  [FIRApp configure];
  NSURL *jsCodeLocation;
#ifdef DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];

  [RNSplashScreen show];
  return YES;
}
  
// react-native-firebase dynamic links
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<NSString *, id> *)options {
  return [[RNFirebaseLinks instance] application:application openURL:url options:options];
}
  
// react-native-firebase dynamic links
- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray *))restorationHandler {
  return [[RNFirebaseLinks instance] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

@end
