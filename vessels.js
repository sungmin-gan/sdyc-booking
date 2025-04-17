//// //// //// //// Declarations //// //// //// ////

let vessels = [];

let currentVessel = "7qc7aPDMLFWSvq7Js1Hg";

const vesselList = {
    "[1] Standard": "standardVesselsList",
    "[2] Large": "largeVesselsList",
    "[3] Specialty": "specialtyVesselsList"
}

//// //// //// //// For Making the Vessels List //// //// //// ////

function getVessels() {
    return new Promise(async (resolve) => {
        const url = "https://sdyc-api-2-8c0da59c5ac4.herokuapp.com/getVessels";
        try {
            const response = await fetch(url, {
                method: "GET"
            });
            console.log(response)
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            } else {
                const json = await response.json();
                resolve(json.vessels)
            }
        } catch (error) {
            console.log(error.message)
        }
    })
}

function fillVesselLists() {
    return new Promise(async (resolve) => {
        vessels.forEach((vessel) => {
            let slot = document.createElement("div");
            slot.classList.add("div-block-40");
            slot.setAttribute("id", vessel.id);
            let name = document.createElement("div");
            name.classList.add("text-block-22");
            if (vessel.name.length > 23) {
                let vesselName = `${vessel.name.substring(0, 23)}...`;
                if (vesselName[22] == " ") {
                    vesselName = `${vesselName.substring(0, 22)}...`
                }
                name.innerHTML = vesselName;
            } else {
                name.innerHTML = vessel.name;
            }
            let displayName = document.createElement("div");
            displayName.classList.add("text-block-23");
            displayName.innerHTML = vessel.displayName;
            slot.appendChild(name);
            slot.appendChild(displayName);
            slot.addEventListener("click", () => { setVessel(slot) })
            e(vesselList[vessel.class]).appendChild(slot)
        })
    })
}

function setVessels(vesselsArr) {
    return new Promise(async (resolve) => {
        vesselsArr.forEach((v) => {
            vessels.push(v)
        })
        resolve()
    })
}

//// //// //// //// For Controlling the Vessel Form //// //// //// ////

function setVessel(slot, initial = false) {
    console.log('setVessel fired')
    console.log(initial)
    const vid = slot.getAttribute("id");
    if (vid == currentVessel && !initial) { return null } else {
        if (!initial) { e(currentVessel).classList.remove("selected") }
        e(vid).classList.add("selected");
        let vessel = vessels.find((v) => v.id == vid);
        e("vf_vesselName").value = vessel.name;
        e("vf_vesselDisplayName").value = vessel.displayName;
        e("vf_capacity").value = vessel.maxCapacity;
        e("vf_class").value = vessel.class;
        currentVessel = vid;
    }
}

