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

// TODO: rename to saveArchivedPlay
export function archiveCurrentPlay(item: ArchivedPlay): void {
  realm.write(() => {
    realm.create('ArchivedPlay', item, true);
  });
}

export function loadArchivedPlays(start, count): ArchivedPlay[] {
  const result = realm
    .objects<ArchivedPlay>('ArchivedPlay')
    .sorted('updatedAt', true)
    .slice(start, start + count);
  return [...result];
}

export function loadArchivedPlay(id: string): ArchivedPlay {
  const result = realm
    .objects<ArchivedPlay>('ArchivedPlay')
    .find(play => play.id === id);
  if (!result) {
    throw new Error('Failed to load archived play')
  }
  return result;
}

export function editArchivedPlay(id: string, title: string): ArchivedPlay {
  realm.write(() => {
    const play = realm
      .objects<ArchivedPlay>('ArchivedPlay')
      .find(play => play.id === id);
    if (play) {
      play.title = title;
    } else {
      console.error(`Failed to find play (id: ${id})`);
      throw new Error(`Failed to find play (id: ${id})`);
    }
  });
  return loadArchivedPlay(id);
}

export function deleteArchivedPlay(id: string): void {
  realm.write(() => {
    const play = realm
      .objects<ArchivedPlay>('ArchivedPlay')
      .find(play => play.id === id);
    realm.delete(play);
  });
}

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
