// ======================================
// CALENDAR ELEMENTS
// ======================================

const monthTitle =
  document.getElementById("monthTitle");

const calendarGrid =
  document.getElementById("calendarGrid");

const monthSelect =
  document.getElementById("monthSelect");

const yearInput =
  document.getElementById("yearInput");

const prevMonth =
  document.getElementById("prevMonth");

const nextMonth =
  document.getElementById("nextMonth");

const todayBtn =
  document.getElementById("todayBtn");

const goToDateBtn =
  document.getElementById("goToDateBtn");

const festivalList =
  document.getElementById("festivalList");

const festivalMonth =
  document.getElementById("festivalMonth");

const selectedDate =
  document.getElementById("selectedDate");

const selectedDayName =
  document.getElementById("selectedDayName");

const selectedFestival =
  document.getElementById("selectedFestival");


// ======================================
// CURRENT CALENDAR DATE
// ======================================

const today =
  new Date();


let currentMonth =
  today.getMonth();


let currentYear =
  today.getFullYear();


// ======================================
// MONTH NAMES
// ======================================

const monthNames = [

  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"

];


// ======================================
// DAY NAMES
// ======================================

const dayNames = [

  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"

];


// ======================================
// INDIAN FESTIVAL DATA
// ======================================

const indianFestivals = {

  1980: {

    "1980-02-14": {
      name: "Maha Shivaratri",
      icon: "🔱",
      type: "Hindu Festival",
      description:
        "A major Hindu festival dedicated to Lord Shiva."
    },

    "1980-03-02": {
      name: "Holi",
      icon: "🎨",
      type: "Hindu Festival",
      description:
        "The festival of colours."
    },

    "1980-03-17": {
      name: "Ugadi / Gudi Padwa",
      icon: "🌸",
      type: "Regional Festival",
      description:
        "Traditional New Year celebrations observed in several parts of India."
    },

    "1980-03-24": {
      name: "Rama Navami",
      icon: "🏹",
      type: "Hindu Festival",
      description:
        "Celebration of the birth of Lord Rama."
    },

    "1980-07-14": {
      name: "Rath Yatra",
      icon: "🛕",
      type: "Hindu Festival",
      description:
        "The chariot festival associated with Lord Jagannath."
    },

    "1980-08-24": {
      name: "Onam",
      icon: "🌼",
      type: "Regional Festival",
      description:
        "A major harvest festival of Kerala."
    },

    "1980-08-26": {
      name: "Raksha Bandhan",
      icon: "🪢",
      type: "Hindu Festival",
      description:
        "A festival celebrating the bond between brothers and sisters."
    },

    "1980-09-02": {
      name: "Janmashtami",
      icon: "🦚",
      type: "Hindu Festival",
      description:
        "Celebration of the birth of Lord Krishna."
    },

    "1980-09-13": {
      name: "Ganesh Chaturthi",
      icon: "🐘",
      type: "Hindu Festival",
      description:
        "Festival celebrating Lord Ganesha."
    },

    "1980-10-10": {
      name: "Sharad Navratri",
      icon: "🙏",
      type: "Hindu Festival",
      description:
        "Beginning of the Sharad Navratri festivities."
    },

    "1980-10-19": {
      name: "Dussehra",
      icon: "🏹",
      type: "Hindu Festival",
      description:
        "Celebration of the victory of good over evil."
    },

    "1980-11-07": {
      name: "Diwali",
      icon: "🪔",
      type: "Hindu Festival",
      description:
        "Festival of lights."
    },

    "1980-11-09": {
      name: "Bhai Dooj",
      icon: "❤️",
      type: "Hindu Festival",
      description:
        "Festival celebrating the bond between brothers and sisters."
    },

    "1980-11-14": {
      name: "Chhath Puja",
      icon: "🌅",
      type: "Hindu Festival",
      description:
        "A festival dedicated to the worship of the Sun."
    }

  },


  2026: {

    "2026-01-14": {
      name: "Makar Sankranti",
      icon: "🪁",
      type: "Indian Festival",
      description:
        "A major solar festival celebrated across India."
    },

    "2026-03-04": {
      name: "Holi",
      icon: "🎨",
      type: "Hindu Festival",
      description:
        "The festival of colours."
    },

    "2026-03-26": {
      name: "Rama Navami",
      icon: "🏹",
      type: "Hindu Festival",
      description:
        "Celebration of the birth of Lord Rama."
    },

    "2026-04-14": {
      name: "Vaisakhi",
      icon: "🌾",
      type: "Indian Festival",
      description:
        "A major harvest festival celebrated especially in northern India."
    },

    "2026-07-16": {
      name: "Rath Yatra",
      icon: "🛕",
      type: "Hindu Festival",
      description:
        "The famous chariot festival of Lord Jagannath."
    },

    "2026-08-28": {
      name: "Raksha Bandhan",
      icon: "🪢",
      type: "Hindu Festival",
      description:
        "A festival celebrating the bond between brothers and sisters."
    },

    "2026-09-04": {
      name: "Janmashtami",
      icon: "🦚",
      type: "Hindu Festival",
      description:
        "Celebration of the birth of Lord Krishna."
    },

    "2026-09-14": {
      name: "Ganesh Chaturthi",
      icon: "🐘",
      type: "Hindu Festival",
      description:
        "Festival celebrating Lord Ganesha."
    },

    "2026-10-11": {
      name: "Sharad Navratri",
      icon: "🙏",
      type: "Hindu Festival",
      description:
        "Beginning of the Sharad Navratri festivities."
    },

    "2026-10-20": {
      name: "Dussehra",
      icon: "🏹",
      type: "Hindu Festival",
      description:
        "Celebration of the victory of good over evil."
    },

    "2026-11-08": {
      name: "Diwali",
      icon: "🪔",
      type: "Hindu Festival",
      description:
        "Festival of lights."
    },

    "2026-11-15": {
      name: "Chhath Puja",
      icon: "🌅",
      type: "Indian Festival",
      description:
        "A festival dedicated to the worship of the Sun."
    },

    "2026-11-24": {
      name: "Guru Nanak Jayanti",
      icon: "🙏",
      type: "Sikh Festival",
      description:
        "Celebration of the birth anniversary of Guru Nanak."
    }

  }

};


