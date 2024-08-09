const audio = document.getElementById("audio")
const playPauseButton = document.getElementById("play-pause")
const volumeControl = document.getElementById("volume-control");
const muteButton = document.getElementById("mute-button")
const progressBar = document.getElementById("progress-bar")
const currentTimeDisplay = document.getElementById("current-time");
const totalTimeDisplay = document.getElementById("total-time");

muteButton.addEventListener("click", () => {

    if(audio.muted){
        audio.muted = false
        muteButton.innerHTML = `
            <i class="fa-solid fa-volume-high"></i>
        `
    }else{
        audio.muted = true
        muteButton.innerHTML = `
            <i class="fa-solid fa-volume-xmark"></i>
        `
    }
})

audio.onplay = function(){
    playPauseButton.innerHTML = `
        <i class="fa-solid fa-pause fa-lg"></i>
    `
}
audio.onpause = function(){
    playPauseButton.innerHTML = `
       <i class="fa-solid fa-play fa-lg"></i>
    `
}

volumeControl.addEventListener("input", () => {
    audio.volume = volumeControl.value;
});

function play_pause(){
    if(audio.paused){
        audio.play()
    }else{
        audio.pause()
    }
}

audio.addEventListener("timeupdate", () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;

    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    /*
    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = Math.floor(duration % 60);

    
    totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
    */
    currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;

    progressBar.setAttribute("max", duration)
    progressBar.value = currentTime
});


progressBar.onchange = () => {
    audio.currentTime = progressBar.value;
}

