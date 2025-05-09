//// //// //// //// Declarations //// //// //// ////

let vessels = [];

let currentVessel = "7qc7aPDMLFWSvq7Js1Hg";

const vesselList = {
    "[1] Standard": "standardVesselsList",
    "[2] Large": "largeVesselsList",
    "[3] Specialty": "specialtyVesselsList"
}

let vessel_update = {
	id: null,
    update: {}
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

function updateVessel(id, data) {
    return new Promise(async (resolve) => {
        const url = "https://sdyc-api-2-8c0da59c5ac4.herokuapp.com/updateVessel";
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
            slot.addEventListener("click", () => { 
                changeVessel(slot)
            })
            e(vesselList[vessel.class]).appendChild(slot)
        })
        resolve()
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

let vfElements = {
    // Basic Info
    name: e("vf_name"),
    displayName: e("vf_displayName"),
    class: e("vf_class"),
    maxCapacity: e("vf_maxCapacity"),
    sdycURL: e("vf_sdycURL"),
    homePort: e("vf_homePort"),
    altPort: e("vf_altPort"),
    pricing: e("vf_pricing"),
    // Company / Owner Info
    primaryName: e("vf_primaryName"),
    primaryPhone: e("vf_primaryPhone"),
    primaryEmail: e("vf_primaryEmail"),
    website: e("vf_website"),
    qbid: e("vf_qbid"),
    secondaryName: e("vf_secondaryName"),
    secondaryPhone: e("vf_secondaryPhone"),
    secondaryEmail: e("vf_secondaryEmail"),
    // Captain Info
    captainName: e("vf_captainName"),
    captainPhone: e("vf_captainPhone"),
    captainEmail: e("vf_captainEmail"),
    secondaryCaptainName: e("vf_secondaryCaptainName"),
    secondaryCaptainPhone: e("vf_secondaryCaptainPhone"),
    secondaryCaptainEmail: e("vf_secondaryCaptainEmail")
}

function disableVfFields() {
    Object.keys(vfElements).forEach((key) => {
        vfElements[key].disabled = true;
        vfElements[key].style.background = "white";
        if (key == "name" || key == "displayName") {
            vfElements[key].style.paddingLeft = "0rem";
            vfElements[key].style.border = "1px solid transparent";
        }
        
    })
    e("saveButton_vf").classList.add("hidden")
    e("editButton_vf").classList.remove("hidden")
}


let vesselTo = "";

function setVessel(slot) {
    disableVfFields()
    const vid = slot.getAttribute("id");
    
    e(currentVessel).classList.remove("selected");
    slot.classList.add("selected");
    let vessel = vessels.find((v) => v.id == vid);
    
    Object.keys(vfElements).forEach((key) => {
        vfElements[key].value = vessel[key] || "";
    })
    e("vf_vesselURL").setAttribute("href", vfElements.sdycURL.value)
    currentVessel = vid;
    vesselTo = "";
    vessel_update = { id: vid, update: {} }
}

function changeVessel(slot) {
    if (slot.getAttribute("id") != currentVessel) {
        setVesselUpdate();
        if (Object.keys(vessel_update.update).length > 0) {
            e("confirmSaveVessel").classList.remove("hidden");
            vesselTo = slot.getAttribute("id")
        } else {
            setVessel(slot)
        }
    }
}

function enableVfFields() {
    Object.keys(vfElements).forEach((key) => {
        vfElements[key].disabled = false;
        vfElements[key].style.background = "white";
        if (key == "name" || key == "displayName") {
            vfElements[key].style.paddingLeft = "0.5rem";
            vfElements[key].style.borderBottom = "1px solid lightgrey";
        }
    })
    
    e("saveButton_vf").classList.remove("hidden")
    e("editButton_vf").classList.add("hidden")
    
}

e("editButton_vf").addEventListener("click", () => { enableVfFields() })

function setVesselUpdate() {
    let vessel = vessels.find(x => x.id == currentVessel);
    Object.keys(vfElements).forEach((key) => {
        let value = (key == "maxCapacity" ? parseInt(vfElements[key].value) : vfElements[key].value)
        if (vessel[key] != value) {
            vessel_update.update[key] = value;
        } else {
            delete vessel_update.update[key];
        }
    })
}

function updateLocalVessel() {
    Object.keys(vessel_update.update).forEach((key) => {
        vessels.find( x => x.id == vessel_update.id)[key] = vessel_update.update[key];
    })
}

e("saveButton_vf").addEventListener("click", () => { 
    disableVfFields(); 
    setVesselUpdate();
    if (Object.keys(vessel_update.update).length > 0) {
        updateVessel(vessel_update.id, vessel_update.update).then(() => {
            updateLocalVessel();
        });
    }
})

e("confirmSaveVessel_save").addEventListener("click", () => {
    e("confirmSaveVessel").classList.add("hidden");
    disableVfFields();
    updateVessel(vessel_update.id, vessel_update.update).then(() => {
        updateLocalVessel();
        if (vesselTo) { changeVessel(e(vesselTo)) }
        else if (goToTab) { switchTabs(toToTab) }
    });
})

e("confirmSaveVessel_cancel").addEventListener("click", () => {
    e("confirmSaveVessel").classList.add("hidden");
})

e("confirmSaveVessel_discard").addEventListener("click", () => {
    e("confirmSaveVessel").classList.add("hidden");
    if (vesselTo) { setVessel(e(vesselTo)) }
    else if (goToTab) { switchTabs(toToTab) }
})