// ======================================
// FORMAT DATE KEY
// ======================================

function getDateKey(
  year,
  month,
  day
) {

  return (
    `${year}-` +
    `${String(month + 1).padStart(2, "0")}-` +
    `${String(day).padStart(2, "0")}`
  );

}


// ======================================
// RENDER CALENDAR
// ======================================

function renderCalendar() {

  calendarGrid.innerHTML = "";


  monthTitle.innerText =
    `${monthNames[currentMonth]} ${currentYear}`;


  monthSelect.value =
    currentMonth;


  yearInput.value =
    currentYear;


  festivalMonth.innerText =
    `${monthNames[currentMonth]} ${currentYear}`;


  // First day of month

  const firstDay =
    new Date(
      currentYear,
      currentMonth,
      1
    );


  // Last day of month

  const lastDay =
    new Date(
      currentYear,
      currentMonth + 1,
      0
    );


  const totalDays =
    lastDay.getDate();


  // Convert Sunday = 0 into Monday-based index

  let startingDay =
    firstDay.getDay();


  startingDay =
    startingDay === 0
      ? 6
      : startingDay - 1;


  // ==================================
  // PREVIOUS MONTH DAYS
  // ==================================

  for (
    let i = 0;
    i < startingDay;
    i++
  ) {

    const previousDate =
      new Date(
        currentYear,
        currentMonth,
        i - startingDay + 1
      );


    createCalendarDay(
      previousDate,
      true
    );

  }


  // ==================================
  // CURRENT MONTH DAYS
  // ==================================

  for (
    let day = 1;
    day <= totalDays;
    day++
  ) {

    const date =
      new Date(
        currentYear,
        currentMonth,
        day
      );


    createCalendarDay(
      date,
      false
    );

  }


  // ==================================
  // NEXT MONTH DAYS
  // ==================================

  const totalCells =
    42;


  const cellsUsed =
    startingDay + totalDays;


  const remainingCells =
    totalCells - cellsUsed;


  for (
    let i = 1;
    i <= remainingCells;
    i++
  ) {

    const nextDate =
      new Date(
        currentYear,
        currentMonth + 1,
        i
      );


    createCalendarDay(
      nextDate,
      true
    );

  }


  renderFestivals();

}


// ======================================
// CREATE CALENDAR DAY
// ======================================

function createCalendarDay(
  date,
  outsideMonth
) {

  const day =
    date.getDate();


  const year =
    date.getFullYear();


  const month =
    date.getMonth();


  const dateKey =
    getDateKey(
      year,
      month,
      day
    );


  const dayElement =
    document.createElement("button");


  dayElement.type =
    "button";


  dayElement.className =
    "calendar-day";


  if (outsideMonth) {

    dayElement.classList.add(
      "outside-month"
    );

  }


  // ==================================
  // TODAY
  // ==================================

  const isToday =
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();


  if (isToday) {

    dayElement.classList.add(
      "today-date"
    );

  }


  // ==================================
  // FESTIVAL
  // ==================================

  const festival =
    indianFestivals[year]?.[dateKey];


  if (festival) {

    dayElement.classList.add(
      "festival-date"
    );

  }


  dayElement.innerHTML = `

    <span class="day-number">
      ${day}
    </span>

    ${
      festival
        ? `
          <span class="festival-dot">
            ${festival.icon}
          </span>

          <span class="festival-short-name">
            ${getShortFestivalName(
              festival.name
            )}
          </span>
        `
        : ""
    }

  `;


  // ==================================
  // CLICK
  // ==================================

  dayElement.addEventListener(
    "click",
    function () {

      showSelectedDate(
        date,
        festival
      );

    }
  );


  calendarGrid.appendChild(
    dayElement
  );

}


// ======================================
// SHORT FESTIVAL NAME
// ======================================

function getShortFestivalName(
  name
) {

  if (name.length <= 11) {
    return name;
  }


  return (
    name.substring(0, 10) +
    "..."
  );

}


