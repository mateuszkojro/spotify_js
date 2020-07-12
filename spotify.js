var app = new Vue({
  el: "#app",
  data: {
    title: "Loading",
    previous: "Previous",
    pause: "Pause",
    next: "Next",
  },
});

let x = null;
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
    app.title = message;
  });
  player.addListener("authentication_error", ({ message }) => {
    app.title = message;
  });
  player.addListener("account_error", ({ message }) => {
    app.title = message;
  });
  player.addListener("playback_error", ({ message }) => {
    app.title = message;
  });

  // Playback status updates
  player.addListener("player_state_changed", (state) => {
    app.title = "Reciving";
  });

  // Ready
  player.addListener("ready", ({ device_id }) => {
    app.title = "Ready";
  });

  // Not Ready
  player.addListener("not_ready", ({ device_id }) => {
    app.title = "Device has gone offline";
  });

  player.getCurrentState().then((state) => {
    console.log(state);
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
