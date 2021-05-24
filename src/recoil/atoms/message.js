import { atom } from "recoil";

export const userSelectedState = atom({
  key: "userSelected",
  default: {},
});

export const userMessages = atom({
  key: "userMessages",
  default: [],
});
