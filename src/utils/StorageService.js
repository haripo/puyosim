import Realm from 'realm';

const StackStateSchema = {
  name: 'LastState',
  properties: {
    history: { type: 'string' }
  }
};

const configSchema = {
  name: 'Config',
  primaryKey: 'key',
  properties: {
    key: { type: 'string' },
    value: { type: 'string' }
  }
}

let realm = new Realm({
  schema: [
    StackStateSchema,
    configSchema
  ]
});

console.info("Realm path: " + realm.path);

export function saveLastState(history) {
  const body = JSON.stringify(history);
  realm.write(() => {
    realm.delete(realm.objects('LastState'));
    realm.create('LastState', {
      history: body
    });
  });
}

export function loadLastState() {
  const json = realm.objects('LastState');
  if (json[0]) {
    return JSON.parse(json[0].history);
  } else {
    return null;
  }
}

export function loadConfig() {
  const config = realm.objects('Config');
  console.warn(JSON.stringify(config));
  return config;
}

loadConfig();

export function saveConfig(key, value) {
  const config = realm.objects('Config').filtered(`key = ${key}`);
  realm.write(() => {
    if (config[0]) {
      config.value = value;
    } else {
      realm.create('Config', { key, value });
    }
  });
}
