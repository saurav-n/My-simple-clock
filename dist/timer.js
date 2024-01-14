const timerAddingScreen=document.querySelector('.timer-adding-screen')
const timerScreen=document.querySelector('.timer-screen')
const fullCircle=document.querySelector('.full-circle')
const semicircleOne=document.querySelector('.semicircle-one')
const semicircleTwo=document.querySelector('.semicircle-two')
const timeShower=document.querySelector('.time-shower')
const timerStartBtn=document.querySelector('.timer-start-btn')
const timerPauseResumeBtn=document.querySelector('.timer-pause-resume-btn')
const timerCancelBtn=document.querySelector('.timer-cancel-btn')
const timerInputs=document.querySelectorAll('.timer-input')
let totalTime=null
let remainingTime=null
let timerLoop=null
let isTimerPaused=false
//disable btns
timerStartBtn.disabled=true
timerPauseResumeBtn.disabled=true

// function to get time in 00:00:00 format 
function getFormatedTimeStamp(timeToBeConverted){
    const hrs=(Math.trunc(timeToBeConverted/3600)<10)?`0${Math.trunc(timeToBeConverted/3600)}`:`${Math.trunc(timeToBeConverted/3600)}`
    timeToBeConverted%=3600
    const mins=(Math.trunc(timeToBeConverted/60)<10)?`0${Math.trunc(timeToBeConverted/60)}`:`${Math.trunc(timeToBeConverted/60)}`
    timeToBeConverted%=60
    const secs=timeToBeConverted<10?`0${timeToBeConverted}`:`${timeToBeConverted}`
    return `${hrs}:${mins}:${secs}`
}


// function to start timer
function startTimer(){
    //initialize remaining time by total time if timer is not started after pausing
    if(!remainingTime) remainingTime=totalTime
    //timer running part
    return (
        setInterval(()=>{
            //alert time
            if(remainingTime<=10){
                semicircleOne.classList.replace('bg-blue-700','bg-red-500')
                semicircleTwo.classList.replace('bg-blue-700','bg-red-500')
                timeShower.classList.replace('text-blue-700','text-red-500')
            }
            timeShower.textContent=getFormatedTimeStamp(remainingTime)
            const angle=360-((remainingTime/totalTime)*360)
            if(angle>180){
                semicircleOne.classList.add('opacity-0')
                semicircleTwo.setAttribute('style',`transform:rotate(${180-angle}deg);`)
            }
            else{
                semicircleOne.setAttribute('style',`transform:rotate(-${angle}deg);`)
            }
            remainingTime--
            //timer over
            if(angle===360) {
            //remove timer if not
                if(timerLoop) {
                    clearInterval(timerLoop)
                    timerLoop=null
                }
                //disable resume/pasuse btn after time over
                timerPauseResumeBtn.disabled=true
                timerPauseResumeBtn.classList.replace('bg-blue-500','bg-slate-500')
                timerPauseResumeBtn.classList.remove('hover:bg-blue-700')
            }
        },1000)
    )
}

// function to check validity of time
function areInputsValid(){
    let validity=true
    timerInputs.forEach((timeInput)=>{
        if(timeInput.value===''||isNaN(timeInput.value)) validity=false
    })
    return validity
}

// function to allow user to start timer
function enableTimerStartBtn(){
    timerStartBtn.disabled=false
    timerStartBtn.classList.replace('bg-slate-500','bg-blue-500')
    timerStartBtn.classList.add('hover:bg-blue-700')
}

// function to dont allow user to start timer
function disableTimerStartBtn(){
    timerStartBtn.disabled=true
    timerStartBtn.classList.replace('bg-blue-500','bg-slate-500')
    timerStartBtn.classList.remove('hover:bg-blue-700')
}

timerInputs.forEach((timerInput)=>{
    timerInput.addEventListener('input',()=>{
        if(areInputsValid()) enableTimerStartBtn() //enable start btn if user gives valid time
        else if(!timerStartBtn.disabled) disableTimerStartBtn() //disable start btn if user giver invalid time when start btn is enabled
    })
})
timerStartBtn.addEventListener('click',()=>{
    // go to timer screen 
    timerAddingScreen.classList.replace('flex','hidden')
    timerScreen.classList.replace('hidden','flex')
    timerPauseResumeBtn.classList.add('left-btn-animate')
    timerCancelBtn.classList.add('right-btn-animate')
    // enable pause/resume btn
    timerPauseResumeBtn.disabled=false
    timerPauseResumeBtn.classList.replace('bg-slate-500','bg-blue-500')
    timerPauseResumeBtn.classList.add('hover:bg-blue-700')
    // set time through inputs 
    totalTime=0
    timerInputs.forEach((timerInput,key)=>{
        if(key===0) totalTime+=(Number(timerInput.value)*3600)
        else if(key===1) totalTime+=(Number(timerInput.value)*60)
        else totalTime+=Number(timerInput.value)
    })
    //reset timer adding screen
    disableTimerStartBtn()
    timerInputs.forEach((timerInput)=>{
        timerInput.value=''
    })
    //start timer
    timerLoop=startTimer()
})

// cancel timer 
timerCancelBtn.addEventListener('click',()=>{
    //remove timer if not
    if(timerLoop) {
        clearInterval(timerLoop)
        timerLoop=null
    }
    // reset timer screen
    semicircleOne.classList.remove('opacity-0')
    semicircleOne.setAttribute('style',`transform:rotate(0deg);`)
    semicircleTwo.setAttribute('style',`transform:rotate(0deg);`)
    semicircleOne.classList.replace('bg-red-500','bg-blue-700')
    semicircleTwo.classList.replace('bg-red-500','bg-blue-700')
    timeShower.classList.replace('text-red-500','text-blue-700')
    timeShower.textContent='00:00:00'
    // disable pause/resume btn
    timerPauseResumeBtn.disabled=true
    timerPauseResumeBtn.classList.replace('bg-blue-500','bg-slate-500')
    timerPauseResumeBtn.classList.remove('hover:bg-blue-700')
    totalTime=remainingTime=null
    //return to timer adding screen
    timerAddingScreen.classList.replace('hidden','flex')
    timerScreen.classList.replace('flex','hidden')
    //unpause timer if it is paused
    if(isTimerPaused) {
        isTimerPaused=false
        timerPauseResumeBtn.textContent='Pause'
    }
})

// pause/resume timer 
timerPauseResumeBtn.addEventListener('click',(e)=>{
    //resume timer
    if(isTimerPaused){
        isTimerPaused=false
        e.target.textContent='Pause'
        timerLoop=startTimer()
    }
    //pause timer
    else{
        isTimerPaused=true
        e.target.textContent='Resume'
        if(timerLoop) {
            clearInterval(timerLoop)
            timerLoop=null
        }
    }
})
