//// //// //// //// Declarations //// //// //// ////

const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKABBR = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const YEAR = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let currentDate = new Date("March 1, 2025");
//let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let currentDay = currentDate.getDay();

let calendarMonth = currentMonth;
let calendarYear = currentYear;
let calendarDates = [];

let charterBookings = [];
let bookingsToDisplay = [];
let currentBooking = "";

let booking_update = {
    id: null,
    update: {}
}

//// //// //// //// Tabs Control //// //// //// ////

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

e("calendarTab").addEventListener("click", () => {
    if (currentTab = tabs.yachts) {
        setVesselUpdate();
        if (Object.keys(vessel_update.update).length > 0) {
            e("confirmSaveVessel").classList.remove("hidden")
        } else {
            disableVfFields();
            switchTabs(tabs.calendar)
        }
    }
})


e("yachtsTab").addEventListener("click", () => { switchTabs(tabs.yachts) })

e('charterStartDate').setAttribute("type", "date");
e('charterEndDate').setAttribute("type", "date");

//// //// //// //// For Making the Basic Calendar //// //// //// ////

function getBookings(dateStart, dateEnd) {
    return new Promise(async (resolve) => {
        const url = "https://sdyc-api-2-8c0da59c5ac4.herokuapp.com/getBookings";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dateStart: dateStart, dateEnd: dateEnd }),
            });
            console.log(response)
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            } else {
                const json = await response.json();
                resolve(json.bookings);
            }
        } catch (error) {
            console.log(error.message)
        }
    })
}

function updateBooking(id, data) {
    return new Promise(async (resolve) => {
        const url = "https://sdyc-api-2-8c0da59c5ac4.herokuapp.com/updateBooking";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id, data: data }),
            });
            console.log(response)
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            } else {
                resolve()
            }
        } catch (error) {
            console.log(error.message)
        }
    })
}

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
            booking_update.id = booking.booking.id;
            populateBookingDetails(booking.booking)
            openBookingDetails()
        })
    })
}

