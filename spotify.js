let x = null;
async function get_auth() {
  let searchParams = new URLSearchParams(window.location.search);
  let auth = new oauth2();
  if (!searchParams.has("code")) {
    auth.request_auth();
  }
  if (searchParams.has("code")) {
    auth.code = searchParams.get("code");
    auth.state = searchParams.get("state");
    await auth.request_tokens();
  }
  return auth;
}
window.onSpotifyWebPlaybackSDKReady = async () => {
  //console.log("zaczekalem na token: " + (await get_auth()).access_token);
  const token = (await get_auth()).access_token;
  console.log("this is your token: " + token);
  var player = new Spotify.Player({
    name: "Spotify server player",
    getOAuthToken: (cb) => {
      cb(token);
    },
  });
  x = player;
  // Error handling
  player.addListener("initialization_error", ({ message }) => {
    console.error(message);
  });
  player.addListener("authentication_error", ({ message }) => {
    console.error(message);
  });
  player.addListener("account_error", ({ message }) => {
    console.error(message);
  });
  player.addListener("playback_error", ({ message }) => {
    console.error(message);
  });

  // Playback status updates
  player.addListener("player_state_changed", (state) => {
    if (!state) {
      document.getElementById("inside_spotify").innerHTML =
        "Nothing is curently playing";
      return;
    }

    let {
      curent_song,
      next_tracks: [next_track],
    } = state.track_window;

    document.getElementById("inside_spotify").innerHTML =
      "curently playing: " + curent_song;

    console.log(state);
  });

  // Ready
  player.addListener("ready", ({ device_id }) => {
    console.log("Ready with Device ID", device_id);
    //document.getElementById("inside_spotify").innerHTML = "Your device id: " + device_id;
  });

  // Not Ready
  player.addListener("not_ready", ({ device_id }) => {
    console.log("Device ID has gone offline", device_id);
    document.getElementById("inside_spotify").innerHTML =
      "Device offline: " + device_id;
  });

  player.getCurrentState().then((state) => {
    console.log("dziala");
  });
  // Connect to the player!
  player.connect();
};

function prev() {
  if (x != null) {
    x.previousTrack().then(() => {
      console.log("Set to previous track!");
    });
  }
}
function stop() {
  if (x != null) {
    x.togglePlay().then(() => {
      console.log("Toggled playback!");
    });
  }
}
function next() {
  if (x != null) {
    x.nextTrack().then(() => {
      console.log("Skipped to next track!");
    });
  }
}
