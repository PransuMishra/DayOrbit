// ======================================
// STOPWATCH ELEMENTS
// ======================================

const startPauseBtn =
  document.getElementById("startPauseBtn");

const lapBtn =
  document.getElementById("lapBtn");

const resetBtn =
  document.getElementById("resetBtn");

const soundToggle =
  document.getElementById("soundToggle");

const timerRing =
  document.getElementById("timerRing");

const stopwatchStatus =
  document.getElementById("stopwatchStatus");

const lapTableBody =
  document.getElementById("lapTableBody");

const lapCount =
  document.getElementById("lapCount");


// ======================================
// STOPWATCH VARIABLES
// ======================================

let timerId = null;

let startTime = 0;

let elapsedTime = 0;

let lastLapTime = 0;

let isRunning = false;

let soundEnabled = true;

let laps = [];


// ======================================
// SOUND ENGINE
// ======================================

let audioContext = null;


// Create Audio Context

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
  frequency = 600,
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


  oscillator.type = "sine";

  oscillator.frequency.value =
    frequency;


  gain.gain.value =
    volume;


  oscillator.connect(gain);

  gain.connect(context.destination);


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
// START / PAUSE
// ======================================

startPauseBtn.addEventListener(
  "click",
  function () {

    if (!isRunning) {

      startStopwatch();

    } else {

      pauseStopwatch();

    }

  }
);


// ======================================
// START
// ======================================

function startStopwatch() {

  isRunning = true;


  startTime =
    performance.now() -
    elapsedTime;


  timerId =
    setInterval(updateStopwatch, 10);


  startPauseBtn.innerText =
    "⏸ Pause";


  lapBtn.disabled = false;


  stopwatchStatus.innerText =
    "🟢 Running";


  timerRing.classList.add(
    "timer-running"
  );


  playBeep(700, 0.10, 0.07);

}


// ======================================
// PAUSE
// ======================================

function pauseStopwatch() {

  isRunning = false;


  clearInterval(timerId);


  elapsedTime =
    performance.now() -
    startTime;


  startPauseBtn.innerText =
    "▶ Resume";


  stopwatchStatus.innerText =
    "🟡 Paused";


  timerRing.classList.remove(
    "timer-running"
  );


  playBeep(450, 0.12, 0.07);

}


// ======================================
// UPDATE STOPWATCH
// ======================================

function updateStopwatch() {

  elapsedTime =
    performance.now() -
    startTime;


  updateDisplay(elapsedTime);

}


// ======================================
// DISPLAY
// ======================================

function updateDisplay(time) {


  const totalMilliseconds =
    Math.floor(time);


  const milliseconds =
    Math.floor(
      (totalMilliseconds % 1000) / 10
    );


  const totalSeconds =
    Math.floor(
      totalMilliseconds / 1000
    );


  const seconds =
    totalSeconds % 60;


  const totalMinutes =
    Math.floor(
      totalSeconds / 60
    );


  const minutes =
    totalMinutes % 60;


  const hours =
    Math.floor(
      totalMinutes / 60
    );


  document.getElementById(
    "hours"
  ).innerText =
    formatNumber(hours);


  document.getElementById(
    "minutes"
  ).innerText =
    formatNumber(minutes);


  document.getElementById(
    "seconds"
  ).innerText =
    formatNumber(seconds);


  document.getElementById(
    "milliseconds"
  ).innerText =
    formatNumber(milliseconds);

}


// ======================================
// FORMAT NUMBER
// ======================================

function formatNumber(number) {

  return String(number)
    .padStart(2, "0");

}


// ======================================
// LAP
// ======================================

lapBtn.addEventListener(
  "click",
  function () {

    if (!isRunning) {
      return;
    }


    const currentLapTime =
      elapsedTime;


    const lapDifference =
      currentLapTime -
      lastLapTime;


    const lapNumber =
      laps.length + 1;


    laps.push({

      number: lapNumber,

      totalTime:
        currentLapTime,

      difference:
        lapDifference

    });


    lastLapTime =
      currentLapTime;


    renderLaps();


    playBeep(900, 0.08, 0.06);

  }
);


