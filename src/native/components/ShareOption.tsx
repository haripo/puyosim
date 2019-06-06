import React, { Component } from 'react';
import { Image, ImageStyle, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Share from 'react-native-share';

import { contentsMargin, themeLightColor } from '../../shared/utils/constants';
import { Layout } from "../../shared/selectors/layoutSelectors";
import { Theme } from "../../shared/selectors/themeSelectors";
// @ts-ignore
import t from '../../shared/utils/i18n';
import { PendingPair, ShareUrls, StackForRendering } from "../../types";

export type Props = {
  stack: StackForRendering,
  ghosts: PendingPair
  shareURLs: ShareUrls,
  hasEditRecord: boolean,

  puyoSkin: string,
  layout: Layout,
  layoutForCapturingField: Layout,
  theme: Theme,
}

type State = {}

export default class ShareOption extends Component<Props, State> {
  static navigationOptions = () => ({
    title: 'Share'
  });

  constructor(props) {
    super(props);
  }

  async share(shareUrl: string | null) {
    try {
      const r = await fetch("https://us-central1-puyosim-web.cloudfunctions.net/helloWorld");
      const data = await r.text();
      const imageUri = "data:image/gif;base64," + data;

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
                style={ styles.image as ImageStyle }
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.contents }>
          <ScrollView>
            {/*{*/}
              {/*this.renderItem(*/}
                {/*t('shareWholeHistory'),*/}
                {/*t('shareWholeHistoryDescription'),*/}
                {/*require('../../../assets/share-whole-history.png'),*/}
                {/*this.handleWholeSharePressed.bind(this))*/}
            {/*}*/}
            {
              this.props.hasEditRecord ? null : this.renderItem(
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
