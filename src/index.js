// what happens when user alters work period or break period when clock is running?

// use fade in/out and/or animation effects?

const pomodoroClock = (function () {
  "use strict";

  let intervalID = 0;
  let isABreak = false;
  const clock = document.querySelector(".clock");

  const startClock = () => {
    // start the pomodoro clock countdown
    const workTime = document.querySelector(".workTime").value;
    const breakTime = document.querySelector(".breakTime").value;
    let dt = new Date();

    const countdown = () => {
      // decrement clock time by 1 second
      dt.setSeconds(dt.getSeconds() -1);
      // display on the web page
      clock.value = dt.toLocaleTimeString('en-GB');

      // handle transitions between work periods and break periods
      if (clock.value === "00:00:00") {
        if (!isABreak) {
          isABreak = true;
          setTime(breakTime);
        } else {
          isABreak = false;
          setTime(workTime);
        }
      }
    };

    const setTime = (timeStr) => {
      const startTimeArr = timeStr.split(":");
      dt.setHours(...startTimeArr);
      clock.value = timeStr;
    };

    // if (clock.value === "00:00:00") return;
    setTime(workTime);
    intervalID = setInterval(countdown, 1000);
  }

  const stopClock = () => {
    clearInterval(intervalID);
  };

  return {
    startClock: startClock,
    stopClock: stopClock
  }

})();

document.querySelector(".startClock")
  .addEventListener("click", pomodoroClock.startClock);

document.querySelector(".stopClock")
  .addEventListener("click", pomodoroClock.stopClock);
