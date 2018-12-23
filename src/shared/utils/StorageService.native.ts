import Realm from 'realm';
import _ from 'lodash';

const archivedPlaySchema = {
  name: 'ArchivedPlay',
  primaryKey: 'id',
  properties: {
    id: { type: 'string' },
    queue: { type: 'list', objectType: 'int' },
    stack: { type: 'list', objectType: 'int' },
    maxChain: { type: 'int' },
    score: { type: 'int' },
    history: { type: 'string' },
    historyIndex: { type: 'int' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
    title: { type: 'string' },
  }
};

export interface ArchivedPlay {
  id: string,
  queue: number[],
  stack: number[],
  maxChain: number,
  score: number,
  history: string,
  historyIndex: number,
  createdAt: Date,
  updatedAt: Date,
  title: string,
}

const configSchema = {
  name: 'Config',
  primaryKey: 'key',
  properties: {
    key: { type: 'string' },
    value: { type: 'string' }
  }
};

interface Config {
  key: string;
  value: string;
}

let realm = new Realm({
  schema: [
    archivedPlaySchema,
    configSchema
  ]
});

console.info("Realm path: " + realm.path);

export function loadConfig() {
  const config = realm.objects<Config>('Config');
  return _.fromPairs(config.map(c => [c.key, c.value]));
}

export function saveConfig(key: string, value: string) {
  const config = realm.objects<Config>('Config').filtered(`key = "${key}"`);
  value = value.toString();

  realm.write(() => {
    if (config[0]) {
      config[0].value = value;
    } else {
      realm.create('Config', { key, value });
    }
  });
}