// ======================================
// FESTIVAL SIDEBAR
// ======================================

function renderFestivals() {

  festivalList.innerHTML = "";


  const yearFestivals =
    indianFestivals[currentYear];


  if (!yearFestivals) {

    festivalList.innerHTML = `

      <div class="no-festival">

        <div>
          📅
        </div>

        <p>
          Festival data for this year
          hasn't been added yet.
        </p>

      </div>

    `;

    return;

  }


  const monthPrefix =
    `${currentYear}-` +
    `${String(currentMonth + 1).padStart(2, "0")}-`;


  const festivalsThisMonth =
    Object.entries(yearFestivals)
      .filter(
        ([date]) =>
          date.startsWith(
            monthPrefix
          )
      )
      .sort(
        ([a], [b]) =>
          a.localeCompare(b)
      );


  if (
    festivalsThisMonth.length === 0
  ) {

    festivalList.innerHTML = `

      <div class="no-festival">

        <div>
          🌿
        </div>

        <p>
          No highlighted festivals
          for this month.
        </p>

      </div>

    `;

    return;

  }


  festivalsThisMonth.forEach(
    ([date, festival]) => {

      const item =
        document.createElement("button");


      item.type =
        "button";


      item.className =
        "festival-item";


      const dateObject =
        new Date(
          date + "T00:00:00"
        );


      item.innerHTML = `

        <div class="festival-item-icon">
          ${festival.icon}
        </div>

        <div class="festival-item-info">

          <strong>
            ${festival.name}
          </strong>

          <span>
            ${dateObject.toLocaleDateString(
              [],
              {
                day: "numeric",
                month: "short"
              }
            )}
          </span>

        </div>

      `;


      item.addEventListener(
        "click",
        function () {

          showSelectedDate(
            dateObject,
            festival
          );

        }
      );


      festivalList.appendChild(
        item
      );

    }
  );

}


// ======================================
// SELECTED DATE
// ======================================

function showSelectedDate(
  date,
  festival
) {

  const formattedDate =
    date.toLocaleDateString(
      [],
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );


  selectedDate.innerText =
    formattedDate;


  selectedDayName.innerText =
    dayNames[date.getDay()];


  if (festival) {

    selectedFestival.innerHTML = `

      <span class="selected-festival-icon">
        ${festival.icon}
      </span>

      <div>

        <strong>
          ${festival.name}
        </strong>

        <small>
          ${festival.type}
        </small>

        <p>
          ${festival.description}
        </p>

      </div>

    `;

  } else {

    selectedFestival.innerHTML = `

      <span class="selected-festival-icon">
        📌
      </span>

      <div>

        <strong>
          No highlighted festival
        </strong>

        <small>
          Regular day
        </small>

        <p>
          No festival is currently highlighted
          for this date.
        </p>

      </div>

    `;

  }


  // Small animation

  const selectedCard =
    document.getElementById(
      "selectedDateCard"
    );


  selectedCard.classList.remove(
    "date-selected-animation"
  );


  void selectedCard.offsetWidth;


  selectedCard.classList.add(
    "date-selected-animation"
  );

}


// ======================================
// PREVIOUS MONTH
// ======================================

prevMonth.addEventListener(
  "click",
  function () {

    currentMonth--;


    if (currentMonth < 0) {

      currentMonth = 11;

      currentYear--;

    }


    updateCalendar();

  }
);


// ======================================
// NEXT MONTH
// ======================================

nextMonth.addEventListener(
  "click",
  function () {

    currentMonth++;


    if (currentMonth > 11) {

      currentMonth = 0;

      currentYear++;

    }


    updateCalendar();

  }
);


// ======================================
// TODAY
// ======================================

todayBtn.addEventListener(
  "click",
  function () {

    currentMonth =
      today.getMonth();

    currentYear =
      today.getFullYear();


    updateCalendar();

  }
);


// ======================================
// MONTH DROPDOWN
// ======================================

monthSelect.addEventListener(
  "change",
  function () {

    currentMonth =
      Number(
        monthSelect.value
      );

  }
);


// ======================================
// GO TO MONTH + YEAR
// ======================================

goToDateBtn.addEventListener(
  "click",
  function () {

    const selectedYear =
      Number(
        yearInput.value
      );


    if (
      selectedYear < 1900 ||
      selectedYear > 2100
    ) {

      alert(
        "Please enter a year between 1900 and 2100."
      );

      return;

    }


    currentYear =
      selectedYear;


    currentMonth =
      Number(
        monthSelect.value
      );


    updateCalendar();

  }
);


// ======================================
// ENTER KEY FOR YEAR
// ======================================

yearInput.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Enter"
    ) {

      goToDateBtn.click();

    }

  }
);


// ======================================
// UPDATE CALENDAR
// ======================================

function updateCalendar() {

  renderCalendar();

}


// ======================================
// INITIALIZE
// ======================================

renderCalendar();


// Show today's date initially

showSelectedDate(
  today,
  indianFestivals[
    today.getFullYear()
  ]?.[
    getDateKey(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
  ]
);