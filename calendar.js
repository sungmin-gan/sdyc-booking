const getCalendarDates=()=>{
	//Get Previous Month's
	let firstDate = new Date(calendarYear, calendarMonth, 1);
  let firstDay = firstDate.getDay();
  if (firstDay == 0) { firstDay = 7 }
	if(firstDay!=1) {
		let firstDateLastMonth = new Date(calendarYear, calendarMonth, -1*(firstDay-2))
		let lastDateLastMonth = new Date(calendarYear, calendarMonth, 0);
    for(let i=firstDateLastMonth.getDate(); i<lastDateLastMonth.getDate()+1; i++){
    	let date = new Date(firstDateLastMonth.getFullYear(), firstDateLastMonth.getMonth(), i);
      calendarDates.push({date: date, type: "last"})
    }
  }
  //Get This Month's
  let lastDate = new Date(calendarYear, calendarMonth+1, 0);
  for (let i=1; i<lastDate.getDate()+1; i++) {
  	let date = new Date(calendarYear, calendarMonth, i);
  	if(i==currentDate.getDate() && calendarMonth == currentMonth) { calendarDates.push({ date: date, type: "today" }) }
    else { calendarDates.push({ date: date, type: "current" }) }
  }
  //Get Next Month's
  let nextMonth = (calendarMonth==11) ? 0 : calendarMonth + 1;
  let nextYear = (calendarMonth==11) ? calendarYear + 1 : calendarYear;
  let nextDatesLength = 42-calendarDates.length+1;
  for (let i=1; i<nextDatesLength; i++) {
  	let date = new Date(nextYear, nextMonth, i);
    calendarDates.push({ date: date, type: "next"})
  }
}

const renderCalendar=()=>{
	for(let i=1; i<43; i++){
  	//Create boxes
  	let box = document.createElement("div");
    box.classList.add("div-block-6");
    box.setAttribute("id",`datebox_${i}`);
    if(i%7==0){
    	box.classList.add("dateBoxEnd")
    }
    if(i>35){
    	box.classList.add("dateBoxBottom")
    }
    //Create date numbers
    let numberWrapper = document.createElement("div");
    numberWrapper.classList.add("div-block-7");
    let dateNumber = document.createElement("div");
    dateNumber.classList.add("text-block-3");
    dateNumber.setAttribute("id",`datenumber_${i}`);
    //Append to parents
    numberWrapper.appendChild(dateNumber)
    box.appendChild(numberWrapper)
    e("calendarArea").appendChild(box);
  }
}

const fillCalendarDates=()=>{
	e("calendarTitle").innerHTML = `${YEAR[calendarMonth]} ${calendarYear}`;
	calendarDates.forEach((date,i) => {
   	let num = (date.date.getDate() < 10) ? `0${date.date.getDate()}` : date.date.getDate();
  	e(`datenumber_${i+1}`).innerHTML = num;
    if(date.type == "today"){ e(`datenumber_${i+1}`).classList.add("dark") }
    if(date.type != "today" && date.type != "current"){
    	e(`datenumber_${i+1}`).classList.add("light")
      e(`datebox_${i+1}`).classList.add("light")
    }
  })
}

const resetCalendarClasses = () => {
	for (let i=1; i<43; i++) {
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
  resetCalendarClasses()
  fillCalendar()
})

renderCalendar()
fillCalendar()
