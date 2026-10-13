// ======================================
// TIMER ELEMENTS
// ======================================

const hoursInput =
  document.getElementById("hoursInput");

const minutesInput =
  document.getElementById("minutesInput");

const secondsInput =
  document.getElementById("secondsInput");

const setTimeBtn =
  document.getElementById("setTimeBtn");

const startPauseBtn =
  document.getElementById("startPauseBtn");

const resetBtn =
  document.getElementById("resetBtn");

const restartBtn =
  document.getElementById("restartBtn");

const addOneBtn =
  document.getElementById("addOneBtn");

const addFiveBtn =
  document.getElementById("addFiveBtn");

const soundToggle =
  document.getElementById("soundToggle");

const timerDisplay =
  document.getElementById("timerDisplay");

const timerStatus =
  document.getElementById("timerStatus");

const timerLabel =
  document.getElementById("timerLabel");

const timerRing =
  document.getElementById("timerRing");

const timeUpMessage =
  document.getElementById("timeUpMessage");

const presetButtons =
  document.querySelectorAll(".preset-btn");


// ======================================
// TIMER VARIABLES
// ======================================

let timerId = null;

let totalTime = 10 * 60 * 1000;

let remainingTime = totalTime;

let isRunning = false;

let soundEnabled = true;

let lastSecond = null;


// ======================================
// AUDIO ENGINE
// ======================================

let audioContext = null;


// Get Audio Context

function getAudioContext() {

  if (!audioContext) {

    audioContext =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

  }

  return audioContext;

}


// Play beep

function playBeep(
  frequency = 700,
  duration = 0.08,
  volume = 0.06
) {

  if (!soundEnabled) {
    return;
  }


  const context =
    getAudioContext();


  const oscillator =
    context.createOscillator();


  const gain =
    context.createGain();


  oscillator.type =
    "sine";


  oscillator.frequency.value =
    frequency;


  gain.gain.value =
    volume;


  oscillator.connect(gain);

  gain.connect(
    context.destination
  );


  oscillator.start();


  gain.gain.exponentialRampToValueAtTime(
    0.001,
    context.currentTime + duration
  );


  oscillator.stop(
    context.currentTime + duration
  );

}


// ======================================
// COMPLETION SOUND
// ======================================

function playCompletionSound() {

  if (!soundEnabled) {
    return;
  }


  playBeep(
    800,
    0.12,
    0.08
  );


  setTimeout(function () {

    playBeep(
      1000,
      0.12,
      0.08
    );

  }, 180);


  setTimeout(function () {

    playBeep(
      1200,
      0.2,
      0.09
    );

  }, 360);

}


// ======================================
// FORMAT TIME
// ======================================

function formatTime(milliseconds) {

  const totalSeconds =
    Math.max(
      0,
      Math.ceil(
        milliseconds / 1000
      )
    );


  const hours =
    Math.floor(
      totalSeconds / 3600
    );


  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );


  const seconds =
    totalSeconds % 60;


  return (
    formatNumber(hours) +
    ":" +
    formatNumber(minutes) +
    ":" +
    formatNumber(seconds)
  );

}


// ======================================
// FORMAT NUMBER
// ======================================

function formatNumber(number) {

  return String(number)
    .padStart(2, "0");

}


// ======================================
// GET INPUT TIME
// ======================================

function getInputTime() {

  let hours =
    Number(hoursInput.value);


  let minutes =
    Number(minutesInput.value);


  let seconds =
    Number(secondsInput.value);


  // Safety

  hours =
    Math.max(
      0,
      Math.min(99, hours)
    );


  minutes =
    Math.max(
      0,
      Math.min(59, minutes)
    );


  seconds =
    Math.max(
      0,
      Math.min(59, seconds)
    );


  hoursInput.value =
    hours;


  minutesInput.value =
    minutes;


  secondsInput.value =
    seconds;


  return (
    (
      hours * 3600 +
      minutes * 60 +
      seconds
    ) * 1000
  );

}


// ======================================
// UPDATE DISPLAY
// ======================================

function updateDisplay() {

  timerDisplay.innerText =
    formatTime(
      remainingTime
    );


  updateProgressRing();

}


// ======================================
// UPDATE RING
// ======================================

function updateProgressRing() {

  if (totalTime <= 0) {

    timerRing.style
      .setProperty(
        "--progress",
        "0deg"
      );

    return;

  }


  const percentage =
    remainingTime /
    totalTime;


  const degrees =
    percentage * 360;


  timerRing.style
    .setProperty(
      "--progress",
      `${degrees}deg`
    );

}


// ======================================
// SET TIMER
// ======================================

setTimeBtn.addEventListener(
  "click",
  function () {

    stopTimer();


    const selectedTime =
      getInputTime();


    if (selectedTime <= 0) {

      alert(
        "Please set a time greater than 0."
      );

      return;

    }


    totalTime =
      selectedTime;


    remainingTime =
      selectedTime;


    timeUpMessage.classList.remove(
      "show"
    );


    timerStatus.innerText =
      "● Ready";


    timerLabel.innerText =
      "Ready";


    startPauseBtn.innerText =
      "▶ Start";


    updateDisplay();


    playBeep(
      650,
      0.08,
      0.05
    );

  }
);


// ======================================
// START / PAUSE
// ======================================

startPauseBtn.addEventListener(
  "click",
  function () {

    if (!isRunning) {

      startTimer();

    } else {

      pauseTimer();

    }

  }
);


// ======================================
// START TIMER
// ======================================

