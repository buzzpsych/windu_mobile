import moment from "moment";

const handleZero = (number) => {
  const digits = number.toString().length;
  return digits === 1 || number < 0 ? `0${number}` : number;
};

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

  calculateTimeTotal(times) {
    // add array of times together in time format
    const totalhours = times
      .slice(1)
      .reduce(
        (prev, cur) => moment.duration(cur).add(prev),
        moment.duration(times[0])
      );
    var ms = totalhours._milliseconds;
    var ticks = ms / 1000;
    var hh = handleZero(Math.floor(ticks / 3600));
    var mm = handleZero(Math.floor((ticks % 3600) / 60));
    var ss = handleZero(ticks % 60);

    return `${hh}:${mm}:${ss}`;
  },
};

export default utility;
