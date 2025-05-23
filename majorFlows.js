//// //// //// //// API Calls //// //// //// ////

let qbInvoiceLink = "";

function createQbInvoice(data) {
    return new Promise(async (resolve) => {
        const url = "https://sdyc-api-2-8c0da59c5ac4.herokuapp.com/createQbInvoice";
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
                resolve(json);
            }
        } catch (error) {
            console.log(error.message)
        }
        /*resolve({
            success: "true",
          invoiceId: "5508",
          invoiceLink: "https://connect.intuit.com/portal/app/CommerceNetwork/view/scs-v1-0bf19313ca114a23b14fd9945a6699ae8d33a1a9bb3f4188b5cca9071b7a531541f805231e2b4ad4be071682da6effca?locale=en_US&cta=v3invoicelink",
          invoiceNumber: "76",
          invoiceDate: "2025-03-01",
          invoiceDueDate: "2025-02-26",
          invoiceBalance: "2000",
          invoiceTotal: "2000"
        })*/
        /*resolve({
            success: "false",
          err: "Zapier could not create the invoice."
        })*/
    })
}

function gmailQbInvoice(data) {
    return new Promise(async (resolve) => {
        const url = "https://sdyc-api-2-8c0da59c5ac4.herokuapp.com/gmailQbInvoice";
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
                resolve(json);
            }
        } catch (error) {
            console.log(error.message)
        }
        /*resolve({
            success: "true"
        })*/
        /*resolve({
            success: "false",
          err: "Zapier could not email the invoice."
        })*/
    })
}

function gmailOptions(data) {
    return new Promise(async (resolve) => {
        const url = "https://sdyc-api-2-8c0da59c5ac4.herokuapp.com/gmailOptions";
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
                resolve(json);
            }
        } catch (error) {
            console.log(error.message)
        }
        //resolve({ success: "true" })
        //resolve({ success: "false", err: "Zapier could not send the email." })
    })
}

function sendGmail(data) {
    return new Promise(async (resolve) => {
        const url = "https://sdyc-api-2-8c0da59c5ac4.herokuapp.com/sendGmail";
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
                resolve(json);
            }
        } catch (error) {
            console.log(error.message)
        }
        //resolve({ success: true })
        //resolve({ success: false, err: "This is the send email error." })
    })
}

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
    for (let i = 0; i < s.length; i++) {
        if (s[i] == c) { indicies.push(i) }
    }
    if (indicies.length > 0) { return indicies[o - 1] || -1 }
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
    let sendOptionsTemplate = `Hello ${bdElements.firstName.value},\n\nThank you for your inquiry for ${occasionArticle} ${bdElements.occasion.value} cruise on ${makeDatePretty(bdElements.charterStartDate.value)} for ${bdElements.passengers.value} passengers!\n\nHere are some of our most popular yachts for your party size.\n----\n\n----\nThe rates above include fuel and all captain and port fees. Also includes waters, sodas, and snacks.\n\nOnce you are ready to secure your cruise, we'll email you an invoice and you can pay half to reserve your cruise and half 14 days before the cruise. \n\nIf you would like to browse all the yachts in our fleet, please click on the link below:\n\nhttps://www.sdyachtcharters.com\/browse\n\nFeel free to text or call at any time if you have any questions.\n\nCheers!\n--\n\nCaptain Kenne Melonas\nUS Navy SWCC (Retired)\nOwner of Elite Maritime Services/San Diego Yacht Charters\nhttps://www.sdyachtcharters.com\nEmail: sdyachtcharters@gmail.com\nPhone: (619) 307-9534`;
    e("flow_sendOptions_msg").value = sendOptionsTemplate;

    e("flow_sendOptions_to").value = e("email").value;
    e("flow_sendOptions_subject").value = `Charter Request for ${e("dateTimeText").innerHTML.substring(0, getIndex(e("dateTimeText").innerHTML, " ", 2))}`
    setVesselSelects()
}

function removeElement(arr, item) {
    let newArr = arr.filter(x => x != item);
    return newArr
}

let selectedVesselOptions = [];

function setVesselSelects() {
    let toDisplay = vessels.filter(x => x.id != "7qc7aPDMLFWSvq7Js1Hg");
    toDisplay.forEach((v) => {
        let slot = document.createElement("div");
        slot.setAttribute("id", `option_${v.id}`);
        slot.classList.add("div-block-60");

        let c1 = document.createElement("div");
        c1.classList.add("div-block-59");
        slot.appendChild(c1);

        let label = document.createElement("label");
        label.classList.add("w-checkbox");
        label.classList.add("checkbox-field");
        c1.appendChild(label)

        let cBox = document.createElement("input");
        cBox.setAttribute("type", "checkbox");
        cBox.setAttribute("id", `checkbox_${v.id}`);
        cBox.classList.add("w-checkbox-input");
        cBox.classList.add("checkbox");
        label.appendChild(cBox)

        let c2 = document.createElement("div");
        c2.classList.add("div-block-61");
        slot.appendChild(c2);

        let vName = document.createElement("div");
        vName.classList.add("text-block-22");
        vName.innerHTML = v.name;
        c2.appendChild(vName)

        let vDisplayName = document.createElement("div");
        vDisplayName.classList.add("text-block-23");
        vDisplayName.innerHTML = v.displayName;
        c2.appendChild(vDisplayName)

        let passengers = document.createElement("div");
        passengers.classList.add("text-block-23");
        passengers.innerHTML = `${v.maxCapacity} Passengers Max`;
        c2.appendChild(passengers)

        e("vesselOptionsPane").appendChild(slot)

        cBox.addEventListener("change", () => {
            if (cBox.checked) {
                selectedVesselOptions.push(v.id)
            } else {
                selectedVesselOptions = removeElement(selectedVesselOptions, v.id)
            }
            setOptionsText()
        })
    })
}

