
const liveTime = document.getElementById("liveTime");
const liveDate = document.getElementById("liveDate");

const alarmForm = document.getElementById("alarmForm");
const alarmHourInput = document.getElementById("alarmHour");
const alarmMinuteInput = document.getElementById("alarmMinute");
const alarmPeriodInput = document.getElementById("alarmPeriod");
const cancelAlarmBtn = document.getElementById("cancelAlarmBtn");

const alarmStatus = document.getElementById("alarmStatus");
const activeAlarmBox = document.getElementById("activeAlarmBox");
const activeAlarmText = document.getElementById("activeAlarmText");

const ringOverlay = document.getElementById("ringOverlay");
const ringTime = document.getElementById("ringTime");
const stopAlarmBtn = document.getElementById("stopAlarmBtn");
const snoozeAlarmBtn = document.getElementById("snoozeAlarmBtn");

// const themeToggle = document.getElementById("alarmThemeToggle");

let alarmTarget = null;
let audioContext = null;
let ringtoneInterval = null;
let isRinging = false;

// /* Theme: shares the "theme" preference with DayOrbit */
// function applyTheme(isDark) {
//     document.documentElement.classList.toggle("dark-page", isDark);
//     document.body.classList.toggle("dark-mode", isDark);

//     try {
//         localStorage.setItem("theme", isDark ? "dark" : "light");
//     } catch (error) {
//         // The alarm can still work if storage is unavailable.
//     }

//     themeToggle.textContent = isDark
//         ? "☀️ Light Mode"
//         : "🌙 Dark Mode";
// }

// let savedTheme = false;

// try {
//     savedTheme = localStorage.getItem("theme") === "dark";
// } catch (error) {}

// applyTheme(savedTheme);

// themeToggle.addEventListener("click", () => {
//     const isDark = !document.documentElement.classList.contains("dark-page");
//     applyTheme(isDark);
// });

/* Inherit the theme selected on the DayOrbit Home page */

function applySavedTheme() {
    let savedTheme = "light";

    try {
        savedTheme =
            localStorage.getItem("theme") === "dark"
                ? "dark"
                : "light";
    } catch (error) {
        // Use light theme if browser storage is unavailable.
    }

    const isDark = savedTheme === "dark";

    document.documentElement.classList.toggle(
        "dark-page",
        isDark
    );

    document.body.classList.toggle(
        "dark-mode",
        isDark
    );

    document.body.classList.toggle(
        "light-mode",
        !isDark
    );
}

// Apply the saved theme when the Alarm page opens.
applySavedTheme();

// Also sync if the theme changes in another browser tab.
window.addEventListener("storage", (event) => {
    if (event.key === "theme") {
        applySavedTheme();
    }
});

/* Live clock and date */
function updateClock() {
    const now = new Date();

    liveTime.textContent = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    liveDate.textContent = now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


/* Populate hour and minute dropdowns */
function populateTimeSelectors() {
    for (let hour = 1; hour <= 12; hour++) {
        const option = document.createElement("option");

        option.value = String(hour);
        option.textContent = String(hour).padStart(2, "0");

        alarmHourInput.appendChild(option);
    }

    for (let minute = 0; minute < 60; minute++) {
        const option = document.createElement("option");

        option.value = String(minute);
        option.textContent = String(minute).padStart(2, "0");

        alarmMinuteInput.appendChild(option);
    }
}

/* Default to the next full minute */
function setDefaultAlarmTime() {
    const nextMinute = new Date();

    nextMinute.setSeconds(0, 0);
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);

    const hour12 = nextMinute.getHours() % 12 || 12;

    alarmHourInput.value = String(hour12);
    alarmMinuteInput.value = String(nextMinute.getMinutes());
    alarmPeriodInput.value =
        nextMinute.getHours() >= 12 ? "PM" : "AM";
}


function formatAlarmTime(date) {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

function formatAlarmDate(date) {
    const today = new Date();

    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    return isToday ? "today" : "tomorrow";
}

/* Prepare sound after the user interacts with the page */
async function prepareAudio() {
    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        return false;
    }

    try {
        if (!audioContext) {
            audioContext = new AudioContextClass();
        }

        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        return audioContext.state === "running";
    } catch (error) {
        return false;
    }
}

