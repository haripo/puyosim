import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, Share } from 'react-native';
import { Navigator } from "react-native-navigation";
import { themeColor, themeLightColor } from '../../shared/utils/constants';
import { StackForRendering } from "../../shared/selectors/simulatorSelectors";
import { Layout } from "../../shared/selectors/layoutSelectors";
import { Theme } from "../../shared/selectors/themeSelectors";

export type Props = {
  navigator: Navigator,

  stack: StackForRendering,
  shareURL: string,

  puyoSkin: string,
  layout: Layout,
  theme: Theme,
}

export default class ShareOption extends Component<Props, {}> {

  static navigatorButtons = {};

  static navigatorStyle = {
    navBarBackgroundColor: themeColor,
    navBarTextColor: themeLightColor,
    navBarButtonColor: themeLightColor
  };

  constructor(props) {
    super(props);
    this.props.navigator.setTitle({ title: "Share" });
  }

  onWholeSharePressed() {
    Share.share({
      url: this.props.shareURL,
      message: 'hogehoge',
    })
  }

  render() {
    return (
      <View
        style={ styles.container }>
        <View style={ styles.contents }>
          <Button
            onPress={ this.onWholeSharePressed.bind(this) }
            title={ 'Share whole history' }
          />
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
