export type ThemeState = {
  cardBackgroundColor: string,
  buttonColor: string,
  themeColor: string,
  themeLightColor: string
}

export const initialState = {
  cardBackgroundColor: '#EFEBE9',
  buttonColor: '#8D6E63',
  themeColor: '#6D4C41',
  themeLightColor: '#EFEBE9'
};

export const reducer = (state: ThemeState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
