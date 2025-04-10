//// //// //// //// Declarations //// //// //// ////

const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKABBR = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const YEAR = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let currentDay = currentDate.getDay();

let calendarMonth = currentMonth;
let calendarYear = currentYear;
let calendarDates = [];

let charterBookings = [];
let bookingsToDisplay = [];

//// //// //// //// For Making the Basic Calendar //// //// //// ////

function getCalendarDates() {
    //Get Previous Month's
    let firstDate = new Date(calendarYear, calendarMonth, 1);
    let firstDay = firstDate.getDay();
    if (firstDay == 0) { firstDay = 7 }
    if (firstDay != 1) {
        let firstDateLastMonth = new Date(calendarYear, calendarMonth, -1 * (firstDay - 2))
        let lastDateLastMonth = new Date(calendarYear, calendarMonth, 0);
        for (let i = firstDateLastMonth.getDate(); i < lastDateLastMonth.getDate() + 1; i++) {
            let date = new Date(firstDateLastMonth.getFullYear(), firstDateLastMonth.getMonth(), i);
            calendarDates.push({ date: date, type: "last" })
        }
    }
    //Get This Month's
    let lastDate = new Date(calendarYear, calendarMonth + 1, 0);
    for (let i = 1; i < lastDate.getDate() + 1; i++) {
        let date = new Date(calendarYear, calendarMonth, i);
        if (i == currentDate.getDate() && calendarMonth == currentMonth) { calendarDates.push({ date: date, type: "today" }) }
        else { calendarDates.push({ date: date, type: "current" }) }
    }
    //Get Next Month's
    let nextMonth = (calendarMonth == 11) ? 0 : calendarMonth + 1;
    let nextYear = (calendarMonth == 11) ? calendarYear + 1 : calendarYear;
    let nextDatesLength = 42 - calendarDates.length + 1;
    for (let i = 1; i < nextDatesLength; i++) {
        let date = new Date(nextYear, nextMonth, i);
        calendarDates.push({ date: date, type: "next" })
    }
}

function renderCalendar() {
    for (let i = 1; i < 43; i++) {
        //Create boxes
        let box = document.createElement("div");
        box.classList.add("div-block-6");
        box.setAttribute("id", `datebox_${i}`);
        if (i % 7 == 0) {
            box.classList.add("dateBoxEnd")
        }
        if (i > 35) {
            box.classList.add("dateBoxBottom")
        }
        //Create date numbers
        let numberWrapper = document.createElement("div");
        numberWrapper.classList.add("div-block-7");
        let dateNumber = document.createElement("div");
        dateNumber.classList.add("text-block-3");
        dateNumber.setAttribute("id", `datenumber_${i}`);
        //Append to parents
        numberWrapper.appendChild(dateNumber)
        box.appendChild(numberWrapper)
        e("calendarArea").appendChild(box);
    }
}

function fillCalendarDates() {
    e("calendarTitle").innerHTML = `${YEAR[calendarMonth]} ${calendarYear}`;
    calendarDates.forEach((date, i) => {
        let num = (date.date.getDate() < 10) ? `0${date.date.getDate()}` : date.date.getDate();
        e(`datenumber_${i + 1}`).innerHTML = num;
        if (date.type == "today") { e(`datenumber_${i + 1}`).classList.add("dark") }
        if (date.type != "today" && date.type != "current") {
            e(`datenumber_${i + 1}`).classList.add("light")
            e(`datebox_${i + 1}`).classList.add("light")
        }
    })
}

function resetCalendarClasses() {
    for (let i = 1; i < 43; i++) {
        e(`datenumber_${i}`).classList.remove("light");
        e(`datenumber_${i}`).classList.remove("dark");
        e(`datebox_${i}`).classList.remove("light");
    }
}

function fillCalendar() {
    getCalendarDates()
    fillCalendarDates()
}

