// alram screen
const addPopUpOpenBtn=document.querySelector('.add-popup-open-btn')
const addPopUpBg=document.querySelector('.add-popup-bg')
const addPopUp=document.querySelector('.add-popup')
const addPoPUpCloseBtn=document.querySelector('.add-popup-close-btn')
const ringingPopUpBg=document.querySelector('.ringing-popup-bg')
const ringingPopUp=document.querySelector('.ringing-popup')
const alramStopBtn=document.querySelector('.alram-stop-btn')
const timeInput=document.querySelector('.time-input')
const alramAddEditBtn=document.querySelector('.alram-add-editcomplete-btn')
const alramContainer=document.querySelector('.alram-container')
const dayInputs=document.querySelectorAll('.day-input')
const alrams=[]
const alramAudio=new Audio('../music/alarm.mp3')
let currEditAlramCart=null

//play alram continously
alramAudio.addEventListener('ended',()=>{alramAudio.play()})

//functions to retrieve formatted dates and time for simplying time comparing process
function getTodayDate(){
    const todayDate=new Date()
    return {month:todayDate.getMonth(),day:todayDate.getDate()}
}

function getTommorowDate(){
    const todayDate= new Date()
    const tommorowDate=new Date()
    tommorowDate.setDate(todayDate.getDate()+1)
    return {month:tommorowDate.getMonth(),day:tommorowDate.getDate()}
}

function areDateSame(date1,date2){
    if(date1.month!==date2.month) return false
    if(date1.day!==date2.day) return false 
    return true
}

function getFormattedCurrentTime(){
    const currTime=new Date()
    const currTimeHrs=currTime.getHours()<10?`0${currTime.getHours()}`:`${currTime.getHours()}`
    const currTimeMins=currTime.getMinutes()<10?`0${currTime.getMinutes()}`:`${currTime.getMinutes()}`
    const currTimeSecs=currTime.getSeconds()
    return `${currTimeHrs}:${currTimeMins}:${currTimeSecs}`
}

//check for entered time has passed today or not if user hasnt marked days for alram so that today or tomm date is to be applied in the alram
function hasEnteredTimePassed(enteredTime){
    const currTime=new Date()
    if(enteredTime.hours>currTime.getHours()) return true //entered time has passed since entered time hrs>curr time hrs
    else if(enteredTime.hours===currTime.getHours()){
        if(enteredTime.mins<=currTime.getMinutes()) return true//hrs are matched but entered time is as same as or ahead of curr time by minutes
        return false //hrs matched but curr time is ahead of entered time by minutes
    }
    return false //curr time is ahead by hrs
}

// convert number to month
function getMnthForCorrespondingNumber(mnthNum){
    switch (mnthNum) {
        case 0:
            return 'Jan';
        case 1:
            return 'Feb';
        case 2:
            return 'Mar';
        case 3:
            return 'Apr';
        case 4:
            return 'May';
        case 5:
            return 'Jun';
        case 6:
            return 'Jul';
        case 7:
            return 'Aug';
        case 8:
            return 'Sep';
        case 9:
            return 'Oct';
        case 10:
            return 'Nov';
        case 11:
            return 'Dec';
        default:
            return 'Invalid month number';
    }
}

//delete alram function 
function deleteAlram(e){
    let toBeDeletedAlramCart=e.target
    while(!(toBeDeletedAlramCart.className.includes('alram-cart'))) toBeDeletedAlramCart=toBeDeletedAlramCart.parentElement
    const toBeDeletedAlramCartIndx=Number(toBeDeletedAlramCart.getAttribute('id'))
    alrams.splice(toBeDeletedAlramCartIndx,1)
    alramContainer.removeChild(toBeDeletedAlramCart)
    //reset alram cart id's alfter deletion
    const alramCarts=document.querySelectorAll('.alram-cart')
    let newId=0
    alramCarts.forEach((alramCart)=>{
        alramCart.setAttribute('id',`${newId}`)
        newId++
    })
}

