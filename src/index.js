const pomodoroClock = (function () {
  "use strict";

  const workTime = document.querySelector("#js-work-time");
  const breakTime = document.querySelector("#js-break-time");
  const startBtn = document.querySelector(".js-start-clock");
  const errMsg = document.querySelector(".js-err-msg");
  let intervalID = 0;
  let clockPaused = false;
  let isABreak = false;

  // broken in dev branch - fix!!!!!!!!
  let promptChange = {'js-work-time': false, 'js-break-time': false};

  const validation = (inputEvent) => {
    const timeStr = inputEvent.target.value;
    // specify time format as hh:mm:ss
    const re = /^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/;

    // check length & characters
    if (timeStr.match(re) !== null) {
        // handle cross browser differences in the input event object
        if (inputEvent.srcElement !== undefined) {
        promptChange[inputEvent.srcElement.id] = true;
        } else if (inputEvent.target !== undefined) {
        promptChange[inputEvent.target.id] = true;
        }
        startBtn.disabled = false;
        inputEvent.target.style.background = "#FFFFFF";
        errMsg.innerText = "";
    } else {
      startBtn.disabled = true;
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

    const clock = document.querySelector(".js-clock");
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
        document.querySelector(".js-timer").play();
        if (!isABreak) {
          isABreak = true;
          document.querySelector(".js-indicator").innerText = "Break Time";
          tme = setTime(breakTime.value);
          intervalID = setInterval(countdown, 1000);
        } else {
          isABreak = false;
          document.querySelector(".js-indicator").innerText = "Work Time";
          tme = setTime(workTime.value);
          intervalID = setInterval(countdown, 1000);
        }
      }

      // decrement clock time by 1 second
      tme.setSeconds(tme.getSeconds() -1);
      // display on the web document
      clock.value = tme.toLocaleTimeString('en-GB');
    };

    if (workTime.value === "00:00:00" || breakTime.value === "00:00:00") {
      errMsg.innerText = "Be sure to enter a duration for each period!";
      return;
    }

    errMsg.innerText = "";
    startBtn.disabled = true;
    readOnlyPrompts(true);

    // ensure clock responds to user interaction
    if (!clockPaused) {
      tme = setTime(workTime.value);
      document.querySelector(".js-indicator").innerText = "Work Time";
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
    startBtn.disabled = false;
    readOnlyPrompts(false);
    clockPaused = true;
  };

  return {
    startClock: startClock,
    pauseClock: pauseClock,
    validation: validation
  };

})();

document.querySelector("#js-work-time")
  .addEventListener("input", pomodoroClock.validation);

document.querySelector("#js-break-time")
  .addEventListener("input", pomodoroClock.validation);

document.querySelector(".js-start-clock")
  .addEventListener("click", pomodoroClock.startClock);

document.querySelector(".js-pause-clock")
  .addEventListener("click", pomodoroClock.pauseClock);
