import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { contentsMargin, themeColor, themeLightColor } from '../../shared/utils/constants';
import { HistoryRecord } from "../../shared/models/history";
import { Theme } from "../../shared/selectors/themeSelectors";
import { Layout } from "../../shared/selectors/layoutSelectors";
import { StackForRendering } from "../../shared/selectors/simulatorSelectors";
import Field from "../../shared/components/Field";
import Icon from "react-native-vector-icons/MaterialIcons";

export interface Props {
  theme: Theme,
  puyoSkin: string,
  layout: Layout,

  stack: StackForRendering,
  history: HistoryRecord[],
  historyIndex: number,
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

  renderItem({ item, index, separators }) {
    return (
      <View style={ styles.itemWrapper }>
        <View style={ styles.fieldWrapper }>
          <Field
            layout={ this.props.layout }
            theme={ this.props.theme }
            puyoSkin={ this.props.puyoSkin }
            isActive={ false }
            stack={ this.props.stack }
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
              last modified: 2018-10-10 12:23:34
            </Text>
            <Text style={ styles.stats }>
              120 hands, 8 chain, total 120000 pts.
            </Text>
          </View>
          <View style={ styles.controls }>
            <TouchableOpacity>
              <Icon name="star" size={ 25 } color={ themeColor }/>
              { /* star_border */ }
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  render() {
    const items = [
      { title: 'hogehoge' },
      { title: 'fugafuga' }
    ];
    return (
      <View style={ styles.container }>
        <View style={ styles.contents }>
          <FlatList
            data={ items }
            renderItem={ this.renderItem.bind(this) }
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
