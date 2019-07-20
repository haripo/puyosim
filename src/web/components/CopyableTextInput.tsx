import React from 'react';
import { Clipboard, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { themeColor, themeLightColor } from '../../shared/utils/constants';

function downloadUrl(path: string, filename?: string) {
  // @ts-ignore
  const el = document.createElement('a');
  el.download = filename || 'file';
  el.href = path;
  el.click();
}

export type Props = {
  value: string,
  hasDownload?: boolean,
  filename?: string,
  style?: ViewStyle
}

export default function CopyableTextInput(props: Props) {
  return (
    <View style={ {
      display: 'flex',
      flexDirection: 'row',

      padding: 6,
      margin: 6,
      paddingBottom: 10,
      borderWidth: 1,
      borderRadius: 3,
      borderColor: themeLightColor
    } }>
      <TextInput
        value={ props.value }
        style={ {
          flex: 1
        } }
      />
      <TouchableOpacity
        onPress={ () => Clipboard.setString(props.value) }
        style={ {
          backgroundColor: themeColor,
          padding: 6,
          borderRadius: 3
        } }
      >
        <Text style={ {
          color: themeLightColor
        } }>
          COPY
        </Text>
      </TouchableOpacity>
      { props.filename !== undefined ?
        (
          <TouchableOpacity
            onPress={ () => downloadUrl(props.value, props.filename) }
            style={ {
              backgroundColor: themeColor,
              padding: 6,
              marginLeft: 3,
              borderRadius: 3
            } }
          >
            <Text style={ {
              color: themeLightColor
            } }>
              DOWNLOAD
            </Text>
          </TouchableOpacity>
        ) : null
      }
    </View>
  );
}
