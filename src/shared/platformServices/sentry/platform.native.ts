import { Sentry } from "react-native-sentry";

export function captureException(e: Error) {
  Sentry.captureException(e, { tags: { selfCapture: true } });
}