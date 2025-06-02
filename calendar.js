//// //// //// //// Declarations //// //// //// ////

let device = "desktop";

if (window.matchMedia('(min-width: 992px)').matches) { device = "desktop" }
else if (window.matchMedia('(max-width: 479px)').matches) { device = "mobile" }

const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKABBR = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const YEAR = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const YEARABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//let currentDate = new Date("March 1, 2025");
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let currentDay = currentDate.getDay();

let calendarMonth = currentMonth;
let calendarYear = currentYear;
let calendarDates = [];

let charterBookings = [];
let bookingsToDisplay = [];

let booking_update = {
    id: null,
    update: {}
}

let currentBooking = "";

function getCurrentBooking() {
    let booking = charterBookings.find(x => x.id == currentBooking);
    return booking
}

//// //// //// //// Tabs Control //// //// //// ////

const tabs = {
    calendar: {
        tab: e("calendarTab"),
        section: (device == "desktop" ? e("calendarSection") : e("listSection")),
        icon: e("calendarTabIcon")
    },
    yachts: {
        tab: e("yachtsTab"),
        section: e("yachtsSection"),
        icon: e("yachtsTabIcon")
    }
}

let currentTab = tabs.calendar;
let goToTab = null;

function switchTabs(dest) {
    if (dest != currentTab) {
        currentTab.tab.classList.remove("selected");
        currentTab.section.classList.add("hidden");
        currentTab.icon.classList.remove("selected")
        dest.tab.classList.add("selected");
        dest.section.classList.remove("hidden");
        dest.icon.classList.add("selected")
        currentTab = dest;
        goToTab = null;
    }
    if (device == "mobile") {
        e("mainMenu").classList.add("hidden");
        mobileMenuStatus = "closed"
    }
}

e("calendarTab").addEventListener("click", () => {
    if (currentTab = tabs.yachts) {
        setVesselUpdate();
        if (Object.keys(vessel_update.update).length > 0) {
            e("confirmSaveVessel").classList.remove("hidden");
            goToTab = tabs.calendar;
        } else {
            disableVfFields();
            switchTabs(tabs.calendar)
        }
    }
})


e("yachtsTab").addEventListener("click", () => { switchTabs(tabs.yachts) })

e('charterStartDate').setAttribute("type", "date");
e('charterEndDate').setAttribute("type", "date");

//// //// //// //// API Calls //// //// //// ////

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

let statusClass = {
    "Send Options": "sendoptions",
    "Options Sent": "optionssent",
    "Vessel Request": "vesselrequest",
    "Request Accepted": "requestaccepted",
    "Deposit Paid": "depositpaid",
    "Fully Paid": "fullypaid",
    "Referred Out": "referredout",
    "Declined": "declined",
    "Cancelled": "cancelled"
}

function displayBookings() {
    bookingsToDisplay.forEach((booking, i) => {
        // Render elements
        let bookingDiv = document.createElement("div");
        bookingDiv.classList.add("div-block-11");
        bookingDiv.setAttribute("id", `bookingContainer_${i}`)
        let bookingBadge = document.createElement("div");
        bookingBadge.classList.add("text-block-6");
        bookingBadge.setAttribute("id", `booking_${i}`)
        bookingBadge.innerHTML = `${extractTimeFormatted(booking.booking.charterStart)}  ${booking.booking.firstName} ${booking.booking.lastName}`;
        if (statusClass[booking.booking.status]) { bookingBadge.classList.add(statusClass[booking.booking.status]) }
        bookingDiv.appendChild(bookingBadge);
        e(`datebox_${booking.position}`).appendChild(bookingDiv)
        // Set event listener
        bookingBadge.addEventListener("click", () => {
            currentBooking = booking.booking.id;
            populateBookingDetails(booking.booking)
            openBookingDetails()
        })
    })
}

