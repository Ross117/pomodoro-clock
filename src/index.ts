"use strict";

interface PomodoroClock {
  startClock: EventListener,
  pauseClock: EventListener,
  validation: EventListener
}

const pomodoroClock: PomodoroClock = (function (): PomodoroClock {
  const workTime: HTMLInputElement = document.querySelector("#workTime");
  const breakTime: HTMLInputElement = document.querySelector("#breakTime");
  const startBtn: HTMLButtonElement = document.querySelector(".js-start-clock");
  const pauseBtn: HTMLButtonElement = document.querySelector(".js-pause-clock");
  const errMsg: HTMLParagraphElement = document.querySelector(".js-err-msg");
  const sessionType: HTMLParagraphElement = document.querySelector(".js-indicator");

  let intervalID: number = 0;
  let clockPaused: boolean = false;
  let isABreak: boolean = false;
  let tme: Date;

  interface PromptChange {
    [index: string]: boolean,
    workTime: boolean,
    breakTime: boolean
  }

  let promptChange: PromptChange = {
    workTime: false,
    breakTime: false
  };

  const validation = (inputEvent: InputEvent): void => {
    const inputEle: HTMLInputElement = inputEvent.target as HTMLInputElement;
    const timeStr: string = inputEle.value;
    // specify time format as hh:mm:ss
    const re: RegExp = /^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/;

    // check length & characters
    if (timeStr.match(re) !== null) {
      promptChange[inputEle.id] = true;
      startBtn.disabled = false;
      pauseBtn.disabled = false;
      errMsg.innerText = '';
    } else {
      startBtn.disabled = true;
      pauseBtn.disabled = true;
      errMsg.innerText = `The format should be 'hh:mm:ss'`;
    }
  };

  const readOnlyPrompts = (bln: boolean): void => {
    if (bln) {
      workTime.readOnly = true;
      breakTime.readOnly = true;
    } else {
      workTime.readOnly = false;
      breakTime.readOnly = false;
    }
  };

  const startClock = (): void => {
    const clock: HTMLInputElement = document.querySelector(".js-clock");

    // sets the clock's initial value
    const setTime = (timeStr: string): Date => {
      const newTme: Date = new Date();
      const startTime: Array<string> = timeStr.split(':');
      const startTimeToNumbers: Array<number> = startTime.map(val => Number(val))

      newTme.setHours(...startTimeToNumbers as [number, number, number]);
      clock.value = timeStr;

      return newTme;
    };

    // start the pomodoro clock countdown
    const countdown = (): void => {
      // handle transitions between work periods and break periods
      // mutiple date object functions in if statement used as a workaround
      // to handle Edge/IE bug when checking value of the clock input element.
      // (clock.value === '00:00:00' never returns 'true' in MS browsers)
      const alarmAudio: HTMLAudioElement = document.querySelector(".js-timer");

      if (tme.getHours() === 0 && tme.getMinutes() === 0 && tme.getSeconds() === 0) {
        clearInterval(intervalID);
        alarmAudio.play();
        if (!isABreak) {
          isABreak = true;
          sessionType.innerText = "Break Time";
          tme = setTime(breakTime.value);
        } else {
          isABreak = false;
          sessionType.innerText = "Work Time";
          tme = setTime(workTime.value);
        }
        intervalID = setInterval(countdown, 1000);
      }

      // decrement clock time by 1 second
      tme.setSeconds(tme.getSeconds() - 1);
      // display on the web document
      clock.value = tme.toLocaleTimeString('en-GB');
    };

    if (workTime.value === '00:00:00' || breakTime.value === '00:00:00') {
      errMsg.innerText = 'Be sure to enter a duration for each period!';
      return;
    }

    errMsg.innerText = '';
    startBtn.disabled = true;
    readOnlyPrompts(true);

    // ensure clock responds to user interaction
    if (!clockPaused) {
      tme = setTime(workTime.value);
      sessionType.innerText = "Work Time";
    } else if (promptChange.workTime && !isABreak) {
      tme = setTime(workTime.value);
    } else if (promptChange.breakTime && isABreak) {
      tme = setTime(breakTime.value);
    }

    clockPaused = false;
    promptChange.workTime = false;
    promptChange.breakTime = false;
    intervalID = setInterval(countdown, 1000);
  };

  const pauseClock = (): void => {
    clearInterval(intervalID);
    startBtn.disabled = false;
    readOnlyPrompts(false);
    clockPaused = true;
  };

  return {
    startClock,
    pauseClock,
    validation,
  };
}());

document.querySelector('#workTime')
  .addEventListener('input', pomodoroClock.validation);

document.querySelector('#breakTime')
  .addEventListener('input', pomodoroClock.validation);

document.querySelector(".js-start-clock")
  .addEventListener("click", pomodoroClock.startClock);

document.querySelector(".js-pause-clock")
  .addEventListener("click", pomodoroClock.pauseClock);