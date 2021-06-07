import { REACT_APP_BE, NODE_ENV } from "@env";

export const graphql =
  NODE_ENV === "development"
    ? `http://${REACT_APP_BE}/graphql`
    : `https://${REACT_APP_BE}/graphql`;

export const graphqlws =
  NODE_ENV === "development"
    ? `ws://${REACT_APP_BE}/graphql`
    : `wss://${REACT_APP_BE}/graphql`;

export const playImg =
  "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/play_white.png";

export const pauseImg =
  "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/pause_white.png";

export const stopImg =
  "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/stop_white.png";

export const winduLogo =
  "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/logo.png";

export const loginImg =
  "https://windu.s3.us-east-2.amazonaws.com/assets/mobile/mobile_1.png";

export const androidClientId =
  "302105212525-huvnsk7njva6bhm93q7bf6h32jvo4epi.apps.googleusercontent.com";
export const androidStandaloneAppClientId =
  "302105212525-t6v4rpmgihm7fui74680srn0935o95ho.apps.googleusercontent.com";
export const iosClientId =
  "103455477750-9rnro9p60f3c6blo0v7e6jg4i5r1hg9q.apps.googleusercontent.com";
export const iosStandaloneAppClientId =
  "103455477750-9rnro9p60f3c6blo0v7e6jg4i5r1hg9q.apps.googleusercontent.com";