e("checkbox_7qc7aPDMLFWSvq7Js1Hg").addEventListener("change", () => {
    if (e("checkbox_7qc7aPDMLFWSvq7Js1Hg").checked) {
        selectedVesselOptions.push("7qc7aPDMLFWSvq7Js1Hg")
    } else {
        selectedVesselOptions = removeElement(selectedVesselOptions, "7qc7aPDMLFWSvq7Js1Hg")
    }
    setOptionsText()
})

function replaceBetweenDashes(text, replacement) {
    return text.replace(/----.*?----/gs, `----${replacement}----`);
}

function setOptionsText() {
    let optionsPortion = "";
    selectedVesselOptions.forEach((vid, i) => {
        let endSpacer = (i == selectedVesselOptions.length - 1 ? "\n" : "\n");
        let v = vessels.find(x => x.id == vid);
        optionsPortion += `\n🛥️ ${v.displayName}\n`;
        optionsPortion += `· For up to ${v.maxCapacity} passengers\n`;
        optionsPortion += `· ${v.sdycURL}\n\n`;
        optionsPortion += `${v.pricing}${endSpacer}`;
    })
    e("flow_sendOptions_msg").value = replaceBetweenDashes(e("flow_sendOptions_msg").value, optionsPortion)
}

function flow_sendOptions_clearForm() {
    e("flow_sendOptions_msg").value = "";
    e("flow_sendOptions_to").value = "";
    e("flow_sendOptions_subject").value = "";
    selectedVesselOptions.forEach((vid) => {
        e(`checkbox_${vid}`).checked = false
    })
    selectedVesselOptions = [];
    e("flow_sendOptions_defaultTab").click()
}

function formatPhone(phone) {
    phone = phone.replaceAll("(", "");
    phone = phone.replaceAll(")", "");
    phone = phone.replaceAll("-", "");
    phone = phone.replaceAll(" ", "");
    if (phone.length == 11) {
        return `+${phone}`
    } else {
        return `+1${phone}`
    }
}

e("flow_sendOptions_send").addEventListener("click", () => {
    let check = false;
    let to_check = false;
    let subject_check = false;
    let msg_check = false;
    let option_check = false;

    if (e("flow_sendOptions_to").value != "") { to_check = true };
    if (e("flow_sendOptions_subject").value != "") { subject_check = true }
    if (e("flow_sendOptions_msg").value != "") { msg_check = true }

    vessels.forEach((v) => {
        let box = e(`checkbox_${v.id}`);
        if (box.checked == true) { option_check = true }
    })

    check = to_check && subject_check && msg_check && option_check;

    if (check) {
        e("loadingScreen").classList.remove("hidden")
        let data = {
            to: e("flow_sendOptions_to").value,
            subject: e("flow_sendOptions_subject").value,
            message: e("flow_sendOptions_msg").value
        }
        gmailOptions(data).then((response) => {
            e("loadingScreen").classList.add("hidden");
            if (response.success == "true") {
                let booking = getCurrentBooking();
                if (booking.textOptIn && booking.textOptIn != "false" &&
                       booking.phone && booking.phone != ""
                   ) {
                    e("flow_sendOptions_successTab_text").classList.remove("hidden")
                    let href = `sms:${formatPhone(bdElements.phone.value)}&body=${encodeURIComponent(e("flow_sendOptions_msg").value)}`;
                    e("flow_sendOptions_successTab_text").setAttribute("href", href);
                } else {
                    e("flow_sendOptions_successTab_text").classList.add("hidden")
                }
                e("flow_sendOptions_successTab").click();
                booking_update.id = currentBooking;
                booking_update.update["status"] = "Options Sent";
                bdElements.status.value = "Options Sent"; 
                updateLocalBooking();
                updateBooking(booking_update.id, booking_update.update).then(() => {
                    booking_update.id = null;
                    booking_update.update = {};
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
                })
            } else {
                e("flow_sendOptions_errorTab").click();
                e("flow_sendOptions_errorTab_msg").innerHTML = response.err;
            }
        })
    } else {
        e("flow_sendOptions_err").classList.remove("hidden")
    }

})

