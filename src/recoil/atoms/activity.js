import { atom } from "recoil";

export const showActivityFormState = atom({
  key: "showActivityFormState",
  default: false,
});

export const activeActivityState = atom({
  key: "activeActivityState",
  default: {
    data: null,
    active: false,
  },
});