/* Play one classic two-tone beep pattern */
function playTone(frequency, offset, duration) {
    if (!audioContext || audioContext.state !== "running") {
        return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    const startAt = audioContext.currentTime + offset;
    const endAt = startAt + duration;

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(frequency, startAt);

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.13, startAt + 0.02);
    gain.gain.setValueAtTime(0.13, endAt - 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(startAt);
    oscillator.stop(endAt + 0.03);
}

function playRingtonePattern() {
    if (!audioContext || audioContext.state !== "running") {
        return;
    }

    playTone(880, 0.00, 0.18);
    playTone(660, 0.23, 0.18);
    playTone(880, 0.46, 0.18);
    playTone(660, 0.69, 0.18);
}

function stopRingtone() {
    if (ringtoneInterval !== null) {
        clearInterval(ringtoneInterval);
        ringtoneInterval = null;
    }
}

/* Update alarm details on the screen */
function updateAlarmDisplay() {
    const hasAlarm = alarmTarget !== null;

    cancelAlarmBtn.disabled = !hasAlarm;
    activeAlarmBox.hidden = !hasAlarm;

    if (hasAlarm) {
        const targetDate = new Date(alarmTarget);

        activeAlarmText.textContent =
            `Next alarm: ${formatAlarmTime(targetDate)} (${formatAlarmDate(targetDate)})`;
    }
}

/* Set the next occurrence of the selected time */

alarmForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const hour12 = Number(alarmHourInput.value);
    const minutes = Number(alarmMinuteInput.value);
    const period = alarmPeriodInput.value;

    if (
        !Number.isInteger(hour12) ||
        hour12 < 1 ||
        hour12 > 12 ||
        !Number.isInteger(minutes) ||
        minutes < 0 ||
        minutes > 59
    ) {
        alarmStatus.textContent = "Please select a valid alarm time.";
        return;
    }

    // Convert 12-hour time into 24-hour time.
    let hour24 = hour12 % 12;

    if (period === "PM") {
        hour24 += 12;
    }

    const target = new Date();

    target.setHours(hour24, minutes, 0, 0);

    // If that time has already passed today,
    // schedule it for tomorrow.
    if (target.getTime() <= Date.now()) {
        target.setDate(target.getDate() + 1);
    }

    stopRingtone();

    ringOverlay.hidden = true;
    isRinging = false;
    alarmTarget = target.getTime();

    const soundReady = await prepareAudio();

    updateAlarmDisplay();

    alarmStatus.textContent =
        `Alarm set for ${formatAlarmTime(target)} ` +
        `(${formatAlarmDate(target)}).` +
        (soundReady
            ? ""
            : " Sound may be blocked or unsupported by this browser.");

    document.title = "DayOrbit | Alarm Clock";
});

/* Check when the alarm is due */
function checkAlarm() {
    if (alarmTarget === null || Date.now() < alarmTarget) {
        return;
    }

    alarmTarget = null;
    updateAlarmDisplay();
    startRinging();
}

function startRinging() {
    if (isRinging) {
        return;
    }

    isRinging = true;
    ringOverlay.hidden = false;

    const now = new Date();
    ringTime.textContent = formatAlarmTime(now);

    alarmStatus.textContent = "Your alarm is ringing!";
    document.title = "⏰ Alarm Ringing | DayOrbit";

    // Start the repeating classic ringtone.
    if (audioContext && audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
    }

    playRingtonePattern();
    ringtoneInterval = setInterval(playRingtonePattern, 1400);

    stopAlarmBtn.focus();
}

/* Stop the current alarm completely */
function stopAlarm() {
    stopRingtone();

    isRinging = false;
    alarmTarget = null;
    ringOverlay.hidden = true;

    updateAlarmDisplay();

    alarmStatus.textContent = "Alarm stopped.";
    document.title = "DayOrbit | Alarm Clock";
}

stopAlarmBtn.addEventListener("click", stopAlarm);

/* Cancel an alarm before it rings */
cancelAlarmBtn.addEventListener("click", () => {
    stopRingtone();

    alarmTarget = null;
    isRinging = false;
    ringOverlay.hidden = true;

    updateAlarmDisplay();

    alarmStatus.textContent = "Alarm cancelled.";
    document.title = "DayOrbit | Alarm Clock";
});

/* Snooze: ring again in five minutes */
snoozeAlarmBtn.addEventListener("click", () => {
    if (!isRinging) {
        return;
    }

    stopRingtone();

    isRinging = false;
    ringOverlay.hidden = true;

    alarmTarget = Date.now() + (5 * 60 * 1000);

    updateAlarmDisplay();

    const snoozeTime = new Date(alarmTarget);

    alarmStatus.textContent =
        `Snoozed for 5 minutes. Next ring: ${formatAlarmTime(snoozeTime)}.`;

    document.title = "DayOrbit | Alarm Clock";
});

/* Start the clock and alarm checks */

populateTimeSelectors();
setDefaultAlarmTime();

updateClock();
updateAlarmDisplay();

setInterval(updateClock, 1000);
setInterval(checkAlarm, 500);