e("flow_sendOptions_err_ok").addEventListener("click", () => {
    e("flow_sendOptions_err").classList.add("hidden")
})

e("flow_sendOptions_errorTab_ok").addEventListener("click", () => {
    flow_sendOptions_clearForm();
    flow_acceptBooking_clearForm();
    e("tab_bookingDetails").click();
})

e("flow_sendOptions_successTab_ok").addEventListener("click", () => {
    flow_sendOptions_clearForm();
    flow_acceptBooking_clearForm();
    e("tab_bookingDetails").click();
})

//// //// //// //// Flow: Accept Booking //// //// //// ////

e("flow_acceptBooking_invoiceDate").setAttribute("type", "date");
e("flow_acceptBooking_dueDate").setAttribute("type", "date");
e("flow_acceptBooking_sDate1").setAttribute("type", "date");
e("flow_acceptBooking_sDate2").setAttribute("type", "date");
e("flow_acceptBooking_sDate3").setAttribute("type", "date");
e("flow_acceptBooking_sDate4").setAttribute("type", "date");
e("flow_acceptBooking_sDate5").setAttribute("type", "date");

e("flow_acceptBooking_cancel").addEventListener("click", () => {
    e("flow_acceptBooking_createInvoiceTab").click()
    e("tab_bookingDetails").click()
})

function check_acceptBooking() {
    if (dbFieldsDisabled && bdElements.vessel.value && bdElements.vessel.value != "") {
        e("button_acceptBooking").classList.remove("disabled");
        e("button_icon_acceptBooking").classList.remove("disabled")
    } else {
        e("button_acceptBooking").classList.add("disabled");
        e("button_icon_acceptBooking").classList.add("disabled")
    }
}

function goTo_acceptBooking() {
    e("flow_acceptBooking_create").classList.remove("hidden")
    if (dbFieldsDisabled && bdElements.vessel.value && bdElements.vessel.value != "") {
        setTemplate_acceptBooking();
        e("tab_acceptBooking").click();
    }
}

e("button_acceptBooking").addEventListener("click", () => {
    goTo_acceptBooking()
})

