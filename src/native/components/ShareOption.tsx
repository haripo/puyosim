import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Navigator } from "react-native-navigation";
import Share from 'react-native-share';
import { CaptureOptions, captureRef } from "react-native-view-shot";
import Icon from 'react-native-vector-icons/MaterialIcons';

import { contentsMargin, contentsPadding, themeColor, themeLightColor } from '../../shared/utils/constants';
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

type State = {}

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

  async share(shareUrl: string | null) {
    try {
      // capture
      const captureOptions: CaptureOptions = {
        format: 'png',
        result: 'data-uri'
      };
      const imageUri = await captureRef(this.viewShotRef, captureOptions);

      // share
      const shareOptions = {
        url: imageUri,
        message: shareUrl
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
    return await this.share(this.props.shareURL);
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
                "すべての操作履歴をシェア",
                "分岐を含む全ての履歴と現在手のスナップショットを共有します。",
                require('../../../assets/share-whole-history.png'),
                this.handleWholeSharePressed.bind(this))
            }
            {
              this.renderItem(
                "現在手までの操作履歴をシェア",
                "分岐を含まない現在手までの履歴とスナップショットを共有します。",
                require('../../../assets/share-single-history.png'),
                this.handleWholeSharePressed.bind(this))
            }
            {
              this.renderItem(
                "現在のスナップショットをシェア",
                "現在のスナップショット画像のみ共有します。",
                require('../../../assets/share-snapshot.png'),
                this.handleWholeSharePressed.bind(this))
            }
          </ScrollView>
        </View>

        { /* off-screen field for generating image */ }
        <View style={ { position: 'absolute', width: 0, height: 0 } }>
          <View ref={ r => this.viewShotRef = r }
                collapsable={ false }
                style={ captureViewStyle }>
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
