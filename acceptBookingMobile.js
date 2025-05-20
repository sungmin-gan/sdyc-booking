//// //// //// //// Flow: Accept Booking Mobile //// //// //// ////

e("flow_acceptBooking_sDate1_mobile").setAttribute("type", "date");
e("flow_acceptBooking_sDate2_mobile").setAttribute("type", "date");
e("flow_acceptBooking_sDate3_mobile").setAttribute("type", "date");

function setCharterLineMobile() {
    let booking = getCurrentBooking();
    if (booking.estimate && booking.estimate != 0 && booking.estimate != "") {
        let duration = getDuration(booking.charterStartTimestamp, booking.charterEndTimestamp);
        let rate = (booking.estimate / duration).toFixed(2);
        e("flow_acceptBooking_qty1_mobile").value = duration;
        e("flow_acceptBooking_rate1_mobile").value = rate;
        e("flow_acceptBooking_amt1_mobile").innerHTML = formatCurrency((duration * rate).toFixed(2))
    }
}

for (let i = 1; i < 4; i++) {
    e(`flow_acceptBooking_qty${i}_mobile`).addEventListener("input", () => {
        let rate = parseFloat(e(`flow_acceptBooking_rate${i}_mobile`).value);
        if (rate || rate == "") { rate = 0 }
        let qty = parseFloat(e(`flow_acceptBooking_qty${i}_mobile`).value);
        if (!qty || qty == "") { qty = 0 }
        let amt = (rate * qty).toFixed(2);
        e(`flow_acceptBooking_amt${i}_mobile`).innerHTML = formatCurrency(amt);
        flow_acceptBooking_setTotal()
    });
    e(`flow_acceptBooking_rate${i}_mobile`).addEventListener("input", () => {
        let rate = parseFloat(e(`flow_acceptBooking_rate${i}_mobile`).value);
        if (!rate || rate == "") { rate = 0 }
        let qty = parseFloat(e(`flow_acceptBooking_qty${i}_mobile`).value);
        if (!qty || qty == "") { qty = 0 }
        let amt = (rate * qty).toFixed(2);
        e(`flow_acceptBooking_amt${i}_mobile`).innerHTML = formatCurrency(amt);
        flow_acceptBooking_setTotal()
    })
    e(`flow_acceptBooking_qty${i}_mobile`).addEventListener("change", () => {
        if (!e(`flow_acceptBooking_qty${i}_mobile`).value || e(`flow_acceptBooking_qty${i}`).value == "") {
            e(`flow_acceptBooking_qty${i}_mobile`).value = 0
        }
    })
    e(`flow_acceptBooking_rate${i}_mobile`).addEventListener("change", () => {
        if (!e(`flow_acceptBooking_rate${i}_mobile`).value || e(`flow_acceptBooking_rate${i}`).value == "") {
            e(`flow_acceptBooking_rate${i}_mobile`).value = 0
        }
    })
}

for (let i = 1; i < 4; i++) {
    e(`flow_acceptBooking_clear${i}_mobile`).addEventListener("click", () => {
        e(`flow_acceptBooking_sDate${i}_mobile`).value = "";
        e(`flow_acceptBooking_service${i}_mobile`).value = "";
        e(`flow_acceptBooking_desc${i}_mobile`).value = "";
        e(`flow_acceptBooking_qty${i}_mobile`).value = "";
        e(`flow_acceptBooking_rate${i}_mobile`).value = "";
        e(`flow_acceptBooking_amt${i}_mobile`).innerHTML = "$0.00"
    })
}
