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
