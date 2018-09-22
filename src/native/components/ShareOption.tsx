import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Navigator } from "react-native-navigation";
import Share from 'react-native-share';
import { CaptureOptions, captureRef } from "react-native-view-shot";

import { themeColor, themeLightColor } from '../../shared/utils/constants';
import { PendingPair, StackForRendering } from "../../shared/selectors/simulatorSelectors";
import { Layout } from "../../shared/selectors/layoutSelectors";
import { Theme } from "../../shared/selectors/themeSelectors";
import Field from "../../shared/components/Field";

export type Props = {
  navigator: Navigator,

  stack: StackForRendering,
  ghosts: PendingPair
  shareURL: string,

  puyoSkin: string,
  layout: Layout,
  layoutForCapturingField: Layout,
  theme: Theme,
}

type State = {
}

export default class ShareOption extends Component<Props, State> {

  static navigatorButtons = {};

  static navigatorStyle = {
    navBarBackgroundColor: themeColor,
    navBarTextColor: themeLightColor,
    navBarButtonColor: themeLightColor
  };

  viewShotRef: any = null;

  constructor(props) {
    super(props);
    this.props.navigator.setTitle({ title: "Share" });
  }

  async onWholeSharePressed() {
    try {
      // capture
      const captureOptions: CaptureOptions = {
        format: 'png',
        result: 'data-uri'
      };
      const uri = await captureRef(this.viewShotRef, captureOptions);

      // share
      const shareOptions = {
        url: uri,
        message: 'テスト'
      };
      const response = await Share.open(shareOptions);

      if (response['message'] !== 'OK') {
        // error
      }
    } catch (e) {
      // handle error
    }
  }

  handleCaptured(uri) {
    this.setState({
      imageUri: uri
    })
  }

  render() {
    const captureViewStyle = {
      left: this.props.layout.screen.width * 2, // off-screen
      width: this.props.layoutForCapturingField.field.width,
      height: this.props.layoutForCapturingField.field.height
    };

    return (
      <View
        style={ styles.container }>
        <View style={ styles.contents }>
          <Button
            onPress={ this.onWholeSharePressed.bind(this) }
            title={ 'Share whole history' }
          />
        </View>

        {/* off-screen field for generating image */}
        <View style={{ position: 'absolute' }}>
          <View ref={ r => this.viewShotRef = r } collapsable={ false } style={ captureViewStyle }>
            <Field
              layout={ this.props.layoutForCapturingField }
              theme={ this.props.theme }
              puyoSkin={ this.props.puyoSkin }
              stack={ this.props.stack }
              ghosts={ this.props.ghosts }
              style={ null }
              isActive={ true } // must be true to render ghost puyos
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#F5F5F5'
  },
  contents: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row'
  }
});
