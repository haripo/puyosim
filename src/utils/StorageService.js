import Realm from 'realm';

const StackStateSchema = {
  name: 'LastState',
  properties: {
    history: { type: 'string' }
  }
};

let realm = new Realm({
  schema: [
    StackStateSchema
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
  const json = realm.objects('LastState');
}

export function loadLastState() {
  const json = realm.objects('LastState');
  if (json[0]) {
    return JSON.parse(json[0].history);
  } else {
    return null;
  }
}
