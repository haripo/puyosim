import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Navigator } from "react-native-navigation";
import Share from 'react-native-share';
import { CaptureOptions, captureRef } from "react-native-view-shot";
import Icon from 'react-native-vector-icons/MaterialIcons';

import { contentsMargin, contentsPadding, themeColor, themeLightColor } from '../../shared/utils/constants';
import { PendingPair, ShareUrls, StackForRendering } from "../../shared/selectors/simulatorSelectors";
import { Layout } from "../../shared/selectors/layoutSelectors";
import { Theme } from "../../shared/selectors/themeSelectors";
import Field from "../../shared/components/Field";

// @ts-ignore
import t from '../../shared/utils/i18n';
import FieldCapturer from "./FieldCapturer";

export type Props = {
  navigator: Navigator,

  stack: StackForRendering,
  ghosts: PendingPair
  shareURLs: ShareUrls,

  puyoSkin: string,
  layout: Layout,
  layoutForCapturingField: Layout,
  theme: Theme,
}

type State = {}

export default class ShareOption extends Component<Props, State> {

  static navigatorButtons = {};

  static navigatorStyle = {
    navBarBackgroundColor: themeColor,
    navBarTextColor: themeLightColor,
    navBarButtonColor: themeLightColor
  };

  viewShotRef: any = null;
  capturer: FieldCapturer | null = null;

  constructor(props) {
    super(props);
    this.props.navigator.setTitle({ title: "Share" });
  }

  async share(shareUrl: string | null) {
    try {
      // capture
      // const captureOptions: CaptureOptions = {
      //   format: 'png',
      //   result: 'data-uri'
      // };
      // const imageUri = await captureRef(this.viewShotRef, captureOptions);
      if (this.capturer === null) {
        return;
      }
      const imageUri = await this.capturer.capture();

      // share
      const shareOptions = {
        url: imageUri,
        message: shareUrl || undefined
      };
      const response = await Share.open(shareOptions);

      if (response['message'] !== 'OK') {
        // error
        console.warn(response);
      }
    } catch (e) {
      // handle error
      console.warn(e)
    }
  }

  async handleWholeSharePressed() {
    return await this.share(this.props.shareURLs.whole);
  }

  async handleCurrentSharePressed() {
    return await this.share(this.props.shareURLs.current);
  }

  async handleSnapshotSharePressed() {
    return await this.share(null);
  }

  renderItem(title: string, description: string, image: any, handler: () => void) {
    return (
      <View style={ styles.shareCard }>
        <TouchableOpacity onPress={ handler }>
          <View style={ styles.description }>
            <View style={ { flex: 1 } }>
              <Text style={ styles.title }>
                { title }
              </Text>
              <Text>
                { description }
              </Text>
            </View>
            <View style={ { flex: 0 } }>
              <Image
                source={ image }
                style={ styles.image }
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const captureViewStyle = {
      left: this.props.layout.screen.width * 2, // off-screen
      width: this.props.layoutForCapturingField.field.width,
      height: this.props.layoutForCapturingField.field.height
    };

    return (
      <View style={ styles.container }>
        <View style={ styles.contents }>
          <ScrollView>
            {
              this.renderItem(
                t('shareWholeHistory'),
                t('shareWholeHistoryDescription'),
                require('../../../assets/share-whole-history.png'),
                this.handleWholeSharePressed.bind(this))
            }
            {
              this.renderItem(
                t('shareCurrentHistory'),
                t('shareCurrentHistoryDescription'),
                require('../../../assets/share-single-history.png'),
                this.handleCurrentSharePressed.bind(this))
            }
            {
              this.renderItem(
                t('shareSnapshot'),
                t('shareSnapshotDescription'),
                require('../../../assets/share-snapshot.png'),
                this.handleSnapshotSharePressed.bind(this))
            }
          </ScrollView>
        </View>

        { /* off-screen field for generating image */ }
        {/*<View style={ { position: 'absolute', width: 0, height: 0 } }>*/}
          {/*<View ref={ r => this.viewShotRef = r }*/}
                {/*collapsable={ false }*/}
                {/*style={ captureViewStyle }>*/}
            {/*<Field*/}
              {/*layout={ this.props.layoutForCapturingField }*/}
              {/*theme={ this.props.theme }*/}
              {/*puyoSkin={ this.props.puyoSkin }*/}
              {/*stack={ this.props.stack }*/}
              {/*ghosts={ this.props.ghosts }*/}
              {/*style={ null }*/}
              {/*isActive={ true } // must be true to render ghost puyos*/}
            {/*/>*/}
          {/*</View>*/}
        {/*</View>*/}
        <FieldCapturer
          ref={ ref => this.capturer = ref }
          { ...this.props }
        />
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
    flexDirection: 'column',
  },
  shareCard: {
    margin: contentsMargin,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: themeLightColor
  },
  title: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "bold"
  },
  image: {
    width: 80,
    height: 80,
    marginLeft: 20
  },
  description: {
    flexDirection: 'row'
  }
});
