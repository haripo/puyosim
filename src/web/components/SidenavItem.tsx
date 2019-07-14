import React from 'react';
import { Text } from 'react-native';
import { themeColor, themeLightColor } from '../../shared/utils/constants';
import { Link } from 'react-router-dom';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  icon: string,
  text: string,
  path: string,
  isActive: boolean
}

export default function SidenavItem(props: Props) {
  return (
    <Link
      style={ {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingLeft: 20,
        textDecoration: 'none',
        opacity: props.isActive ? 1 : 0.5,
        borderLeftStyle: 'solid',
        borderLeftColor: props.isActive ? themeLightColor : themeColor,
        borderLeftWidth: 3
      } }
      to={ props.path }
    >
      <Icon name={ props.icon } size={ 20 } color={ themeLightColor }/>
      <Text style={ {
        color: themeLightColor,
        fontSize: 16,
        marginLeft: 10
      } }>
        { props.text }
      </Text>
    </Link>
  )
}
