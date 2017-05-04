
const field = (state = [], action) => {
  switch (action.type) {
    case 'PUT_PAIR':
      return [ ...state, action.pair ];
    default:
      return state;
  }
};

export default field;