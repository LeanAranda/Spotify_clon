const start = async () => {

  const responsePlaylist = await fetch('https://audius-discovery-2.theblueprint.xyz/v1/playlists/trending?app_name=SpotifyClon')
  const playlist = await responsePlaylist.json()
  const firstPlaylist = playlist.data[0]

  startLibrary(playlist)

  const responseSongs = await fetch('https://audius-discovery-2.theblueprint.xyz/v1/playlists/'+firstPlaylist.id+'/tracks?app_name=SpotifyClon')
  const songs = await responseSongs.json()
  
  startSongs(songs)
}

start()

function startLibrary(playlist){

  let library = document.getElementById("lib");

  playlist.data.forEach(p => {
    library.innerHTML += `
      <div class="lib">
        <button class="lib-element selectable">
          <img src="${p.artwork['150x150']}" alt="">
          <span>
            <h4>${p.playlist_name}</h4>
            <p>Lista · ${p.user.name}</p>
          </span>
        </button>
      </div>
    `
  });

  const firstPlaylist = playlist.data[0]

  let title = document.getElementById("title");

    title.innerHTML = `
      <img src="${firstPlaylist.artwork['480x480']}" alt="">
      <div class="data">
        <h1>${firstPlaylist.playlist_name}</h1>
        <p>${firstPlaylist.description}</p>
        <span> ${firstPlaylist.total_play_count} reproducciones · guardada ${firstPlaylist.favorite_count} veces</span>
      </div>
    `
}

function startSongs(songs){

  let songsList = document.getElementById("songsList");

  let index = 0

  songs.data.forEach( s => {
    index ++
    songsList.innerHTML += `
      <tr class="selectable">
        <th><h4>${index}</h4></th>
        <th>
          <div class="song">
            <img src="${s.artwork['150x150']}" alt="">
            <span>
              <h3>${s.title}</h3>
              <p>${s.user.name}</p>
            </span>
          </div>
        </th>
        <th><h4>${s.play_count}</h4></th>
        <th></th>
        <th><h4>${s.release_date}</h4></th>
        <th><h4>${secondsToString(s.duration)}</h4></th>
      </tr>
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
    <audio controls>
      <source src="https://audius-discovery-2.theblueprint.xyz/v1/tracks/${firstSong.id}/stream?app_name=SpotifyClon" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </div>
  <div class="player-3">
  </div>
  `
}

function secondsToString(seconds) {
  var minute = Math.floor((seconds / 60) % 60);
  var second = seconds % 60;
  second = (second < 10)? '0' + second : second;
  return minute + ':' + second;
}

