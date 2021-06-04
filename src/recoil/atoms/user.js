import { atom } from "recoil";

export const userState = atom({
  key: "user",
  default: null,
});

export const usersList = atom({
  key: "usersList",
  default: [],
});
