//// //// //// //// API Calls //// //// //// ////

function addBooking(data) {
    return new Promise(async (resolve) => {
        const url = "https://sdyc-api-2-8c0da59c5ac4.herokuapp.com/addBooking";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: data }),
            });
            console.log(response)
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            } else {
                const json = await response.json();
                resolve(json)
            }
        } catch (error) {
            console.log(error.message)
        }
        //resolve({ success: false, err: "This is the create booking error." })
        //resolve({ success: true, id: "ABCD1234" })
    })
}

//// //// //// //// Main Functions //// //// //// ////

e("createBookingButton").addEventListener("click", () => {
	e("newCharterForm").classList.add("open")
})

e("createBookingButton_mobile").addEventListener("click", () => {
	e("newCharterForm").classList.add("open")
})

e("newCharter_cancel").addEventListener("click", () => {
	clearNcElements();
	e("newCharterForm").classList.remove("open")
})

e("backscreenNewCharter").addEventListener("click", () => {
	clearNcElements();
	e("newCharterForm").classList.remove("open")
})

e("xNewCharter").addEventListener("click", () => {
	clearNcElements();
	e("newCharterForm").classList.remove("open")
})

e("newCharter_charterStartDate").setAttribute("type", "date");
e("newCharter_charterEndDate").setAttribute("type", "date");
setTimeInput(e("newCharter_charterStartTime"));
setTimeInput(e("newCharter_charterEndTime"));

function loadVesselSelectionsCreateBooking() {
    vessels.forEach((vessel) => {
        let option = document.createElement("option");
        option.value = vessel.id;
        option.innerHTML = vessel.name;
        e("newCharter_vessel").appendChild(option)
    })
}

let ncElements = {
	charterStartDate: e("newCharter_charterStartDate"),
  charterStartTime: e("newCharter_charterStartTime"),
  charterEndDate: e("newCharter_charterEndDate"),
  charterEndTime: e("newCharter_charterEndTime"),
  status: e("newCharter_status"),
  passengers: e("newCharter_passengers"),
  vessel: e("newCharter_vessel"),
  occasion: e("newCharter_occasion"),
  alcohol: e("newCharter_alcohol"),
  internalNotes: e("newCharter_internalNotes"),
  firstName: e("newCharter_firstName"),
  lastName: e("newCharter_lastName"),
  contactMode: e("newCharter_contactMode"),
  email: e("newCharter_email"),
  phone: e("newCharter_phone"),
  textOptIn: e("newCharter_textOptIn")
}

let ncForm = {
  alcohol: false,
  charterEnd: "",
  charterEndTimestamp: "",
  charterLength: 0,
  charterStart: "",
  charterStartTimestamp: "",
  contactMode: "",
  email: "",
  firstName: "",
  internalNotes: "",
  lastName: "",
  occasion: "",
  passengers: 0,
  phone: 0,
  status: "",
  textOptIn: false,
  vessel: "",
  vesselDisplayName: "",
  vesselName: "",
  foodOptions: []
}

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

function checkNcForm() {
	let errsList = [];
  let errsMsg = "Please review the following errors:<br><br>";
  if (!ncElements.charterStartDate.value||ncElements.charterStartDate.value == "") {
  	errsList.push("Charter start date is not specified.")
  }
  if (!ncElements.charterStartTime.value||ncElements.charterStartTime.value == "") {
  	errsList.push("Charter start time is not specified.")
  }
  if (!ncElements.charterEndDate.value||ncElements.charterEndDate.value == "") {
  	errsList.push("Charter end date is not specified.")
  }
  if (!ncElements.charterEndTime.value||ncElements.charterEndTime.value == "") {
  	errsList.push("Charter end time is not specified.")
  }
  if (!ncElements.firstName.value||ncElements.firstName.value == "") {
  	errsList.push("Customer's first name is not specified.")
  }
  if (!ncElements.lastName.value||ncElements.lastName.value == "") {
  	errsList.push("Customer's last name is not specified.")
  }
  if (!ncElements.email.value||ncElements.email.value == "") {
  	errsList.push("Customer's email is not specified.")
  }
  if (!ncElements.phone.value||ncElements.phone.value == "") {
  	errsList.push("Customer's phone number is not specified.")
  }
  if (
  	ncElements.charterStartDate.value&&ncElements.charterStartDate.value != ""&&
    ncElements.charterStartTime.value&&ncElements.charterStartTime.value != ""&&
    ncElements.charterEndDate.value&&ncElements.charterEndDate.value != ""&&
    ncElements.charterEndTime.value&&ncElements.charterEndTime.value != ""
  ) {
  	let start = convertToUnix(`${ncElements.charterStartDate.value}T${ncElements.charterStartTime.value}:00-07:00`);
    let end = convertToUnix(`${ncElements.charterEndDate.value}T${ncElements.charterEndTime.value}:00-07:00`);
    if (!(end > start)) {
    	errsList.push("Charter end date/time must be later than charter start end date/time.")
    }
  }
  errsList.forEach((msg, i) => {
  	let suffix = (i==errsList.length-1 ? "" : "<br>");
		errsMsg += `${msg}${suffix}`
  })
  if (errsList.length > 0) {
  	return { pass: false, err: errsMsg }
  } else { return { pass: true } }
}

