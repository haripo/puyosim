import { ThemeState } from "../reducers/theme";

export type Theme = ThemeState;

export function getTheme(state: ThemeState): Theme {
  return state;
}