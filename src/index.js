// use fade in/out and/or animation effects?

const pomodoroClock = (function () {
  "use strict";

  const workTime = document.querySelector("#workTime");
  const breakTime = document.querySelector("#breakTime");
  const startBtn = document.querySelector(".startClock");
  let intervalID = 0;
  let clockPaused = false;
  let isABreak = false;
  let promptChange = {workTime: false, breakTime: false};

  const validation = (inputEvent) => {
    const timeStr = inputEvent.target.value;
    const re = /\d/g;
    let validated = false;

    // check length & characters - use pattern instead?
    if (timeStr.length === 8 && timeStr.match(re).length === 6
      && timeStr[2] === ":" && timeStr[5] === ":") {
        validated = true;
        promptChange[inputEvent.srcElement.id] = true;
        startBtn.disabled = false
        inputEvent.target.style.background = "#FFFFFF";
    } else {
      validated = false;
      startBtn.disabled = true;
      // need an error message?
      inputEvent.target.style.background = "#C02424";
    }
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

    const clock = document.querySelector(".clock");
    let tme;

    const setTime = (timeStr) => {
      let tme = new Date();
      const startTimeArr = timeStr.split(":");

      tme.setHours(...startTimeArr);
      clock.value = timeStr;

      return tme;
    };

    // start the pomodoro clock countdown
    const countdown = () => {

      // handle transitions between work periods and break periods
      if (clock.value === "00:00:00") {
        clearInterval(intervalID);
        document.querySelector(".timer").play();
        if (!isABreak) {
          isABreak = true;
          // break visualisation
          tme = setTime(breakTime.value);
          intervalID = setInterval(countdown, 1000);
        } else {
          isABreak = false;
          // work visualisation
          tme = setTime(workTime.value);
          intervalID = setInterval(countdown, 1000);
        }
      }

      // decrement clock time by 1 second
      tme.setSeconds(tme.getSeconds() -1);
      // display on the web page
      clock.value = tme.toLocaleTimeString('en-GB');
    };

    if (workTime.value === "00:00:00") return;
    startBtn.disabled = true;
    readOnlyPrompts(true);
    if (!clockPaused) {
      tme = setTime(workTime.value);
    } else if (promptChange.workTime && !isABreak) {
      tme = setTime(workTime.value);
    } else if (promptChange.breakTime && isABreak) {
      tme = setTime(breakTime.value);
    } else {
      tme = setTime(clock.value);
    }

    clockPaused = false;
    promptChange.workTime = false;
    promptChange.breakTime = false;
    intervalID = setInterval(countdown, 1000);
  };

  const pauseClock = () => {
    clearInterval(intervalID);
    startBtn.disabled = false
    readOnlyPrompts(false);
    clockPaused = true;
  };

  return {
    startClock: startClock,
    pauseClock: pauseClock,
    validation: validation
  }

})();

document.querySelector("#workTime")
  .addEventListener("input", pomodoroClock.validation);

document.querySelector("#breakTime")
  .addEventListener("input", pomodoroClock.validation);

document.querySelector(".startClock")
  .addEventListener("click", pomodoroClock.startClock);

document.querySelector(".pauseClock")
  .addEventListener("click", pomodoroClock.pauseClock);