function packageNcForm() {
	ncForm.alcohol = (ncElements.alcohol.value == "true" ? true : false);
  ncForm.contactMode = ncElements.contactMode.value;
  ncForm.email = ncElements.email.value;
  ncForm.firstName = ncElements.firstName.value;
  ncForm.internalNotes = ncElements.internalNotes.value;
  ncForm.lastName = ncElements.lastName.value;
  ncForm.occasion = ncElements.occasion.value;
  ncForm.passengers = parseFloat(ncElements.passengers.value);
  ncForm.phone = ncElements.phone.value;
  ncForm.status = ncElements.status.value;
  ncForm.textOptIn = (ncElements.textOptIn.value == "true" ? true : false);
  ncForm.vessel = ncElements.vessel.value;
  ncForm.charterStart = `${ncElements.charterStartDate.value}T${ncElements.charterStartTime.value}:00-07:00`;
  ncForm.charterEnd = `${ncElements.charterEndDate.value}T${ncElements.charterEndTime.value}:00-07:00`;
  ncForm.charterStartTimestamp = convertToUnix(ncForm.charterStart);
  ncForm.charterEndTimestamp = convertToUnix(ncForm.charterEnd);
  ncForm.charterLength = (ncForm.charterEndTimestamp-ncForm.charterStartTimestamp)/60;
  if (ncForm.vessel && ncForm.vessel != "") {
    let vessel = vessels.find(x => x.id == ncForm.vessel);
    ncForm.vesselName = vessel.name;
    ncForm.vesselDisplayName = vessel.displayName;
  }
}

function clearNcElements() {
	Object.keys(ncElements).forEach((key) => {
  	if (key == "alcohol" && key == "textOptIn") {
    	ncElements[key].value = "false"
    } else {
    	ncElements[key].value = ""
    }
  })
}

function clearNcForm() {
	Object.keys(ncForm).forEach((key) => {
  	if (key == "alcohol" && key == "textOptIn") {
    	ncForm[key].value = false
    } else {
    	ncForm[key].value = ""
    }
  })
}

e("newCharter_saveButton").addEventListener("click", () => {
	e("loadingScreen").classList.remove("hidden");
  let check = checkNcForm();
  if (check.pass) {
    packageNcForm();
    addBooking(ncForm).then((response) => {
      e("loadingScreen").classList.add("hidden");
      if (response.success && response.success != "false") {
      	let booking = ncForm;
        booking.id = response.id;
      	charterBookings.push(booking);
        charterBookings = charterBookings.sort((a, b) => a.charterStartTimestamp - b.charterStartTimestamp);
        let bookingDate = new Date(ncForm.charterStart);
        calendarYear = bookingDate.getFullYear();
        calendarMonth = bookingDate.getMonth();
        calendarDates = [];
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
        clearNcForm();
        clearNcElements();
        e("createBooking_defaultTab").click();
        e("newCharterForm").classList.remove("open");
        currentBooking = booking.id;
        populateBookingDetails(booking)
        openBookingDetails()
      } else {
      	e("loadingScreen").classList.add("hidden");
        e("createBooking_errorTab").click();
        e("createBooking_errorTab_msg").innerHTML = response.err
      }
    })
  } else {
  	e("loadingScreen").classList.add("hidden");
  	e("flow_createBooking_err").classList.remove("hidden");
    e("flow_createBooking_err_msg").innerHTML = check.err;
  }
})

e("flow_createBooking_err_ok").addEventListener("click", () => {
	e("flow_createBooking_err").classList.add("hidden")
})

e("createBooking_errorTab_ok").addEventListener("click", () => {
	clearNcForm();
  e("createBooking_defaultTab").click()
})