e("nextMonth").addEventListener("click", () => {
    calendarDates = [];
    if (calendarMonth == 11) {
        calendarMonth = 0; calendarYear += 1;
    } else {
        calendarMonth += 1
    }
    clearBookings()
    resetCalendarClasses()
    fillCalendar()
    extractBookings()
    displayBookings()
})

e("previousMonth").addEventListener("click", () => {
    calendarDates = [];
    if (calendarMonth == 0) {
        calendarMonth = 11; calendarYear -= 1;
    } else {
        calendarMonth -= 1
    }
    clearBookings()
    resetCalendarClasses()
    fillCalendar()
    extractBookings()
    displayBookings()
})

const tabs = {
    calendar: {
        tab: e("calendarTab"),
        section: e("calendarSection"),
        icon: e("calendarTabIcon")
    },
    yachts: {
        tab: e("yachtsTab"),
        section: e("yachtsSection"),
        icon: e("yachtsTabIcon")
    }
}

let currentTab = tabs.calendar;

function switchTabs(dest) {
    if (dest == currentTab) { console.log("null"); return null } else {
        currentTab.tab.classList.remove("selected");
        currentTab.section.classList.add("hidden");
        currentTab.icon.classList.remove("selected")
        dest.tab.classList.add("selected");
        dest.section.classList.remove("hidden");
        dest.icon.classList.add("selected")
        currentTab = dest;
    }
}

e("calendarTab").addEventListener("click", () => { switchTabs(tabs.calendar) })
e("yachtsTab").addEventListener("click", () => { switchTabs(tabs.yachts) })

e('charterStartDate').setAttribute("type", "date");
e('charterEndDate').setAttribute("type", "date");

//// //// //// //// For Filling the Calendar with Bookings //// //// //// ////

function extractBookings() {
    calendarDates.forEach((date, i) => {
        let year = date.date.getFullYear();
        let month = (date.date.getMonth() + 1 < 10) ? `0${date.date.getMonth() + 1}` : date.date.getMonth() + 1;
        let day = (date.date.getDate() < 10) ? `0${date.date.getDate()}` : date.date.getDate();
        let matchingBookings = charterBookings.filter(booking => booking.charterStart.includes(`${year}-${month}-${day}`))
        matchingBookings.forEach((booking) => {
            bookingsToDisplay.push({ booking: booking, position: i + 1 })
        })
    })
}

function extractTimeFormatted(dateTime) {
    let time = dateTime.substring(11, 16);
    let hour = (parseInt(time.substring(0, 2)) > 12 ? parseInt(time.substring(0, 2)) - 12 : parseInt(time.substring(0, 2)));
    let suffix = (parseInt(time.substring(0, 2)) > 11 ? "p" : "a");
    let restOfTime = time.substring(2);
    if (parseInt(hour) == 0) { hourFormatted = "12" }
    return `${hour}${restOfTime}${suffix}`
}

function displayBookings() {
    bookingsToDisplay.forEach((booking, i) => {
        // Render elements
        let bookingDiv = document.createElement("div");
        bookingDiv.classList.add("div-block-11");
        let bookingBadge = document.createElement("div");
        bookingBadge.classList.add("text-block-6");
        bookingBadge.setAttribute("id", `booking_${i}`)
        bookingBadge.innerHTML = `${extractTimeFormatted(booking.booking.charterStart)}  ${booking.booking.firstName} ${booking.booking.lastName}`;
        bookingDiv.appendChild(bookingBadge);
        e(`datebox_${booking.position}`).appendChild(bookingDiv)
        // Set event listener
        bookingBadge.addEventListener("click", () => {
            populateBookingDetails(booking.booking)
            openBookingDetails()
        })
    })
}

function clearBookings() {
    for (let i = 0; i < bookingsToDisplay.length; i++) {
        e(`booking_${i}`).remove();
    }
    bookingsToDisplay = [];
}

//// //// //// //// For Controlling Booking Details Form //// //// //// ////

let dbFieldsDisabled = true;

