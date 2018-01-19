// what happens when user alters work period or break period when clock is running? - don't allow this,
// user must use buttons?

// use fade in/out and/or animation effects?

// does user need the option to set periods of longer than an hour? or just use mm:ss?

const pomodoroClock = (function () {
  "use strict";

  const clock = document.querySelector(".clock");
  const workTime = document.querySelector(".workTime");
  const breakTime = document.querySelector(".breakTime");
  let intervalID = 0;
  let isABreak = false;
  let clockPaused = false;
  let dt = new Date();

  const setTime = (timeStr) => {
    const startTimeArr = timeStr.split(":");
    dt.setHours(...startTimeArr);
    clock.value = timeStr;
  };

  const startClock = () => {
    // start the pomodoro clock countdown
    const countdown = () => {
      // decrement clock time by 1 second
      dt.setSeconds(dt.getSeconds() -1);
      // display on the web page
      clock.value = dt.toLocaleTimeString('en-GB');

      // handle transitions between work periods and break periods
      if (clock.value === "00:00:00") {
        if (!isABreak) {
          isABreak = true;
          setTime(breakTime.value);
        } else {
          isABreak = false;
          setTime(workTime.value);
        }
      }
    };

    workTime.readOnly = true;
    breakTime.readOnly = true;
    if (!clockPaused) setTime(workTime.value);
    clockPaused = false;
    intervalID = setInterval(countdown, 1000);
  };

  const pauseClock = () => {
    workTime.readOnly = false;
    breakTime.readOnly = false;
    clearInterval(intervalID);
    clockPaused = true;
  };

  const resetClock = () => {
    workTime.readOnly = false;
    breakTime.readOnly = false;   
    clearInterval(intervalID);
    setTime(workTime.value);
  };

  return {
    startClock: startClock,
    pauseClock: pauseClock,
    resetClock: resetClock
  }

})();

document.querySelector(".startClock")
  .addEventListener("click", pomodoroClock.startClock);

document.querySelector(".pauseClock")
  .addEventListener("click", pomodoroClock.pauseClock);

document.querySelector(".resetClock")
  .addEventListener("click", pomodoroClock.resetClock);
