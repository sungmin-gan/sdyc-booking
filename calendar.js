const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const YEAR = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let currentDay = currentDate.getDay();

let calendarMonth = currentMonth;
let calendarYear = currentYear;
let calendarDates = [];

let bookingsToDisplay = [];

// For Making the Basic Calendar //

const getCalendarDates = () => {
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

const renderCalendar = () => {
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

const fillCalendarDates = () => {
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

const resetCalendarClasses = () => {
    for (let i = 1; i < 43; i++) {
        e(`datenumber_${i}`).classList.remove("light");
        e(`datenumber_${i}`).classList.remove("dark");
        e(`datebox_${i}`).classList.remove("light");
    }
}

const fillCalendar = () => {
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
})

// For Filling the Calendar with Bookings //

const extractBookings = () => {
	calendarDates.forEach((date, i) => {
  	let year = date.date.getFullYear();
    let month = (date.date.getMonth() + 1 < 10) ? `0${date.date.getMonth() + 1}` : date.date.getMonth() + 1;
    let day = (date.date.getDate() < 10) ? `0${date.date.getDate()}` : date.date.getDate();
  	let matchingBookings = charterBookings.filter(booking => booking.Date == `${year}-${month}-${day}`)
    matchingBookings.forEach((booking) => { 
    	bookingsToDisplay.push({booking: booking, position: i+1}) 
    })
  })
}

const displayBookings = () => {
	bookingsToDisplay.forEach((booking, i) => {
  	// Render elements
  	let bookingDiv = document.createElement("div");
    bookingDiv.classList.add("div-block-11");
    let bookingBadge = document.createElement("div");
    bookingBadge.classList.add("text-block-6");
    bookingBadge.setAttribute("id", `booking_${i}`)
    bookingBadge.innerHTML = `${booking.booking.Time} | ${booking.booking["First Name"]} ${booking.booking["Last Name"]}`;
    bookingDiv.appendChild(bookingBadge);
    e(`datebox_${booking.position}`).appendChild(bookingDiv)
    // Set event listener
    bookingBadge.addEventListener("click", () => {
    	populateBookingDetails(booking.booking)
    	openBookingDetails()
    })
  })
}

const clearBookings = () => {
	for (let i=0; i<bookingsToDisplay.length; i++) {
		e(`booking_${i}`).remove();
	}
	bookingsToDisplay = [];
}

// For Controlling Booking Details Form

let dbFieldsDisabled = true;

let bdElements = {
  estimate: e("estimate"),
  invoiced: e("invoiced"),
  vessel: e("vessel"),
  requestedDate: e("requestedDate"),
  alternateDate: e("alternateDate"),
	passengers: e("passengers"),
  occasion: e("occasion"),
  alcohol: e("alcohol"),
  notes: e("notes"),
  firstName: e("firstName"),
  lastName: e("lastName"),
  phone: e("phone"),
  email: e("email"),
  contactMode: e("contactMode"),
  textOptIn: e("textOptIn")
}

const populateBookingDetails = (booking) => {
	bdElements.passengers.value = booking.Passengers;
  //bdElements.occasion.value = booking.Occasion;
  //bdElements.alcohol.value = (booking.alcohol) ? "Yes" : "No";
  bdElements.notes.value = booking["Additional Info"];
  bdElements.firstName.value = booking["First Name"];
  bdElements.lastName.value = booking["Last Name"];
  bdElements.phone.value = booking.Phone;
  bdElements.email.value = booking.Email;
  bdElements.contactMode.value = booking["Contact Mode"];
  bdElements.textOptIn.value = (booking["Text Opt In"]) ? "Yes" : "No";
}

const clearBookingDetails = (booking) => {
	Object.keys(bdElements).forEach((key) => {
  	bdElements[key].value = ""
  })
}

const disableBDFields = () => {
	Object.keys(bdElements).forEach((key) => {
  	bdElements[key].disabled = true
  })
  if (!dbFieldsDisabled) {
  	e("saveButton").classList.remove("show")
    e("editButton").classList.remove("hidden")
  }
  dbFieldsDisabled = true;
}

const enableBDFields = () => {
	Object.keys(bdElements).forEach((key) => {
  	bdElements[key].disabled = false
  })
  e("editButton").classList.add("hidden")
  e("saveButton").classList.add("show")
  dbFieldsDisabled = false;
}

const openBookingDetails = () => {
	disableBDFields();
	e("bookingDetails").classList.add("open");
}

const closeBookingDetails = () => {
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
