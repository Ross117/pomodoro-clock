// need 'timer' to go off when work period ends
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

  const validation = (inputEvent) => {
    const timeStr = inputEvent.target.value;
    const re = /\d/g;
    let validated = false;

    // check length & characters
    if (timeStr.length === 8 && timeStr.match(re).length === 6 && timeStr[2] === ":" && timeStr[5] === ":") {
      validated = true;
      document.querySelector(".startClock").disabled = false
      document.querySelector(".resetClock").disabled = false
      inputEvent.target.style.background = "#FFFFFF";
    } else {
      validated = false;
      document.querySelector(".startClock").disabled = true;
      document.querySelector(".resetClock").disabled = true;
      // need an error message?
      inputEvent.target.style.background = "#C02424";
    }
  };

  const setTime = (timeStr) => {
    const startTimeArr = timeStr.split(":");
    dt.setHours(...startTimeArr);
    clock.value = timeStr;
  };

  const readOnlyPrompts = (bln) => {
    if (bln) {
      workTime.readOnly = true;
      breakTime.readOnly = true;
    } else {
      workTime.readOnly = false;
      breakTime.readOnly = false;
    }
  };

  const startClock = () => {
    // start the pomodoro clock countdown
    const countdown = () => {
      // decrement clock time by 1 second
      debugger;
      dt.setSeconds(dt.getSeconds() -1);
      // display on the web page
      clock.value = dt.toLocaleTimeString('en-GB');

      // handle transitions between work periods and break periods
      if (clock.value === "00:00:00") {
        document.querySelector(".timer").play();
        if (!isABreak) {
          isABreak = true;
          setTime(breakTime.value);
        } else {
          isABreak = false;
          setTime(workTime.value);
        }
      }
    };

    if (workTime.value === "00:00:00") return;
    readOnlyPrompts(true);
    if (!clockPaused) setTime(workTime.value);
    clockPaused = false;
    intervalID = setInterval(countdown, 1000);
  };

  const pauseClock = () => {
    clearInterval(intervalID);
    clockPaused = true;
  };

  const resetClock = () => {
    readOnlyPrompts(false);
    clearInterval(intervalID);
    setTime(workTime.value);
  };

  return {
    startClock: startClock,
    pauseClock: pauseClock,
    resetClock: resetClock,
    validation: validation
  }

})();

document.querySelector(".workTime")
  .addEventListener("input", pomodoroClock.validation);

document.querySelector(".breakTime")
  .addEventListener("input", pomodoroClock.validation);

document.querySelector(".startClock")
  .addEventListener("click", pomodoroClock.startClock);

document.querySelector(".pauseClock")
  .addEventListener("click", pomodoroClock.pauseClock);

document.querySelector(".resetClock")
  .addEventListener("click", pomodoroClock.resetClock);
