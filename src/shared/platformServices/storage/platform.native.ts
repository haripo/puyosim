import AsyncStorage from '@react-native-community/async-storage';

export async function loadConfig(): Promise<any> {
  const c = await AsyncStorage.getItem('config') || '{}';
  return JSON.parse(c);
}

export async function saveConfig(key: string, value: string): Promise<void> {
  let configStr = await AsyncStorage.getItem('config');
  let config = {};
  if (configStr !== null) {
    config = JSON.parse(configStr);
  }
  config[key] = value;
  return AsyncStorage.setItem('config', JSON.stringify(config));
}
