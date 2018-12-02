import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { contentsMargin, fieldCols, fieldRows, themeColor, themeLightColor } from '../../shared/utils/constants';
import { Theme } from "../../shared/selectors/themeSelectors";
import { Layout } from "../../shared/selectors/layoutSelectors";
import Field from "../../shared/components/Field";
import Icon from "react-native-vector-icons/MaterialIcons";
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
  onEndReached: () => void
}

interface State {
}

export default class Archive extends Component<Props, State> {
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
  }

  handleItemClicked(id: string) {
    this.props.onItemPressed(id);
    Navigation.pop(this.props.componentId);
  }

  handleEndReached() {
    this.props.onEndReached();
  }

  renderItem({ item, index, separators }: { item: ArchivedPlay, index: number, separators: any }) {
    return (
      <TouchableOpacity
        onPress={ this.handleItemClicked.bind(this, item.id) }
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
