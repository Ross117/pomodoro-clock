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

    const errMsg = document.querySelector(".errMsg");
    const timeStr = inputEvent.target.value;
    // specify time format as hh:mm:ss
    const re = /^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/;

    // check length & characters
    if (timeStr.match(re) !== null) {
        promptChange[inputEvent.srcElement.id] = true;
        startBtn.disabled = false
        inputEvent.target.style.background = "#FFFFFF";
        errMsg.innerText = "";
    } else {
      startBtn.disabled = true;
      // need an error message?
      inputEvent.target.style.background = "#C02424";
      errMsg.innerText = "hh:mm:ss";
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

    // converts a time string to a date value, and sets the clock's initial value
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
          document.querySelector(".indicator").innerText = "Break Time";
          tme = setTime(breakTime.value);
          intervalID = setInterval(countdown, 1000);
        } else {
          isABreak = false;
          document.querySelector(".indicator").innerText = "Work Time";
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
    // ensure clock responds to user interaction
    if (!clockPaused) {
      tme = setTime(workTime.value);
      document.querySelector(".indicator").innerText = "Work Time";
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
