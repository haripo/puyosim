import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Share from 'react-native-share';

import { Button, Left, ListItem, Radio, Right, Text as NativeBaseText } from 'native-base';
import { Layout } from "../../shared/selectors/layoutSelectors";
import { Theme } from "../../shared/selectors/themeSelectors";
// @ts-ignore
import { PendingPair, StackForRendering } from "../../types";
import { MediaShareType, ShareOption as ShareOptionType, UrlShareType } from "../../shared/reducers/shareOption";
import ModalIndicator from "../../shared/components/ModalIndicator";

// @ts-ignore
import { t } from "../../shared/utils/i18n";

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
            <Text style={ styles.radioTitle }>{ t('shareUrlType') }</Text>
            <ListItem onPress={ this.handleUrlOptionChanged.bind(this, 'none') }>
              <Left>
                <Text>{ t('shareUrlTypeNone') }</Text>
              </Left>
              <Right>
                <Radio selected={ option.hasUrl === 'none' } />
              </Right>
            </ListItem>
            <ListItem onPress={ this.handleUrlOptionChanged.bind(this, 'current') }>
              <Left>
                <Text>{ t('shareUrlTypeSimple') }</Text>
              </Left>
              <Right>
                <Radio selected={ option.hasUrl === 'current' } />
              </Right>
            </ListItem>

            <Text style={ styles.radioTitle }>{ t('shareMediaType') }</Text>
            <ListItem onPress={ this.handleMediaOptionChanged.bind(this, 'none') }>
              <Left>
                <Text>{ t('shareMediaTypeNone') }</Text>
              </Left>
              <Right>
                <Radio selected={ option.hasMedia === 'none' } />
              </Right>
            </ListItem>
            <ListItem onPress={ this.handleMediaOptionChanged.bind(this, 'image') }>
              <Left>
                <Text>{ t('shareMediaTypeImage') }</Text>
              </Left>
              <Right>
                <Radio selected={ option.hasMedia === 'image' } />
              </Right>
            </ListItem>
            <ListItem onPress={ this.handleMediaOptionChanged.bind(this, 'video') }>
              <Left>
                <Text>{ t('shareMediaTypeMovie') }</Text>
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
            disabled={ this.props.shareOption.hasMedia === 'none' && this.props.shareOption.hasUrl === 'none' }
          >
            <NativeBaseText>{ t('confirmShare') }</NativeBaseText>
          </Button>
        </View>

        <ModalIndicator visible={ this.props.isGenerating } text={ t('shareProcessing') } />
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
