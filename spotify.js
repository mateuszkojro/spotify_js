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
    app.title = `${message} pls <a href="\\">log in</a> again`;
  });
  player.addListener("account_error", ({ message }) => {
    app.title = message;
  });
  player.addListener("playback_error", ({ message }) => {
    app.title = message;
  });

  // Ready
  player.addListener("ready", ({ device_id }) => {
    app.title =
      'Ready <a onclick="take_control() href="null">take control of the player</a>';
  });

  // Not Ready
  player.addListener("not_ready", ({ device_id }) => {
    app.title = "Device has gone offline";
  });

  player.addListener(
    "player_state_changed",
    ({ position, duration, track_window: { current_track } }) => {
      app.title =
        "U r " +
        Math.round((position / duration) * 100) +
        "% into " +
        current_track.name;
      console.log("Currently Playing", current_track.name);
      console.log("Position in Song", position);
      console.log("Duration of Song", duration);
    }
  );
  // Connect to the player!
  setInterval(function () {
    player.getCurrentState().then((state) => {
      if (state) {
        app.title =
          "U r " +
          Math.round((state.position / state.duration) * 100) +
          "% into " +
          state.track_window.current_track.name;
      } else {
      }
    });
  }, 3000); //evr 3 sekundy
  player.connect();
};
function refresh_data(player) {}

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
