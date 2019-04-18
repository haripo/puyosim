import { Sentry } from "react-native-sentry";

export function captureException(e) {
  Sentry.captureException(e)
}