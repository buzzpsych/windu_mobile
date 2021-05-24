import { atom } from "recoil";

export const userState = atom({
  key: "user",
  default: false,
});

export const usersList = atom({
  key: "usersList",
  default: [],
});
