var currentPlaylist
var currentPlaylistSongs
var currentPlaylistSongsAux
var currentSong
var index
var host

const start = async () => {

  const sample =  (arr) => arr[Math.floor(Math.random() * arr.length)]
  host = await fetch('https://api.audius.co')
  .then(r => r.json())
  .then(j => j.data)
  .then(d => sample(d))

  responsePlaylist = await fetch(host + '/v1/playlists/trending?app_name=SpotifyClon')
  const playlist = await responsePlaylist.json()
  const firstPlaylist = playlist.data[0]
  
  let library = document.getElementById("lib");

  playlist.data.forEach(p => {
    library.innerHTML += `
      <div class="lib">
        <button class="lib-element selectable" onclick="changePlaylist('${p.id}')">
          <img src="${p.artwork['150x150']}" alt="">
          <span>
            <h4>${p.playlist_name}</h4>
            <p>Lista · ${p.user.name}</p>
          </span>
        </button>
      </div>
    `
  });

  changePlaylist(firstPlaylist.id)

  const responseSongs = await fetch(host + '/v1/playlists/'+firstPlaylist.id+'/tracks?app_name=SpotifyClon')
  const songs = await responseSongs.json()

  const firstSong = songs.data[0]

  changeSong(firstSong.id, false, true)
  
}

start()

async function changePlaylist(id){
  
  let responseCurrentPlaylist = await fetch(host + '/v1/playlists/'+id+'?app_name=SpotifyClon')
  currentPlaylist = await responseCurrentPlaylist.json()
  currentPlaylist = currentPlaylist.data[0]

  let title = document.getElementById("title");

  title.innerHTML = `
    <img src="${currentPlaylist.artwork['480x480']}" alt="">
    <div class="data">
      <h1>${currentPlaylist.playlist_name}</h1>
      <span> ${currentPlaylist.total_play_count} reproducciones · guardada ${currentPlaylist.favorite_count} veces</span>
    </div>
  `
  
  let responseCurrentPlaylistSongs = await fetch(host + '/v1/playlists/'+id+'/tracks?app_name=SpotifyClon')
  currentPlaylistSongs = await responseCurrentPlaylistSongs.json()
  
  let songsList = document.getElementById("songsList");
  songsList.innerHTML = ``

  let indexSong = 0

  currentPlaylistSongs.data.forEach( s => {
    indexSong ++
    songsList.innerHTML += `
      <button class="table-song selectable" onclick="changeSong('${s.id}', true, true)" id="${s.id}">
        <div class="t1">${indexSong}</div>
        <div class="t2">
          <img src="${s.artwork['150x150']}" alt="">
          <span>
            <h3>${s.title}</h3>
            <p>${s.user.name}</p>
          </span>
        </div>
        <div class="t3">${s.play_count}</div>
        <div class="t4">${s.release_date}</div>
        <div class="t5">${secondsToString(s.duration)}</div>
      </button>
    `

    let button = document.getElementById("giantPlay");
    button.setAttribute("onclick", "changeSong('"+currentPlaylistSongs.data[0].id+"', true, true)");
  });
}

async function changeSong(id, autoplay, current){
  let responseCurrentSong = await fetch(host + '/v1/tracks/'+id+'?app_name=SpotifyClon')
  currentSong = await responseCurrentSong.json()
  currentSong = currentSong.data

  let player = document.getElementById("player");

  player.innerHTML = `
    <img src="${currentSong.artwork['150x150']}" alt="">
      <span>
        <h4>${currentSong.title}</h4>
        <p>${currentSong.user.name}</p>
      </span>
  `

  let audio = document.getElementById("audio");
  
  audio.src= host + "/v1/tracks/"+currentSong.id+"/stream?app_name=SpotifyClon"

  let totalTime = document.getElementById("total-time")
  totalTime.textContent = secondsToString(currentSong.duration)

  let currentTime = document.getElementById("current-time")
  currentTime.textContent = "0:00"

  if(autoplay){
    audio.play();
  }

  let selected = document.getElementsByClassName("selected")[0]
  if(selected!= null){
    selected.classList.remove("selected")
  }
  
  selected = document.getElementById(id)
  if(selected!= null){
    selected.classList.add("selected")
  }
  
  if(current){
    currentPlaylistSongsAux = currentPlaylistSongs
  }

  audio.onended = function() {
    changeSongRight()
  };

  index = currentPlaylistSongsAux.data.findIndex(s => s.id==currentSong.id);
  let prevSong = document.getElementById("prevSong")
  let nextSong = document.getElementById("nextSong")

  if(index == 0){
    prevSong.disabled = true
  }else{
    prevSong.disabled = false
  }

  if(index == currentPlaylistSongsAux.data.length -1){
    nextSong.disabled = true
  }else{
    nextSong.disabled = false
  }
}

function changeSongLeft(){
  if(index != 0){
    changeSong(currentPlaylistSongsAux.data[index-1].id, true, false)
  }
}

function changeSongRight(){
  if(index < currentPlaylistSongsAux.data.length){
    changeSong(currentPlaylistSongsAux.data[index+1].id, true, false)
  }
}

function secondsToString(seconds) {
  var minute = Math.floor((seconds / 60) % 60);
  var second = seconds % 60;
  second = (second < 10)? '0' + second : second;
  return minute + ':' + second;
}