// ======================================
// RENDER LAPS
// ======================================

function renderLaps() {

  lapTableBody.innerHTML = "";


  laps.forEach(function (lap) {


    const row =
      document.createElement("tr");


    row.classList.add(
      "lap-row"
    );


    row.innerHTML = `

      <td>
        #${lap.number}
      </td>

      <td>
        ${formatLapTime(lap.totalTime)}
      </td>

      <td>
        +${formatLapTime(lap.difference)}
      </td>

    `;


    lapTableBody.appendChild(row);

  });


  lapCount.innerText =
    `${laps.length} ${
      laps.length === 1
        ? "Lap"
        : "Laps"
    }`;

}


// ======================================
// FORMAT LAP TIME
// ======================================

function formatLapTime(time) {


  const milliseconds =
    Math.floor(
      (time % 1000) / 10
    );


  const totalSeconds =
    Math.floor(
      time / 1000
    );


  const seconds =
    totalSeconds % 60;


  const totalMinutes =
    Math.floor(
      totalSeconds / 60
    );


  const minutes =
    totalMinutes % 60;


  const hours =
    Math.floor(
      totalMinutes / 60
    );


  return `${formatNumber(hours)}:` +
         `${formatNumber(minutes)}:` +
         `${formatNumber(seconds)}.` +
         `${formatNumber(milliseconds)}`;

}


// ======================================
// RESET
// ======================================

resetBtn.addEventListener(
  "click",
  function () {

    clearInterval(timerId);


    isRunning = false;

    startTime = 0;

    elapsedTime = 0;

    lastLapTime = 0;

    laps = [];


    updateDisplay(0);


    startPauseBtn.innerText =
      "▶ Start";


    lapBtn.disabled = true;


    stopwatchStatus.innerText =
      "● Ready";


    timerRing.classList.remove(
      "timer-running"
    );


    lapTableBody.innerHTML = `

      <tr id="emptyLap">

        <td colspan="3">
          No laps recorded yet
        </td>

      </tr>

    `;


    lapCount.innerText =
      "0 Laps";


    playBeep(300, 0.15, 0.06);

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
// KEYBOARD SHORTCUTS
// ======================================

document.addEventListener(
  "keydown",
  function (event) {

    // Ignore keyboard shortcuts
    // while typing in an input

    if (
      event.target.tagName ===
      "INPUT"
    ) {
      return;
    }


    // Space
    if (
      event.code === "Space"
    ) {

      event.preventDefault();

      if (!isRunning) {

        startStopwatch();

      } else {

        pauseStopwatch();

      }

    }


    // L = Lap

    if (
      event.key.toLowerCase() === "l"
    ) {

      if (isRunning) {
        lapBtn.click();
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
// THEME
// ======================================

const themeToggle =
  document.getElementById(
    "themeToggle"
  );


const savedTheme =
  localStorage.getItem("theme");


if (savedTheme === "dark") {

  document.body.classList.add(
    "dark-mode"
  );

  themeToggle.innerText =
    "☀️ Light Mode";

} else {

  themeToggle.innerText =
    "🌙 Dark Mode";

}


themeToggle.addEventListener(
  "click",
  function () {

    document.body.classList.toggle(
      "dark-mode"
    );


    if (
      document.body.classList.contains(
        "dark-mode"
      )
    ) {

      themeToggle.innerText =
        "☀️ Light Mode";


      localStorage.setItem(
        "theme",
        "dark"
      );

    } else {

      themeToggle.innerText =
        "🌙 Dark Mode";


      localStorage.setItem(
        "theme",
        "light"
      );

    }

  }
);


// ======================================
// INITIAL DISPLAY
// ======================================

updateDisplay(0);