// close ringing popup window fn
function closeRingingPopUpWindow(){
    ringingPopUpBg.classList.replace('flex','hidden')
    ringingPopUp.classList.remove('popup-animate')
}
//close alram adding window fn
function closeAddPopupWindow(){
    //reset day inputs
    dayInputs.forEach((dayInput,key)=>{
        if(dayInput.className.includes('text-blue-700')){
            if(key===5) dayInput.classList.replace('text-blue-700','text-red-500')
            else dayInput.classList.replace('text-blue-700','text-white')
        }
    })
    addPopUpBg.classList.replace('flex','hidden')
    addPopUp.classList.remove('popup-animate')
}

//editing window open fn(it will open the add window but in editing environment)
function openEditingWindow(toBeEditedAlramCart){
    addPopUpBg.classList.replace('hidden','flex')
    addPopUp.classList.add('popup-animate')
    addPopUp.children[1].children[2].textContent='Done' //user has opened add window for editing existing alram cart
    currEditAlramCart=toBeEditedAlramCart
    timeInput.value=toBeEditedAlramCart.children[0].textContent
    if(toBeEditedAlramCart.children[1].children[0].tagName==='DIV'){
        dayInputs.forEach((dayInput,key)=>{
            if(toBeEditedAlramCart.children[1].children[0].children[key].className.includes('text-blue-700')){
                if(key===5) dayInput.classList.replace('text-red-500','text-blue-700')
                else dayInput.classList.replace('text-white','text-blue-700')
            }
        })
    }
}

//create alram cart

function createAlramCart(enteredTime,days,date){
   // Create main container
   const mainDiv = document.createElement('div');
   mainDiv.className = 'alram-cart flex justify-between items-center bg-gray-800 rounded-xl px-2 py-6 text-white';
   mainDiv.setAttribute('id',`${alrams.length}`)

   //open edit window when clicked on the alram cart
   mainDiv.addEventListener('click',function(e){
    const eventTargetClsName=e.target.className
    const isAlramClicked=!(eventTargetClsName.includes('alram-on-off-btn')||eventTargetClsName.includes('alram-btn-circle')||
    eventTargetClsName.includes('alram-del-btn')||eventTargetClsName.includes('fa-trash'))//if alram onoff btn or delete btn is clicked then 
    // alram cart clicked is not considered
    if(!isAlramClicked) return
    openEditingWindow(this)
   })

   // Create time element
   const timeP = document.createElement('p');
   timeP.className = 'text-xl';
   timeP.textContent = enteredTime;
   mainDiv.appendChild(timeP)

    //create second div
    const secondDiv=document.createElement('div')
    secondDiv.classList.add('flex','gap-x-3','items-center')

    //if user marked any of the day
    if(days){
        // Create days container
        const daysDiv = document.createElement('div');
        daysDiv.className = 'flex gap-x-1 text-xs text-white';
     
        // Create days of the week
        const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        let currDayIndx=0
        for (const day of daysOfWeek) {
            const dayP = document.createElement('p');
            dayP.textContent = day;
            if(days[currDayIndx]) dayP.classList.add('text-blue-700')
            daysDiv.appendChild(dayP);
            currDayIndx++;
        }
        //add day indicator to second div 
        secondDiv.appendChild(daysDiv)
    }
    //if user hasnt marked any of the day
    else{
        const dateDiv=document.createElement('p')
        dateDiv.className='text-xs text-white'

        dateDiv.textContent=`${date.day} ${getMnthForCorrespondingNumber(date.month)}`
        //add date indicator to second div
        secondDiv.appendChild(dateDiv)
    }

   // Create alarm button container
   const alarmBtnDiv = document.createElement('div');
   alarmBtnDiv.className = 'alram-on-off-btn w-8 bg-blue-700 rounded-r-full rounded-l-full transition-all';

   // Create alarm button inner element
   const alarmBtnInnerDiv = document.createElement('div');
   alarmBtnInnerDiv.className = 'alram-btn-circle bg-white w-[50%] aspect-square rounded-full transition-all translate-x-[100%]';

   //add alraminnerdiv to alram button
   alarmBtnDiv.appendChild(alarmBtnInnerDiv);

   //on off toggle event
   alarmBtnDiv.addEventListener('click',function(e){
        if(this.className.includes('bg-gray-600')){
            this.firstElementChild.classList.add('translate-x-[100%]')
            this.classList.replace('bg-gray-600','bg-blue-700')
            alrams[Number(this.parentElement.parentElement.getAttribute('id'))].on=true
        }
        else{
            this.firstElementChild.classList.remove('translate-x-[100%]')
            this.classList.replace('bg-blue-700','bg-gray-600')
            alrams[Number(this.parentElement.parentElement.getAttribute('id'))].on=false
        }
   })

   //add alram btn container to second div
   secondDiv.appendChild(alarmBtnDiv)

   //create alram delete button
   const alramDelBtnDiv=document.createElement('div')
   alramDelBtnDiv.className='alram-del-btn rounded-full px-2 py-2 hover:bg-slate-700 transition-all text-sm cursor-pointer'
   const alramDelBtn=document.createElement('i')
   alramDelBtn.className="fa-solid fa-trash"
   //add alram del btn to alram del btn div
   alramDelBtnDiv.appendChild(alramDelBtn)

   //delete alram
   alramDelBtnDiv.addEventListener('click',deleteAlram)

   //add alram del btn to second div
   secondDiv.appendChild(alramDelBtnDiv)

   //add second div to main div
   mainDiv.appendChild(secondDiv)

   return mainDiv
}