function extractTimeFormattedFull(dateTime) {
    let time = dateTime.substring(11, 16);
    let hour = (parseInt(time.substring(0, 2)) > 12 ? parseInt(time.substring(0, 2)) - 12 : parseInt(time.substring(0, 2)));
    let suffix = (parseInt(time.substring(0, 2)) > 11 ? "PM" : "AM");
    let restOfTime = time.substring(2);
    if (parseInt(hour) == 0) { hourFormatted = "12" }
    return `${hour}${restOfTime} ${suffix}`
}

function makeDateSpanPretty(dateTime_1, dateTime_2) {
    let day_1 = new Date(`${YEAR[parseInt(dateTime_1.substring(5, 7)) - 1]} ${dateTime_1.substring(8, 10)} ,${dateTime_1.substring(0, 4)}`);
    day_1 = WEEKABBR[day_1.getDay()];
    let date_1 = `${day_1} ${parseInt(dateTime_1.substring(5, 7))}/${parseInt(dateTime_1.substring(8, 10))}/${parseInt(dateTime_1.substring(0, 4))}`;
    let time_1 = extractTimeFormattedFull(dateTime_1)

    let day_2 = new Date(`${YEAR[parseInt(dateTime_2.substring(5, 7)) - 1]} ${dateTime_2.substring(8, 10)} ,${dateTime_2.substring(0, 4)}`);
    day_2 = WEEKABBR[day_2.getDay()];

    let date_2 = `${day_2} ${parseInt(dateTime_2.substring(5, 7))}/${parseInt(dateTime_2.substring(8, 10))}/${parseInt(dateTime_2.substring(0, 4))}`;
    let time_2 = extractTimeFormattedFull(dateTime_2)

    if (date_1 == date_2) {
        return `${date_1} ${time_1} - ${time_2}`
    } else {
        return `${date_1} ${time_1} - ${date_2} ${time_2}`
    }
}

function resizeTextarea(textarea, fieldSizing) {
    let newText = textarea.value.replaceAll('\n', '<br>')
    fieldSizing.innerHTML = newText
    textarea.style.height = `${fieldSizing.offsetHeight}px`
}

e("internalNotes").addEventListener("input", () => {
    resizeTextarea(e("internalNotes"), e("internalNotesFieldSizing"))
})

let bdElements = {
    // Charter Info
    formWindowTitle: e("formWindowTitle"),
    formTitle: e("formTitle"),
    dateTimeText: e("dateTimeText"),
    passengersText: e("passengersText"),
    //passengers: e("passengers"),
    vessel: e("vessel"),
    occasion: e("occasion"),
    alcohol: e("alcohol"),
    notes: e("notes"),
    internalNotes: e("internalNotes"),
    // Customer Info
    firstName: e("firstName"),
    lastName: e("lastName"),
    contactMode: e("contactMode"),
    email: e("email"),
    phone: e("phone"),
    textOptIn: e("textOptIn"),
    // Invoice Info
    //estimate: e("estimate"),
    //invoiced: e("invoiced"),
    // Misc Info
    //requestedDate: e("requestedDate"),
    //alternateDate: e("alternateDate")
}

function populateBookingDetails(booking) {
    // Charter Info
    bdElements.formWindowTitle.innerHTML = `Yacht Charter for ${booking.firstName} ${booking.lastName}`;
    bdElements.formTitle.innerHTML = `Yacht Charter for ${booking.firstName} ${booking.lastName}`;
    bdElements.dateTimeText.innerHTML = makeDateSpanPretty(booking.charterStart, booking.charterEnd);
    bdElements.passengersText.innerHTML = `${booking.passengers} Passengers`;
    //bdElements.passengers.value = booking.passengers;
    //bdElements.vessel.value = booking.vessel;
    //bdElements.occasion.value = booking.occasion;
    bdElements.alcohol.value = booking.alcohol || false;
    bdElements.notes.innerHTML = booking.additionalInfo || "-";
    bdElements.internalNotes.value = booking.internalNotes || "";
    resizeTextarea(bdElements.internalNotes, e("internalNotesFieldSizing"))
    // Customer Info
    bdElements.firstName.value = booking.firstName;
    bdElements.lastName.value = booking.lastName;
    bdElements.contactMode.value = booking.contactMode;
    bdElements.email.value = booking.email;
    bdElements.phone.value = booking.phone;
    bdElements.textOptIn.value = booking.textOptIn;
}

