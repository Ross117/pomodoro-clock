// what happens when user alters work period or break period when clock is running?
const pomodoroClock = (function () {
  "use strict";
  const startClock = () => {
    // start the pomodoro clock countdown
    const clock = document.querySelector(".clock");
    let intervalID = 0;
    let dt = new Date();

    const countdown = () => {
      // decrement startValue by 1 second
      dt.setSeconds(dt.getSeconds() -1);
      // display on the web page
      clock.value = dt.toLocaleTimeString('en-GB');
      if (clock.value === "00:00:00") {
        clearInterval(intervalID);
      }
    };

    if (clock.value === "00:00:00") return;
    const startTimeArr = clock.value.split(":");
    dt.setHours(startTimeArr[0], startTimeArr[1], startTimeArr[2]);
    intervalID = setInterval(countdown, 1000);
  }

  return {
    startClock: startClock
  }
})();


document.querySelector(".startCountdown")
  .addEventListener("click", pomodoroClock.startClock);