function startTimer() {

  if (remainingTime <= 0) {

    remainingTime =
      totalTime;

  }


  isRunning =
    true;


  lastSecond = null;


  const startTimestamp =
    performance.now();


  const initialRemaining =
    remainingTime;


  timerStatus.innerText =
    "🟢 Running";


  timerLabel.innerText =
    "Counting Down";


  startPauseBtn.innerText =
    "⏸ Pause";


  timerRing.classList.add(
    "timer-running"
  );


  timeUpMessage.classList.remove(
    "show"
  );


  playBeep(
    750,
    0.08,
    0.06
  );


  timerId =
    requestAnimationFrame(
      function tick(timestamp) {

        if (!isRunning) {
          return;
        }


        const elapsed =
          timestamp -
          startTimestamp;


        remainingTime =
          Math.max(
            0,
            initialRemaining -
            elapsed
          );


        updateDisplay();


        const currentSeconds =
          Math.ceil(
            remainingTime / 1000
          );


        // Last 10 seconds

        if (
          currentSeconds <= 10 &&
          currentSeconds > 0 &&
          currentSeconds !== lastSecond
        ) {

          lastSecond =
            currentSeconds;


          playBeep(
            900,
            0.07,
            0.055
          );

          timerRing.classList.add(
            "last-seconds"
          );

        }


        if (
          currentSeconds > 10
        ) {

          timerRing.classList.remove(
            "last-seconds"
          );

        }


        // Completed

        if (
          remainingTime <= 0
        ) {

          finishTimer();

          return;

        }


        timerId =
          requestAnimationFrame(
            tick
          );

      }
    );

}


// ======================================
// PAUSE TIMER
// ======================================

function pauseTimer() {

  isRunning =
    false;


  cancelAnimationFrame(
    timerId
  );


  timerStatus.innerText =
    "🟡 Paused";


  timerLabel.innerText =
    "Paused";


  startPauseBtn.innerText =
    "▶ Resume";


  timerRing.classList.remove(
    "timer-running"
  );


  playBeep(
    450,
    0.1,
    0.06
  );

}


// ======================================
// STOP TIMER
// ======================================

function stopTimer() {

  isRunning =
    false;


  cancelAnimationFrame(
    timerId
  );


  timerRing.classList.remove(
    "timer-running"
  );


  timerRing.classList.remove(
    "last-seconds"
  );

}


// ======================================
// FINISH TIMER
// ======================================

function finishTimer() {

  stopTimer();


  remainingTime =
    0;


  updateDisplay();


  timerStatus.innerText =
    "🔴 Finished";


  timerLabel.innerText =
    "Time's Up!";


  startPauseBtn.innerText =
    "▶ Start Again";


  timeUpMessage.classList.add(
    "show"
  );


  playCompletionSound();

}


// ======================================
// RESET
// ======================================

resetBtn.addEventListener(
  "click",
  function () {

    stopTimer();


    remainingTime =
      totalTime;


    timerStatus.innerText =
      "● Ready";


    timerLabel.innerText =
      "Ready";


    startPauseBtn.innerText =
      "▶ Start";


    timeUpMessage.classList.remove(
      "show"
    );


    lastSecond =
      null;


    updateDisplay();


    playBeep(
      350,
      0.12,
      0.055
    );

  }
);


// ======================================
// RESTART
// ======================================

restartBtn.addEventListener(
  "click",
  function () {

    timeUpMessage.classList.remove(
      "show"
    );


    remainingTime =
      totalTime;


    updateDisplay();


    startTimer();

  }
);


// ======================================
// ADD 1 MINUTE
// ======================================

addOneBtn.addEventListener(
  "click",
  function () {

    totalTime +=
      60 * 1000;


    remainingTime +=
      60 * 1000;


    updateDisplay();


    playBeep(
      800,
      0.07,
      0.05
    );

  }
);


// ======================================
// ADD 5 MINUTES
// ======================================

addFiveBtn.addEventListener(
  "click",
  function () {

    totalTime +=
      5 * 60 * 1000;


    remainingTime +=
      5 * 60 * 1000;


    updateDisplay();


    playBeep(
      950,
      0.08,
      0.05
    );

  }
);


// ======================================
// SOUND TOGGLE
// ======================================

soundToggle.addEventListener(
  "click",
  function () {

    soundEnabled =
      !soundEnabled;


    if (soundEnabled) {

      soundToggle.innerText =
        "🔊 Sound ON";


      playBeep(
        800,
        0.08,
        0.05
      );

    } else {

      soundToggle.innerText =
        "🔇 Sound OFF";

    }

  }
);


// ======================================
// QUICK PRESETS
// ======================================

presetButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        const minutes =
          Number(
            button.dataset.minutes
          );


        stopTimer();


        hoursInput.value =
          0;


        minutesInput.value =
          minutes;


        secondsInput.value =
          0;


        totalTime =
          minutes * 60 * 1000;


        remainingTime =
          totalTime;


        timerStatus.innerText =
          "● Ready";


        timerLabel.innerText =
          `${minutes} Minute Preset`;


        startPauseBtn.innerText =
          "▶ Start";


        timeUpMessage.classList.remove(
          "show"
        );


        updateDisplay();


        playBeep(
          650,
          0.08,
          0.05
        );

      }
    );

  }
);


// ======================================
// KEYBOARD SHORTCUTS
// ======================================

document.addEventListener(
  "keydown",
  function (event) {

    // Space

    if (
      event.code === "Space"
    ) {

      event.preventDefault();


      if (isRunning) {

        pauseTimer();

      } else {

        startTimer();

      }

    }


    // R = Reset

    if (
      event.key.toLowerCase() === "r"
    ) {

      resetBtn.click();

    }

  }
);


// ======================================
// INITIAL DISPLAY
// ======================================

updateDisplay();