function clearBookingDetails(booking) {
    Object.keys(bdElements).forEach((key) => {
        bdElements[key].value = ""
    })
}

function disableBDFields() {
    Object.keys(bdElements).forEach((key) => {
        bdElements[key].disabled = true
    })
    if (!dbFieldsDisabled) {
        e("saveButton").classList.add("hidden")
        e("editButton").classList.remove("hidden")
        e("linePassengersInput").classList.add("hidden")
        e("linePassengersText").classList.remove("hidden")
        e("lineCharterDatetimeInput").classList.add("hidden")
        e("lineCharterDatetimeText").classList.remove("hidden")
    }
    dbFieldsDisabled = true;
}

function enableBDFields() {
    Object.keys(bdElements).forEach((key) => {
        bdElements[key].disabled = false
    })
    e("saveButton").classList.remove("hidden")
    e("editButton").classList.add("hidden")
    e("linePassengersInput").classList.remove("hidden")
    e("linePassengersText").classList.add("hidden")
    e("lineCharterDatetimeInput").classList.remove("hidden")
    e("lineCharterDatetimeText").classList.add("hidden")
    dbFieldsDisabled = false;
}

function openBookingDetails() {
    disableBDFields();
    e("bookingDetails").classList.add("open");
}

function closeBookingDetails() {
    clearBookingDetails()
    e("bookingDetails").classList.remove("open")
}

e("xBookingDetails").addEventListener("click", () => {
    closeBookingDetails()
})

e("backscreenBookingDetails").addEventListener("click", () => {
    closeBookingDetails()
})

e("editButton").addEventListener("click", () => {
    enableBDFields()
})

e("saveButton").addEventListener("click", () => {
    disableBDFields()
})

function setTimeInput(el) {
    for (let i = 9; i < 12; i++) {
        let j = (i < 10 ? `0${i}` : `${i}`);
        let option_1 = document.createElement("option");
        option_1.textContent = `${j}:00 AM`;
        option_1.value = `${j}:00`;
        el.appendChild(option_1);
        let option_2 = document.createElement("option");
        option_2.textContent = `${j}:30 AM`;
        option_2.value = `${j}:30`;
        el.appendChild(option_2)
    }
    let option_noon_1 = document.createElement("option");
    option_noon_1.textContent = `12:00 PM`;
    option_noon_1.value = `12:00`;
    el.appendChild(option_noon_1);
    let option_noon_2 = document.createElement("option");
    option_noon_2.textContent = `12:30 PM`;
    option_noon_2.value = `12:30`;
    el.appendChild(option_noon_2);
    for (let i = 1; i < 12; i++) {
        let option_1 = document.createElement("option");
        option_1.textContent = `${i}:00 PM`;
        option_1.value = `${i + 12}:00`;
        el.appendChild(option_1);
        let option_2 = document.createElement("option");
        option_2.textContent = `${i}:30 PM`;
        option_2.value = `${i + 12}:30`;
        el.appendChild(option_2)
    }
    let option_midnight_1 = document.createElement("option");
    option_midnight_1.textContent = `12:00 AM`;
    option_midnight_1.value = `00:00`;
    el.appendChild(option_midnight_1);
    let option_midnight_2 = document.createElement("option");
    option_midnight_2.textContent = `12:30 AM`;
    option_midnight_2.value = `00:30`;
    el.appendChild(option_midnight_2);
}

setTimeInput(e('charterStartTime'));
setTimeInput(e('charterEndTime'));
