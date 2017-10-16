// start the pomodoro clock countdown
function startClock () {
  "use strict";

/* use moment.js (or other lib) to work with time values?
 allow user to set clock for more than an hour?
 what happens when user alters work period or break period when clock is running?
 */

  const clock = document.querySelector(".clock");
  let clockTime = clock.value;
  let intervalID = 0;
  const countDown = () => {
    let mins = clockTime.slice(0, 2);
    let secs = clockTime.slice(3);

    if (secs === "00") {
      secs = "59";
      mins = Number(mins) - 1;
      mins = mins.toString();
      if (Number(mins) < 10) {
        mins = "0" + mins;
      }
    } else if (secs === "10" || Number(secs) < 10) {
      secs = Number(secs) - 1;
      secs = "0" + secs.toString();
    } else {
      secs = Number(secs) - 1;
      secs = secs.toString();
    }

    clockTime = mins + ":" + secs;
    clock.value = clockTime;
    // stop when clock reaches zero
    if (clockTime === "00:00") {
      // do something visual to mark this
      clearInterval(intervalID);
    }

  };

  if (clockTime === "00:00") return;

  intervalID = setInterval(countDown, 1000);
}

document.querySelector(".startCountdown")
  .addEventListener("click", startClock);