function clearBookings() {
    for (let i = 0; i < bookingsToDisplay.length; i++) {
        e(`booking_${i}`).remove();
    }
    bookingsToDisplay = []
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

function segmentedDateTime(dateTime) {
    const date = dateTime.substring(0, 10);
    const time = dateTime.substring(11, 16);
    return { date: date, time: time }
}

function resizeTextarea(textarea, fieldSizing) {
    let newText = textarea.value.replaceAll('\n', '<br>')
    fieldSizing.innerHTML = newText
    textarea.style.height = `${fieldSizing.offsetHeight}px`
}

e("internalNotes").addEventListener("input", () => {
    resizeTextarea(e("internalNotes"), e("internalNotesFieldSizing"))
})

function formatCurrency(amount = 0) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

let bdElements = {
    // Charter Info
    charterStartDate: e("charterStartDate"),
    charterStartTime: e("charterStartTime"),
    charterEndDate: e("charterEndDate"),
    charterEndTime: e("charterEndTime"),
    passengers: e("passengers"),
    vessel: e("vessel"),
    occasion: e("occasion"),
    alcohol: e("alcohol"),
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
}

function populateBookingDetails(booking) {
    currentBooking = booking.id;
    // Charter Info
    e("formWindowTitle").innerHTML = `Yacht Charter for ${booking.firstName} ${booking.lastName}`;
    e("formTitle").innerHTML = `Yacht Charter for ${booking.firstName} ${booking.lastName}`;
    e("dateTimeText").innerHTML = makeDateSpanPretty(booking.charterStart, booking.charterEnd);
    bdElements.charterStartDate.value = segmentedDateTime(booking.charterStart).date;
    bdElements.charterStartTime.value = segmentedDateTime(booking.charterStart).time;
    bdElements.charterEndDate.value = segmentedDateTime(booking.charterEnd).date;
    bdElements.charterEndTime.value = segmentedDateTime(booking.charterEnd).time;
    e("passengersText").innerHTML = `${booking.passengers} Passengers`;
    bdElements.passengers.value = booking.passengers;
    bdElements.vessel.value = booking.vessel || "";
    bdElements.occasion.value = booking.occasion;
    bdElements.alcohol.value = booking.alcohol || false;
    e("notes").innerHTML = booking.additionalInfo || "-";
    bdElements.internalNotes.value = booking.internalNotes || "";
    resizeTextarea(bdElements.internalNotes, e("internalNotesFieldSizing"));
    e("estimate").innerHTML = `Quote: ${formatCurrency(booking.estimate)}`;
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
    check_sendOptions();
    check_acceptBooking()
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
    check_sendOptions();
    check_acceptBooking()
}

function openBookingDetails() {
    disableBDFields();
    e("bookingDetails").classList.add("open");
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

function loadVesselSelections() {
    vessels.forEach((vessel) => {
        let option = document.createElement("option");
        option.value = vessel.id;
        option.innerHTML = vessel.name;
        e("vessel").appendChild(option)
    })
}

//// //// //// //// For Sending Booking Updates //// //// //// ////

function convertToUnix(isoString) {
    let date = new Date(isoString);
    date = date.toUTCString();
    const milliseconds = Date.parse(date);
    if (isNaN(milliseconds)) {
        return null
    } else {
        return Math.floor(milliseconds / 1000)
    }
}

function setBookingUpdate() {
    let booking = bookingsToDisplay.find(x => x.booking.id == booking_update.id);
    booking = booking.booking;
    Object.keys(bdElements).forEach((key) => {

        let value = bdElements[key].value;
        let additional = {};

        if (value == "true") { value = true }
        else if (value == "false") { value = false }

        else if (key == "charterStartDate" || key == "charterStartTime") {
            value = `${bdElements.charterStartDate.value}T${bdElements.charterStartTime.value}:00-07:00`;
            key = "charterStart";
            additional["charterStartTimestamp"] = convertToUnix(value.substring(0, 19))
        }
        else if (key == "charterEndDate" || key == "charterEndTime") {
            value = `${bdElements.charterEndDate.value}T${bdElements.charterEndTime.value}:00-07:00`;
            key = "charterEnd";
            additional["charterEndTimestamp"] = convertToUnix(value.substring(0, 19))
        }
        else if (key == "vessel") {
            let vessel = (value == "" ? { name: "", displayName: "" } : vessels.find(x => x.id == value))
            additional["vesselName"] = vessel.name;
            additional["vesselDisplayName"] = vessel.displayName;
        }

        let booking_value = booking[key];

        if (value != booking_value) {
            booking_update.update[key] = value;
            Object.keys(additional).forEach((key_additional) => {
                booking_update.update[key_additional] = additional[key_additional]
            })
        } else {
            delete booking_update.update[key];
            Object.keys(additional).forEach((key_additional) => {
                delete booking_update.update[key_additional]
            })
        }


    })
}

function updateLocalBooking() {
    Object.keys(booking_update.update).forEach((key) => {
        charterBookings.find(x => x.id == booking_update.id)[key] = booking_update.update[key];
        bookingsToDisplay.find(x => x.booking.id == booking_update.id).booking[key] = booking_update.update[key];
    })
}

function closeBookingDetails() {
    console.log(booking_update)
    if (Object.keys(booking_update.update).length > 0) {
        clearBookingDetails();
        e("bookingDetails").classList.remove("open");
        updateBooking(booking_update.id, booking_update.update).then(() => {
            if (booking_update.update.charterStart || booking_update.update.charterEnd) {
                clearBookings();
                extractBookings();
                displayBookings()
            }
            booking_update = { id: null, update: {} }
        })
    } else {
        setBookingUpdate();
        if (Object.keys(booking_update.update).length > 0) {
            e("confirmSaveBooking").classList.remove("hidden")
        } else {
            e("bookingDetails").classList.remove("open");
        }
    }
}

e("saveButton").addEventListener("click", () => {
    setBookingUpdate();
    updateLocalBooking();
    let displayedBooking = bookingsToDisplay.find(x => x.booking.id == booking_update.id).booking;
    populateBookingDetails(displayedBooking);
    disableBDFields();
})

e("confirmSaveBooking_save").addEventListener("click", () => {
    e("confirmSaveBooking").classList.add("hidden");
    updateLocalBooking();
    closeBookingDetails()
})

e("confirmSaveBooking_cancel").addEventListener("click", () => {
    booking_update.update = {};
    e("confirmSaveBooking").classList.add("hidden");
})

e("confirmSaveBooking_discard").addEventListener("click", () => {
    e("confirmSaveBooking").classList.add("hidden");
    clearBookingDetails();
    e("bookingDetails").classList.remove("open");
    booking_update = { id: null, update: {} }
})

//// //// //// //// Flow: Send Options //// //// //// ////

e("flow_sendOptions_cancel").addEventListener("click", () => {
    e("tab_bookingDetails").click()
})

function check_sendOptions() {
    if (dbFieldsDisabled) {
        e("button_sendOptions").classList.remove("disabled");
        e("button_icon_sendOptions").classList.remove("disabled")
    } else {
        e("button_sendOptions").classList.add("disabled");
        e("button_icon_sendOptions").classList.add("disabled")
    }
}

function goTo_sendOptions() {
    if (dbFieldsDisabled) {
        setTemplate_sendOptions();
        e("tab_sendOptions").click()
    }
}

e("button_sendOptions").addEventListener("click", () => {
    goTo_sendOptions()
})

function makeDatePretty(dateTime_1) {
    let day_1 = new Date(`${YEAR[parseInt(dateTime_1.substring(5, 7)) - 1]} ${dateTime_1.substring(8, 10)} ,${dateTime_1.substring(0, 4)}`);
    day_1 = WEEKABBR[day_1.getDay()];
    let date_1 = `${day_1} ${parseInt(dateTime_1.substring(5, 7))}/${parseInt(dateTime_1.substring(8, 10))}/${parseInt(dateTime_1.substring(0, 4))}`;

    return `${date_1}`
}

let occasionArticle = "a";

function getIndex(s, c, o) {
    let indicies = [];
    for (let i=0; i<s.length; i++) {
        if (s[i] == c) { indicies.push(i) }
    }
    if (indicies.length > 0) { return indicies[o-1] || -1 } 
    else { return -1 }
}

function setTemplate_sendOptions() {
    if (bdElements.occasion.value[0] == 'A' ||
        bdElements.occasion.value[0] == 'E' ||
        bdElements.occasion.value[0] == 'I' ||
        bdElements.occasion.value[0] == 'O' ||
        bdElements.occasion.value[0] == 'U') {
        occasionArticle = "an"
    }
    let sendOptionsTemplate = `Hello ${bdElements.firstName.value},\n\nThank you for your inquiry for ${occasionArticle} ${bdElements.occasion.value} cruise on ${makeDatePretty(bdElements.charterStartDate.value)} for ${bdElements.passengers.value} passengers!\n\nHere are some of our most popular yachts for your party size.\n----\n\n----\nThe rates above include fuel and all captain and port fees. Also includes waters, sodas, and snacks.\n\nOnce you are ready to secure your cruise, we'll email you an invoice and you can pay half to reserve your cruise and half 14 days before the cruise. \n\nIf you would like to browse all the yachts in our fleet, please click on the link below:\n\nhttps://www.sdyachtcharters.com\/browse\n\nFeel free to text or call at any time if you have any questions.\n\nCheers!\n--\n\nCaptain Kenne Melonas\nUS Navy SWCC (Retired)\nOwner of Elite Maritime Services/San Diego Yacht Charters\nhttps://www.sdyachtcharters.com\nEmail: sdyachtcharters@gmail.com`;
    e("flow_sendOptions_msg").value = sendOptionsTemplate;

    e("flow_sendOptions_to").value = e("email").value;
    e("flow_sendOptions_subject").value = `Charter Request for ${e("dateTimeText").innerHTML.substring(0, getIndex(e("dateTimeText").innerHTML, " ", 2))}`
    setVesselSelects()
}

//// //// //// //// Flow: Accept Booking //// //// //// ////

e("flow_acceptBooking_invoiceDate").setAttribute("type", "date");
e("flow_acceptBooking_dueDate").setAttribute("type", "date");
e("flow_acceptBooking_sDate1").setAttribute("type", "date");
e("flow_acceptBooking_sDate2").setAttribute("type", "date");
e("flow_acceptBooking_sDate3").setAttribute("type", "date");
e("flow_acceptBooking_sDate4").setAttribute("type", "date");
e("flow_acceptBooking_sDate5").setAttribute("type", "date");

e("flow_acceptBooking_cancel").addEventListener("click", () => {
    e("tab_bookingDetails").click()
})

function check_acceptBooking() {
    if (dbFieldsDisabled) {
        e("button_acceptBooking").classList.remove("disabled");
        e("button_icon_acceptBooking").classList.remove("disabled")
    } else {
        e("button_acceptBooking").classList.add("disabled");
        e("button_icon_acceptBooking").classList.add("disabled")
    }
}

function goTo_acceptBooking() {
		console.log(currentBooking)
    if (dbFieldsDisabled) {
    		setTemplate_acceptBooking();
        e("tab_acceptBooking").click();
    }
}

e("button_acceptBooking").addEventListener("click", () => {
    goTo_acceptBooking()
})

function todayDateInput() {
	let month = (currentMonth+1 < 10 ? `0${currentMonth+1}` : `${currentMonth+1}`);
  let day = (currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : `${currentDate.getDate()}`);
  return `${currentYear}-${month}-${day}`;
}

function getDuration(start, end) {
	return (end - start)/3600
}

function setCharterLine() {
	let booking = getCurrentBooking();
  let duration = getDuration(booking.charterStartTimestamp, booking.charterEndTimestamp);
  let rate = (booking.estimate/duration).toFixed(2);
  e("flow_acceptBooking_qty1").value = duration;
	e("flow_acceptBooking_rate1").value = rate;
  e("flow_acceptBooking_amt1").innerHTML = formatCurrency((duration*rate).toFixed(2))
}

for (let i=1; i<6; i++) {
	e(`flow_acceptBooking_qty${i}`).addEventListener("input", () => {
  	let rate = parseFloat(e(`flow_acceptBooking_rate${i}`).value);
  	if (rate || rate == "") { rate = 0 }
    let qty = parseFloat(e(`flow_acceptBooking_qty${i}`).value);
    if (!qty || qty == "") { qty = 0 }
    let amt = (rate*qty).toFixed(2);
    e(`flow_acceptBooking_amt${i}`).innerHTML = formatCurrency(amt);
    flow_acceptBooking_setTotal()
  });
  e(`flow_acceptBooking_rate${i}`).addEventListener("input", () => {
  	let rate = parseFloat(e(`flow_acceptBooking_rate${i}`).value);
  	if (!rate || rate == "") { rate = 0 }
    let qty = parseFloat(e(`flow_acceptBooking_qty${i}`).value);
    if (!qty || qty == "") { qty = 0 }
    let amt = (rate*qty).toFixed(2);
    e(`flow_acceptBooking_amt${i}`).innerHTML = formatCurrency(amt);
    flow_acceptBooking_setTotal()
  })
  e(`flow_acceptBooking_qty${i}`).addEventListener("change", () => {
  	if (!e(`flow_acceptBooking_qty${i}`).value || e(`flow_acceptBooking_qty${i}`).value == "") {
    	e(`flow_acceptBooking_qty${i}`).value = 0
    }
  })
  e(`flow_acceptBooking_rate${i}`).addEventListener("change", () => {
  	if (!e(`flow_acceptBooking_rate${i}`).value || e(`flow_acceptBooking_rate${i}`).value == "") {
    	e(`flow_acceptBooking_rate${i}`).value = 0
    }
  })
}

function changeDate(d, days) {
	let year = parseInt(d.substring(0,4));
  let month = parseInt(d.substring(5,7))-1;
  let day = parseInt(d.substring(8));
  let date = new Date(year, month, day);
  let newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  let newYear = newDate.getFullYear();
  let newMonth = (newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth()+1}` : `${newDate.getMonth()}`)
  let newDay = (newDate.getDate() < 10 ? `0${newDate.getDate()}` : `${newDate.getDate()}`)
  return `${newYear}-${newMonth}-${newDay}`
}

function standardTime(time) {
	let tod = "AM";
	let hour = parseInt(time.substring(0,2));
  if (hour > 11) { 
    hour = hour - 12;
    tod = "PM"; 
  }
  else if (hour == 0) { hour = 12 }
  let minute = time.substring(3);
  return `${hour}:${minute}${tod}`
}

function setDescription() {
    let timeStart = standardTime(bdElements.charterStartTime.value);
    let timeEnd = standardTime(bdElements.charterEndTime.value);
    let vessel = vessels.find(x => x.id == bdElements.vessel.value);
    let vesselDisplayName = vessel.displayName;
    let maxPassengers = vessel.maxCapacity;
    e("flow_acceptBooking_desc1").value = `${timeStart}-${timeEnd} San Diego Bay Cruise on ${vesselDisplayName} for up to ${maxPassengers} passengers.`;
}

function flow_acceptBooking_getTotal() {
	let total = 0;
  for (let i=1; i<6; i++) {
  	let rate = parseFloat(e(`flow_acceptBooking_rate${i}`).value);
    let qty = parseFloat(e(`flow_acceptBooking_qty${i}`).value);
    if (!rate || rate == "") { rate = 0 }
    if (!qty || qty == "") { qty = 0 }
  	total += (rate*qty);
  }
  return total.toFixed(2)
}

function flow_acceptBooking_setTotal() {
  e("flow_acceptBooking_invoiceTotal").innerHTML = formatCurrency(flow_acceptBooking_getTotal());
  flow_acceptBooking_setPaymentOptions()
}

function flow_acceptBooking_setPaymentOptions() {
	let deposit = flow_acceptBooking_getTotal()/2;
  let dueDate = e("flow_acceptBooking_dueDate").value;
  2025-03-01
  let dueMonth = YEAR[parseInt(dueDate.substring(5,7))-1];
  let dueYear = dueDate.substring(0,4);
  let dueDay = `${parseInt(dueDate.substring(8))}`;
  let fullDate = `${dueMonth} ${dueDay}, ${dueYear}`;
  e("flow_acceptBooking_paymentOptions").value = `A deposit of ${formatCurrency(deposit)} is due up front to secure your cruise and the remaining half is due ${fullDate}. You are welcome to entire amount all at once.`
}

function flow_acceptBooking_setNote() {
	let l1 = "Cancellation Policy:";
  let l2 = "* 100% Refund for cancellations more than 14 days before scheduled booking. 50% Refund for cancellations more than 7 days before scheduled booking. No refunds for cancellations within 7 days.";
  let l3 = "* If a charter is cancelled due to unsafe weather, 100% refunded or Charterer may reschedule.";
  e("flow_acceptBooking_note").value = `${l1}\n${l2}\n${l3}`;
}

function setTemplate_acceptBooking() {
	e("flow_acceptBooking_customerName").value = `${bdElements.firstName.value} ${bdElements.lastName.value}`;
	e("flow_acceptBooking_customerEmail").value = bdElements.email.value;
  e("flow_acceptBooking_invoiceDate").value = todayDateInput();
  e("flow_acceptBooking_dueDate").value = changeDate(bdElements.charterStartDate.value, -14);
  e("flow_acceptBooking_sDate1").value = bdElements.charterStartDate.value;
  setCharterLine()
  setDescription()
  flow_acceptBooking_setTotal()
  flow_acceptBooking_setNote()
}