function clearBookings() {
    for (let i = 0; i < bookingsToDisplay.length; i++) {
        e(`bookingContainer_${i}`).remove();
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
    status: e("status"),
    passengers: e("passengers"),
    children: e("children"),
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

function humanDate(date) {
    let year = date.substring(0, 4);
    let month = YEARABBR[parseInt(date.substring(5, 7)) - 1];
    let day = date.substring(8);
    return `${month} ${day}, ${year}`
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
    let childrenCount = (booking.children ? parseInt(booking.children) : 0);
    e("childrenText").innerHTML = `${childrenCount} Children`;
    bdElements.passengers.value = booking.passengers;
    bdElements.children.value = childrenCount;
    bdElements.vessel.value = booking.vessel || "";
    bdElements.occasion.value = booking.occasion;
    bdElements.alcohol.value = booking.alcohol || false;
    e("notes").innerHTML = booking.additionalInfo || "-";
    bdElements.internalNotes.value = booking.internalNotes || "";
    e("estimate").innerHTML = `Quote: ${formatCurrency(booking.estimate)}`;
    if (Object.keys(statusClass).includes(booking.status)) { bdElements.status.value = booking.status }
    if (booking.originalForm && booking.originalForm != "") {
        e("originalForm").innerHTML = booking.originalForm.replaceAll("\n", "<br>")
    }
    // Customer Info
    bdElements.firstName.value = booking.firstName;
    bdElements.lastName.value = booking.lastName;
    bdElements.contactMode.value = booking.contactMode;
    bdElements.email.value = booking.email;
    bdElements.phone.value = booking.phone;
    bdElements.textOptIn.value = booking.textOptIn;
    // List Invoices
    if (booking.qbInvoices && Object.keys(booking.qbInvoices).length > 0) {
        e("msg_no_invoices").classList.add("hidden");
        Object.keys(booking.qbInvoices).forEach((iid) => {
            let invoice = booking.qbInvoices[iid];
            let link = document.createElement("a");
            link.classList.add("link-block", "qblink", "w-inline-block");
            link.setAttribute("href", `https://qbo.intuit.com/app/invoice?txnId=${invoice.invoiceId}`);
            link.setAttribute("target", "_blank");
            link.setAttribute("id", `qbLink_${invoice.invoiceId}`)
            e("bookingDetails_qbInvoices").appendChild(link);
            let w1 = document.createElement("div");
            w1.classList.add("div-block-87");
            link.appendChild(w1);
            let invoiceNo = document.createElement("div");
            invoiceNo.classList.add("text-block-48");
            invoiceNo.innerHTML = `${invoice.invoiceNumber}`;
            w1.appendChild(invoiceNo);
            let w2 = document.createElement("div");
            w2.classList.add("div-block-88");
            link.appendChild(w2);
            let invoiceDate = document.createElement("div");
            invoiceDate.classList.add("text-block-49");
            invoiceDate.innerHTML = `Created: ${humanDate(invoice.invoiceDate)}`;
            w2.appendChild(invoiceDate);
            let invoiceDueDate = document.createElement("div");
            invoiceDueDate.classList.add("text-block-49");
            invoiceDueDate.innerHTML = `Due: ${humanDate(invoice.invoiceDueDate)}`;
            w2.appendChild(invoiceDueDate);
            let paid = document.createElement("div");
            paid.classList.add("text-block-49");
            let paidAmt = formatCurrency((parseFloat(invoice.invoiceTotal) - parseFloat(invoice.invoiceBalance)).toFixed(2));
            paid.innerHTML = `${paidAmt} / ${formatCurrency(parseFloat(invoice.invoiceTotal).toFixed(2))} paid`;
            w2.appendChild(paid);
            let invoiceBalance = document.createElement("div");
            invoiceBalance.classList.add("text-block-49", "last");
            invoiceBalance.innerHTML = `${formatCurrency(parseFloat(invoice.invoiceBalance).toFixed(2))} remaining`
            w2.appendChild(invoiceBalance);

        })
    } else {
        e("msg_no_invoices").classList.remove("hidden");
    }
    if (booking.vessel == "7qc7aPDMLFWSvq7Js1Hg" || booking.vessel == "ZbsHfr4Bjdql9Tt0E3s7") {
        e("foodOptions").classList.remove("hidden");
        if (booking.foodOptions && booking.foodOptions.length > 0) {
            booking.foodOptions.forEach((option) => {
                console.log(option)
                e(option.input).value = option.count;
                let foodOption = foodOptions.find(x => x.input == option.input);
                foodOption.count = option.count;
                foodOption.total = parseInt(foodOption.count * foodOption.unit)
            })
            setFoodEstimate()
        }
    } else {
        e("foodOptions").classList.add("hidden")
    }
}

function clearFoodOptions() {
    foodOptions.forEach((option) => {
        e(option.input).value = 0;
        option.count = 0;
        option.total = 0
    })
    foodOptionsTotal = 0
}

function clearInvoiceList() {
    let booking = getCurrentBooking();
    if (booking.qbInvoices && Object.keys(booking.qbInvoices).length > 0) {
        Object.keys(booking.qbInvoices).forEach((iid) => {
            e(`qbLink_${iid}`).remove()
        })
    }
}

function clearBookingDetails() {
    flow_sendOptions_clearForm();
    flow_acceptBooking_clearForm();
    e("tab_bookingDetails").click();
    Object.keys(bdElements).forEach((key) => {
        bdElements[key].value = ""
    })
    clearInvoiceList()
    clearFoodOptions()
    currentBooking = "";
    e("notes").innerHTML = "-";
    e("originalForm").innerHTML = "-"
}

function disableBDFields() {
    Object.keys(bdElements).forEach((key) => {
        bdElements[key].disabled = true
    })
    foodOptions.forEach((option) => {
        e(option.input).disabled = true;
        e(`${option.input}_plus`).classList.add("hidden");
        e(`${option.input}_minus`).classList.add("hidden");
    })
    e("select_diningOptions").disabled = true;
    if (!dbFieldsDisabled) {
        e("saveButton").classList.add("hidden")
        e("editButton").classList.remove("hidden")
        e("linePassengersInput").classList.add("hidden")
        e("lineChildrenInput").classList.add("hidden")
        e("linePassengersText").classList.remove("hidden")
        e("lineChildrenText").classList.remove("hidden")
        e("lineCharterDatetimeInput").classList.add("hidden")
        e("lineCharterDatetimeText").classList.remove("hidden")
    }
    e("dateTimeText").innerHTML = makeDateSpanPretty(getCurrentBooking().charterStart, getCurrentBooking().charterEnd);
    e("passengersText").innerHTML = `${getCurrentBooking().passengers} Passengers`;
    let childrenCount = (getCurrentBooking().children ? parseInt(getCurrentBooking().children) : 0);
    e("childrenText").innerHTML = `${childrenCount} Children`;
    dbFieldsDisabled = true;
    check_sendOptions();
    check_acceptBooking();
    check_decline();
    check_cancelBooking();
    check_forward();
}

function enableBDFields() {
    Object.keys(bdElements).forEach((key) => {
        bdElements[key].disabled = false
    })
    foodOptions.forEach((option) => {
        e(option.input).disabled = false;
        e(`${option.input}_plus`).classList.remove("hidden");
        e(`${option.input}_minus`).classList.remove("hidden");
    })
    e("select_diningOptions").disabled = false;
    e("saveButton").classList.remove("hidden")
    e("editButton").classList.add("hidden")
    e("linePassengersInput").classList.remove("hidden")
    e("lineChildrenInput").classList.remove("hidden")
    e("linePassengersText").classList.add("hidden")
    e("lineChildrenText").classList.add("hidden")
    e("lineCharterDatetimeInput").classList.remove("hidden")
    e("lineCharterDatetimeText").classList.add("hidden")
    dbFieldsDisabled = false;
    check_sendOptions();
    check_acceptBooking();
    check_decline();
    check_cancelBooking();
    check_forward();
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
    let booking = bookingsToDisplay.find(x => x.booking.id == currentBooking);
    booking = booking.booking;
    booking_update.id = currentBooking;
    console.log("In Set Booking Update")
    console.log(booking_update)
    console.log(booking)
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
    
    let foodMatch = false;
    let selectedOptions = foodOptions.filter(x => x.count > 0);
    if (selectedOptions) {
        selectedOptions.sort((a, b) => a.name.localeCompare(b.name));
    }
    console.log(selectedOptions)
    let currentOptions = booking.foodOptions;
    if (currentOptions) {
        currentOptions.sort((a, b) => a.name.localeCompare(b.name));
    }
    console.log(currentOptions)
    if (JSON.stringify(selectedOptions) == JSON.stringify(currentOptions)) {
        foodMatch = true
    }
    if (!foodMatch) {
        booking_update.update.foodOptions = selectedOptions.map(option => ({ ...option }));
    }
}

function updateLocalBooking() {
    console.log("In updateLocalBooking")
    console.log(booking_update)
    Object.keys(booking_update.update).forEach((key) => {
        charterBookings.find(x => x.id == booking_update.id)[key] = booking_update.update[key];
        bookingsToDisplay.find(x => x.booking.id == booking_update.id).booking[key] = booking_update.update[key];
    })
    console.log(getCurrentBooking())
}

function closeBookingDetails() {
    console.log("In Close Booking Details")
    console.log(booking_update)
    console.log(getCurrentBooking())
    setBookingUpdate();
    if (Object.keys(booking_update.update).length > 0) {
        e("confirmSaveBooking").classList.remove("hidden")
    } else {
        clearBookingDetails();
        e("bookingDetails").classList.remove("open");
        booking_update = { id: null, update: {} }
    }
    /*if (Object.keys(booking_update.update).length > 0) {
        clearBookingDetails();
        e("bookingDetails").classList.remove("open");
        updateBooking(booking_update.id, booking_update.update).then(() => {
            if (booking_update.update.charterStart || booking_update.update.charterEnd || booking_update.update.status) {
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
            clearBookingDetails();
            e("bookingDetails").classList.remove("open");
            booking_update = { id: null, update: {} }
        }
    }*/
}

function checkSave() {
    let errsList = [];
    let errsMsg = "Please review the following errors:<br><br>";
    if (!bdElements.charterStartDate.value || bdElements.charterStartDate.value == "") {
        errsList.push("Charter start date is not specified.")
    }
    if (!bdElements.charterStartTime.value || bdElements.charterStartTime.value == "") {
        errsList.push("Charter start time is not specified.")
    }
    if (!bdElements.charterEndDate.value || bdElements.charterEndDate.value == "") {
        errsList.push("Charter end date is not specified.")
    }
    if (!bdElements.charterEndTime.value || bdElements.charterEndTime.value == "") {
        errsList.push("Charter end time is not specified.")
    }
    if (!bdElements.firstName.value || bdElements.firstName.value == "") {
        errsList.push("Customer's first name is not specified.")
    }
    if (!bdElements.lastName.value || bdElements.lastName.value == "") {
        errsList.push("Customer's last name is not specified.")
    }
    if (!bdElements.email.value || bdElements.email.value == "") {
        errsList.push("Customer's email is not specified.")
    }
    if (!bdElements.phone.value || bdElements.phone.value == "") {
        errsList.push("Customer's phone number is not specified.")
    }
    if (
        bdElements.charterStartDate.value && bdElements.charterStartDate.value != "" &&
        bdElements.charterStartTime.value && bdElements.charterStartTime.value != "" &&
        bdElements.charterEndDate.value && bdElements.charterEndDate.value != "" &&
        bdElements.charterEndTime.value && bdElements.charterEndTime.value != ""
    ) {
        let start = convertToUnix(`${bdElements.charterStartDate.value}T${bdElements.charterStartTime.value}:00-07:00`);
        let end = convertToUnix(`${bdElements.charterEndDate.value}T${bdElements.charterEndTime.value}:00-07:00`);
        if (!(end > start)) {
            errsList.push("Charter end date/time must be later than charter start end date/time.")
        }
    }
    errsList.forEach((msg, i) => {
        let suffix = (i == errsList.length - 1 ? "" : "<br>");
        errsMsg += `${msg}${suffix}`
    })
    if (errsList.length > 0) {
        return { pass: false, err: errsMsg }
    } else { return { pass: true } }
}

e("saveButton").addEventListener("click", () => {
    let check = checkSave();
    if (check.pass) {
        setBookingUpdate();
        console.log("In saveButton")
        console.log(booking_update)
        if (Object.keys(booking_update.update).length > 0) {
            updateBooking(booking_update.id, booking_update.update).then(() => {
                console.log(booking_update)
                updateLocalBooking();
                if (device == "desktop") {
                    clearBookings();
                    extractBookings();
                    displayBookings()
                } else {
                    clearBookingsList()
                    getCalendarDatesStrict();
                    extractBookings();
                    fillBookingsList();
                }
                disableBDFields();
                booking_update = { id: null, update: {} }
            })
            //setBookingUpdate();
            //updateLocalBooking();
            // //let displayedBooking = bookingsToDisplay.find(x => x.booking.id == booking_update.id).booking;
            // //populateBookingDetails(displayedBooking);
            //disableBDFields();
        } else {
            disableBDFields()
        }
    } else {
        e("flow_saveBooking_err").classList.remove("hidden");
        e("flow_saveBooking_err_msg").innerHTML = check.err;
    }
})

e("confirmSaveBooking_save").addEventListener("click", () => {
    let check = checkSave();
    if (check.pass) {
        updateBooking(booking_update.id, booking_update.update).then(() => {
            updateLocalBooking();
            if (device == "desktop") {
                clearBookings();
                extractBookings();
                displayBookings()
            } else {
                clearBookingsList()
                getCalendarDatesStrict();
                extractBookings();
                fillBookingsList();
            }
            disableBDFields();
            e("confirmSaveBooking").classList.add("hidden");
            updateLocalBooking();
            closeBookingDetails()
            booking_update = { id: null, update: {} }
        })
        //e("confirmSaveBooking").classList.add("hidden");
        //updateLocalBooking();
        //closeBookingDetails()
    } else {
        e("flow_saveBooking_err").classList.remove("hidden");
        e("flow_saveBooking_err_msg").innerHTML = check.err;
    } 
})

e("flow_saveBooking_err_ok").addEventListener("click", () => {
    e("confirmSaveBooking").classList.add("hidden");
    e("flow_saveBooking_err").classList.add("hidden");
})

e("confirmSaveBooking_cancel").addEventListener("click", () => {
    e("confirmSaveBooking").classList.add("hidden");
})

e("confirmSaveBooking_discard").addEventListener("click", () => {
    e("confirmSaveBooking").classList.add("hidden");
    e("bookingDetails").classList.remove("open");
    booking_update = { id: null, update: {} }
})
