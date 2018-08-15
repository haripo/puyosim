
export default function compareWith(obj1, obj2, ...args) {
  for (let arg of args) {
    if (obj1[arg] !== obj2[arg]) {
      return false;
    }
  }
  return true;
}
