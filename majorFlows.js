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
                e("flow_sendOptions_successTab").click();
                booking_update.id = currentBooking;
                booking_update.update["status"] = "Options Sent";
                updateLocalBooking();
                populateBookingDetails(getCurrentBooking())
                updateBooking(booking_update.id, booking_update.update)
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
                resolve(json.result);
            }
        } catch (error) {
            console.log(error.message)
        }
    })
}

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
        e("flow_acceptBooking_qty1").value = duration;
        e("flow_acceptBooking_rate1").value = rate;
        e("flow_acceptBooking_amt1").innerHTML = formatCurrency((duration * rate).toFixed(2))
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
    e("flow_acceptBooking_desc1").value = `${timeStart}-${timeEnd} San Diego Bay Cruise on ${vesselDisplayName} for up to ${maxPassengers} passengers.`;
}

function flow_acceptBooking_getTotal() {
    let total = 0;
    for (let i = 1; i < 6; i++) {
        let rate = parseFloat(e(`flow_acceptBooking_rate${i}`).value);
        let qty = parseFloat(e(`flow_acceptBooking_qty${i}`).value);
        if (!rate || rate == "") { rate = 0 }
        if (!qty || qty == "") { qty = 0 }
        total += (rate * qty);
    }
    return total.toFixed(2)
}

function flow_acceptBooking_setTotal() {
    e("flow_acceptBooking_invoiceTotal").innerHTML = formatCurrency(flow_acceptBooking_getTotal());
    flow_acceptBooking_setPaymentOptions()
}

function flow_acceptBooking_setPaymentOptions() {
    let deposit = flow_acceptBooking_getTotal() / 2;
    let dueDate = e("flow_acceptBooking_dueDate").value;
    2025 - 03 - 01
    let dueMonth = YEAR[parseInt(dueDate.substring(5, 7)) - 1];
    let dueYear = dueDate.substring(0, 4);
    let dueDay = `${parseInt(dueDate.substring(8))}`;
    let fullDate = `${dueMonth} ${dueDay}, ${dueYear}`;
    e("flow_acceptBooking_paymentOptions").value = `A deposit of ${formatCurrency(deposit)} is due up front to secure your cruise and the remaining half is due ${fullDate}. You are welcome to pay the entire amount all at once.`
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
    for (let i = 1; i < 6; i++) {
        e(`flow_acceptBooking_sDate${i}`).value = "";
        e(`flow_acceptBooking_service${i}`).value = "";
        e(`flow_acceptBooking_desc${i}`).value = "";
        e(`flow_acceptBooking_qty${i}`).value = "";
        e(`flow_acceptBooking_rate${i}`).value = "";
        e(`flow_acceptBooking_amt${i}`).innerHTML = "$0.00"
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
    return data
}

e("flow_acceptBooking_create").addEventListener("click", () => {
    let pass = false;
    let rowsCheck = false;
    let essentialsCheck = true;

    let rows = {
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

    let essentials = {
        customerName: e("flow_acceptBooking_customerName").value != "",
        customerEmail: e("flow_acceptBooking_customerEmail").value != "",
        terms: e("flow_acceptBooking_terms").value != "",
        invoiceDate: e("flow_acceptBooking_invoiceDate").value != "",
        dueDate: e("flow_acceptBooking_dueDate").value != "",
        row1: e("flow_acceptBooking_sDate1").value != ""
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
                populateBookingDetails(getCurrentBooking())
                updateBooking(booking_update.id, booking_update.update)
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
                populateBookingDetails(getCurrentBooking())
                updateLocalBooking();
                updateBooking(booking_update.id, booking_update.update)
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
    e("flow_acceptBooking_sendErr").classList.add("hidden")
})

e("flow_acceptBooking_gmailErrorTab_ok").addEventListener("click", () => {
    flow_sendOptions_clearForm();
    flow_acceptBooking_clearForm();
    e("tab_bookingDetails").click();
})

e("flow_acceptBooking_successTab_ok").addEventListener("click", () => {
    flow_sendOptions_clearForm();
    flow_acceptBooking_clearForm();
    e("tab_bookingDetails").click();
});
