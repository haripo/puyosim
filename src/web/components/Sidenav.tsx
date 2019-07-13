import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { themeColor } from '../../shared/utils/constants';
import SidenavItem from "./SidenavItem";

type Props = {
  path: string,
  style?: ViewStyle
}

export default class Sidenav extends React.Component<Props, {}> {
  render() {
    return (
      <View style={ [styles.component, this.props.style] }>
        <SidenavItem
          icon='gamepad'
          text='simulator'
          path='/s'
          isActive={ this.props.path === '/s' }
        />
        <SidenavItem
          icon='edit'
          text='editor'
          path='/e'
          isActive={ this.props.path === '/e' }
        />
        {/*<SidenavItem*/}
        {/*  icon='settings'*/}
        {/*  text='settings'*/}
        {/*  path='/settings'*/}
        {/*  isActive={ this.props.path === '/settings' }*/}
        {/*/>*/}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  component: {
    backgroundColor: themeColor,
    margin: 0,
    // boxShadow: '4px 0px 2px -2px rgba(0, 0, 0, 0.2)'
  }
});
