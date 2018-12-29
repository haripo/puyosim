import React, { Component } from 'react';
import ReactNative, {
  ActionSheetIOS,
  Alert,
  FlatList,
  LayoutAnimation, Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import { contentsMargin, fieldCols, themeColor, themeLightColor } from '../../shared/utils/constants';
import { Theme } from "../../shared/selectors/themeSelectors";
import { Layout } from "../../shared/selectors/layoutSelectors";
import Field from "../../shared/components/Field";
import { ArchivedPlay } from "../../shared/utils/StorageService.native";
import _ from 'lodash';
import { getStackForRendering, StackForRendering } from "../../shared/models/stack";
import { Navigation } from "react-native-navigation";
// @ts-ignore
import t, { formatDateTime } from '../../shared/utils/i18n';

export interface Props {
  componentId: string,

  theme: Theme,
  puyoSkin: string,
  layout: Layout,
  stack: StackForRendering,

  archivedPlays: ArchivedPlay[],

  onArchiveOpened: () => void,
  onItemPressed: (id: string) => void,
  onEndReached: () => void,
  onDeleteSelected: (id: string) => void
  onLoginRequested: () => void
}

interface State {
}

export default class Archive extends Component<Props, State> {
  itemRefs: any = [];

  static options() {
    return {
      topBar: {
        title: {
          text: 'Archive',
        },
      },
    }
  }

  componentDidMount() {
    this.props.onArchiveOpened();
    this.props.onLoginRequested();
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  handleItemClicked(id: string) {
    this.props.onItemPressed(id);
    Navigation.pop(this.props.componentId);
  }

  handleDeleteConfirmed(item: ArchivedPlay) {
    // TODO: delete item
    LayoutAnimation.easeInEaseOut();
    this.props.onDeleteSelected(item.id);
  }

  handlePopupMenuItemSelected(event: string, index: number, item: ArchivedPlay): void {
    if (event === 'itemSelected') {
      switch (index) {
        case 0: // edit
          Navigation.push(
            this.props.componentId,
            {
              component: {
                name: 'com.puyosimulator.SaveModal',
                passProps: {
                  editItem: item
                }
              }
            });
          break;
        case 1: // delete
          Alert.alert(
            t('delete'),
            t('deleteMessage'),
            [
              {
                text: 'Cancel',
                style: 'cancel'
              },
              {
                text: 'OK',
                onPress: () => this.handleDeleteConfirmed(item)
              },
            ],
            { cancelable: false }
          );
          break;
      }
    }
  }

  handleItemLongPressed(item: ArchivedPlay, itemIndex: number) {
    if (Platform.OS === 'android') {
      // @ts-ignore
      UIManager.showPopupMenu(
        ReactNative.findNodeHandle(this.itemRefs[itemIndex]),
        [
          t('edit'),
          t('delete')
        ],
        () => console.warn('something went wrong with the popup menu'),
        (event, index) => this.handlePopupMenuItemSelected(event, index, item)
      );
    } else {
      ActionSheetIOS.showActionSheetWithOptions({
        options: [
          t('edit'),
          t('delete')
        ],
      }, buttonIndex => {
        this.handlePopupMenuItemSelected('itemSelected', buttonIndex, item);
      })
    }
  }

  handleEndReached() {
    this.props.onEndReached();
  }

  renderItem({ item, index, separators }: { item: ArchivedPlay, index: number, separators: any }) {
    return (
      <TouchableOpacity
        ref={ e => { this.itemRefs[index] = e } }
        onPress={ this.handleItemClicked.bind(this, item.id) }
        onLongPress={ () => this.handleItemLongPressed(item, index) }
        style={ styles.itemWrapper }>
        <View style={ styles.fieldWrapper }>
          <Field
            layout={ this.props.layout }
            theme={ this.props.theme }
            puyoSkin={ this.props.puyoSkin }
            isActive={ false }
            stack={ getStackForRendering(_.chunk(item.stack, fieldCols), []) }
            ghosts={ [] }
            style={ { width: 10 } }
          />
        </View>
        <View style={ styles.description }>
          <View>
            <Text style={ styles.title }>
              { item.title }
            </Text>
            <Text style={ styles.lastModified }>
              { t('lastModified') }: { formatDateTime(item.updatedAt) }
            </Text>
            <Text style={ styles.stats }>
              { item.maxChain } chain, { item.score } pts.
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.contents }>
          <FlatList
            data={ this.props.archivedPlays }
            renderItem={ this.renderItem.bind(this) }
            keyExtractor={ item => item.id }
            onEndReached={ this.handleEndReached.bind(this) }
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
    flexDirection: 'column'
  },
  itemWrapper: {
    flexDirection: 'row',
    flex: 1,
    padding: contentsMargin,
    margin: contentsMargin,
    backgroundColor: themeLightColor,
    elevation: 2
  },
  fieldWrapper: {
    borderColor: themeColor + '33',
    borderWidth: 1,
    margin: contentsMargin
  },
  description: {
    justifyContent: 'space-between',
    margin: contentsMargin,
    flexGrow: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  lastModified: {
    lineHeight: 21
  },
  stats: {
    lineHeight: 21
  },
  controls: {
    flexDirection: 'row',
    alignContent: 'flex-end',
    justifyContent: 'flex-end'
  }
});