// fn for checking the identical alrams
function checkForIdenticalExistingAlram(time,days,date){
    let matched=false
    alrams.forEach((alram)=>{
        if(alram.time===time){
            if(alram.days&&days){
                matched=true
                for(let dayIndx=0;dayIndx<7;dayIndx++){
                    if(alram.days[dayIndx]!==days[dayIndx]) matched=false
                }
            }
            else if(alram.date&&date){
                matched=true
                if(alram.date.month!==date.month) matched=false
                if(alram.date.day!==date.day) matched=false
            }
        }
    })
    return matched
}

//edit alram cart
function editAlramCart(){
    if(timeInput.value===''){
        alert('enter valid time for alram')
        return false
    }
    //set edited time
    currEditAlramCart.children[0].textContent=timeInput.value
    let isAnyDayMarked=false
    const markedDays=[]
    let date=null
    //check which days user has marked
    dayInputs.forEach((dayInput)=>{
        if(dayInput.className.includes('text-blue-700')){
            isAnyDayMarked=true
            markedDays.push(true)
        }
        else markedDays.push(false)
    })

    //reset day date indicator div
    const cartSecondDiv=currEditAlramCart.children[1]
    if(!isAnyDayMarked){
        date=hasEnteredTimePassed(
        {   
            hours:Number(timeInput.value[0]+timeInput.value[1]), 
            mins:Number(timeInput.value[3]+timeInput.value[4])
        })?getTommorowDate():getTodayDate()
        if(checkForIdenticalExistingAlram(`${timeInput.value}:0`,null,date)){
            alert('same alram already exist')
            return false
        }
        //create new date indicator
        const dateIndicator=document.createElement('p')
        dateIndicator.textContent=`${date.day} ${getMnthForCorrespondingNumber(date.month)}`
        cartSecondDiv.replaceChild(dateIndicator,cartSecondDiv.firstElementChild)
    }
    else{
        if(checkForIdenticalExistingAlram(`${timeInput.value}:0`,markedDays,null)){
            alert('same alram already exist')
            return false
        }
        // Create days container
        const daysIndicator = document.createElement('div');
        daysIndicator.className = 'flex gap-x-1 text-xs text-white';
     
        // Create days of the week
        const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        let currDayIndx=0
        for (const day of daysOfWeek) {
            const dayP = document.createElement('p');
            dayP.textContent = day;
            if(markedDays[currDayIndx]) dayP.classList.add('text-blue-700')
            daysIndicator.appendChild(dayP);
            currDayIndx++;
        }
        cartSecondDiv.replaceChild(daysIndicator,cartSecondDiv.firstElementChild)

    }
    const editedAlramCartIndx=Number(currEditAlramCart.getAttribute('id'))
    alrams[editedAlramCartIndx].time=`${timeInput.value}:0`
    alrams[editedAlramCartIndx].days=isAnyDayMarked?markedDays:null
    alrams[editedAlramCartIndx].date=isAnyDayMarked?null:date

    return true
}