function todayDateInput() {
    let month = (currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`);
    let day = (currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : `${currentDate.getDate()}`);
    return `${currentYear}-${month}-${day}`;
}

function getDuration(start, end) {
    return (end - start) / 3600
}

function setCharterLine() {
    let booking = getCurrentBooking();
    if (booking.estimate && booking.estimate != 0 && booking.estimate != "") {
        let duration = getDuration(booking.charterStartTimestamp, booking.charterEndTimestamp);
        let rate = (booking.estimate / duration).toFixed(2);
        if (device == "desktop") {
            e("flow_acceptBooking_qty1").value = duration;
            e("flow_acceptBooking_rate1").value = rate;
            e("flow_acceptBooking_amt1").innerHTML = formatCurrency((duration * rate).toFixed(2))
        } else {
            e("flow_acceptBooking_qty1_mobile").value = duration;
            e("flow_acceptBooking_rate1_mobile").value = rate;
            e("flow_acceptBooking_amt1_mobile").innerHTML = formatCurrency((duration * rate).toFixed(2))
        }
    }
}

function setFoodOptionsLine() {
    if (foodOptionsTotal > 0) {
        let foodOptionsDesc = "";
        let selectedOptions = foodOptions.filter(x => x.count > 0);
        selectedOptions.forEach((option, i) => {
            let suffix = (i == selectedOptions.length-1 ? "" : "\n")
            foodOptionsDesc += `${option.name} x ${option.count} @ ${formatCurrency(option.unit)}${suffix}`
        })
        if (device == "desktop") {
            e("flow_acceptBooking_qty2").value = 1;
            e("flow_acceptBooking_rate2").value = parseFloat(foodOptionsTotal.toFixed(2));
            e("flow_acceptBooking_amt2").innerHTML = formatCurrency(foodOptionsTotal);
            e("flow_acceptBooking_desc2").value = foodOptionsDesc;
            e("flow_acceptBooking_sDate2").value = e("flow_acceptBooking_sDate1").value;
        } else {
            e("flow_acceptBooking_qty2_mobile").value = 1;
            e("flow_acceptBooking_rate2_mobile").value = parseFloat(foodOptionsTotal.toFixed(2));
            e("flow_acceptBooking_amt2_mobile").innerHTML = formatCurrency(foodOptionsTotal);
            e("flow_acceptBooking_desc2_mobile").value = foodOptionsDesc;
            e("flow_acceptBooking_sDate2_mobile").value = e("flow_acceptBooking_sDate1_mobile").value;
        }
    }
}

for (let i = 1; i < 6; i++) {
    e(`flow_acceptBooking_qty${i}`).addEventListener("input", () => {
        let rate = parseFloat(e(`flow_acceptBooking_rate${i}`).value);
        if (rate || rate == "") { rate = 0 }
        let qty = parseFloat(e(`flow_acceptBooking_qty${i}`).value);
        if (!qty || qty == "") { qty = 0 }
        let amt = (rate * qty).toFixed(2);
        e(`flow_acceptBooking_amt${i}`).innerHTML = formatCurrency(amt);
        flow_acceptBooking_setTotal()
    });
    e(`flow_acceptBooking_rate${i}`).addEventListener("input", () => {
        let rate = parseFloat(e(`flow_acceptBooking_rate${i}`).value);
        if (!rate || rate == "") { rate = 0 }
        let qty = parseFloat(e(`flow_acceptBooking_qty${i}`).value);
        if (!qty || qty == "") { qty = 0 }
        let amt = (rate * qty).toFixed(2);
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
    let year = parseInt(d.substring(0, 4));
    let month = parseInt(d.substring(5, 7)) - 1;
    let day = parseInt(d.substring(8));
    let date = new Date(year, month, day);
    let newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    let newYear = newDate.getFullYear();
    let newMonth = (newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : `${newDate.getMonth()}`)
    let newDay = (newDate.getDate() < 10 ? `0${newDate.getDate()}` : `${newDate.getDate()}`)
    return `${newYear}-${newMonth}-${newDay}`
}

function standardTime(time) {
    let tod = "AM";
    let hour = parseInt(time.substring(0, 2));
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
    if (device == "desktop") {
        e("flow_acceptBooking_desc1").value = `${timeStart}-${timeEnd} San Diego Bay Cruise on ${vesselDisplayName} for up to ${maxPassengers} passengers.`;
    } else {
        e("flow_acceptBooking_desc1_mobile").value = `${timeStart}-${timeEnd} San Diego Bay Cruise on ${vesselDisplayName} for up to ${maxPassengers} passengers.`;
    }
}

function flow_acceptBooking_getTotal() {
    let total = 0;
    if (device == "desktop") {
        for (let i = 1; i < 6; i++) {
            let rate = parseFloat(e(`flow_acceptBooking_rate${i}`).value);
            let qty = parseFloat(e(`flow_acceptBooking_qty${i}`).value);
            if (!rate || rate == "") { rate = 0 }
            if (!qty || qty == "") { qty = 0 }
            total += (rate * qty);
        }
    } else {
        for (let i = 1; i < 4; i++) {
            let rate = parseFloat(e(`flow_acceptBooking_rate${i}_mobile`).value);
            let qty = parseFloat(e(`flow_acceptBooking_qty${i}_mobile`).value);
            if (!rate || rate == "") { rate = 0 }
            if (!qty || qty == "") { qty = 0 }
            total += (rate * qty);
        }
    }
    return total.toFixed(2)
}

function flow_acceptBooking_setTotal() {
    e("flow_acceptBooking_invoiceTotal").innerHTML = formatCurrency(flow_acceptBooking_getTotal());
    flow_acceptBooking_setPaymentOptions()
}

function flow_acceptBooking_setPaymentOptions() {
    if (e("flow_acceptBooking_dueDate").value == e("flow_acceptBooking_invoiceDate").value) {
        e("flow_acceptBooking_paymentOptions").value = `The full amount of ${formatCurrency(flow_acceptBooking_getTotal())} is due immediately to secure your cruise. Your reservation is not confirmed until payment is received.`;
    } else {
        let deposit = flow_acceptBooking_getTotal() / 2;
        let dueDate = e("flow_acceptBooking_dueDate").value;
        let dueMonth = YEAR[parseInt(dueDate.substring(5, 7)) - 1];
        let dueYear = dueDate.substring(0, 4);
        let dueDay = `${parseInt(dueDate.substring(8))}`;
        let fullDate = `${dueMonth} ${dueDay}, ${dueYear}`;
        e("flow_acceptBooking_paymentOptions").value = `A deposit of ${formatCurrency(deposit)} is due up front to secure your cruise and the remaining half is due ${fullDate}. You are welcome to pay the entire amount all at once.`
    }
}

function flow_acceptBooking_setNote() {
    let text = "";
    if (e("flow_acceptBooking_dueDate").value == e("flow_acceptBooking_invoiceDate").value) {
        let l1 = "Payment & Cancellation Terms:";
        let l2 = "* Cancel 8-13 days: 50% refund minus $100.";
        let l3 = "* Unsafe weather: Reschedule or refund minus $100. Cooler/rainy weather is not considered unsafe.";
        text = `${l1}\n${l2}\n${l3}`;
    } else {
        let l1 = "Payment & Cancellation Terms:";
        let l2 = "* 50% deposit secures booking; balance due 14 days prior or deposit may be forfeited. Full payment also accepted.";
        let l3 = "* Cancel 8-13 days: 50% refund minus $100.";
        let l4 = "* Unsafe weather: Reschedule or refund minus $100. Cooler/rainy weather is not considered unsafe.";
        text = `${l1}\n${l2}\n${l3}\n${l4}`;
    }
    e("flow_acceptBooking_note").value = text;
}

function setTemplate_acceptBooking() {
    e("flow_acceptBooking_customerName").value = `${bdElements.firstName.value} ${bdElements.lastName.value}`;
    e("flow_acceptBooking_customerEmail").value = bdElements.email.value;
    e("flow_acceptBooking_invoiceDate").value = todayDateInput();
    e("flow_acceptBooking_dueDate").value = changeDate(bdElements.charterStartDate.value, -14);
    let today = new Date(todayDateInput());
    let dueDate = new Date(e("flow_acceptBooking_dueDate").value);
    if (dueDate < today) { e("flow_acceptBooking_dueDate").value = todayDateInput() }
    if (device == "desktop") {
        e("flow_acceptBooking_sDate1").value = bdElements.charterStartDate.value;
    } else {
        e("flow_acceptBooking_sDate1_mobile").value = bdElements.charterStartDate.value;
    }
    setCharterLine()
    setDescription()
    setFoodOptionsLine()
    flow_acceptBooking_setTotal()
    flow_acceptBooking_setNote()
}

for (let i = 1; i < 6; i++) {
    e(`flow_acceptBooking_clear${i}`).addEventListener("click", () => {
        e(`flow_acceptBooking_sDate${i}`).value = "";
        e(`flow_acceptBooking_service${i}`).value = "";
        e(`flow_acceptBooking_desc${i}`).value = "";
        e(`flow_acceptBooking_qty${i}`).value = "";
        e(`flow_acceptBooking_rate${i}`).value = "";
        e(`flow_acceptBooking_amt${i}`).innerHTML = "$0.00"
    })
}

e("flow_acceptBooking_invoiceErr_ok").addEventListener("click", () => {
    e("flow_acceptBooking_invoiceErr").classList.add("hidden")
})

function flow_acceptBooking_clearForm() {
    if (device == "desktop") {
        for (let i = 1; i < 6; i++) {
            e(`flow_acceptBooking_sDate${i}`).value = "";
            e(`flow_acceptBooking_service${i}`).value = "";
            e(`flow_acceptBooking_desc${i}`).value = "";
            e(`flow_acceptBooking_qty${i}`).value = "";
            e(`flow_acceptBooking_rate${i}`).value = "";
            e(`flow_acceptBooking_amt${i}`).innerHTML = "$0.00"
        }
    } else {
        for (let i = 1; i < 4; i++) {
            e(`flow_acceptBooking_sDate${i}_mobile`).value = "";
            e(`flow_acceptBooking_service${i}_mobile`).value = "";
            e(`flow_acceptBooking_desc${i}_mobile`).value = "";
            e(`flow_acceptBooking_qty${i}_mobile`).value = "";
            e(`flow_acceptBooking_rate${i}_mobile`).value = "";
            e(`flow_acceptBooking_amt${i}_mobile`).innerHTML = "$0.00"
        }
    }
    e("flow_acceptBooking_customerName").value = "";
    e("flow_acceptBooking_customerEmail").value = "";
    e("flow_acceptBooking_invoiceDate").value = "";
    e("flow_acceptBooking_dueDate").value = "";
    e("flow_acceptBooking_invoiceTotal").innerHTML = "$0.00";
    e("flow_acceptBooking_paymentOptions").value = "";
    e("flow_acceptBooking_note").value = "";
    e("flow_acceptBooking_memo").value = "";
    e("flow_acceptBooking_createInvoiceTab").click();
    qbInvoiceLink = "";
}

function flow_acceptBooking_packageInvoice() {
    let data = {
        customerName: e("flow_acceptBooking_customerName").value,
        customerEmail: e("flow_acceptBooking_customerEmail").value,
        terms: e("flow_acceptBooking_terms").value,
        invoiceDate: e("flow_acceptBooking_invoiceDate").value,
        dueDate: e("flow_acceptBooking_dueDate").value,
        paymentOptions: e("flow_acceptBooking_paymentOptions").value,
        note: e("flow_acceptBooking_note").value,
        memo: e("flow_acceptBooking_memo").value,
        rows: {
            r1: null,
            r2: null,
            r3: null,
            r4: null,
            r5: null
        }
    }
    if (device == "desktop") {
        for (let i = 1; i < 6; i++) {
            if (e(`flow_acceptBooking_sDate${i}`).value) {
                data.rows[`r${i}`] = {
                    serviceDate: e(`flow_acceptBooking_sDate${i}`).value,
                    serviceName: e(`flow_acceptBooking_service${i}`).value,
                    description: e(`flow_acceptBooking_desc${i}`).value,
                    quantity: e(`flow_acceptBooking_qty${i}`).value,
                    rate: e(`flow_acceptBooking_rate${i}`).value
                }
            }
        }
    } else {
        for (let i = 1; i < 4; i++) {
            if (e(`flow_acceptBooking_sDate${i}_mobile`).value) {
                data.rows[`r${i}`] = {
                    serviceDate: e(`flow_acceptBooking_sDate${i}_mobile`).value,
                    serviceName: e(`flow_acceptBooking_service${i}_mobile`).value,
                    description: e(`flow_acceptBooking_desc${i}_mobile`).value,
                    quantity: e(`flow_acceptBooking_qty${i}_mobile`).value,
                    rate: e(`flow_acceptBooking_rate${i}_mobile`).value
                }
            }
        }
    }

    return data
}

e("flow_acceptBooking_create").addEventListener("click", () => {
    let pass = false;
    let rowsCheck = false;
    let essentialsCheck = true;
    let rows = {};

    if (device == "desktop") {
        rows = {
            r1: false,
            r2: false,
            r3: false,
            r4: false,
            r5: false
        }
        for (let i = 1; i < 6; i++) {
            if (
                (e(`flow_acceptBooking_sDate${i}`).value == "" &&
                    e(`flow_acceptBooking_service${i}`).value == "" &&
                    e(`flow_acceptBooking_desc${i}`).value == "" &&
                    e(`flow_acceptBooking_qty${i}`).value == "" &&
                    e(`flow_acceptBooking_rate${i}`).value == "") ||
                (e(`flow_acceptBooking_sDate${i}`).value != "" &&
                    e(`flow_acceptBooking_service${i}`).value != "" &&
                    e(`flow_acceptBooking_desc${i}`).value != "" &&
                    e(`flow_acceptBooking_qty${i}`).value != "" &&
                    e(`flow_acceptBooking_rate${i}`).value != "")
            ) {
                rows[`r${i}`] = true
            }
        }

        rowsCheck = rows.r1 && rows.r2 && rows.r3 && rows.r4 && rows.r5;
    } else {
        rows = {
            r1: false,
            r2: false,
            r3: false
        }
        for (let i = 1; i < 4; i++) {
            if (
                (e(`flow_acceptBooking_sDate${i}_mobile`).value == "" &&
                    e(`flow_acceptBooking_service${i}_mobile`).value == "" &&
                    e(`flow_acceptBooking_desc${i}_mobile`).value == "" &&
                    e(`flow_acceptBooking_qty${i}_mobile`).value == "" &&
                    e(`flow_acceptBooking_rate${i}_mobile`).value == "") ||
                (e(`flow_acceptBooking_sDate${i}_mobile`).value != "" &&
                    e(`flow_acceptBooking_service${i}_mobile`).value != "" &&
                    e(`flow_acceptBooking_desc${i}_mobile`).value != "" &&
                    e(`flow_acceptBooking_qty${i}_mobile`).value != "" &&
                    e(`flow_acceptBooking_rate${i}_mobile`).value != "")
            ) {
                rows[`r${i}`] = true
            }
        }

        rowsCheck = rows.r1 && rows.r2 && rows.r3;
    }
    let r1 = null;
    if (device == "desktop") { r1 = e("flow_acceptBooking_sDate1").value != "" }
    else { r1 = e("flow_acceptBooking_sDate1_mobile").value != "" }
    let essentials = {
        customerName: e("flow_acceptBooking_customerName").value != "",
        customerEmail: e("flow_acceptBooking_customerEmail").value != "",
        terms: e("flow_acceptBooking_terms").value != "",
        invoiceDate: e("flow_acceptBooking_invoiceDate").value != "",
        dueDate: e("flow_acceptBooking_dueDate").value != "",
        row1: r1
    }
    Object.keys(essentials).forEach((key) => {
        if (!essentials[key]) { essentialsCheck = false }
    })

    pass = rowsCheck && essentialsCheck;

    if (!pass) {
        e("flow_acceptBooking_invoiceErr").classList.remove("hidden")
    } else {
        e("loadingScreen").classList.remove("hidden")
        createQbInvoice(flow_acceptBooking_packageInvoice()).then((response) => {
            e("loadingScreen").classList.add("hidden")
            if (response.success == "true") {
                e("flow_acceptBooking_emailInvoiceTab").click()
                flow_acceptBooking_setSendInvoice(response.invoiceLink)
                booking_update.id = currentBooking;
                booking_update.update["qbInvoices"] = {};
                booking_update.update["qbInvoices"][response.invoiceId] = {};
                booking_update.update["qbInvoices"][response.invoiceId] = {
                    invoiceId: response.invoiceId,
                    invoiceNumber: response.invoiceNumber,
                    invoiceLink: response.invoiceLink,
                    invoiceDueDate: response.invoiceDueDate,
                    invoiceDate: response.invoiceDate,
                    invoiceBalance: response.invoiceBalance,
                    invoiceTotal: response.invoiceTotal
                }
                updateLocalBooking();
                updateBooking(booking_update.id, booking_update.update).then(() => {
                    booking_update.id = null;
                    booking_update.update = {};
                })
            } else {
                e("flow_acceptBooking_invoiceErrorTab").click();
                e("flow_acceptBooking_invoiceErrorTab_msg").innerHTML = response.err;
            }
        })
    }
})

e("flow_acceptBooking_invoiceErrorTab_ok").addEventListener("click", () => {
    flow_sendOptions_clearForm();
    flow_acceptBooking_clearForm();
    e("tab_bookingDetails").click();
})

function flow_acceptBooking_getSubject() {
    let timeStart = standardTime(bdElements.charterStartTime.value);
    let timeEnd = standardTime(bdElements.charterEndTime.value);
    let vessel = vessels.find(x => x.id == bdElements.vessel.value);
    let vesselDisplayName = vessel.displayName;
    let maxPassengers = vessel.maxCapacity;
    return `[ACCEPTED] San Diego Bay Cruise for ${e("dateTimeText").innerHTML}`;
}

function flow_acceptBooking_setSendInvoice(invoiceLink) {
    qbInvoiceLink = invoiceLink;
    e("flow_acceptBooking_create").classList.add("hidden")
    e("flow_acceptBooking_to").value = bdElements.email.value;
    e("flow_acceptBooking_subject").value = flow_acceptBooking_getSubject();
    let s1 = `Hello ${bdElements.firstName.value},\n\n`;
    let s2 = `Your charter for ${e("dateTimeText").innerHTML} for ${bdElements.passengers.value} passengers has been accepted!\n\n`;
    let s3 = `${flow_acceptBooking_paymentOptions.value} Please use the link below to pay your invoice:\n\n`;
    let s4 = `${invoiceLink}\n\n`;
    let s5 = "Feel free to text or call at any time if you have any questions.\n\nCheers!\n--\n\nCaptain Kenne Melonas\nUS Navy SWCC (Retired)\nOwner of Elite Maritime Services/San Diego Yacht Charters\nhttps://www.sdyachtcharters.com\nEmail: sdyachtcharters@gmail.com\nPhone: (619) 307-9534";
    e("flow_acceptBooking_msg").value = s1 + s2 + s3 + s4 + s5
}

e("flow_acceptBooking_send").addEventListener("click", () => {
    let check = false;
    let to_check = false;
    let subject_check = false;
    let msg_check = false;

    if (e("flow_acceptBooking_to").value != "") { to_check = true };
    if (e("flow_acceptBooking_subject").value != "") { subject_check = true }
    if (e("flow_acceptBooking_msg").value != "") { msg_check = true }

    check = to_check && subject_check && msg_check;

    if (check) {
        e("loadingScreen").classList.remove("hidden")
        let data = {
            to: e("flow_acceptBooking_to").value,
            subject: e("flow_acceptBooking_subject").value,
            message: e("flow_acceptBooking_msg").value,
            qbInvoiceLink: qbInvoiceLink
        }
        gmailQbInvoice(data).then((response) => {
            e("loadingScreen").classList.add("hidden");
            if (response.success == "true") {
                e("flow_acceptBooking_successTab").click();
                booking_update.id = currentBooking;
                booking_update.update["status"] = "Request Accepted";
                bdElements.status.value = "Request Accepted";
                updateLocalBooking();
                updateBooking(booking_update.id, booking_update.update).then(() => {
                    booking_update.id = null;
                    booking_update.update = {};
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
                })
            } else {
                e("flow_acceptBooking_gmailErrorTab").click();
                e("flow_acceptBooking_gmailErrorTab_msg").innerHTML = response.err;
            }
        })
    } else {
        e("flow_acceptBooking_sendErr").classList.remove("hidden")
    }

})

e("flow_acceptBooking_sendErr_ok").addEventListener("click", () => {
    e("flow_acceptBooking_sendErr").classList.add("hidden");
})

e("flow_acceptBooking_gmailErrorTab_ok").addEventListener("click", () => {
    flow_sendOptions_clearForm();
    flow_acceptBooking_clearForm();
    populateBookingDetails(getCurrentBooking())
    e("tab_bookingDetails").click();
})

e("flow_acceptBooking_successTab_ok").addEventListener("click", () => {
    flow_sendOptions_clearForm();
    flow_acceptBooking_clearForm();
    populateBookingDetails(getCurrentBooking())
    e("tab_bookingDetails").click();
});

//// //// //// //// Flow: Send Email //// //// //// ////

function flow_sendEmail_getSubject(status) {
    let timeStart = standardTime(bdElements.charterStartTime.value);
    let timeEnd = standardTime(bdElements.charterEndTime.value);
    let vessel = vessels.find(x => x.id == bdElements.vessel.value);
    let vesselDisplayName = vessel.displayName;
    let maxPassengers = vessel.maxCapacity;
    return `[${status}] San Diego Bay Cruise for ${e("dateTimeText").innerHTML}`;
}

let sendEmailData = {
    to: "",
    subject: "",
    message: ""
}

let sendEmailStatus = "";

function check_decline() {
    if (dbFieldsDisabled &&
        (!(bdElements.status.value == "Send Options" ||
            bdElements.status.value == "Vessel Request"))
    ) {
        e("button_decline").classList.add("disabled");
        e("button_decline_icon").classList.add("disabled");
    }
}

e("button_decline").addEventListener("click", () => {
    if (dbFieldsDisabled &&
        (bdElements.status.value == "Send Options" ||
            bdElements.status.value == "Vessel Request")) {
        e("tab_sendEmail").click();
        e("flow_sendEmail_to").value = bdElements.email.value;
        e("flow_sendEmail_subject").value = flow_sendEmail_getSubject("DECLINED");
        e("flow_sendEmail_msg").value = `Hello ${bdElements.firstName.value},\n\n`;
        sendEmailStatus = "Declined"
    }
})

function check_cancelBooking() {
    if (!dbFieldsDisabled &&
        (!(bdElements.status.value == "Request Accepted" ||
            bdElements.status.value == "Deposit Paid" ||
            bdElements.status.value == "Fully Paid"))
    ) {
        e("button_cancelBooking").classList.add("disabled");
        e("button_cancelBooking_icon").classList.add("disabled");
    }
}

e("button_cancelBooking").addEventListener("click", () => {
    if (dbFieldsDisabled &&
        (bdElements.status.value == "Request Accepted" ||
            bdElements.status.value == "Deposit Paid" ||
            bdElements.status.value == "Fully Paid")) {
        e("tab_sendEmail").click();
        e("flow_sendEmail_to").value = bdElements.email.value;
        e("flow_sendEmail_subject").value = flow_sendEmail_getSubject("CANCELLED");
        e("flow_sendEmail_msg").value = `Hello ${bdElements.firstName.value},\n\n`;
        sendEmailStatus = "Cancelled"
    }
})

function check_forward() {
    if (!(dbFieldsDisabled &&
        bdElements.vessel.value && 
        bdElements.vessel.value != "")
    ) {
        e("button_forward").classList.add("disabled");
        e("button_forward_icon").classList.add("disabled");
    }
}

e("button_forward").addEventListener("click", () => {
    if (dbFieldsDisabled &&
        bdElements.vessel.value && 
        bdElements.vessel.value != ""
    ) {
        e("tab_sendEmail").click();
        e("flow_sendEmail_to").value = vfElements.forwardRequestsTo.value;
        e("flow_sendEmail_subject").value = flow_sendEmail_getSubject("FWD");
        let msg = `Hello ${vfElements.primaryName.value},\n\n`;
        msg += "Please see the attached vessel request below:\n\n";
        msg += getCurrentBooking().originalForm;
        e("flow_sendEmail_msg").value = msg;
        sendEmailStatus = "Forwarded Out"
    }
})

e("flow_sendEmail_cancel").addEventListener("click", () => {
    clearSendEmailForm();
    e("tab_bookingDetails").click()
})

function checkSendEmail() {
    let toPass = (e("flow_sendEmail_to").value == "" ? false : true);
    let subjectPass = (e("flow_sendEmail_subject").value == "" ? false : true);
    let msgPass = (e("flow_sendEmail_msg").value == "" ? false : true);
    return toPass && subjectPass && msgPass
}

e("flow_sendEmail_send").addEventListener("click", () => {
    if (checkSendEmail()) {
        e("loadingScreen").classList.remove("hidden")
        sendEmailData.to = e("flow_sendEmail_to").value;
        sendEmailData.subject = e("flow_sendEmail_subject").value;
        sendEmailData.message = e("flow_sendEmail_msg").value;
        sendGmail(sendEmailData).then((response) => {
            e("loadingScreen").classList.add("hidden")
            if (response.success && response.success != "false") {
                e("flow_sendEmail_successTab").click();
                booking_update.id = currentBooking;
                booking_update.update["status"] = sendEmailStatus;
                bdElements.status.value = sendEmailStatus;
                updateLocalBooking();
                updateBooking(booking_update.id, booking_update.update).then(() => {
                    booking_update.id = null;
                    booking_update.update = {};
                    sendEmailStatus = "";
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
                })
            } else {
                e("flow_sendEmail_errorTab").click();
                e("flow_sendEmail_errorTab_msg").innerHTML = response.err
            }
        })
    } else {
        e("flow_sendEmail_err").classList.remove("hidden")
    }
})

e("flow_sendEmail_err_ok").addEventListener("click", () => {
    e("flow_sendEmail_err").classList.add("hidden")
})

function clearSendEmailForm() {
    e("flow_sendEmail_to").value = "";
    e("flow_sendEmail_subject").value = "";
    e("flow_sendEmail_msg").value = "";
    sendEmailData.to = "";
    sendEmailData.subject = "";
    sendEmailData.message = "";
    sendEmailStatus = "";
}

e("flow_sendEmail_errorTab_ok").addEventListener("click", () => {
    e("flow_sendEmail_defaultTab").click();
    e("tab_bookingDetails").click();
    clearSendEmailForm()
})

e("flow_sendEmail_successTab_ok").addEventListener("click", () => {
    e("flow_sendEmail_defaultTab").click();
    e("tab_bookingDetails").click();
    clearSendEmailForm()
})
