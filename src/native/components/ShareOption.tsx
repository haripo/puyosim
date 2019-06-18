import React, { Component } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import Share from 'react-native-share';

import { Button, Left, ListItem, Radio, Right, Text as NativeBaseText } from 'native-base';
import { Layout } from "../../shared/selectors/layoutSelectors";
import { Theme } from "../../shared/selectors/themeSelectors";
// @ts-ignore
import { PendingPair, StackForRendering } from "../../types";
import { MediaShareType, ShareOption as ShareOptionType, UrlShareType } from "../../shared/reducers/shareOption";

export type Props = {
  shareOption: ShareOptionType,
  isGenerating: boolean,

  stack: StackForRendering,
  ghosts: PendingPair
  hasEditRecord: boolean,

  puyoSkin: string,
  layout: Layout,
  layoutForCapturingField: Layout,
  theme: Theme,

  onShareOptionChanged: (hasUrl: UrlShareType, hasMedia: MediaShareType) => void,
  onSharePressed: () => void
}

type State = {}

export default class ShareOption extends Component<Props, State> {
  static navigationOptions = () => ({
    title: 'Share'
  });

  handleUrlOptionChanged(selected) {
    this.props.onShareOptionChanged(
      selected,
      this.props.shareOption.hasMedia
    );
  }

  handleMediaOptionChanged(selected) {
    this.props.onShareOptionChanged(
      this.props.shareOption.hasUrl,
      selected
    );
  }

  async handleSharePressed() {
    this.props.onSharePressed();
  }

  render() {
    const option = this.props.shareOption;
    return (
      <View style={ styles.container }>
        <View style={ styles.contents }>
          <ScrollView>
            <Text style={ styles.radioTitle }>ぷよ譜 URL</Text>
            <ListItem onPress={ this.handleUrlOptionChanged.bind(this, 'none') }>
              <Left>
                <Text>なし</Text>
              </Left>
              <Right>
                <Radio selected={ option.hasUrl === 'none' } />
              </Right>
            </ListItem>
            <ListItem onPress={ this.handleUrlOptionChanged.bind(this, 'current') }>
              <Left>
                <Text>あり</Text>
              </Left>
              <Right>
                <Radio selected={ option.hasUrl === 'current' } />
              </Right>
            </ListItem>

            <Text style={ styles.radioTitle }>メディア</Text>
            <ListItem onPress={ this.handleMediaOptionChanged.bind(this, 'none') }>
              <Left>
                <Text>なし</Text>
              </Left>
              <Right>
                <Radio selected={ option.hasMedia === 'none' } />
              </Right>
            </ListItem>
            <ListItem onPress={ this.handleMediaOptionChanged.bind(this, 'image') }>
              <Left>
                <Text>画像</Text>
              </Left>
              <Right>
                <Radio selected={ option.hasMedia === 'image' } />
              </Right>
            </ListItem>
            <ListItem onPress={ this.handleMediaOptionChanged.bind(this, 'video') }>
              <Left>
                <Text>動画</Text>
              </Left>
              <Right>
                <Radio selected={ option.hasMedia === 'video' } />
              </Right>
            </ListItem>
          </ScrollView>

          <Button
            primary
            full
            style={ styles.shareButton }
            onPress={ this.handleSharePressed.bind(this) }
          >
            <NativeBaseText>share</NativeBaseText>
          </Button>
        </View>

        <Modal
          transparent
          animationType={"none"}
          visible={this.props.isGenerating}
          onRequestClose={() => null}
        >
          <View
            style={[
              {
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              },
              { backgroundColor: `rgba(0,0,0,${0.4})` }
            ]}
          >
            <View style={{
              backgroundColor: "white",
              height: 100,
              width: 100,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ActivityIndicator animating={true} color={'blue'} size={20} />
              <Text style={{
                position: "absolute",
                paddingTop: 50
              }} numberOfLines={1}>
                動画生成中
              </Text>
            </View>
          </View>
        </Modal>
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
  radioTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 20
  },
  shareButton: {
    margin: 8,
  }
});
