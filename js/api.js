var currentPlaylist
var currentPlaylistSongs
var currentSong

const start = async () => {

  const responsePlaylist = await fetch('https://audius-discovery-2.theblueprint.xyz/v1/playlists/trending?app_name=SpotifyClon')
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

  let title = document.getElementById("title");

    title.innerHTML = `
      <img src="${firstPlaylist.artwork['480x480']}" alt="">
      <div class="data">
        <h1>${firstPlaylist.playlist_name}</h1>
        <span> ${firstPlaylist.total_play_count} reproducciones · guardada ${firstPlaylist.favorite_count} veces</span>
      </div>
    `

  const responseSongs = await fetch('https://audius-discovery-2.theblueprint.xyz/v1/playlists/'+firstPlaylist.id+'/tracks?app_name=SpotifyClon')
  const songs = await responseSongs.json()
  
  let songsList = document.getElementById("songsList");

  let index = 0

  songs.data.forEach( s => {
    index ++
    songsList.innerHTML += `

      <button class="table-song selectable" onclick="changeSong('${s.id}')">
        <div class="t1">${index}</div>
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
  });

  const firstSong = songs.data[0]
  
  let player = document.getElementById("player");

  player.innerHTML = `
  <div class="player-1">
    <img src="${firstSong.artwork['150x150']}" alt="">
    <span>
      <h4>${firstSong.title}</h4>
      <p>${firstSong.user.name}</p>
    </span>
  </div>
  <div class="player-2" id="player">
    <audio controls id="audio">
      <source src="https://audius-discovery-2.theblueprint.xyz/v1/tracks/${firstSong.id}/stream?app_name=SpotifyClon" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </div>
  <div class="player-3">
  </div>
  `

  let button = document.getElementById("giantPlay");
  button.setAttribute("onclick", "changeSong('"+firstSong.id+"')");
}

start()

async function changePlaylist(id){
  let responseCurrentPlaylist = await fetch('https://audius-discovery-1.cultur3stake.com/v1/playlists/'+id+'?app_name=SpotifyClon')
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
  
  let responseCurrentPlaylistSongs = await fetch('https://audius-discovery-2.theblueprint.xyz/v1/playlists/'+id+'/tracks?app_name=SpotifyClon')
  currentPlaylistSongs = await responseCurrentPlaylistSongs.json()
  
  let songsList = document.getElementById("songsList");
  songsList.innerHTML = ``

  let index = 0

  currentPlaylistSongs.data.forEach( s => {
    index ++
    songsList.innerHTML += `
      <button class="table-song selectable" onclick="changeSong('${s.id}')">
        <div class="t1">${index}</div>
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
    button.setAttribute("onclick", "changeSong('"+currentPlaylistSongs.data[0].id+"')");
  });
}

async function changeSong(id){
  let responseCurrentSong = await fetch('https://audius-discovery-1.cultur3stake.com/v1/tracks/'+id+'?app_name=SpotifyClon')
  currentSong = await responseCurrentSong.json()
  currentSong = currentSong.data

  let player = document.getElementById("player");

  player.innerHTML = `
  <div class="player-1">
    <img src="${currentSong.artwork['150x150']}" alt="">
    <span>
      <h4>${currentSong.title}</h4>
      <p>${currentSong.user.name}</p>
    </span>
  </div>
  <div class="player-2" id="song-player">
    <audio controls id="audio">
      <source src="https://audius-discovery-2.theblueprint.xyz/v1/tracks/${currentSong.id}/stream?app_name=SpotifyClon" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </div>
  <div class="player-3">
  </div>
  `

  let audio = document.getElementById("audio");
  audio.play();
}

function secondsToString(seconds) {
  var minute = Math.floor((seconds / 60) % 60);
  var second = seconds % 60;
  second = (second < 10)? '0' + second : second;
  return minute + ':' + second;
}