//add alram
function addAlram(){
    if(timeInput.value===''){
        alert('enter valid time for alram')
        return false
    }
    let isAnyDayMarked=false
    const markedDays=[]
    let date=null
    //check which days user has marked
    dayInputs.forEach((dayInput)=>{
        if(dayInput.className.includes('text-blue-700')){
            isAnyDayMarked=true
            markedDays.push(true)
        }
        else markedDays.push(false)
    })
    //if user entered any of the day then create cart with marked days else create with particular date
    if(!isAnyDayMarked){
        date=hasEnteredTimePassed(
            {   
                hours:Number(timeInput.value[0]+timeInput.value[1]), 
                mins:Number(timeInput.value[3]+timeInput.value[4])
            })?getTommorowDate():getTodayDate()
        if(checkForIdenticalExistingAlram(`${timeInput.value}:0`,null,date)){
            alert('same alram already exist')
            return false
        }
        alramContainer.appendChild(createAlramCart(timeInput.value,null,date))
    }
    else {
        if(checkForIdenticalExistingAlram(`${timeInput.value}:0`,markedDays,null)){
            alert('same alram already exist')
            return false
        }
        alramContainer.appendChild(createAlramCart(timeInput.value,markedDays,null))
    }
    alrams.push(
        {
            time:`${timeInput.value}:0`,
            on:true,
            days:isAnyDayMarked?markedDays:null,
            date:isAnyDayMarked?null:date
        }
    )
    return true
}

// open alram adding window
addPopUpOpenBtn.addEventListener('click',function(e){
    addPopUpBg.classList.replace('hidden','flex')
    addPopUp.classList.add('popup-animate')
    addPopUp.children[1].children[2].textContent='Add' //user has opened add window for adding new alram
    const currHrs=new Date().getHours()<10?`0${new Date().getHours()}`:`${new Date().getHours()}`
    const currMins=new Date().getMinutes()<10?`0${new Date().getMinutes()}`:`${new Date().getMinutes()}`
    timeInput.value=`${currHrs}:${currMins}`
})
// close alram adding window
addPoPUpCloseBtn.addEventListener('click',closeAddPopupWindow)

//close alram ringing window
alramStopBtn.addEventListener('click',()=>{
    alramAudio.pause() //stop alarm
    closeRingingPopUpWindow() //close ringing window
})

//mark the days user want alram to be ring
dayInputs.forEach((dayInput,key)=>{
    dayInput.addEventListener('click',(e)=>{
        if(key===5){
            if(dayInput.className.includes('text-red-500')) dayInput.classList.replace('text-red-500','text-blue-700')
            else dayInput.classList.replace('text-blue-700','text-red-500')
        } 
        else{
            if(dayInput.className.includes('text-white')) dayInput.classList.replace('text-white','text-blue-700')
            else dayInput.classList.replace('text-blue-700','text-white')
        }
    })
})

// add new alram

alramAddEditBtn.addEventListener('click',()=>{
    if(alramAddEditBtn.textContent==='Add'){
        if(addAlram()) closeAddPopupWindow()
    }
    else
        if(editAlramCart()) closeAddPopupWindow()
})

setInterval(()=>{

    alrams.forEach((alram)=>{
        if(alram.time!==getFormattedCurrentTime()) return
        if(alram.days){
            if(!alram.days[new Date().getDay()===0?6:new Date().getDay()-1]) return
        }
        else{
            if(!areDateSame(alram.date,getTodayDate())) return
        }
        if(!alram.on) return
        ringingPopUpBg.classList.replace('hidden','flex')
        ringingPopUp.classList.add('popup-animate')
        ringingPopUp.children[0].textContent=alram.time.substring(0,5)
        alramAudio.currentTime=0
        alramAudio.play()
    })
},1000)
