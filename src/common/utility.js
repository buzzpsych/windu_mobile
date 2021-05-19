import moment from "moment";

const utility = {
  intoTimeFormat(time, value) {
    switch (time) {
      case 0:
      case 1:
      case 2:
        return `00:00:${value}`;
      case 4:
      case 5:
        return `00:${value}`;
      default:
        return value;
    }
  },
};

export default utility;
